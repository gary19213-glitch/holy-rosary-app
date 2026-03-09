"use client";
import { useState } from "react";
// Import our new Lego piece!
import RosaryBeads from "./components/RosaryBeads";

export default function Home() {
  const [screen, setScreen] = useState("home");
  // This state remembers which bead we are on (0 to 10)
  const [currentBead, setCurrentBead] = useState(0);

  // Function to move to the next bead
  const nextBead = () => {
    if (currentBead < 10) {
      setCurrentBead(currentBead + 1);
    } else {
      setCurrentBead(0); // Reset after the decade
    }
  };

  // --- ROSARY SCREEN ---
  if (screen === "rosary") {
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none" }}>← Back</button>
          <h2 style={{ fontSize: "18px" }}>1st Glorious Mystery</h2>
          <div style={{ width: "50px" }}></div> {/* Spacer */}
        </header>

        {/* Our visual SVG beads component */}
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

        {/* Feature 22: Step-by-Step Navigation */}
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

  // --- HOME SCREEN ---
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
