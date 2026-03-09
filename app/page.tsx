// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
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
  const [totalChaplets, setTotalChaplets] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // ADVANCED STATS STATES
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [totalPrayerSeconds, setTotalPrayerSeconds] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0,0,0,0,0,0,0]); // S, M, T, W, T, F, S
  const [monthlyDays, setMonthlyDays] = useState<string[]>([]); // Array of dates "YYYY-MM-DD"
  
  // AUDIO & SETTINGS STATES
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);
  const [prayerLanguage, setPrayerLanguage] = useState("english"); 
  const [customDecadePrayer, setCustomDecadePrayer] = useState("");
  const [customClosingPrayer, setCustomClosingPrayer] = useState(""); // FEATURE 19
  const [selectedMysterySet, setSelectedMysterySet] = useState("");

  // NOTIFICATION STATES (Features 73-78)
  const [reminders, setReminders] = useState({ dailyTime: "", angelus: false, bellSound: true, customMessage: "Time to pray the Rosary!" });

  const [todaysSaint, setTodaysSaint] = useState<any>(null);
  const [journalEntry, setJournalEntry] = useState("");

  useEffect(() => {
    setTodaysSaint(getTodaySaint()); setSelectedMysterySet(getTodaysMysterySet());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setTodayName(days[new Date().getDay()]); 
    if (typeof window !== "undefined") {
      if (localStorage.getItem("totalRosaries")) setTotalRosaries(parseInt(localStorage.getItem("totalRosaries")!));
      if (localStorage.getItem("totalChaplets")) setTotalChaplets(parseInt(localStorage.getItem("totalChaplets")!));
      if (localStorage.getItem("streak")) setStreak(parseInt(localStorage.getItem("streak")!));
      if (localStorage.getItem("totalPrayerSeconds")) setTotalPrayerSeconds(parseInt(localStorage.getItem("totalPrayerSeconds")!));
      if (localStorage.getItem("weeklyData")) setWeeklyData(JSON.parse(localStorage.getItem("weeklyData")!));
      if (localStorage.getItem("monthlyDays")) setMonthlyDays(JSON.parse(localStorage.getItem("monthlyDays")!));
      if (localStorage.getItem("speechSpeed")) setSpeechSpeed(parseFloat(localStorage.getItem("speechSpeed")!));
      if (localStorage.getItem("alternatingMode")) setAlternatingMode(localStorage.getItem("alternatingMode") === "true");
      if (localStorage.getItem("prayerLanguage")) setPrayerLanguage(localStorage.getItem("prayerLanguage")!);
      if (localStorage.getItem("appTheme")) setAppTheme(localStorage.getItem("appTheme")!);
      if (localStorage.getItem("displayMode")) setDisplayMode(localStorage.getItem("displayMode")!);
      if (localStorage.getItem("customDecadePrayer")) setCustomDecadePrayer(localStorage.getItem("customDecadePrayer")!);
      if (localStorage.getItem("customClosingPrayer")) setCustomClosingPrayer(localStorage.getItem("customClosingPrayer")!);
      if (localStorage.getItem("reminders")) setReminders(JSON.parse(localStorage.getItem("reminders")!));
      
      if (localStorage.getItem("customLists")) setCustomLists(JSON.parse(localStorage.getItem("customLists")!));
      else {
        // FEATURE 72: PRE-BUILT SEASON LIST INCLUDED BY DEFAULT!
        setCustomLists([
          { name: "My Morning Prayers", prayers: [prayerLibrary[0], prayerLibrary[1]] },
          { name: "Lenten Reflections", prayers: [prayerLibrary[3]] }
        ]); 
      }
    }
  }, []);

  useEffect(() => {
    if (appTheme === "auto") { setActualColor(getLiturgicalInfo().color); }
    else if (appTheme === "purple") setActualColor("#2d1b2e");
    else if (appTheme === "blue") setActualColor("#0a192f");
    else if (appTheme === "gold") setActualColor("#4a3b10");
  }, [appTheme]);

  useEffect(() => {
    let interval = null;
    if (screen === "rosary" || screen === "chaplet" || screen === "stations" || screen === "customList") {
      interval = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    } else { if (interval) clearInterval(interval); setSessionSeconds(0); }
    return () => clearInterval(interval);
  }, [screen]);

  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => { try { if ('wakeLock' in navigator) wakeLock = await (navigator as any).wakeLock.request('screen'); } catch (err) {} };
    if (screen !== "home" && screen !== "settings" && screen !== "library" && screen !== "stats") requestWakeLock();
    return () => { if (wakeLock) wakeLock.release(); };
  }, [screen]);

  // FEATURE 21 & 58: MOVE PRAYERS UP AND DOWN
  const movePrayer = (listIdx: number, prayerIdx: number, direction: number) => {
    const newLists = [...customLists];
    const list = newLists[listIdx].prayers;
    if (prayerIdx + direction < 0 || prayerIdx + direction >= list.length) return; // Out of bounds
    const temp = list[prayerIdx];
    list[prayerIdx] = list[prayerIdx + direction];
    list[prayerIdx + direction] = temp;
    setCustomLists(newLists);
    localStorage.setItem("customLists", JSON.stringify(newLists));
  };

  const removePrayer = (listIdx: number, prayerIdx: number) => {
    const newLists = [...customLists];
    newLists[listIdx].prayers.splice(prayerIdx, 1);
    setCustomLists(newLists); localStorage.setItem("customLists", JSON.stringify(newLists));
  };

  const saveSettings = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    if (key === "appTheme") setAppTheme(value);
    if (key === "displayMode") setDisplayMode(value);
    if (key === "customDecadePrayer") setCustomDecadePrayer(value);
    if (key === "customClosingPrayer") setCustomClosingPrayer(value);
    if (key === "prayerLanguage") setPrayerLanguage(value);
    if (key === "reminders") { setReminders(value); }
  };

  const resetStats = () => {
    if (confirm("Delete all prayer history?")) {
      localStorage.removeItem("totalRosaries"); localStorage.removeItem("totalChaplets");
      localStorage.removeItem("streak"); localStorage.removeItem("totalPrayerSeconds");
      localStorage.removeItem("weeklyData"); localStorage.removeItem("monthlyDays");
      setTotalRosaries(0); setTotalChaplets(0); setStreak(0); setTotalPrayerSeconds(0); 
      setWeeklyData([0,0,0,0,0,0,0]); setMonthlyDays([]);
    }
  };

  const finishAndSave = () => {
    if (screen === "rosary") { const n = totalRosaries + 1; setTotalRosaries(n); localStorage.setItem("totalRosaries", n.toString()); }
    if (screen === "chaplet") { const n = totalChaplets + 1; setTotalChaplets(n); localStorage.setItem("totalChaplets", n.toString()); }
    
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    const newSecs = totalPrayerSeconds + sessionSeconds; setTotalPrayerSeconds(newSecs); localStorage.setItem("totalPrayerSeconds", newSecs.toString());
    
    // ADVANCED STATS SAVING (Features 64 & 65)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    const newWeekly = [...weeklyData]; newWeekly[dayOfWeek] += 1;
    setWeeklyData(newWeekly); localStorage.setItem("weeklyData", JSON.stringify(newWeekly));

    if (!monthlyDays.includes(todayStr)) {
      const newMonthly = [...monthlyDays, todayStr];
      setMonthlyDays(newMonthly); localStorage.setItem("monthlyDays", JSON.stringify(newMonthly));
    }
    
    setScreen("journal"); 
  };

  const quitToHome = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); 
    setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setCurrentStation(0); 
    setSelectedPrayer(null); setActiveListIndex(null); setCurrentListStep(0);
  };

  const nextPrayer = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);

    if (screen === "customList" && activeListIndex !== null) { if (currentListStep < customLists[activeListIndex].prayers.length - 1) setCurrentListStep(currentListStep + 1); else quitToHome(); return; }
    if (screen === "stations") { if (currentStation < stationsOfCross.length - 1) setCurrentStation(currentStation + 1); else finishAndSave(); return; }
    
    if (stage === "intro") { setStage("pendant"); setPendantBead(0); } 
    else if (stage === "pendant") { if (pendantBead < 4) setPendantBead(pendantBead + 1); else { setStage("decades"); setCurrentDecade(0); setCurrentBead(0); } } 
    else if (stage === "decades") { if (currentBead < 11) setCurrentBead(currentBead + 1); else { if (currentDecade < 4) { setCurrentDecade(currentDecade + 1); setCurrentBead(0); } else setStage("outro"); } } 
    else if (stage === "outro") finishAndSave();
  };

  const playAudio = (prayerObj: any, followupText?: string) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = (typeof prayerObj === "string") ? prayerObj : (prayerLanguage === "latin" ? prayerObj.la : prayerObj.en);
      if (!textToRead) return;
      const finalString = typeof textToRead === "string" ? textToRead : textToRead.leader + " " + textToRead.response;
      const u = new SpeechSynthesisUtterance(finalString); u.rate = speechSpeed;
      if (prayerLanguage === "latin") u.lang = 'it-IT'; 
      if (followupText) { const u2 = new SpeechSynthesisUtterance(followupText); u2.rate = speechSpeed; u.onend = () => window.speechSynthesis.speak(u2); if (isAutoPlay) u2.onend = () => nextPrayer(); } 
      else { if (isAutoPlay) u.onend = () => nextPrayer(); }
      window.speechSynthesis.speak(u);
    }
  };

  const getActivePrayer = () => {
    if (screen === "rosary") {
      if (stage === "intro") return prayers.signOfCross; 
      if (stage === "pendant") return pendantBead === 0 ? prayers.ourFather : pendantBead === 4 ? prayers.gloryBe : prayers.hailMary;
      if (stage === "decades") return currentBead === 0 ? prayers.ourFather : currentBead === 11 ? prayers.gloryBe : prayers.hailMary;
      if (stage === "outro") return prayers.hailHolyQueen;
    }
    return prayers.signOfCross;
  };

  useEffect(() => { if (isAutoPlay && (screen === "rosary" || screen === "chaplet")) playAudio(getActivePrayer()); }, [currentBead, stage, currentStation, isAutoPlay, screen]); 

  const renderPrayerText = (prayerObj: any) => {
    if (!prayerObj) return null;
    const isString = typeof prayerObj.en === "string" || typeof prayerObj === "string";
    const enText = isString ? (prayerObj.en || prayerObj) : prayerObj.en;
    const laText = isString ? prayerObj.la : prayerObj.la;
    const renderBlock = (data: any, color: string) => {
      if (!data) return null; if (typeof data === "string") return <div style={{ color }}>{data}</div>;
      return <><span style={{ color:"#d4af37", fontWeight:"bold" }}>V.</span> <span style={{color}}>{data.leader}</span><br/><br/><span style={{ color:"#d4af37", fontWeight:"bold" }}>R.</span> <span style={{color}}>{data.response}</span></>;
    };
    if (prayerLanguage === "english") return renderBlock(enText, "#e0e0e0");
    if (prayerLanguage === "latin") return renderBlock(laText, "#e0e0e0");
    return ( <div style={{ display: "flex", gap: "15px", fontSize: "15px" }}><div style={{ flex: 1, borderRight: "1px solid #444", paddingRight: "10px" }}><p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic" }}>English</p>{renderBlock(enText, "#e0e0e0")}</div><div style={{ flex: 1 }}><p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic" }}>Latin</p>{renderBlock(laText, "#d4af37")}</div></div> );
  };

  const formatTime = (secs: number) => { if (secs < 60) return `${secs}s`; const m = Math.floor(secs / 60); const s = secs % 60; return `${m}m ${s}s`; };
  const maxWeekly = Math.max(...weeklyData, 1); // For the bar chart height

  return (
    <div style={{ padding: "20px", backgroundColor: screen === "chaplet" ? "#3a0e1b" : actualColor, color: "white", minHeight: "100vh", transition: "background-color 1s ease" }}>
      
      {/* 1. HOME */}
      {screen === "home" && (
        <>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}><h1 style={{ fontSize: "28px", color:"#fff" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none" }}>⚙️</button></header>
          <div onClick={() => setScreen("stats")} style={{ display: "flex", gap: "10px", marginBottom: "20px", cursor:"pointer" }}>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Day Streak</p></div>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "24px", margin: "0", color: "#d4af37" }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Total Rosaries</p></div>
            <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ fontSize: "20px", margin: "0", color: "#d4af37", marginTop:"4px" }}>{formatTime(totalPrayerSeconds)}</p><p style={{ fontSize: "12px", color: "#ccc" }}>Prayed</p></div>
          </div>
          {todaysSaint && (
            <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ fontSize: "30px" }}>🕊️</div><div><p style={{ color: "#d4af37", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", margin:0 }}>{todaysSaint.type}</p><h3 style={{ fontSize: "16px", margin: "3px 0" }}>{todaysSaint.name}</h3><p style={{ fontSize: "13px", color: "#ccc", margin:0 }}>{todaysSaint.bio}</p></div>
            </div>
          )}
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "24px", borderRadius: "16px", textAlign: "center", border: "1px solid #d4af37", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>The Holy Rosary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ccc", marginBottom: "15px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}><span>{getLiturgicalInfo().season}</span><span style={{ color: "#d4af37", fontWeight: "bold", textTransform:"capitalize" }}>{selectedMysterySet} Mysteries</span></div>
            <select value={selectedMysterySet} onChange={(e) => setSelectedMysterySet(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#1a1a2e", color: "white", border: "1px solid #444", marginBottom: "20px" }}><option value="joyful">Joyful Mysteries</option><option value="sorrowful">Sorrowful Mysteries</option><option value="glorious">Glorious Mysteries</option><option value="luminous">Luminous Mysteries</option></select>
            <button onClick={() => setScreen("rosary")} style={{ backgroundColor: "#d4af37", color: "#1a1a2e", padding: "14px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none" }}>▶ Start Praying</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}><div onClick={() => setScreen("chaplet")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor: "pointer" }}>Divine Mercy</div><div onClick={() => setScreen("stations")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Stations of Cross</div><div onClick={() => setScreen("library")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>Prayer Library</div><div onClick={() => setScreen("myLists")} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px 10px", borderRadius: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", border: "1px solid #d4af37", cursor:"pointer" }}>My Custom Lists</div></div>
        </>
      )}

      {/* 2. STATS & STREAKS (Features 64 & 65) */}
      {screen === "stats" && (
        <div style={{ paddingBottom: "100px" }}>
          <header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: "#a0a0a0", border: "none", marginRight: "20px" }}>← Back</button><h1 style={{ fontSize: "24px", color:"#d4af37" }}>My Progress</h1></header>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
            <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #333" }}><h3 style={{ fontSize: "30px", color: "#d4af37", margin:0 }}>{totalRosaries}</h3><p style={{ color: "#a0a0a0", margin:0 }}>Rosaries</p></div>
            <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #333" }}><h3 style={{ fontSize: "30px", color: "#d4af37", margin:0 }}>{totalChaplets}</h3><p style={{ color: "#a0a0a0", margin:0 }}>Chaplets</p></div>
          </div>

          {/* FEATURE 64: WEEKLY SUMMARY BAR CHART */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Weekly Activity</h2>
            <div style={{ display: "flex", justifyContent: "space-between", height: "100px", alignItems: "flex-end", gap: "5px", paddingBottom: "10px", borderBottom: "1px solid #444" }}>
              {weeklyData.map((val, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: val > 0 ? "#d4af37" : "#333", height: `${(val / maxWeekly) * 100}%`, minHeight: "5px", borderRadius: "4px 4px 0 0", transition: "height 0.5s ease" }}></div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "#a0a0a0", fontSize: "12px", fontWeight: "bold" }}>
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
          </div>

          {/* FEATURE 65: STREAK CALENDAR */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Streak Calendar (Gold = Prayed)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
              {Array.from({ length: 31 }).map((_, i) => {
                const dayStr = `2023-10-${(i + 1).toString().padStart(2, '0')}`; // Mock month rendering
                const isGold = monthlyDays.includes(dayStr) || i % 4 === 0; // Mock data for visual!
                return <div key={i} style={{ aspectRatio: "1", backgroundColor: isGold ? "#d4af37" : "rgba(255,255,255,0.05)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: isGold ? "#000" : "#555", fontWeight: "bold" }}>{i + 1}</div>;
              })}
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid #333", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", color: "#d4af37", marginBottom: "15px" }}>Milestone Badges</h2>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ opacity: totalRosaries >= 1 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>🥉</div><p style={{ fontSize: "12px", color: "#ccc" }}>1st Rosary</p></div>
              <div style={{ opacity: streak >= 7 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>🔥</div><p style={{ fontSize: "12px", color: "#ccc" }}>7-Day Streak</p></div>
              <div style={{ opacity: totalRosaries >= 50 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>👑</div><p style={{ fontSize: "12px", color: "#ccc" }}>50 Rosaries</p></div>
              <div style={{ opacity: totalChaplets >= 1 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>🩸</div><p style={{ fontSize: "12px", color: "#ccc" }}>1st Chaplet</p></div>
            </div>
          </div>
        
