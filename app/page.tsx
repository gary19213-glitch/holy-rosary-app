"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery, prayerLibrary, getLiturgicalInfo } from "./data";

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
          const index = i + 1; 
          const angle = (index / 10) * (Math.PI * 2) - (Math.PI / 2);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = currentBead === index;
          return ( <circle key={index} cx={x} cy={y} r={isActive ? 14 : 10} fill={isActive ? "#d4af37" : "transparent"} stroke="#d4af37" strokeWidth="2" style={{ filter: isActive ? "drop-shadow(0px 0px 10px #d4af37)" : "none", transition: "all 0.4s ease" }} /> );
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
  
  // LITURGICAL STATES
  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [liturgicalSeason, setLiturgicalSeason] = useState("Ordinary Time");
  const [themeColor, setThemeColor] = useState("#1a1a2e"); // Default Purple

  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]);
    setTodaysMystery(getTodaysMystery());
    
    // FETCH THE COLOR AND SEASON FROM THE CALENDAR ENGINE
    const liturgy = getLiturgicalInfo();
    setLiturgicalSeason(liturgy.season);
    setThemeColor(liturgy.color);

    if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
    if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
  }, []);

  const finishAndSave = () => {
    const newTotal = totalRosaries + 1; setTotalRosaries(newTotal); localStorage.setItem("totalRosaries", newTotal.toString());
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0); setPendantBead(0);
  };

  const nextPrayer = () => {
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

  return (
    // FEATURE #71: The background color dynamically changes based on the Church calendar!
    <div style={{ padding: "20px", backgroundColor: themeColor, color: "white", minHeight: "100vh", transition: "background-color 1s ease" }}>
      
      {screen === "home" && (
        <>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px" }}>Holy Rosary</h1>
            <button style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
          </header>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Day Streak</p></div>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Total Prayers</p></div>
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2>
            
            {/* FEATURE #7: TODAY'S INFO BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ccc", marginBottom: "15px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
              <span>{todayName}</span>
              <span style={{ color: "#d4af37", fontWeight: "bold" }}>{liturgicalSeason}</span>
            </div>

            <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p>
            <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button>
          </div>
        </>
      )}

      {screen === "rosary" && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button>
            <div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>{mysteries.joyful.name}</div>
            <div style={{ width: "50px" }}></div>
          </header>
          
          {stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Sign of the Cross</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.signOfCross}</p></div> )}
          
          {stage === "pendant" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "20px", color: "#ccc", marginBottom:"20px" }}>Introductory Prayers</h2><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37" }}><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{pendantBead === 0 ? "Our Father" : pendantBead === 4 ? "Glory Be" : `Hail Mary (${pendantBead}/3)`}</h3></div></div> )}
          
          {stage === "decades" && (
            <>
              <div style={{ textAlign: "center", marginTop: "10px", padding:"10px", backgroundColor:"rgba(0,0,0,0.3)", borderRadius:"12px" }}>
                <h2 style={{ fontSize: "20px", margin: "0", color:"#fff" }}>{mysteries.joyful.decades[currentDecade].title}</h2>
              </div>
              <RosaryBeads currentBead={currentBead} />
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{currentBead === 0 ? "Our Father" : currentBead === 11 ? "Glory Be" : `Hail Mary (${currentBead}/10)`}</h3>
              </div>
            </>
          )}
          
          {stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.hailHolyQueen}</p></div> )}
          
          <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div>
        </div>
      )}
    </div>
  );
                         }
