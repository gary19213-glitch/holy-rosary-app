"use client";
import { useState, useEffect } from "react";
import { prayers, chapletPrayers, mysteries, getTodaysMystery, prayerLibrary, getLiturgicalInfo, stationsOfCross } from "./data";

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
  const [screen, setScreen] = useState("home"); 
  const [stage, setStage] = useState("intro"); 
  const [pendantBead, setPendantBead] = useState(0); 
  const [currentDecade, setCurrentDecade] = useState(0); 
  const [currentBead, setCurrentBead] = useState(0); 
  const [currentStation, setCurrentStation] = useState(0); 

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState<any>(null);

  const [customLists, setCustomLists] = useState<{name: string, prayers: any[]}[]>([]);
  const [activeListIndex, setActiveListIndex] = useState<number | null>(null);
  const [currentListStep, setCurrentListStep] = useState(0);

  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [liturgicalSeason, setLiturgicalSeason] = useState("Ordinary Time");
  
  const [appTheme, setAppTheme] = useState("auto");
  const [actualColor, setActualColor] = useState("#1a1a2e");
  const [displayMode, setDisplayMode] = useState("visual");

  const [totalRosaries, setTotalRosaries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);

  const [customDecadePrayer, setCustomDecadePrayer] = useState("");

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]); setTodaysMystery(getTodaysMystery());
    if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
    if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
    if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
    if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
    if (localStorage.getItem("appTheme")) setAppTheme(localStorage.getItem("appTheme")!);
    if (localStorage.getItem("displayMode")) setDisplayMode(localStorage.getItem("displayMode")!);
    if (localStorage.getItem("customDecadePrayer")) setCustomDecadePrayer(localStorage.getItem("customDecadePrayer")!);
    if (localStorage.getItem("customLists")) setCustomLists(JSON.parse(localStorage.getItem("customLists")!));
    else setCustomLists([{ name: "My Morning Prayers", prayers: [] }]); 
  }, []);

  useEffect(() => {
    if (appTheme === "auto") {
      const liturgy = getLiturgicalInfo();
      setLiturgicalSeason(liturgy.season); setActualColor(liturgy.color);
    } else if (appTheme === "purple") setActualColor("#2d1b2e");
    else if (appTheme === "blue") setActualColor("#0a192f");
    else if (appTheme === "gold") setActualColor("#4a3b10");
  }, [appTheme]);

  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => { try { if ('wakeLock' in navigator) wakeLock = await (navigator as any).wakeLock.request('screen'); } catch (err) {} };
    if (screen !== "home" && screen !== "settings" && screen !== "library") requestWakeLock();
    return () => { if (wakeLock) wakeLock.release(); };
  }, [screen]);
    const addPrayerToList = (prayer: any, listIndex: number) => {
    const newLists = [...customLists]; newLists[listIndex].prayers.push(prayer);
    setCustomLists(newLists); localStorage.setItem("customLists", JSON.stringify(newLists));
    alert("Added to " + newLists[listIndex].name + "!");
  };

  const createNewList = () => {
    const name = prompt("Enter list name:");
    if (name) { const newLists = [...customLists, { name, prayers: [] }]; setCustomLists(newLists); localStorage.setItem("customLists", JSON.stringify(newLists)); }
  };

  const saveSettings = (key: string, value: string) => {
    localStorage.setItem(key, value);
    if (key === "appTheme") setAppTheme(value);
    if (key === "displayMode") setDisplayMode(value);
    if (key === "customDecadePrayer") setCustomDecadePrayer(value);
  };

  const finishAndSave = () => {
    const newTotal = totalRosaries + 1; setTotalRosaries(newTotal); localStorage.setItem("totalRosaries", newTotal.toString());
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    quitToHome();
  };

  const quitToHome = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); 
    setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setCurrentStation(0); 
    setSelectedPrayer(null); setActiveListIndex(null); setCurrentListStep(0);
  };

  const nextPrayer = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);

    if (screen === "customList" && activeListIndex !== null) {
      if (currentListStep < customLists[activeListIndex].prayers.length - 1) setCurrentListStep(currentListStep + 1); else quitToHome(); return;
    }
    if (screen === "stations") {
      if (currentStation < stationsOfCross.length - 1) setCurrentStation(currentStation + 1); else finishAndSave(); return;
    }
    if (stage === "intro") { setStage("pendant"); setPendantBead(0); } 
    else if (stage === "pendant") { if (pendantBead < 4) setPendantBead(pendantBead + 1); else { setStage("decades"); setCurrentDecade(0); setCurrentBead(0); } } 
    else if (stage === "decades") { if (currentBead < 11) setCurrentBead(currentBead + 1); else { if (currentDecade < 4) { setCurrentDecade(currentDecade + 1); setCurrentBead(0); } else setStage("outro"); } } 
    else if (stage === "outro") finishAndSave();
  };

  const playAudio = (prayerObj: any, followupText?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (typeof prayerObj === "string") {
        const u = new SpeechSynthesisUtterance(prayerObj); u.rate = speechSpeed;
        if (followupText) { const u2 = new SpeechSynthesisUtterance(followupText); u2.rate = speechSpeed; u.onend = () => window.speechSynthesis.speak(u2); if (isAutoPlay) u2.onend = () => nextPrayer(); } 
        else { if (isAutoPlay) u.onend = () => nextPrayer(); } window.speechSynthesis.speak(u);
      } else if (alternatingMode && prayerObj.leader && prayerObj.response) {
        const l = new SpeechSynthesisUtterance(prayerObj.leader); l.rate = speechSpeed; l.pitch = 1.2;
        const r = new SpeechSynthesisUtterance(prayerObj.response); r.rate = speechSpeed; r.pitch = 0.7;
        l.onend = () => window.speechSynthesis.speak(r);
        if (followupText) { const f = new SpeechSynthesisUtterance(followupText); f.rate = speechSpeed; r.onend = () => window.speechSynthesis.speak(f); if (isAutoPlay) f.onend = () => nextPrayer(); } 
        else { if (isAutoPlay) r.onend = () => nextPrayer(); } window.speechSynthesis.speak(l);
      }
    }
  };

  const fatimaPlusCustom = customDecadePrayer ? prayers.fatimaPrayer + ". " + customDecadePrayer : prayers.fatimaPrayer;

  useEffect(() => {
    if (isAutoPlay && screen !== "home" && screen !== "settings" && screen !== "library" && screen !== "myLists") {
      let prayerToRead; let followup;
      if (screen === "customList" && activeListIndex !== null) { prayerToRead = customLists[activeListIndex].prayers[currentListStep].text; }
      else if (screen === "stations") { prayerToRead = stationsOfCross[currentStation].adoration; followup = stationsOfCross[currentStation].reflection; }
      else if (screen === "rosary") {
        if (stage === "intro") prayerToRead = prayers.signOfCross + ". " + prayers.creed;
        else if (stage === "pendant") { if (pendantBead === 0) prayerToRead = prayers.ourFather; else if (pendantBead >= 1 && pendantBead <= 3) prayerToRead = prayers.hailMary; else prayerToRead = prayers.gloryBe; }
        else if (stage === "decades") { if (currentBead === 0) prayerToRead = prayers.ourFather; else if (currentBead >= 1 && currentBead <= 10) prayerToRead = prayers.hailMary; else { prayerToRead = prayers.gloryBe; followup = fatimaPlusCustom; } }
        else if (stage === "outro") prayerToRead = prayers.hailHolyQueen;
      }
      else if (screen === "chaplet") {
        if (stage === "intro") prayerToRead = chapletPrayers.opening;
        else if (stage === "decades") prayerToRead = currentBead === 0 || currentBead === 11 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion;
        else if (stage === "outro") prayerToRead = chapletPrayers.closing;
      }
      if (prayerToRead) playAudio(prayerToRead, followup);
    }
  }, [currentBead, stage, currentStation, currentListStep, isAutoPlay, screen, fatimaPlusCustom, activeListIndex, customLists]); 

  const renderPrayerText = (prayer: any, followup?: string) => (
    <>
      {typeof prayer === "string" ? prayer : <><span style={{ color: "#d4af37", fontWeight:"bold" }}>V.</span> {prayer.leader}<br/><br/><span style={{ color: "#d4af37", fontWeight:"bold" }}>R.</span> {prayer.response}</>}
      {followup && <><br/><br/><span style={{ color: "#d4af37", fontStyle: "italic", fontSize:"15px", whiteSpace: "pre-wrap" }}>{followup}</span></>}
    </>
  );

  const filteredPrayers = prayerLibrary.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
    <div style={{ padding: "20px", backgroundColor: screen === "chaplet" ? "#3a0e1b" : actualColor, color: "white", minHeight: "100vh", transition: "background-color 1s ease" }}>
      
      {screen === "home" && (
        <><header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}><h1 style={{ fontSize: "28px" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button></header><div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}><div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Day Streak</p></div><div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Total Prayers</p></div></div><div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}><h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Quick Start Rosary</h2><div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ccc", marginBottom: "15px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}><span>{todayName}</span><span style={{ color: "#d4af37", fontWeight: "bold" }}>{appTheme === "auto" ? liturgicalSeason : "Custom Theme"}</span></div><p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>{todaysMystery} Mysteries</p><button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}><div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor: "pointer" }}>Divine Mercy</div><div onClick={() => setScreen("stations")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Stations of Cross</div><div onClick={() => setScreen("library")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Prayer Library</div><div onClick={() => setScreen("myLists")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>My Custom Lists</div></div></>
      )}

      {screen === "library" && (
        <><header style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}><button onClick={() => { selectedPrayer ? setSelectedPrayer(null) : setScreen("home"); }} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "20px", color: "#d4af37" }}>{selectedPrayer ? selectedPrayer.title : "Prayer Library"}</h1></header>
          {selectedPrayer ? ( <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", border: "1px solid #d4af37", position: "relative", whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "18px" }}><button onClick={() => playAudio(selectedPrayer.text)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><div style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "15px", fontStyle: "italic" }}>Category: {selectedPrayer.category}</div>{selectedPrayer.text}<div style={{ marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}><p style={{ fontSize: "14px", color: "#ccc", marginBottom: "10px" }}>Add to a list:</p>{customLists.map((list, idx) => ( <button key={idx} onClick={() => addPrayerToList(selectedPrayer, idx)} style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px", backgroundColor: "#1a1a2e", border: "1px solid #d4af37", color: "white", borderRadius: "8px" }}>+ {list.name}</button> ))}</div></div>) : ( <><input type="text" placeholder="🔍 Search prayers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "rgba(0,0,0,0.4)", color: "white", border: "1px solid #444", marginBottom: "20px", fontSize: "16px" }} /><div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{filteredPrayers.map((prayer, idx) => (<div key={idx} onClick={() => setSelectedPrayer(prayer)} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h3 style={{ fontSize: "16px", margin: 0 }}>{prayer.title}</h3><p style={{ fontSize: "12px", color: "#a0a0a0", marginTop: "4px", margin: 0 }}>{prayer.category}</p></div><div style={{ color: "#d4af37", fontSize: "18px" }}>➔</div></div>))}</div></>)}</>
      )}

      {screen === "settings" && (
        <><header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "24px" }}>Settings</h1></header>
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Voice Settings</h2><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: "#a0a0a0" }}>Alternating Voices</label><button onClick={() => { setAlternatingMode(!alternatingMode); localStorage.setItem("alternatingMode", (!alternatingMode).toString()); }} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? "#d4af37" : "#333", color: alternatingMode ? "#1a1a2e" : "white", border: "none", fontWeight: "bold" }}>{alternatingMode ? "ON" : "OFF"}</button></div><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Speech Speed: {speechSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => { setSpeechSpeed(parseFloat(e.target.value)); localStorage.setItem("speechSpeed", e.target.value); }} style={{ width: "100%", accentColor: "#d4af37" }} /></div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Custom Prayers</h2><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0", fontSize:"14px" }}>Add a prayer after the Fatima Prayer (O My Jesus):</label><textarea value={customDecadePrayer} onChange={(e) => saveSettings("customDecadePrayer", e.target.value)} placeholder="e.g. Jesus, Mary, and Joseph..." style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginTop: "10px", fontSize: "16px", fontFamily: "inherit", resize:"none" }} /></div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}><h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Appearance</h2><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Color Theme</label><select value={appTheme} onChange={(e) => saveSettings("appTheme", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginBottom: "20px" }}><option value="auto">Auto (Liturgical Calendar)</option><option value="purple">Dark Purple</option><option value="blue">Midnight Blue</option><option value="gold">Light Gold</option></select><label style={{ display: "block", marginBottom: "5px", color: "#a0a0a0" }}>Default Display Mode</label><select value={displayMode} onChange={(e) => saveSettings("displayMode", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444" }}><option value="visual">Visual Beads</option><option value="text">Text Only</option></select></div>
        </>
      )}

      {screen === "myLists" && ( <><header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}><div style={{ display: "flex", alignItems: "center" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "24px", color: "#d4af37" }}>My Lists</h1></div><button onClick={createNewList} style={{ fontSize: "24px", background: "none", border: "none", color: "#d4af37" }}>➕</button></header><div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>{customLists.map((list, idx) => ( <div key={idx} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #d4af37" }}><h3 style={{ fontSize: "20px", marginBottom: "5px" }}>{list.name}</h3><p style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "15px" }}>{list.prayers.length} Prayers</p>{list.prayers.length > 0 ? ( <button onClick={() => { setActiveListIndex(idx); setCurrentListStep(0); setScreen("customList"); }} style={{ width: "100%", padding: "12px", backgroundColor: "#d4af37", color: "#1a1a2e", fontWeight: "bold", border: "none", borderRadius: "30px", fontSize: "16px" }}>▶ Pray</button> ) : ( <button onClick={() => setScreen("library")} style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: "#d4af37", border: "1px solid #d4af37", borderRadius: "30px", fontSize: "14px" }}>+ Add prayers</button> )}</div> ))}</div></> )}
      {screen === "customList" && activeListIndex !== null && (() => { const list = customLists[activeListIndex]; const prayer = list.prayers[currentListStep]; return ( <div style={{ paddingBottom: "100px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button><div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>{list.name}</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header><div style={{ textAlign: "center", marginBottom: "20px" }}><p style={{ color: "#a0a0a0", fontSize: "14px" }}>Prayer {currentListStep + 1} of {list.prayers.length}</p></div><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", border: "1px solid #d4af37", position: "relative", whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "18px" }}><button onClick={() => playAudio(prayer.text)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", fontSize:"22px", textAlign:"center" }}>{prayer.title}</h3>{prayer.text}</div><div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{currentListStep === list.prayers.length - 1 ? "Finish ✓" : "Next ➔"}</button></div></div> ); })()}
      {screen === "chaplet" && ( <div style={{ paddingBottom: "100px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button><div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>Divine Mercy Chaplet</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header>{stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Opening Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{chapletPrayers.opening}</p></div> )}{stage === "decades" && ( <><div style={{ textAlign: "center", marginTop: "10px" }}><h2 style={{ fontSize: "22px", margin: "0" }}>Decade {currentDecade + 1}</h2></div><RosaryBeads currentBead={currentBead} /><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}><button onClick={() => playAudio(currentBead === 0 || currentBead === 11 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{currentBead === 0 || currentBead === 11 ? "Large Bead" : `Small Bead (${currentBead}/10)`}</h3><p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>{renderPrayerText(currentBead === 0 || currentBead === 11 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion)}</p></div></> )}{stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Closing Prayers</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{chapletPrayers.closing}</p></div> )}<div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>{stage === "outro" ? "Finish ✓" : "Next Prayer ➔"}</button></div></div> )}
      {screen === "stations" && (() => { const station = stationsOfCross[currentStation]; return ( <div style={{ paddingBottom: "100px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button><div style={{ fontSize: "14px", color: "#d4af37", fontWeight: "bold" }}>Via Dolorosa</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button></header><div style={{ textAlign: "center", marginBottom: "20px" }}><h1 style={{ fontSize: "50px", color: "#d4af37", margin: "0" }}>{station.numeral}</h1><h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "20px" }}>{station.title}</h2><img src={station.image} alt={station.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px", border: "2px solid #d4af37" }} /></div><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", position: "relative" }}><button onClick={() => playAudio(station.adoration, station.reflection)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px" }}>Adoration</h3><p style={{ fontSize: "16px", lineHeight: "1.5" }}>{renderPrayerText(station.adoration)}</p><h3 style={{ color: "#d4af37", marginBottom: "10px", marginTop:"15px" }}>Reflection</h3><p style={{ fontSize: "16px", fontStyle: "italic" }}>"{station.reflection}"</p></div><div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}><button onClick={nextPrayer} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>Next Station ➔</button></div></div> ); })()}
      
      {screen === "rosary" && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={quitToHome} style={{ background: "none", color: "#ccc", border: "none", fontSize: "16px" }}>← Quit</button>
            <button onClick={() => setDisplayMode(displayMode === "visual" ? "text" : "visual")} style={{ background: "none", border: "1px solid #d4af37", color: "#d4af37", padding: "5px 10px", borderRadius: "8px", fontSize: "12px" }}>{displayMode === "visual" ? "Text View" : "Visual Beads"}</button>
            <button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? "#d4af37" : "#333", color: isAutoPlay ? "#1a1a2e" : "white", border: "none", padding: "5px 10px", borderRadius: "20px" }}>{isAutoPlay ? "Auto ON" : "Auto OFF"}</button>
          </header>
          {stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "24px", color: "#d4af37" }}>Sign of the Cross</h2><p style={{ marginTop: "20px", fontSize: "18px" }}>{prayers.signOfCross}</p><h2 style={{ fontSize: "24px", color: "#d4af37", marginTop:"40px" }}>Apostles Creed</h2><p style={{ marginTop: "20px", fontSize: "18px", color:"#e0e0e0" }}>{prayers.creed}</p></div> )}
          {stage === "pendant" && ( <div style={{ textAlign: "center", marginTop: "40px" }}><h2 style={{ fontSize: "20px", color: "#ccc", marginBottom:"20px" }}>Introductory Prayers</h2><div style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", position: "relative" }}><button onClick={() => playAudio(pendantBead === 0 ? prayers.ourFather : pendantBead === 4 ? prayers.gloryBe : prayers.hailMary)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: "#d4af37", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px" }}>🔊</button><h3 style={{ color: "#d4af37", marginBottom: "15px", textAlign: "center", fontSize:"22px" }}>{pendantBead === 0 ? "Our Father" : pend
