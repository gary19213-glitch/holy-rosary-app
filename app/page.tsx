"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery, prayerLibrary, getLiturgicalInfo, stationsOfCross } from "./data";

function RosaryBeads({ currentBead }: { currentBead: number }) {
  const beads = Array.from({ length: 10 });
  const radius = 110; const center = 150; 
  const isLargeBeadActive = currentBead === 0 || currentBead === 11;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <svg width="300" height="340" viewBox="0 0 300 340">
        <circle cx={center} cy={center} r={radius} stroke="#444" strokeWidth="2" fill="none" />
        <path d="M 150 260 L 150 320" stroke="#444" strokeWidth="2" />
        {beads.map((_, i) => {
          const index = i + 1; const angle = (index / 10) * (Math.PI * 2) - (Math.PI / 2);
          const x = center + radius * Math.cos(angle); const y = center + radius * Math.sin(angle);
          return ( <circle key={index} cx={x} cy={y} r={currentBead === index ? 14 : 10} fill={currentBead === index ? "#d4af37" : "transparent"} stroke="#d4af37" strokeWidth="2" style={{ filter: currentBead === index ? "drop-shadow(0px 0px 10px #d4af37)" : "none", transition: "all 0.4s ease" }} /> );
        })}
        <circle cx="150" cy="280" r={isLargeBeadActive ? 16 : 12} fill={isLargeBeadActive ? "#d4af37" : "transparent"} stroke="#d4af37" strokeWidth="2" style={{ filter: isLargeBeadActive ? "drop-shadow(0px 0px 15px #d4af37)" : "none", transition: "all 0.4s ease" }} />
        <text x="150" y="355" fontSize="50" textAnchor="middle" fill="#d4af37">✝</text>
      </svg>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState("home"); 
  const [stage, setStage] = useState("intro"); 
  const [pendantBead, setPendantBead] = useState(0); 
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  const [currentStation, setCurrentStation] = useState(0); 

  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [liturgicalSeason, setLiturgicalSeason] = useState("Ordinary Time");
  const [themeColor, setThemeColor] = useState("#1a1a2e"); 

  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]); setTodaysMystery(getTodaysMystery());
    const liturgy = getLiturgicalInfo(); setLiturgicalSeason(liturgy.season); setThemeColor(liturgy.color);

    if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
    if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
    if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
    if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
  }, []);

  const finishAndSave = () => {
    const newTotal = totalRosaries + 1; setTotalRosaries(newTotal); localStorage.setItem("totalRosaries", newTotal.toString());
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    quitToHome();
  };

  const quitToHome = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); 
    setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setCurrentStation(0);
  };

  const nextPrayer = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    if (screen === "stations") {
      if (currentStation < stationsOfCross.length - 1) setCurrentStation(currentStation + 1);
      else finishAndSave();
      return;
    }

    if (stage === "intro") { setStage("pendant"); setPendantBead(0); } 
    else if (stage === "pendant") {
      if (pendantBead < 4) setPendantBead(pendantBead + 1);
      else { setStage("decades"); setCurrentDecade(0); setCurrentBead(0); }
    } 
    else if (stage === "decades") {
      if (currentBead < 11) setCurrentBead(currentBead + 1);
      else {
        if (currentDecade < 4) { setCurrentDecade(currentDecade + 1); setCurrentBead(0); }
        else setStage("outro");
      }
    } 
    else if (stage === "outro") finishAndSave();
  };

  const playAudio = (prayerObj: any, followupText?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (typeof prayerObj === "string") {
        const u = new SpeechSynthesisUtterance(prayerObj); u.rate = speechSpeed;
        if (followupText) { const u2 = new SpeechSynthesisUtterance(followupText); u2.rate = speechSpeed; u.onend = () => window.speechSynthesis.speak(u2); if (isAutoPlay) u2.onend = () => nextPrayer(); } 
        else { if (isAutoPlay) u.onend = () => nextPrayer(); }
        window.speechSynthesis.speak(u);
      } else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const l = new SpeechSynthesisUtterance(prayerObj.leader); l.rate = speechSpeed; l.pitch = 1.2;
        const r = new SpeechSynthesisUtterance(prayerObj.response); r.rate = speechSpeed; r.pitch = 0.7;
        l.onend = () => window.speechSynthesis.speak(r);
        if (followupText) { const f = new SpeechSynthesisUtterance(followupText); f.rate = speechSpeed; r.onend = () => window.speechSynthesis.speak(f); if (isAutoPlay) f.onend = () => nextPrayer(); } 
        else { if (isAutoPlay) r.onend = () => nextPrayer(); }
        window.speechSynthesis.speak(l);
      }
    }
  };

  // THE AUTO-PLAY BUG FIX! Added currentStation to dependencies, and added stations logic.
  useEffect(() => {
    if (isAutoPlay && screen !== "home" && screen !== "settings" && screen !== "library") {
      let prayerToRead; let followup;
      if (screen === "stations") {
        prayerToRead = stationsOfCross[currentStation].adoration;
        followup = stationsOfCross[currentStation].reflection;
      }
      else if (screen === "rosary") {
        if (stage === "intro") prayerToRead = prayers.signOfCross + ". " + prayers.creed;
        else if (stage === "pendant") {
            if (pendantBead === 0) prayerToRead = prayers.ourFather;
            else if (pendantBead >= 1 && pendantBead <= 3) prayerToRead = prayers.hailMary;
            else prayerToRead = prayers.gloryBe;
        }
        else if (stage === "decades") {
            if (currentBead === 0) prayerToRead = prayers.ourFather;
            else if (currentBead >= 1 && currentBead <= 10) prayerToRead = prayers.hailMary;
            else { prayerToRead = prayers.gloryBe; followup = prayers.fatimaPrayer; }
        }
        else if (stage === "outro") prayerToRead = prayers.hailHolyQueen;
      } 
      else if (screen === "chaplet") {
        if (stage === "intro") prayerToRead = chapletPrayers.opening;
        else if (stage === "decades") prayerToRead = currentBead === 0 || currentBead === 11 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion;
        else if (stage === "outro") prayerToRead = chapletPrayers.closing;
      }
      if (prayerToRead) playAudio(prayerToRead, followup);
    }
  }, [currentBead, stage, currentStation, isAutoPlay]); 

  const renderPrayerText = (prayer: any, followup?: string) => (
    <>
      {typeof prayer === "string" ? prayer : <><span style={{ color: "#d4af37", fontWeight:"bold" }}>V.</span> {prayer.leader}<br/><br/><span style={{ color: "#d4af37", fontWeight:"bold" }}>R.</span> {prayer.response}</>}
      {followup && <><br/><br/><span style={{ color: "#d4af37", fontStyle: "italic", fontSize:"15px" }}>{followup}</span></>}
    </>
  );

  return (
    <div style={{ padding: "20px", backgroundColor: screen === "chaplet" ? "#3a0e1b" : themeColor, color: "white", minHeight: "100vh", transition: "background-color 1s ease" }}>
      
      {screen === "home" && (
        <><header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}><h1 style={{ fontSize: "28px" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button></header><div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}><div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Day Streak</p></div><div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Total Prayers</p></div></div><div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}><h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2><div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ccc", marginBottom: "15px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}><span>{todayName}</span><span style={{ color: "#d4af37", fontWeight: "bold" }}>{liturgicalSeason}</span></div><p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p><button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}><div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "#3a0e1b", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37" }}>Divine Mercy</div><div onClick={() => setScreen("stations")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Stations of Cross</div><div onClick={() => setScreen("library")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Prayer Library</div><div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.1)" }}>My Custom Lists</div></div></>
      )}

      {/* --- STATIONS OF THE CROSS --- */}
      {screen === "stations" && (() => {
        const station = stationsOfCross[currentStation];
        return (
          <div style={{ paddingBottom: "100px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button>
              <div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>Via Dolorosa</div>
              <button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button>
            </header>

            <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>
              <h1 style={{ fontSize: "50px", color: "#d4af37", margin: "0", opacity: 0.8 }}>{station.numeral}</h1>
              <h2 style={{ fontSize: "20px", color: "#fff", marginTop: "5px", marginBottom: "20px" }}>{station.title}</h2>
              
              {/* FEATURE 47: CLASSICAL PAINTINGS IN STATIONS! */}
              <img src={station.image} alt={station.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px", border: "2px solid #d4af37", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }} />
            </div>

            <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", position: "relative" }}>
              <button onClick={() => playAudio(station.adoration, station.reflection)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
              <h3 style={{ color: "#d4af37", marginBottom: "15px", fontSize:"18px" }}>Adoration</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#e0e0e0", marginBottom: "20px" }}>{renderPrayerText(station.adoration)}</p>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "15px" }}></div>
              <h3 style={{ color: "#d4af37", marginBottom: "10px", fontSize:"18px" }}>Reflection</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#ccc", fontStyle: "italic" }}>"{station.reflection}"</p>
            </div>
            <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>{currentStation === stationsOfCross.length - 1 ? "Finish Stations ✓" : "Next Station ➔"}</button></div>
          </div>
        );
      })()}

      {/* --- ROSARY SCREEN WITH PICTURES --- */}
      {screen === "rosary" && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button><div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>{mysteries.joyful.name}</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header>
          {stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Sign of the Cross</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.signOfCross}</p></div> )}
          {stage === "pendant" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "20px", color: "#ccc", marginBottom:"20px" }}>Introductory Prayers</h2><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37" }}><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{pendantBead === 0 ? "Our Father" : pendantBead === 4 ? "Glory Be" : `Hail Mary (${pendantBead}/3)`}</h3></div></div> )}
          {stage === "decades" && (() => {
            const currentMystery = mysteries.joyful.decades[currentDecade];
            return (
            <>
              <div style={{ textAlign: "center", marginTop: "10px", padding:"10px", backgroundColor:"rgba(0,0,0,0.3)", borderRadius:"12px" }}>
                <h2 style={{ fontSize: "20px", margin: "0", color:"#fff", marginBottom: "10px" }}>{currentMystery.title}</h2>
                
                {/* FEATURE 15: CLASSICAL PAINTINGS IN ROSARY! */}
                <img src={currentMystery.image} alt={currentMystery.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", border: "1px solid #d4af37", marginBottom: "10px" }} />
                
                {currentBead === 0 && ( <div style={{ marginTop: "5px", paddingTop: "10px", borderTop: "1px solid #333", fontSize: "14px", color: "#ccc", textAlign: "left" }}><p style={{ marginBottom: "10px" }}><strong>Scripture:</strong> {currentMystery.verse}</p><p><strong>Reflection:</strong> {currentMystery.reflection}</p></div> )}
              </div>
              <RosaryBeads currentBead={currentBead} />
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}><button onClick={() => playAudio(currentBead === 0 ? prayers.ourFather : currentBead === 11 ? prayers.gloryBe : prayers.hailMary, currentBead === 11 ? prayers.fatimaPrayer : undefined)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{currentBead === 0 ? "Our Father" : currentBead === 11 ? "Glory Be" : `Hail Mary (${currentBead}/10)`}</h3></div>
            </>
          );})()}
          {stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.hailHolyQueen}</p></div> )}
          <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div>
        </div>
      )}
    </div>
  );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
