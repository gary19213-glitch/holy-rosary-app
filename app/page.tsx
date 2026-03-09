"use client";
import { useState } from "react";

export default function Home() {
  const [screen, setScreen] = useState("home");

  if (screen === "rosary") {
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
        <button onClick={() => setScreen("home")} style={{ fontSize: "18px", background: "none", color: "white", border: "none" }}>← Back</button>
        <h1 style={{ textAlign: "center", marginTop: "40px" }}>The Holy Rosary</h1>
        <p style={{ textAlign: "center", color: "#d4af37", marginTop: "20px" }}>(Visual beads will go here!)</p>
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
        {/* Feature 1: Quick Start */}
        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px" }}>
          <h2>Quick Start Rosary</h2>
          <p style={{ color: "#a0a0a0", marginBottom: "20px" }}>Today's Mystery: Glorious</p>
          <button 
            onClick={() => setScreen("rosary")}
            style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "12px", width: "100%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none" }}>
            ▶ Start Praying
          </button>
        </div>

        {/* Feature 2: Divine Mercy */}
        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
          <h3>Divine Mercy Chaplet</h3>
        </div>
      </main>
    </div>
  );
}
