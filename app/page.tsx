"use client";
import { useState } from "react";

// --- OUR LEGO PIECE: THE VISUAL BEADS ---
// We put it right here in the same file so it can't get lost!
function RosaryBeads({ currentBead }: { currentBead: number }) {
  const beads = Array.from({ length: 10 });
  const radius = 110; 
  const center = 150; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
      <svg width="300" height="360" viewBox="0 0 300 360">
        <circle cx={center} cy={center} r={radius} stroke="#444" strokeWidth="2" fill="none" />
        <path d="M 150 260 L 150 320" stroke="#444" strokeWidth="2" />

        {beads.map((_, index) => {
          const angle = (index / 10) * (Math.PI * 2) - (Math.PI / 2);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = currentBead === index;

          return (
            <circle
              key={index} cx={x} cy={y}
              r={isActive ? 14 : 10} 
              fill={isActive ? "#d4af37" : "#1a1a2e"} 
              stroke="#d4af37" strokeWidth="2"
              style={{
                filter: isActive ? "drop-shadow(0px 0px 10px #d4af37)" : "none",
                transition: "all 0.4s ease" 
              }}
            />
          );
        })}

        <circle 
          cx="150" cy="280" 
          r={currentBead === 10 ? 16 : 12} 
          fill={currentBead === 10 ? "#d4af37" : "#1a1a2e"} 
          stroke="#d4af37" strokeWidth="2" 
          style={{ transition: "all 0.4s ease" }}
        />
        <text x="150" y="355" fontSize="50" textAnchor="middle" fill="#d4af37">✝</text>
      </svg>
    </div>
  );
}

// --- OUR MAIN APP ---
export default function Home() {
  const [screen, setScreen] = useState("home");
  const [currentBead, setCurrentBead] = useState(0);

  const nextBead = () => {
    if (currentBead < 10) {
      setCurrentBead(currentBead + 1);
    } else {
      setCurrentBead(0); 
    }
  };

  if (screen === "rosary") {
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh", paddingBottom: "100px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", padding: "10px" }}>← Back</button>
          <h2 style={{ fontSize: "18px" }}>1st Glorious Mystery</h2>
          <div style={{ width: "50px" }}></div>
        </header>

        {/* The Beads! */}
        <RosaryBeads currentBead={currentBead} />

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <h3 style={{ color: "#d4af37", marginBottom: "10px" }}>
            {currentBead === 10 ? "Glory Be / O My Jesus" : `Hail Mary (${currentBead + 1}/10)`}
          </h3>
          <p style={{ fontSize: "18px", lineHeight: "1.5", padding: "0 10px", color: "#e0e0e0" }}>
            {currentBead === 10 
              ? "Glory be to the Father, and to the Son, and to the Holy Spirit..." 
              : "Hail Mary, full of grace, the Lord is with thee..."}
          </p>
        </div>

        <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}>
          <button 
            onClick={nextBead}
            style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", boxShadow: "0 4px 10px rgba(212, 175, 55, 0.3)" }}>
            Next Prayer ➔
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1>Holy Rosary</h1>
        <button style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
      </header>
      <main>
        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px" }}>
          <h2>Quick Start Rosary</h2>
          <p style={{ color: "#a0a0a0", marginBottom: "20px" }}>Today's Mystery: Glorious</p>
          <button 
            onClick={() => setScreen("rosary")}
            style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "12px", width: "100%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none" }}>
            ▶ Start Praying
          </button>
        </div>
      </main>
    </div>
  );
    }
