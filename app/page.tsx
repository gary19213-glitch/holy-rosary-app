// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMysterySet, prayerLibrary, getLiturgicalInfo, getTodaySaint, stationsOfCross } from "./data";

function RosaryBeads({ currentBead }: { currentBead: number }) {
  const beads = Array.from({ length: 10 }); const radius = 110; const center = 150; 
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
  const [screen, setScreen] = useState("home"); // home, rosary, chaplet, stations, library, settings, journal
  const [stage, setStage] = useState("intro"); 
  const [pendantBead, setPendantBead] = useState(0); 
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  const [currentStation, setCurrentStation] = useState(0); 

  // PRAYER TIME TRACKER (Feature 63)
  const [prayerSeconds, setPrayerSeconds] = useState(0);
  const [totalPrayerMinutes, setTotalPrayerMinutes] = useState(0);
  useEffect(() => {
    let interval = null;
    if (screen === "rosary" || screen === "chaplet" || screen === "stations") {
      interval = setInterval(() => setPrayerSeconds(s => s + 1), 1000);
    } else { if (interval) clearInterval(interval); setPrayerSeconds(0); }
    return () => clearInterval(interval);
  }, [screen]);

  // SETTINGS STATES
  const [appTheme, setAppTheme] = useState("auto");
  const [actualColor, setActualColor] = useState("#1a1a2e");
  const [displayMode, setDisplayMode] = useState("visual");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);
  const [prayerLanguage, setPrayerLanguage] = useState("english"); // english, latin, bilingual
  const [customDecadePrayer, setCustomDecadePrayer] = useState("");
  const [selectedMysterySet, setSelectedMysterySet] = useState("");

  // STATS & DATA STATES
  const [todaysSaint, setTodaysSaint] = useState<any>(null);
  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");

  useEffect(() => {
    setTodaysSaint(getTodaySaint());
    setSelectedMysterySet(getTodaysMysterySet());
    if (typeof window !== "undefined") {
      if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
      if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
      if (localStorage.getItem("totalPrayerMinutes")) setTotalPrayerMinutes(parseInt(localStorage.getItem("totalPrayerMinutes")!));
      if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
      if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
      if (localStorage.getItem("prayerLanguage")) setPrayerLanguage(localStorage.getItem("prayerLanguage")!);
      if (localStorage.getItem("appTheme")) setAppTheme(localStorage.getItem("appTheme")!);
      if (localStorage.getItem("displayMode")) setDisplayMode(localStorage.getItem("displayMode")!);
      if (localStorage.getItem("customDecadePrayer")) setCustomDecadePrayer(localStorage.getItem("customDecadePrayer")!);
    }
  }, []);

  useEffect(() => {
    if (appTheme === "auto") { setActualColor(getLiturgicalInfo().color); }
    else if (appTheme === "purple") setActualColor("#2d1b2e");
    else if (appTheme === "blue") setActualColor("#0a192f");
    else if (appTheme === "gold") setActualColor("#4a3b10");
  }, [appTheme]);

  // FEATURE 35 & 36: MEDIA SESSION API (Lock Screen Controls!)
  useEffect(() => {
    if ('mediaSession' in navigator && (screen === "rosary" || screen === "chaplet")) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: screen === "rosary" ? `Rosary: ${mysteries[selectedMysterySet]?.name}` : "Divine Mercy Chaplet",
        artist: "Catholic Prayer App",
        artwork: [{ src: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=512&q=80", sizes: "512x512", type: "image/jpeg" }]
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => nextPrayer());
      navigator.mediaSession.setActionHandler('play', () => setIsAutoPlay(true));
      navigator.mediaSession.setActionHandler('pause', () => { setIsAutoPlay(false); window.speechSynthesis.cancel(); });
    }
  }, [screen, selectedMysterySet, currentBead]);

  // FEATURE 92: WAKE LOCK
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => { try { if ('wakeLock' in navigator) wakeLock = await (navigator as any).wakeLock.request('screen'); } catch (err) {} };
    if (screen !== "home" && screen !== "settings") requestWakeLock();
    return () => { if (wakeLock) wakeLock.release(); };
  }, [screen]);

  const saveSettings = (key: string, value: string) => {
    localStorage.setItem(key, value);
    if (key === "appTheme") setAppTheme(value);
    if (key === "displayMode") setDisplayMode(value);
    if (key === "customDecadePrayer") setCustomDecadePrayer(value);
    if (key === "prayerLanguage") setPrayerLanguage(value);
  };

  const finishAndSave = () => {
    const newTotal = totalRosaries + 1; setTotalRosaries(newTotal); localStorage.setItem("totalRosaries", newTotal.toString());
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    const newMins = totalPrayerMinutes + Math.floor(prayerSeconds / 60); setTotalPrayerMinutes(newMins); localStorage.setItem("totalPrayerMinutes", newMins.toString());
    
    // Feature 93: Go to Journal Screen instead of Home!
    setScreen("journal"); 
  };

  const quitToHome = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); 
    setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setCurrentStation(0);
  };

  const nextPrayer = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);

    if (screen === "stations") { if (currentStation < stationsOfCross.length - 1) setCurrentStation(currentStation + 1); else finishAndSave(); return; }
    if (stage === "intro") { setStage("pendant"); setPendantBead(0); } 
    else if (stage === "pendant") { if (pendantBead < 4) setPendantBead(pendantBead + 1); else { setStage("decades"); setCurrentDecade(0); setCurrentBead(0); } } 
    else if (stage === "decades") { if (currentBead < 11) setCurrentBead(currentBead + 1); else { if (currentDecade < 4) { setCurrentDecade(currentDecade + 1); setCurrentBead(0); } else setStage("outro"); } } 
    else if (stage === "outro") finishAndSave();
  };

  // FEATURE 34 & 40: AUDIO RESPECTS LANGUAGE
  const playAudio = (prayerObj: any) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Determine which language string to read
      const textToRead = (typeof prayerObj === "string") ? prayerObj : (prayerLanguage === "latin" ? prayerObj.la : prayerObj.en);
      if (!textToRead) return;

      const formatText = (obj: any) => typeof obj === "string" ? obj : obj.leader + " " + obj.response;
      const finalString = formatText(textToRead);

      const u = new SpeechSynthesisUtterance(finalString);
      u.rate = speechSpeed;
      // Force Italian voice for Latin text for accurate pronunciation
      if (prayerLanguage === "latin") u.lang = 'it-IT'; 

      if (isAutoPlay) u.onend = () => nextPrayer();
      window.speechSynthesis.speak(u);
    }
  };

  const getActivePrayer = () => {
    if (screen === "rosary") {
      if (stage === "intro") return prayers.signOfCross; // Simplified for demo
      if (stage === "pendant") return pendantBead === 0 ? prayers.ourFather : pendantBead === 4 ? prayers.gloryBe : prayers.hailMary;
      if (stage === "decades") return currentBead === 0 ? prayers.ourFather : currentBead === 11 ? prayers.gloryBe : prayers.hailMary;
      if (stage === "outro") return prayers.hailHolyQueen;
    }
    return prayers.signOfCross;
  };

  // Auto-Play Engine
  useEffect(() => {
    if (isAutoPlay && (screen === "rosary" || screen === "chaplet")) playAudio(getActivePrayer());
  }, [currentBead, stage, currentStation, isAutoPlay, screen]); 

  // THE BILINGUAL RENDER ENGINE (Features 37, 38, 39)
  const renderPrayerText = (prayerObj: any) => {
    if (!prayerObj) return null;
    const isString = typeof prayerObj.en === "string" || typeof prayerObj === "string";
    const enText = isString ? (prayerObj.en || prayerObj) : prayerObj.en;
    const laText = isString ? prayerObj.la : prayerObj.la;

    const renderBlock = (data: any, color: string) => {
      if (!data) return null;
      if (typeof data === "string") return <div style={{ color }}>{data}</div>;
      return <><span style={{ color:"#d4af37", fontWeight:"bold" }}>V.</span> <span style={{color}}>{data.leader}</span><br/><br/><span style={{ color:"#d4af37", fontWeight:"bold" }}>R.</span> <span style={{color}}>{data.response}</span></>;
    };

    if (prayerLanguage === "english") return renderBlock(enText, "#e0e0e0");
    if (prayerLanguage === "latin") return renderBlock(laText, "#e0e0e0");
    
    // Bilingual Mode: Side by Side
    return (
      <div style={{ display: "flex", gap: "15px", fontSize: "15px" }}>
        <div style={{ flex: 1, borderRight: "1px solid #444", paddingRight: "10px" }}>
          <p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic" }}>English</p>
          {renderBlock(enText, "#e0e0e0")}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic" }}>Latin</p>
          {renderBlock(laText, "#d4af37")}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", backgroundColor: actualColor, color: "white", minHeight: "100vh", transition: "background-color 1s ease" }}>
      
      {/* 1. HOME */}
      {screen === "home" && (
        <>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}><h1 style={{ fontSize: "28px" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button></header>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Day Streak</p></div>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Total Rosaries</p></div>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalPrayerMinutes}m</p><p style={{ fontSize: "12px", color: "#ccc" }}>Prayed</p></div>
          </div>
          
          {todaysSaint && (
            <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ fontSize: "30px" }}>🕊️</div>
              <div><p style={{ color: "#d4af37", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{todaysSaint.type}</p><h3 style={{ fontSize: "16px", margin: "3px 0" }}>{todaysSaint.name}</h3><p style={{ fontSize: "13px", color: "#ccc", margin:0 }}>{todaysSaint.bio}</p></div>
            </div>
          )}

          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>The Holy Rosary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ccc", marginBottom: "15px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}><span>{getLiturgicalInfo().season}</span><span style={{ color: "#d4af37", fontWeight: "bold", textTransform:"capitalize" }}>{selectedMysterySet} Mysteries</span></div>
            <select value={selectedMysterySet} onChange={(e) => setSelectedMysterySet(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginBottom: "20px" }}><option value="joyful">Joyful Mysteries</option><option value="sorrowful">Sorrowful Mysteries</option><option value="glorious">Glorious Mysteries</option><option value="luminous">Luminous Mysteries</option></select>
            <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}><div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor: "pointer" }}>Divine Mercy</div><div onClick={() => setScreen("stations")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Stations of Cross</div></div>
        </>
      )}

      {/* 2. SETTINGS */}
      {screen === "settings" && (
        <><header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "24px" }}>Settings</h1></header>
          
          {/* FEATURE 37, 38, 39: LANGUAGE TOGGLE */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #d4af37", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Language</h2>
            <select value={prayerLanguage} onChange={(e) => saveSettings("prayerLanguage", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginBottom: "10px" }}>
              <option value="english">English Only</option><option value="latin">Latin Only</option><option value="bilingual">Bilingual (Side-by-Side)</option>
            </select>
            <p style={{fontSize:"12px", color:"#ccc", fontStyle:"italic", margin:0}}>*Audio pronunciation will auto-switch to match the text.</p>
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Voice Settings</h2><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: "#a0a0a0" }}>Alternating Voices</label><button onClick={() => { setAlternatingMode(!alternatingMode); localStorage.setItem("alternatingMode", (!alternatingMode).toString()); }} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? "#d4af37" : "#333", color: alternatingMode ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{alternatingMode ? "ON" : "OFF"}</button></div><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Speech Speed: {speechSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => { setSpeechSpeed(parseFloat(e.target.value)); localStorage.setItem("speechSpeed", e.target.value); }} style={{ width: "100%", accentColor: "#d4af37" }} /></div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Custom Decade Prayer</h2><textarea value={customDecadePrayer} onChange={(e) => saveSettings("customDecadePrayer", e.target.value)} placeholder="e.g. Jesus, Mary, and Joseph..." style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginTop: "10px", fontSize: "16px", fontFamily: "inherit", resize:"none" }} /></div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Appearance</h2><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Color Theme</label><select value={appTheme} onChange={(e) => saveSettings("appTheme", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginBottom: "20px" }}><option value="auto">Auto (Liturgical Calendar)</option><option value="purple">Dark Purple</option><option value="blue">Midnight Blue</option><option value="gold">Light Gold</option></select><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Default Display Mode</label><select value={displayMode} onChange={(e) => saveSettings("displayMode", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444" }}><option value="visual">Visual Beads</option><option value="text">Text Only</option></select></div>
        </>
      )}

      {/* 3. PRAYER JOURNAL POPUP (Feature 93) */}
      {screen === "journal" && (
        <div style={{ paddingBottom: "100px", textAlign: "center", marginTop: "40px" }}>
          <h1 style={{ fontSize: "60px", margin: 0 }}>🕊️</h1>
          <h2 style={{ fontSize: "28px", color: "#d4af37", marginBottom: "10px" }}>Rosary Complete!</h2>
          <p style={{ color: "#ccc", fontSize: "16px", marginBottom: "30px" }}>Your streak is now {streak} days.</p>
          
          <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", border: "1px solid #333", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "10px" }}>Spiritual Journal</h3>
            <p style={{ fontSize: "14px", color: "#a0a0a0", marginBottom: "15px" }}>Write down any graces, thoughts, or intentions from this prayer session.</p>
            <textarea value={journalEntry} onChange={(e) => setJournalEntry(e.target.value)} placeholder="Dear Lord..." style={{ width: "100%", height: "150px", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", fontSize: "16px", fontFamily: "inherit", resize:"none" }} />
          </div>
          <button onClick={() => { setJournalEntry(""); quitToHome(); }} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>Save & Return Home</button>
        </div>
      )}

      {/* 4. THE FULL ROSARY */}
      {screen === "rosary" && (() => { 
        const currentMysteryData = mysteries[selectedMysterySet]?.decades[currentDecade];
        const activePrayer = getActivePrayer();
        return (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button>
            <button onClick={() => setDisplayMode(displayMode === "visual" ? "text" : "visual")} style={{ background: "none", border: "1px solid #d4af37", color: "#d4af37", padding: "5px 10px", borderRadius: "8px", fontSize: "12px" }}>{displayMode === "visual" ? "Text View" : "Visual Beads"}</button>
            <button onClick={() => { setIsAutoPlay(!isAutoPlay); if (!isAutoPlay) playAudio(activePrayer); }} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button>
          </header>
          
          {stage === "intro" && ( 
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#d4af37", marginBottom: "20px" }}>Sign of the Cross</h2>
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>{renderPrayerText(prayers.signOfCross)}</div>
            </div> 
          )}
          
          {stage === "pendant" && ( 
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h2 style={{ fontSize: "20px", color: "#ccc", marginBottom:"20px" }}>Introductory Prayers</h2>
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", position: "relative" }}>
                <button onClick={() => playAudio(activePrayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
                <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{pendantBead === 0 ? "Our Father" : pendantBead === 4 ? "Glory Be" : `Hail Mary (${pendantBead}/3)`}</h3>
                <div style={{ fontSize: "18px", lineHeight: "1.5" }}>{renderPrayerText(activePrayer)}</div>
              </div>
            </div> 
          )}
          
          {stage === "decades" && currentMysteryData && (
            <>
              <div style={{ textAlign: "center", marginTop: "10px", padding:"10px", backgroundColor:"rgba(0,0,0,0.3)", borderRadius:"12px" }}>
                <h2 style={{ fontSize: "20px", margin: "0", color:"#fff", marginBottom: "10px" }}>{currentMysteryData.title}</h2>
                {currentMysteryData.image && <img src={currentMysteryData.image} alt={currentMysteryData.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", border: "1px solid #d4af37", marginBottom: "10px" }} />}
                {currentBead === 0 && ( <div style={{ marginTop: "5px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "14px", color: "#ccc", textAlign: "left" }}><p style={{ marginBottom: "10px", fontStyle:"italic" }}>"{currentMysteryData.verse}"</p></div> )}
              </div>
              
              {displayMode === "visual" && <RosaryBeads currentBead={currentBead} />}
              
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", position: "relative", marginTop: displayMode === "text" ? "20px" : "0" }}>
                <button onClick={() => playAudio(activePrayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button>
                <h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{currentBead === 0 ? "Our Father" : currentBead === 11 ? "Glory Be" : `Hail Mary (${currentBead}/10)`}</h3>
                
                <div style={{ fontSize: "18px", lineHeight: "1.5" }}>
                  {renderPrayerText(activePrayer)}
                  {currentBead === 11 && (
                    <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "5px", textTransform:"uppercase" }}>Fatima Prayer</p>
                      {renderPrayerText(prayers.fatimaPrayer)}
                      {customDecadePrayer && (
                        <div style={{ marginTop: "15px" }}>
                          <p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "5px", textTransform:"uppercase" }}>Personal Intention</p>
                          <p style={{ color: "#d4af37", fontStyle:"italic" }}>{customDecadePrayer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {stage === "outro" && ( 
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#d4af37", marginBottom: "20px" }}>Closing Prayers</h2>
              <div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>{renderPrayerText(prayers.hailHolyQueen)}</div>
            </div> 
          )}
          
          <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div>
        </div>
      );})()}
    </div>
  );
}
