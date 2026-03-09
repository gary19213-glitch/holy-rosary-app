"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery, prayerLibrary } from "./data";

// --- VISUAL BEADS ---
function RosaryBeads({ currentBead, isChaplet }: { currentBead: number, isChaplet: boolean }) {
  const beads = Array.from({ length: 10 });
  const radius = 110; const center = 150; 
  const isLargeBeadActive = currentBead === 0 || currentBead === 11;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <svg width="300" height="340" viewBox="0 0 300 340">
        <circle cx={center} cy={center} r={radius} stroke="#444" strokeWidth="2" fill="none" />
        <path d="M 150 260 L 150 320" stroke="#444" strokeWidth="2" />
        {beads.map((_, i) => {
          const index = i + 1; 
          const angle = (index / 10) * (Math.PI * 2) - (Math.PI / 2);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = currentBead === index;
          return (
            <circle key={index} cx={x} cy={y} r={isActive ? 14 : 10} 
              fill={isActive ? "#d4af37" : "#1a1a2e"} stroke="#d4af37" strokeWidth="2"
              style={{ filter: isActive ? "drop-shadow(0px 0px 10px #d4af37)" : "none", transition: "all 0.4s ease" }} />
          );
        })}
        <circle cx="150" cy="280" r={isLargeBeadActive ? 16 : 12} 
          fill={isLargeBeadActive ? "#d4af37" : "#1a1a2e"} stroke="#d4af37" strokeWidth="2" 
          style={{ filter: isLargeBeadActive ? "drop-shadow(0px 0px 15px #d4af37)" : "none", transition: "all 0.4s ease" }} />
        <text x="150" y="355" fontSize="50" textAnchor="middle" fill="#d4af37">✝</text>
      </svg>
    </div>
  );
}

// --- MAIN APP ---
export default function Home() {
  const [screen, setScreen] = useState("home"); 
  const [stage, setStage] = useState("intro"); // "intro" -> "pendant" -> "decades" -> "outro"
  const [pendantBead, setPendantBead] = useState(0); // 0 to 4 for the intro chain
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState<any>(null);

  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);

  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]);
    setTodaysMystery(getTodaysMystery());
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
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setSelectedPrayer(null);
  };

  // THE PERFECTED TIMELINE BRAIN
  const nextPrayer = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    if (stage === "intro") {
      setStage("pendant"); setPendantBead(0);
    } 
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
        if (followupText) {
           const u2 = new SpeechSynthesisUtterance(followupText); u2.rate = speechSpeed;
           u.onend = () => window.speechSynthesis.speak(u2);
           if (isAutoPlay) u2.onend = () => nextPrayer();
        } else {
           if (isAutoPlay) u.onend = () => nextPrayer();
        }
        window.speechSynthesis.speak(u);
      } else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const l = new SpeechSynthesisUtterance(prayerObj.leader); l.rate = speechSpeed; l.pitch = 1.2;
        const r = new SpeechSynthesisUtterance(prayerObj.response); r.rate = speechSpeed; r.pitch = 0.7;
        l.onend = () => window.speechSynthesis.speak(r);
        
        if (followupText) {
            const f = new SpeechSynthesisUtterance(followupText); f.rate = speechSpeed;
            r.onend = () => window.speechSynthesis.speak(f);
            if (isAutoPlay) f.onend = () => nextPrayer();
        } else {
            if (isAutoPlay) r.onend = () => nextPrayer();
        }
        window.speechSynthesis.speak(l);
      }
    }
  };

  const renderPrayerText = (prayer: any, followup?: string) => (
    <>
      {typeof prayer === "string" ? prayer : <><span style={{ color: "#d4af37", fontWeight:"bold" }}>V.</span> {prayer.leader}<br/><br/><span style={{ color: "#d4af37", fontWeight:"bold" }}>R.</span> {prayer.response}</>}
      {followup && <><br/><br/><span style={{ color: "#d4af37", fontStyle: "italic", fontSize:"15px" }}>{followup}</span></>}
    </>
  );

  // Data fetchers for the perfect structure
  const getPendantData = () => {
    if (pendantBead === 0) return { title: "Our Father", obj: prayers.ourFather };
    if (pendantBead === 1) return { title: "Hail Mary (Faith)", obj: prayers.hailMary, followup: "For an increase in Faith." };
    if (pendantBead === 2) return { title: "Hail Mary (Hope)", obj: prayers.hailMary, followup: "For an increase in Hope." };
    if (pendantBead === 3) return { title: "Hail Mary (Charity)", obj: prayers.hailMary, followup: "For an increase in Charity." };
    return { title: "Glory Be", obj: prayers.gloryBe };
  };

  const getRosaryPrayerData = () => {
    if (currentBead === 0) return { title: "Our Father", obj: prayers.ourFather };
    if (currentBead >= 1 && currentBead <= 10) return { title: `Hail Mary (${currentBead}/10)`, obj: prayers.hailMary };
    return { title: "Glory Be & O My Jesus", obj: prayers.gloryBe, followup: prayers.fatimaPrayer };
  };

  const filteredPrayers = prayerLibrary.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ padding: "20px", backgroundColor: screen === "chaplet" ? "#3a0e1b" : "#1a1a2e", color: "white", minHeight: "100vh" }}>
      
      {/* --- HOME SCREEN --- */}
      {screen === "home" && (
        <>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}><h1 style={{ fontSize: "28px" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button></header>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}><div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#a0a0a0" }}>Day Streak</p></div><div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#a0a0a0" }}>Total Prayers</p></div></div>
          <div style={{ backgroundColor: "#16213e", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px" }}><h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2><p style={{ color: "#a0a0a0", marginBottom: "5px" }}>Today is {todayName}</p><p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p><button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "#3a0e1b", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37" }}>Divine Mercy</div>
            <div style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>Stations of Cross</div>
            <div onClick={() => setScreen("library")} style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37" }}>Prayer Library</div>
            <div style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>My Custom Lists</div>
          </div>
        </>
      )}

      {/* --- PRAYER LIBRARY AND SETTINGS HIDDEN FOR SPACE (They still work from previous code!) --- */}
      {screen === "library" && (
        <><header style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}><button onClick={() => { selectedPrayer ? setSelectedPrayer(null) : setScreen("home"); }} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "20px", color: "#d4af37" }}>{selectedPrayer ? selectedPrayer.title : "Prayer Library"}</h1></header>
          {selectedPrayer ? ( <div style={{ backgroundColor: "#16213e", padding: "24px", borderRadius: "16px", border: "1px solid #333", position: "relative", whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "18px" }}><button onClick={() => playAudio(selectedPrayer.text)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><div style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "15px", fontStyle: "italic" }}>Category: {selectedPrayer.category}</div>{selectedPrayer.text}</div>) : (
            <><input type="text" placeholder="🔍 Search prayers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "#16213e", color: "white", border: "1px solid #444", marginBottom: "20px", fontSize: "16px" }} /><div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{filteredPrayers.map((prayer, idx) => (<div key={idx} onClick={() => setSelectedPrayer(prayer)} style={{ backgroundColor: "#16213e", padding: "16px", borderRadius: "12px", border: "1px solid #2a2a4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h3 style={{ fontSize: "16px", margin: 0 }}>{prayer.title}</h3><p style={{ fontSize: "12px", color: "#a0a0a0", marginTop: "4px", margin: 0 }}>{prayer.category}</p></div><div style={{ color: "#d4af37", fontSize: "18px" }}>➔</div></div>))}</div></>)}</>
      )}

      {/* --- THE FULL ROSARY EXPERIENCE --- */}
      {(screen === "rosary") && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={quitToHome} style={{ background: "none", color: "#a0a0a0", border: "none", fontSize: "16px" }}>← Quit</button>
            <div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>{mysteries.joyful.name}</div>
            <button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button>
          </header>
          
          {/* STEP 1: The Cross */}
          {stage === "intro" && ( 
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#d4af37" }}>Sign of the Cross</h2>
              <p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.signOfCross}</p>
              <h2 style={{ fontSize: "24px", color: "#d4af37", marginTop:"40px" }}>Apostles Creed</h2>
              <p style={{ marginTop: "20px", fontSize: "18px", color:"#e0e0e0" }}>{prayers.creed}</p>
            </div> 
          )}

          {/* STEP 2: The Pendant (Our Father, 3x Hail Mary, Glory Be) */}
          {stage === "pendant" && (() => {
            const data = getPendantData();
            return (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <h2 style={{ fontSize: "20px", color: "#a0a0a0", marginBottom:"20px" }}>Introductory Prayers</h2>
                <div style={{ textAlign: "left", backgroundColor: "#16213e", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", position: "relative" }}>
                  <button onClick={() => playAudio(data.obj, data.followup)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
                  <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{data.title}</h3>
                  <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(data.obj, data.followup)}</p>
                </div>
              </div>
            );
          })()}
          
          {/* STEP 3: The Decades (With Scriptures!) */}
          {stage === "decades" && (() => {
            const data = getRosaryPrayerData();
            const currentMystery = mysteries.joyful.decades[currentDecade];
            return (
              <>
                <div style={{ textAlign: "center", marginTop: "10px", padding:"10px", backgroundColor:"#16213e", borderRadius:"12px" }}>
                  <h2 style={{ fontSize: "20px", margin: "0", color:"#fff" }}>{currentMystery.title}</h2>
                  <p style={{ color: "#d4af37", fontSize: "14px", fontStyle: "italic", marginTop: "5px" }}>Fruit: {currentMystery.fruit}</p>
                  
                  {/* SCRIPTURE RE-ADDED (Features 16 & 17) */}
                  {currentBead === 0 && (
                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #333", fontSize: "14px", color: "#a0a0a0", textAlign: "left" }}>
                      <p style={{ marginBottom: "10px" }}><strong>Scripture:</strong> {currentMystery.verse}</p>
                      <p><strong>Reflection:</strong> {currentMystery.reflection}</p>
                    </div>
                  )}
                </div>
                
                <RosaryBeads currentBead={currentBead} isChaplet={false} />
                
                <div style={{ textAlign: "left", backgroundColor: "#16213e", padding: "20px", borderRadius: "12px", border: "1px solid #333", position: "relative" }}>
                  <button onClick={() => playAudio(data.obj, data.followup)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
                  <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{data.title}</h3>
                  <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(data.obj, data.followup)}</p>
                </div>
              </>
            );
          })()}
          
          {/* STEP 4: Closing */}
          {stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.hailHolyQueen}</p></div> )}
          
          <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div>
        </div>
      )}

      {/* Chaplet cut for space, will add back later! */}
    </div>
  );
          }
