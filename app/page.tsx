"use client";
import { useState, useEffect } from "react";
import { prayers, mysteries, getTodaysMystery } from "./data";

// --- THE VISUAL BEADS ---
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
  
  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");

  // DATABASE STATES
  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);

  // LOAD SAVED DATA WHEN APP OPENS
  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]);
    setTodaysMystery(getTodaysMystery());

    // Load Stats from Phone Memory
    const savedTotal = localStorage.getItem("totalRosaries");
    if (savedTotal) setTotalRosaries(parseInt(savedTotal));

    const savedStreak = localStorage.getItem("streak");
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  // SAVE STATS FUNCTION (Runs when you click "Finish Rosary")
  const finishRosaryAndSave = () => {
    // 1. Update Lifetime Total
    const newTotal = totalRosaries + 1;
    setTotalRosaries(newTotal);
    localStorage.setItem("totalRosaries", newTotal.toString());

    // 2. Update Streak (Simplified for now: just adds 1!)
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streak", newStreak.toString());

    // 3. Reset and go Home
    setScreen("home");
    setStage("intro");
    setCurrentDecade(0);
    setCurrentBead(0);
  };

  const nextPrayer = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    if (stage === "intro") {
      setStage("decades");
    } else if (stage === "decades") {
      if (currentBead < 10) {
        setCurrentBead(currentBead + 1);
      } else {
        if (currentDecade < 4) {
          setCurrentDecade(currentDecade + 1);
          setCurrentBead(0);
        } else {
          setStage("outro");
        }
      }
    } else if (stage === "outro") {
      // THIS IS WHERE WE SAVE!
      finishRosaryAndSave();
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- ROSARY SCREEN ---
  if (screen === "rosary") {
    const currentDecadeData = mysteries.joyful.decades[currentDecade];

    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh", paddingBottom: "120px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => { setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0); }} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", padding: "10px 0" }}>← Quit</button>
          <div style={{ fontSize: "14px", color: "#d4af37" }}>{mysteries.joyful.name}</div>
          <div style={{ width: "50px" }}></div>
        </header>

        {stage === "intro" && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <h2 style={{ fontSize: "24px", color: "#d4af37" }}>Opening Prayers</h2>
            <p style={{ marginTop: "20px", fontSize: "18px", color: "#e0e0e0" }}>{prayers.signOfCross}</p>
            <p style={{ marginTop: "20px", fontSize: "18px", color: "#e0e0e0" }}>{prayers.creed}</p>
            <button onClick={() => playAudio(prayers.signOfCross + " " + prayers.creed)} style={{ marginTop: "20px", padding: "10px", borderRadius: "50%", background: "#d4af37", border: "none", fontSize: "20px" }}>🔊</button>
          </div>
        )}

        {stage === "decades" && (
          <>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <h2 style={{ fontSize: "22px", margin: "0" }}>{currentDecadeData.title}</h2>
              <p style={{ color: "#a0a0a0", fontSize: "14px", fontStyle: "italic", marginTop: "5px" }}>Fruit of the Mystery: {currentDecadeData.fruit}</p>
            </div>
            <RosaryBeads currentBead={currentBead} />
            <div style={{ textAlign: "center", backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", border: "1px solid #333", position: "relative" }}>
              <button onClick={() => playAudio(currentBead === 10 ? prayers.gloryBe : prayers.hailMary)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>🔊</button>
              <h3 style={{ color: "#d4af37", marginBottom: "10px", fontSize: "16px", marginTop: "10px" }}>{currentBead === 10 ? "Glory Be / O My Jesus" : `Hail Mary (${currentBead + 1}/10)`}</h3>
              <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{currentBead === 10 ? prayers.gloryBe : prayers.hailMary}</p>
            </div>
          </>
        )}

        {stage === "outro" && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2>
            <p style={{ marginTop: "20px", fontSize: "18px", color: "#e0e0e0" }}>{prayers.hailHolyQueen}</p>
            <p style={{ marginTop: "20px", fontSize: "18px", color: "#e0e0e0" }}>{prayers.signOfCross}</p>
            <button onClick={() => playAudio(prayers.hailHolyQueen)} style={{ marginTop: "20px", padding: "10px", borderRadius: "50%", background: "#d4af37", border: "none", fontSize: "20px" }}>🔊</button>
          </div>
        )}

        <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}>
          <button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>
            {stage === "outro" ? "Finish Rosary ✓" : "Next Prayer ➔"}
          </button>
        </div>
      </div>
    );
  }

  // --- HOME SCREEN ---
  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px" }}>Holy Rosary</h1>
        <button style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
      </header>
      
      <main>
        {/* NEW FEATURE: PRAYER STATS DASHBOARD */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}>
            <p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p>
            <p style={{ fontSize: "12px", color: "#a0a0a0", marginTop: "5px" }}>Day Streak</p>
          </div>
          <div style={{ flex: 1, backgroundColor: "#16213e", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}>
            <p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p>
            <p style={{ fontSize: "12px", color: "#a0a0a0", marginTop: "5px" }}>Total Rosaries</p>
          </div>
        </div>

        <div style={{ backgroundColor: "#16213e", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2>
          <p style={{ color: "#a0a0a0", marginBottom: "5px" }}>Today is {todayName}</p>
          <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p>
          <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {["Divine Mercy", "Stations of the Cross", "Prayer Library", "My Custom Lists"].map((title) => (
            <div key={title} style={{ backgroundColor: "#16213e", padding: "20px 10px", borderRadius: "16px", textAlign: "center", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #2a2a4a" }}>
              {title}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
