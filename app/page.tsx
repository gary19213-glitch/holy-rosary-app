"use client";
import { useState, useEffect } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery } from "./data";

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

export default function Home() {
  const [screen, setScreen] = useState("home"); 
  const [stage, setStage] = useState("intro"); 
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Settings states
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true); // Feature #27 toggle

  useEffect(() => {
    if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
    if (localStorage.getItem("alternatingMode") !== null) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
  }, []);

  const saveSettings = (speed: number, alternating: boolean) => {
    setSpeechSpeed(speed);
    setAlternatingMode(alternating);
    localStorage.setItem("speechSpeed", speed.toString());
    localStorage.setItem("alternatingMode", alternating.toString());
  };

  const quitToHome = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false);
    setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0);
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
    else if (stage === "outro") quitToHome();
  };

  // FEATURE #27: THE ALTERNATING AUDIO ENGINE
  const playAudio = (prayerObj: any) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // If it's just a normal string (like Sign of the Cross)
      if (typeof prayerObj === "string") {
        const u = new SpeechSynthesisUtterance(prayerObj);
        u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      } 
      // If it's a split prayer (Leader/Response) AND Alternating mode is ON
      else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const leaderUtterance = new SpeechSynthesisUtterance(prayerObj.leader);
        leaderUtterance.rate = speechSpeed;
        leaderUtterance.pitch = 1.2; // Slightly higher pitch for Leader

        const responseUtterance = new SpeechSynthesisUtterance(prayerObj.response);
        responseUtterance.rate = speechSpeed;
        responseUtterance.pitch = 0.7; // Lower pitch for Congregation response!

        // When Leader finishes, Congregation speaks
        leaderUtterance.onend = () => {
          window.speechSynthesis.speak(responseUtterance);
        };
        
        // When Congregation finishes, move to next bead (if autoplay is on)
        if (isAutoPlay) responseUtterance.onend = () => nextPrayer();

        window.speechSynthesis.speak(leaderUtterance);
      }
      // If Alternating mode is OFF, just read it as one long sentence
      else {
        const fullText = prayerObj.leader + " " + prayerObj.response;
        const u = new SpeechSynthesisUtterance(fullText);
        u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      }
    }
  };

  useEffect(() => {
    if (isAutoPlay && screen !== "home" && screen !== "settings") {
      let prayerToRead;
      if (screen === "rosary" && stage === "decades") prayerToRead = currentBead === 10 ? prayers.gloryBe : prayers.hailMary;
      else if (screen === "chaplet" && stage === "decades") prayerToRead = currentBead === 10 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion;
      if (prayerToRead) playAudio(prayerToRead);
    }
  }, [currentBead, stage, isAutoPlay]); 

  // --- SETTINGS SCREEN ---
  if (screen === "settings") {
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
        <header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button>
          <h1 style={{ fontSize: "24px" }}>Settings</h1>
        </header>

        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Audio Preferences</h2>
          
          {/* FEATURE #27 TOGGLE */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <label style={{ color: "#a0a0a0" }}>Alternating Voices (Leader/Response)</label>
            <button onClick={() => saveSettings(speechSpeed, !alternatingMode)} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? "#d4af37" : "#333", color: alternatingMode ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>
              {alternatingMode ? "ON" : "OFF"}
            </button>
          </div>

          <label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Speech Speed: {speechSpeed}x</label>
          <input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => saveSettings(parseFloat(e.target.value), alternatingMode)} style={{ width: "100%", accentColor: "#d4af37" }} />
          
          <button onClick={() => playAudio(prayers.hailMary)} style={{ width: "100%", marginTop: "20px", padding: "12px", backgroundColor: "#333", color: "white", border: "1px solid #555", borderRadius: "8px", fontWeight: "bold" }}>
            Test Hail Mary Audio 🔊
          </button>
        </div>
      </div>
    );
  }

  // Basic Prayer Render Helper
  const renderPrayerText = (prayer: any) => {
    if (typeof prayer === "string") return prayer;
    return (
      <>
        <span style={{ color: "#d4af37" }}>V.</span> {prayer.leader}<br/><br/>
        <span style={{ color: "#d4af37" }}>R.</span> {prayer.response}
      </>
    );
  };

  // --- ROSARY SCREEN ---
  if (screen === "rosary") {
    const prayer = currentBead === 10 ? prayers.gloryBe : prayers.hailMary;
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh", paddingBottom: "120px" }}>
        <header style={{ display: "flex", justifyContent: "space-between" }}><button onClick={quitToHome} style={{ background: "none", color: "#a0a0a0", border: "none" }}>← Quit</button><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header>
        
        {stage === "decades" && (
          <>
            <RosaryBeads currentBead={currentBead} />
            <div style={{ textAlign: "left", backgroundColor: "#16213e", padding: "20px", borderRadius: "12px", border: "1px solid #333", position: "relative" }}>
              <button onClick={() => playAudio(prayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
              <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center" }}>{currentBead === 10 ? "Glory Be" : `Hail Mary (${currentBead + 1}/10)`}</h3>
              <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(prayer)}</p>
            </div>
          </>
        )}
        <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>Next Prayer ➔</button></div>
      </div>
    );
  }

  // --- HOME SCREEN ---
  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px" }}>Holy Rosary</h1>
        <button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
      </header>
      <main>
        <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", marginBottom: "20px" }}>▶ Start Praying</button>
      </main>
    </div>
  );
                                                                                                                             }
