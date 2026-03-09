"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery } from "./data";

// --- VISUAL BEADS ---
function RosaryBeads({ currentBead }: { currentBead: number }) {
  const beads = Array.from({ length: 10 });
  const radius = 110; const center = 150; 
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="300" height="360" viewBox="0 0 300 360">
        <circle cx={center} cy={center} r={radius} stroke="#444" strokeWidth="2" fill="none" />
        <path d="M 150 260 L 150 320" stroke="#444" strokeWidth="2" />
        {beads.map((_, index) => {
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
        <circle cx="150" cy="280" r={currentBead === 10 ? 16 : 12} fill={currentBead === 10 ? "#d4af37" : "#1a1a2e"} stroke="#d4af37" strokeWidth="2" style={{ transition: "all 0.4s ease" }} />
        <text x="150" y="355" fontSize="50" textAnchor="middle" fill="#d4af37">✝</text>
      </svg>
    </div>
  );
}

// --- MAIN APP ---
export default function Home() {
  const [screen, setScreen] = useState("home"); 
  const [stage, setStage] = useState("intro"); 
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  
  // Home Data & Stats
  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);

  // Audio Settings
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);
  const [isChantOn, setIsChantOn] = useState(false);
  const [chantVolume, setChantVolumeState] = useState(0.2);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load everything on startup
  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]);
    setTodaysMystery(getTodaysMystery());
    
    if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
    if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
    if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
    if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
    if (localStorage.getItem("isChantOn")) setIsChantOn(localStorage.getItem("isChantOn") === "true");
    if (localStorage.getItem("chantVolume")) setChantVolumeState(parseFloat(localStorage.getItem("chantVolume")!));
  }, []);

  // Sync background music volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = chantVolume;
  }, [chantVolume]);

  // Save Settings AND trigger audio safely for Android
  const toggleChant = () => {
    const newState = !isChantOn;
    setIsChantOn(newState);
    localStorage.setItem("isChantOn", newState.toString());
    
    // Play/Pause exactly when the user taps the button to bypass Android blocks
    if (audioRef.current) {
      if (newState) audioRef.current.play().catch(e => console.log("Audio blocked", e));
      else audioRef.current.pause();
    }
  };

  const saveSpeed = (speed: number) => { setSpeechSpeed(speed); localStorage.setItem("speechSpeed", speed.toString()); };
  const toggleAlternating = () => { setAlternatingMode(!alternatingMode); localStorage.setItem("alternatingMode", (!alternatingMode).toString()); };

  const finishAndSave = () => {
    const newTotal = totalRosaries + 1; setTotalRosaries(newTotal); localStorage.setItem("totalRosaries", newTotal.toString());
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    quitToHome();
  };

  const quitToHome = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0);
  };

  const nextPrayer = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (stage === "intro") setStage("decades");
    else if (stage === "decades") {
      if (currentBead < 10) setCurrentBead(currentBead + 1);
      else {
        if (currentDecade < 4) { setCurrentDecade(currentDecade + 1); setCurrentBead(0); }
        else setStage("outro");
      }
    } 
    else if (stage === "outro") finishAndSave();
  };

  const playAudio = (prayerObj: any) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (typeof prayerObj === "string") {
        const u = new SpeechSynthesisUtterance(prayerObj); u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      } else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const l = new SpeechSynthesisUtterance(prayerObj.leader); l.rate = speechSpeed; l.pitch = 1.2;
        const r = new SpeechSynthesisUtterance(prayerObj.response); r.rate = speechSpeed; r.pitch = 0.7;
        l.onend = () => window.speechSynthesis.speak(r);
        if (isAutoPlay) r.onend = () => nextPrayer();
        window.speechSynthesis.speak(l);
      } else {
        const u = new SpeechSynthesisUtterance(prayerObj.leader + " " + prayerObj.response); u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      }
    }
  };

  // Auto-play trigger
  useEffect(() => {
    if (isAutoPlay && (screen === "rosary" || screen === "chaplet")) {
      let prayerToRead;
      if (screen === "rosary") {
        if (stage === "intro") prayerToRead = prayers.signOfCross + ". " + prayers.creed;
        else if (stage === "decades") prayerToRead = currentBead === 10 ? prayers.gloryBe : prayers.hailMary;
        else if (stage === "outro") prayerToRead = prayers.hailHolyQueen;
      } else if (screen === "chaplet") {
        if (stage === "intro") prayerToRead = chapletPrayers.opening;
        else if (stage === "decades") prayerToRead = currentBead === 10 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion;
        else if (stage === "outro") prayerToRead = chapletPrayers.closing;
      }
      if (prayerToRead) playAudio(prayerToRead);
    }
  }, [currentBead, stage, isAutoPlay]); 

  const renderPrayerText = (prayer: any) => {
    if (typeof prayer === "string") return prayer;
    return <><span style={{ color: "#d4af37" }}>V.</span> {prayer.leader}<br/><br/><span style={{ color: "#d4af37" }}>R.</span> {prayer.response}</>;
  };

  // --- SCREENS ---
  return (
    <div style={{ padding: "20px", backgroundColor: screen === "chaplet" ? "#3a0e1b" : "#1a1a2e", color: "white", minHeight: "100vh" }}>
      
      {/* Background Audio Player (Real MP3 Monks) */}
      <audio ref={audioRef} src="https://www.soundjay.com/misc/sounds/wind-chimes-1.mp3" loop />

      {/* --- HOME SCREEN --- */}
      {screen === "home" && (
        <>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px" }}>Holy Rosary</h1>
            <button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
          </header>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#a0a0a0" }}>Day Streak</p></div>
            <div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#a0a0a0" }}>Total Prayers</p></div>
          </div>
          <div style={{ backgroundColor: "#16213e", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2>
            <p style={{ color: "#a0a0a0", marginBottom: "5px" }}>Today is {todayName}</p>
            <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p>
            <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "#3a0e1b", padding: "20px 10px", borderRadius: "16px", textAlign: "center", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37" }}>Divine Mercy</div>
            <div style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>Stations of Cross</div>
            <div style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>Prayer Library</div>
            <div style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>My Custom Lists</div>
          </div>
        </>
      )}

      {/* --- SETTINGS SCREEN --- */}
      {screen === "settings" && (
        <>
          <header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "24px" }}>Settings</h1></header>
          <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Voice Settings</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: "#a0a0a0" }}>Alternating Voices</label><button onClick={toggleAlternating} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? "#d4af37" : "#333", color: alternatingMode ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{alternatingMode ? "ON" : "OFF"}</button></div>
            <label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Speech Speed: {speechSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => saveSpeed(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#d4af37" }} />
          </div>
          <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Background Chant</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: "#a0a0a0" }}>Real Monks Audio</label><button onClick={toggleChant} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: isChantOn ? "#d4af37" : "#333", color: isChantOn ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{isChantOn ? "ON" : "OFF"}</button></div>
            <label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Chant Volume</label><input type="range" min="0.0" max="1.0" step="0.05" value={chantVolume} onChange={(e) => setChantVolumeState(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#d4af37" }} />
          </div>
        </>
      )}

      {/* --- ROSARY & CHAPLET SCREENS --- */}
      {(screen === "rosary" || screen === "chaplet") && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><button onClick={quitToHome} style={{ background: "none", color: "#a0a0a0", border: "none", fontSize: "16px" }}>← Quit</button><div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>{screen === "rosary" ? mysteries.joyful.name : "Divine Mercy"}</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header>
          
          {stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Opening Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{screen === "rosary" ? prayers.signOfCross : chapletPrayers.opening}</p></div> )}
          
          {stage === "decades" && (
            <><div style={{ textAlign: "center", marginTop: "10px" }}><h2 style={{ fontSize: "22px", margin: "0" }}>{screen === "rosary" ? mysteries.joyful.decades[currentDecade].title : `Decade ${currentDecade + 1}`}</h2></div><RosaryBeads currentBead={currentBead} /><div style={{ textAlign: "left", backgroundColor: screen === "chaplet" ? "#2d0b15" : "#16213e", padding: "20px", borderRadius: "12px", border: "1px solid #333", position: "relative" }}><button onClick={() => playAudio(screen === "rosary" ? (currentBead === 10 ? prayers.gloryBe : prayers.hailMary) : (currentBead === 10 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion))} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center" }}>{currentBead === 10 ? (screen === "rosary" ? "Glory Be" : "Large Bead") : (screen === "rosary" ? `Hail Mary (${currentBead + 1}/10)` : `Small Bead (${currentBead + 1}/10)`)}</h3><p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(screen === "rosary" ? (currentBead === 10 ? prayers.gloryBe : prayers.hailMary) : (currentBead === 10 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion))}</p></div></>
          )}
          
          {stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{screen === "rosary" ? prayers.hailHolyQueen : chapletPrayers.closing}</p></div> )}
          
          <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div>
        </div>
      )}
    </div>
  );
      }
