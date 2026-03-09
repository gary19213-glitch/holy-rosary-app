"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery } from "./data";

// --- PROCEDURAL GREGORIAN CHANT ENGINE (Feature #30) ---
// This lives outside the component so it doesn't get interrupted by screen changes
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillators: any[] = [];

const startChant = (volume: number) => {
  if (typeof window === "undefined") return;
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (oscillators.length > 0) return; // Already playing

  masterGain = audioCtx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(audioCtx.destination);

  // A filter to muffle the sound, making it feel like it's echoing in a massive stone Cathedral
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400; 
  filter.connect(masterGain);

  // A solemn D-minor chord (D2, A2, D3, F3)
  const frequencies = [73.42, 110.00, 146.83, 174.61];

  frequencies.forEach(freq => {
    const osc = audioCtx!.createOscillator();
    osc.type = 'sine'; // Pure, smooth tone like a human voice
    osc.frequency.value = freq;

    // Create a slow "breathing" effect (vibrato)
    const lfo = audioCtx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1 + Math.random() * 0.1; // Slow breathing
    const lfoGain = audioCtx!.createGain();
    lfoGain.gain.value = 2; 
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.connect(filter);
    osc.start();
    oscillators.push({ osc, lfo });
  });
};

const stopChant = () => {
  oscillators.forEach(o => { o.osc.stop(); o.lfo.stop(); });
  oscillators = [];
};

const setChantVolume = (v: number) => {
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(v, audioCtx.currentTime, 0.1);
  }
};

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
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Settings
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);
  
  // NEW CHANT SETTINGS (Feature #31, #82)
  const [isChantOn, setIsChantOn] = useState(false);
  const [chantVolume, setChantVolumeState] = useState(0.2); // Default to quiet

  useEffect(() => {
    if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
    if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
    
    // Load chant settings
    if (localStorage.getItem("isChantOn")) setIsChantOn(localStorage.getItem("isChantOn") === "true");
    if (localStorage.getItem("chantVolume")) setChantVolumeState(parseFloat(localStorage.getItem("chantVolume")!));
  }, []);

  // Sync the live audio engine when settings change
  useEffect(() => {
    if (isChantOn) {
      startChant(chantVolume);
    } else {
      stopChant();
    }
    setChantVolume(chantVolume);
  }, [isChantOn, chantVolume]);

  const saveSettings = (speed: number, alternating: boolean, chantOn: boolean, cVol: number) => {
    setSpeechSpeed(speed); setAlternatingMode(alternating);
    setIsChantOn(chantOn); setChantVolumeState(cVol);
    
    localStorage.setItem("speechSpeed", speed.toString());
    localStorage.setItem("alternatingMode", alternating.toString());
    localStorage.setItem("isChantOn", chantOn.toString());
    localStorage.setItem("chantVolume", cVol.toString());
  };

  const playAudio = (prayerObj: any) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (typeof prayerObj === "string") {
        const u = new SpeechSynthesisUtterance(prayerObj);
        u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      } else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const l = new SpeechSynthesisUtterance(prayerObj.leader); l.rate = speechSpeed; l.pitch = 1.2;
        const r = new SpeechSynthesisUtterance(prayerObj.response); r.rate = speechSpeed; r.pitch = 0.7;
        l.onend = () => window.speechSynthesis.speak(r);
        if (isAutoPlay) r.onend = () => nextPrayer();
        window.speechSynthesis.speak(l);
      } else {
        const u = new SpeechSynthesisUtterance(prayerObj.leader + " " + prayerObj.response);
        u.rate = speechSpeed;
        if (isAutoPlay) u.onend = () => nextPrayer();
        window.speechSynthesis.speak(u);
      }
    }
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
    else if (stage === "outro") {
      setScreen("home"); setStage("intro"); setCurrentDecade(0); setCurrentBead(0);
    }
  };

  const renderPrayerText = (prayer: any) => {
    if (typeof prayer === "string") return prayer;
    return <><span style={{ color: "#d4af37" }}>V.</span> {prayer.leader}<br/><br/><span style={{ color: "#d4af37" }}>R.</span> {prayer.response}</>;
  };

  // --- SETTINGS SCREEN ---
  if (screen === "settings") {
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
        <header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button>
          <h1 style={{ fontSize: "24px" }}>Settings</h1>
        </header>

        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Voice Settings</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <label style={{ color: "#a0a0a0" }}>Alternating Voices (Leader/Response)</label>
            <button onClick={() => saveSettings(speechSpeed, !alternatingMode, isChantOn, chantVolume)} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? "#d4af37" : "#333", color: alternatingMode ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{alternatingMode ? "ON" : "OFF"}</button>
          </div>
          <label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Speech Speed: {speechSpeed}x</label>
          <input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => saveSettings(parseFloat(e.target.value), alternatingMode, isChantOn, chantVolume)} style={{ width: "100%", accentColor: "#d4af37" }} />
        </div>

        {/* NEW CHANT SETTINGS */}
        <div style={{ backgroundColor: "#16213e", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Background Music</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <label style={{ color: "#a0a0a0" }}>Cathedral Drone (Chant)</label>
            <button onClick={() => saveSettings(speechSpeed, alternatingMode, !isChantOn, chantVolume)} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: isChantOn ? "#d4af37" : "#333", color: isChantOn ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{isChantOn ? "ON" : "OFF"}</button>
          </div>
          <label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Chant Volume</label>
          <input type="range" min="0.0" max="1.0" step="0.05" value={chantVolume} onChange={(e) => saveSettings(speechSpeed, alternatingMode, isChantOn, parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#d4af37" }} />
        </div>
      </div>
    );
  }

  // --- ROSARY SCREEN ---
  if (screen === "rosary") {
    const prayer = currentBead === 10 ? prayers.gloryBe : prayers.hailMary;
    return (
      <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh", paddingBottom: "120px" }}>
        <header style={{ display: "flex", justifyContent: "space-between" }}><button onClick={() => setScreen("home")} style={{ background: "none", color: "#a0a0a0", border: "none" }}>← Quit</button></header>
        {stage === "decades" && (
          <><RosaryBeads currentBead={currentBead} /><div style={{ textAlign: "left", backgroundColor: "#16213e", padding: "20px", borderRadius: "12px", border: "1px solid #333", position: "relative" }}><button onClick={() => playAudio(prayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center" }}>{currentBead === 10 ? "Glory Be" : `Hail Mary (${currentBead + 1}/10)`}</h3><p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(prayer)}</p></div></>
        )}
        <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>Next Prayer ➔</button></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a2e", color: "white", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px" }}>Holy Rosary</h1>
        <button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button>
      </header>
      <main>
        <button onClick={() => { setScreen("rosary"); setStage("decades"); }} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", marginBottom: "20px" }}>▶ Start Praying</button>
      </main>
    </div>
  );
         }
