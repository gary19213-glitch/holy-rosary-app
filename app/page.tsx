// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import { Lora } from "next/font/google";
import { 
  prayers, chapletPrayers, mysteries, getTodaysMysterySet, 
  prayerLibrary, getLiturgicalInfo, getTodaySaint, stationsOfCross 
} from "./data";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function RosaryBeads({ currentBead }: { currentBead: number }) {
  const cx = 150; const cy = 160; const r = 105; 
  const circleBeads = Array.from({ length: 55 }).map((_, i) => {
    const angle = (Math.PI / 2) + ((i + 1) / 55) * (2 * Math.PI);
    const isLarge = i % 11 === 10;
    return { id: i, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), isLarge, isActive: currentBead === (i < 11 ? i + 1 : 0) };
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="300" height="420" viewBox="0 0 300 420">
        <circle cx={cx} cy={cy} r={r} stroke="#555" strokeWidth="1.5" fill="none" />
        <line x1="150" y1="265" x2="150" y2="385" stroke="#555" strokeWidth="1.5" />
        {circleBeads.map((b) => ( <circle key={`c_${b.id}`} cx={b.x} cy={b.y} r={b.isLarge ? 7 : 4} fill={b.isLarge ? "#888" : "#444"} stroke="none" strokeWidth="1.5" /> ))}
        <circle cx="150" cy="280" r={7} fill="#888" /><circle cx="150" cy="300" r={4} fill="#444" /><circle cx="150" cy="315" r={4} fill="#444" /><circle cx="150" cy="330" r={4} fill="#444" /><circle cx="150" cy="350" r={7} fill="#888" />
        <text x="150" y="405" fontSize="40" textAnchor="middle" fill="#d4af37">✝</text>
        <circle cx={150} cy={160} r={10} fill="#d4af37" style={{ filter: "drop-shadow(0px 0px 10px #d4af37)" }} />
        <text x="150" y="195" fontSize="12" textAnchor="middle" fill="#d4af37">Active</text>
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
  const [customLists, setCustomLists] = useState<any[]>([]);
  const [activeListIndex, setActiveListIndex] = useState<number | null>(null);
  const [currentListStep, setCurrentListStep] = useState(0);

  const [todayName, setTodayName] = useState("");
  const [todaysMystery, setTodaysMystery] = useState("");
  const [liturgicalSeason, setLiturgicalSeason] = useState("Ordinary Time");
  
  const [appTheme, setAppTheme] = useState("auto");
  const [actualColor, setActualColor] = useState("#121212"); 
  const [displayMode, setDisplayMode] = useState("visual");

  const [totalRosaries, setTotalRosaries] = useState(0);
  const [totalChaplets, setTotalChaplets] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [totalPrayerSeconds, setTotalPrayerSeconds] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0,0,0,0,0,0,0]); 
  const [monthlyDays, setMonthlyDays] = useState<string[]>([]); 
  
  const [isChantOn, setIsChantOn] = useState(false);
  const [chantVolume, setChantVolume] = useState(0.3);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [alternatingMode, setAlternatingMode] = useState(true);
  const [prayerLanguage, setPrayerLanguage] = useState("english"); 
  const [customDecadePrayer, setCustomDecadePrayer] = useState("");
  const [customClosingPrayer, setCustomClosingPrayer] = useState(""); 
  const [selectedMysterySet, setSelectedMysterySet] = useState("");

  const [reminders, setReminders] = useState({ dailyTime: "", angelus: false, bellSound: true, customMessage: "Time to pray." });
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
      if (localStorage.getItem("isChantOn")) setIsChantOn(localStorage.getItem("isChantOn") === "true");
      if (localStorage.getItem("chantVolume")) setChantVolume(parseFloat(localStorage.getItem("chantVolume")!));
      if (localStorage.getItem("reminders")) setReminders(JSON.parse(localStorage.getItem("reminders")!));
      if (localStorage.getItem("customLists")) setCustomLists(JSON.parse(localStorage.getItem("customLists")!));
      else setCustomLists([{ name: "My Morning Prayers", prayers: [prayerLibrary[0]] }]); 
    }
  }, []);

  useEffect(() => {
    if (appTheme === "auto") setActualColor(getLiturgicalInfo().color); 
    else if (appTheme === "purple") setActualColor("#231524"); 
    else if (appTheme === "blue") setActualColor("#0e1526"); 
    else if (appTheme === "missal") setActualColor("#f4f1ea"); 
  }, [appTheme]);

  useEffect(() => {
    let interval: any;
    if (screen === "rosary" || screen === "chaplet" || screen === "stations" || screen === "customList") {
      interval = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    } else { setSessionSeconds(0); }
    return () => { if (interval) clearInterval(interval); };
  }, [screen]);

  useEffect(() => { if (bgAudioRef.current) bgAudioRef.current.volume = chantVolume; }, [chantVolume]);
    // ==========================================
  // NEW: NOTIFICATIONS & ALARM ENGINE
  // ==========================================
  useEffect(() => {
    // 1. Ask Android for permission to send notifications
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkAlarms = () => {
      const now = new Date();
      const h = now.getHours(); const m = now.getMinutes(); const s = now.getSeconds();

      // Only check exactly at the 00 second mark so we don't spam!
      if (s !== 0) return;

      const firePush = (title: string, body: string) => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, { body, icon: '/joyful-1.jpg' }); // Uses your local image!
          if (reminders.bellSound) {
            const bell = new Audio('/bell.mp3');
            bell.play().catch(e=>console.log(e));
          }
        }
      };

      // Angelus Check (6 AM, 12 PM, 6 PM)
      if (reminders.angelus && m === 0 && (h === 6 || h === 12 || h === 18)) {
         firePush("The Angelus", "The Angel of the Lord declared unto Mary...");
      }

      // Custom Daily Time Check
      if (reminders.dailyTime) {
         const [remH, remM] = reminders.dailyTime.split(':').map(Number);
         if (h === remH && m === remM) {
           firePush("Prayer Reminder", reminders.customMessage || "It is time to pray.");
         }
      }
    };

    const timer = setInterval(checkAlarms, 1000);
    return () => clearInterval(timer);
  }, [reminders]);
  // ==========================================

  const saveSettings = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    if (key === "appTheme") setAppTheme(value);
    if (key === "displayMode") setDisplayMode(value);
    if (key === "customDecadePrayer") setCustomDecadePrayer(value);
    if (key === "customClosingPrayer") setCustomClosingPrayer(value);
    if (key === "prayerLanguage") setPrayerLanguage(value);
    if (key === "isChantOn") setIsChantOn(value);
    if (key === "chantVolume") setChantVolume(value);
    if (key === "reminders") setReminders(value);
  };

  const finishAndSave = () => {
    if (screen === "rosary") { const n = totalRosaries + 1; setTotalRosaries(n); localStorage.setItem("totalRosaries", n.toString()); }
    if (screen === "chaplet") { const n = totalChaplets + 1; setTotalChaplets(n); localStorage.setItem("totalChaplets", n.toString()); }
    const newStreak = streak + 1; setStreak(newStreak); localStorage.setItem("streak", newStreak.toString());
    const newSecs = totalPrayerSeconds + sessionSeconds; setTotalPrayerSeconds(newSecs); localStorage.setItem("totalPrayerSeconds", newSecs.toString());
    const today = new Date(); const dayOfWeek = today.getDay(); const todayStr = today.toISOString().split('T')[0]; 
    const newWeekly = [...weeklyData]; newWeekly[dayOfWeek] += 1; setWeeklyData(newWeekly); localStorage.setItem("weeklyData", JSON.stringify(newWeekly));
    if (!monthlyDays.includes(todayStr)) { const newMonthly = [...monthlyDays, todayStr]; setMonthlyDays(newMonthly); localStorage.setItem("monthlyDays", JSON.stringify(newMonthly)); }
    if (bgAudioRef.current) bgAudioRef.current.pause();
    setScreen("journal"); 
  };

  const quitToHome = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (bgAudioRef.current) bgAudioRef.current.pause();
    setIsAutoPlay(false); setScreen("home"); setStage("intro"); 
    setCurrentDecade(0); setCurrentBead(0); setPendantBead(0); setCurrentStation(0); 
    setSelectedPrayer(null); setActiveListIndex(null); setCurrentListStep(0);
  };

  const startPrayerSession = (newScreen: string) => {
    if (isChantOn && bgAudioRef.current) bgAudioRef.current.play().catch(e => console.log("Audio blocked", e));
    setScreen(newScreen);
  };

  const prevPrayer = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    if (screen === "customList" && activeListIndex !== null) { if (currentListStep > 0) setCurrentListStep(currentListStep - 1); return; }
    if (screen === "stations") { if (currentStation > 0) setCurrentStation(currentStation - 1); return; }
    if (stage === "outro") { setStage("decades"); setCurrentDecade(4); setCurrentBead(11); }
    else if (stage === "decades") { 
      if (currentBead > 0) setCurrentBead(currentBead - 1); 
      else { if (currentDecade > 0) { setCurrentDecade(currentDecade - 1); setCurrentBead(11); } else { setStage("pendant"); setPendantBead(4); } } 
    }
    else if (stage === "pendant") { if (pendantBead > 0) setPendantBead(pendantBead - 1); else setStage("intro"); }
  };

  const nextPrayer = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    if (isChantOn && bgAudioRef.current && bgAudioRef.current.paused) bgAudioRef.current.play().catch(e=>{});

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
    if (screen === "chaplet") {
      if (stage === "intro") return chapletPrayers.opening;
      if (stage === "decades") return currentBead === 0 || currentBead === 11 ? chapletPrayers.eternalFather : chapletPrayers.sorrowfulPassion;
      if (stage === "outro") return chapletPrayers.closing;
    }
    return prayers.signOfCross;
  };

  useEffect(() => { if (isAutoPlay && (screen === "rosary" || screen === "chaplet")) playAudio(getActivePrayer()); }, [currentBead, stage, currentStation, isAutoPlay, screen]); 

  let currentBackgroundImage = null;
  if (screen === "rosary" && stage === "decades") currentBackgroundImage = mysteries[selectedMysterySet]?.decades[currentDecade]?.image;
  else if (screen === "stations") currentBackgroundImage = stationsOfCross[currentStation]?.image;

  const isLight = appTheme === "missal" && !currentBackgroundImage; 
  const textColor = isLight ? "#111" : "#fff";
  const subTextColor = isLight ? "#555" : "#ccc";
  const cardBg = currentBackgroundImage ? "rgba(0,0,0,0.6)" : (isLight ? "#fff" : "rgba(255,255,255,0.05)");
  const cardFilter = currentBackgroundImage ? "blur(12px)" : "none";
  const borderColor = currentBackgroundImage ? "rgba(212,175,55,0.3)" : (isLight ? "#e5e5e5" : "rgba(255,255,255,0.1)");
  const goldColor = isLight ? "#b31b1b" : "#d4af37"; 
  const renderPrayerText = (prayerObj: any) => {
    if (!prayerObj) return null;
    const isString = typeof prayerObj.en === "string" || typeof prayerObj === "string";
    const enText = isString ? (prayerObj.en || prayerObj) : prayerObj.en;
    const laText = isString ? prayerObj.la : prayerObj.la;
    const renderBlock = (data: any, color: string) => {
      if (!data) return null; 
      if (typeof data === "string") return <div style={{ color, lineHeight: "1.7" }}>{data}</div>;
      return ( <div style={{ lineHeight: "1.7" }}><span style={{ color: goldColor, fontWeight:"bold" }}>V.</span> <span style={{color}}>{data.leader}</span><br/><br/><span style={{ color: goldColor, fontWeight:"bold" }}>R.</span> <span style={{color}}>{data.response}</span></div> );
    };
    if (prayerLanguage === "english") return renderBlock(enText, textColor);
    if (prayerLanguage === "latin") return renderBlock(laText, textColor);
    return ( <div style={{ display: "flex", gap: "15px", fontSize: "15px" }}><div style={{ flex: 1, borderRight: `1px solid ${goldColor}`, paddingRight: "10px" }}><p style={{ color: goldColor, fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic", textTransform:"uppercase" }}>English</p>{renderBlock(enText, textColor)}</div><div style={{ flex: 1 }}><p style={{ color: goldColor, fontSize: "12px", marginBottom: "10px", textAlign:"center", fontStyle:"italic", textTransform:"uppercase" }}>Latin</p>{renderBlock(laText, textColor)}</div></div> );
  };

  const formatTime = (secs: number) => { if (secs < 60) return `${secs}s`; const m = Math.floor(secs / 60); const s = secs % 60; return `${m}m ${s}s`; };
  const maxWeekly = Math.max(...weeklyData, 1);

  return (
    <div className={lora.className} style={{ padding: "20px", backgroundColor: currentBackgroundImage ? "#000" : actualColor, backgroundImage: currentBackgroundImage ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${currentBackgroundImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', color: textColor, minHeight: "100vh", transition: "all 1s ease" }}>
      
      <audio ref={bgAudioRef} src="/chant.mp3" loop />

      {screen === "home" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "50px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}><h1 style={{ fontSize: "28px", margin: 0, fontWeight: "600", letterSpacing: "1px" }}>Holy Rosary</h1><button onClick={() => setScreen("settings")} style={{ fontSize: "24px", background: "none", border: "none", color: textColor, cursor: "pointer" }}>⚙️</button></header>
          <div onClick={() => setScreen("stats")} style={{ display: "flex", gap: "10px", marginBottom: "20px", cursor:"pointer" }}><div style={{ flex: 1, backgroundColor: cardBg, padding: "15px", borderRadius: "12px", textAlign: "center", border: `1px solid ${borderColor}`, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}><p style={{ fontSize: "24px", margin: "0" }}>🔥 {streak}</p><p style={{ fontSize: "12px", color: subTextColor, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Streak</p></div><div style={{ flex: 1, backgroundColor: cardBg, padding: "15px", borderRadius: "12px", textAlign: "center", border: `1px solid ${borderColor}`, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}><p style={{ fontSize: "24px", margin: "0", color: goldColor }}>{totalRosaries}</p><p style={{ fontSize: "12px", color: subTextColor, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Rosaries</p></div></div>
          {todaysSaint && ( <div style={{ backgroundColor: cardBg, padding: "15px 20px", borderRadius: "12px", border: `1px solid ${goldColor}`, marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px", borderLeft: `5px solid ${goldColor}` }}><div style={{ fontSize: "30px" }}>🕊️</div><div><p style={{ color: goldColor, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", margin:0, letterSpacing: "1px" }}>{todaysSaint.type}</p><h3 style={{ fontSize: "16px", margin: "3px 0", fontWeight: "600" }}>{todaysSaint.name}</h3><p style={{ fontSize: "13px", color: subTextColor, margin:0, fontStyle: "italic" }}>{todaysSaint.bio}</p></div></div> )}
          <div style={{ backgroundColor: cardBg, padding: "30px 20px", borderRadius: "16px", textAlign: "center", border: `1px solid ${borderColor}`, marginBottom: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: subTextColor, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: `1px solid ${borderColor}`, paddingBottom: "10px" }}><span>{todayName}</span><span style={{ color: goldColor, fontWeight: "bold" }}>{appTheme === "auto" ? liturgicalSeason : "Devotion"}</span></div><h2 style={{ fontSize: "26px", margin: "0 0 10px 0", fontWeight: "normal" }}>The Holy Rosary</h2><p style={{ color: goldColor, fontWeight: "600", fontSize: "16px", margin: "0 0 25px 0", textTransform:"capitalize", letterSpacing: "1px" }}>{selectedMysterySet} Mysteries</p><select value={selectedMysterySet} onChange={(e) => setSelectedMysterySet(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#f9f9f9" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontFamily: "inherit", fontSize: "14px" }}><option value="joyful">Joyful Mysteries</option><option value="sorrowful">Sorrowful Mysteries</option><option value="glorious">Glorious Mysteries</option><option value="luminous">Luminous Mysteries</option></select><button onClick={() => startPrayerSession("rosary")} style={{ backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>Begin Prayer</button></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>{[ { label: "Divine Mercy", act: () => startPrayerSession("chaplet") }, { label: "Via Dolorosa", act: () => startPrayerSession("stations") }, { label: "Prayer Library", act: () => setScreen("library") }, { label: "My Devotions", act: () => setScreen("myLists") } ].map(btn => ( <div key={btn.label} onClick={btn.act} style={{ backgroundColor: cardBg, padding: "20px 10px", borderRadius: "12px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", border: `1px solid ${borderColor}`, cursor: "pointer", color: textColor }}>{btn.label}</div> ))}</div>
        </div>
      )}

      {/* SETTINGS WITH NOTIFICATIONS ALARMS ADDED! */}
      {screen === "settings" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "100px" }}>
          <header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: subTextColor, border: "none", marginRight: "20px", cursor: "pointer" }}>← Back</button><h1 style={{ fontSize: "24px", fontWeight: "normal" }}>Settings</h1></header>
          
          <div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Reminders & Alarms</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: `1px solid ${borderColor}`, paddingBottom: "15px" }}>
              <label style={{ color: subTextColor, fontSize: "14px" }}>Angelus (6am, 12pm, 6pm)</label>
              <button onClick={() => { 
                const newVal = !reminders.angelus;
                if(newVal && typeof window!=="undefined" && "Notification" in window) Notification.requestPermission();
                saveSettings("reminders", { ...reminders, angelus: newVal }); 
              }} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: reminders.angelus ? goldColor : (isLight ? "#eee" : "#333"), color: reminders.angelus ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: "none", fontWeight: "bold" }}>{reminders.angelus ? "ON" : "OFF"}</button>
            </div>
            <label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize: "14px" }}>Daily Custom Reminder</label>
            <input type="time" value={reminders.dailyTime} onChange={(e) => saveSettings("reminders", { ...reminders, dailyTime: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "10px", fontFamily: "inherit" }} />
            <input type="text" placeholder="Message to show..." value={reminders.customMessage} onChange={(e) => saveSettings("reminders", { ...reminders, customMessage: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontFamily: "inherit", boxSizing:"border-box" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ color: subTextColor, fontSize: "14px" }}>Play Bell Sound on Push</label>
              <button onClick={() => saveSettings("reminders", { ...reminders, bellSound: !reminders.bellSound })} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: reminders.bellSound ? goldColor : (isLight ? "#eee" : "#333"), color: reminders.bellSound ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: "none", fontWeight: "bold" }}>{reminders.bellSound ? "ON" : "OFF"}</button>
            </div>
          </div>

          <div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Background Audio</h2><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: subTextColor, fontSize: "14px" }}>Monastery Choir</label><button onClick={() => saveSettings("isChantOn", (!isChantOn).toString())} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: isChantOn ? goldColor : (isLight ? "#eee" : "#333"), color: isChantOn ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: "none", fontWeight: "bold" }}>{isChantOn ? "ON" : "OFF"}</button></div><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize: "14px" }}>Choir Volume</label><input type="range" min="0.0" max="1.0" step="0.05" value={chantVolume} onChange={(e) => saveSettings("chantVolume", e.target.value)} style={{ width: "100%", accentColor: goldColor }} /></div>
          <div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Language & Audio</h2><select value={prayerLanguage} onChange={(e) => saveSettings("prayerLanguage", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontFamily: "inherit" }}><option value="english">English Only</option><option value="latin">Latin Only</option><option value="bilingual">Bilingual (Side-by-Side)</option></select><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><label style={{ color: subTextColor, fontSize: "14px" }}>Alternating Voices</label><button onClick={() => { setAlternatingMode(!alternatingMode); localStorage.setItem("alternatingMode", (!alternatingMode).toString()); }} style={{ padding: "8px 15px", borderRadius: "20px", backgroundColor: alternatingMode ? goldColor : (isLight ? "#eee" : "#333"), color: alternatingMode ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: "none", fontWeight: "bold" }}>{alternatingMode ? "ON" : "OFF"}</button></div><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize: "14px" }}>Audio Speed: {speechSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.25" value={speechSpeed} onChange={(e) => { setSpeechSpeed(parseFloat(e.target.value)); localStorage.setItem("speechSpeed", e.target.value); }} style={{ width: "100%", accentColor: goldColor }} /></div>
          <div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Custom Intentions</h2><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize:"14px" }}>Add to every decade (After Fatima):</label><textarea value={customDecadePrayer} onChange={(e) => saveSettings("customDecadePrayer", e.target.value)} placeholder="e.g. Jesus, Mary, and Joseph..." style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontSize: "14px", fontFamily: "inherit", resize:"none", boxSizing:"border-box" }} /><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize:"14px" }}>Add to end of Rosary (After Salve Regina):</label><textarea value={customClosingPrayer} onChange={(e) => saveSettings("customClosingPrayer", e.target.value)} placeholder="e.g. St. Michael the Archangel..." style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, fontSize: "14px", fontFamily: "inherit", resize:"none", boxSizing:"border-box" }} /></div>
          <div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Appearance</h2><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize: "14px" }}>Color Theme</label><select value={appTheme} onChange={(e) => saveSettings("appTheme", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontFamily: "inherit" }}><option value="auto">Auto (Liturgical Calendar)</option><option value="missal">Roman Missal (Light Theme)</option><option value="purple">Lenten Purple</option><option value="blue">Marian Blue</option></select><label style={{ display: "block", marginBottom: "8px", color: subTextColor, fontSize: "14px" }}>Default Display Mode</label><select value={displayMode} onChange={(e) => saveSettings("displayMode", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#fff" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, fontFamily: "inherit" }}><option value="visual">Visual Beads & Art</option><option value="text">Text & Art Only</option></select></div>
          <button onClick={() => setScreen("home")} style={{ backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>Save Settings</button>
        </div>
      )}

      {/* MINIFIED ROSARY PLAYER (With the Glassmorphism!) */}
      {(screen === "rosary" || screen === "chaplet") && (() => { 
        const currentMysteryData = screen === "rosary" ? mysteries[selectedMysterySet]?.decades[currentDecade] : null; const activePrayer = getActivePrayer();
        return (
        <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "120px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><button onClick={quitToHome} style={{ background: "none", color: subTextColor, border: "none", fontSize: "24px", cursor: "pointer" }}>✕</button><div style={{ fontSize: "12px", color: goldColor, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>{screen === "rosary" ? mysteries[selectedMysterySet]?.name : "Divine Mercy Chaplet"}</div><button onClick={() => { setIsAutoPlay(!isAutoPlay); if (!isAutoPlay) playAudio(activePrayer); }} style={{ background: isAutoPlay ? goldColor : "transparent", color: isAutoPlay ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: `1px solid ${goldColor}`, padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>{isAutoPlay ? "AUTO ON" : "AUTO OFF"}</button></header>
          {displayMode === "visual" && <RosaryBeads stage={stage} pendantBead={pendantBead} currentDecade={currentDecade} currentBead={currentBead} setTargetBead={setTargetBead} />}
          {stage === "intro" && ( <div style={{ textAlign: "center", marginTop: "40px", animation: "fadeIn 1s ease" }}><h2 style={{ fontSize: "24px", color: goldColor, marginBottom: "20px", fontWeight: "normal" }}>Opening Prayers</h2><div style={{ textAlign: "left", backgroundColor: cardBg, backdropFilter: cardFilter, padding: "30px", borderRadius: "16px", border: `1px solid ${borderColor}` }}>{renderPrayerText(screen === "rosary" ? prayers.signOfCross : chapletPrayers.opening)}</div></div> )}
          {stage === "pendant" && ( <div style={{ textAlign: "center", marginTop: "40px", animation: "fadeIn 1s ease" }}><h2 style={{ fontSize: "14px", color: subTextColor, marginBottom:"20px", textTransform: "uppercase", letterSpacing: "2px" }}>Introductory Prayers</h2><div style={{ textAlign: "left", backgroundColor: cardBg, backdropFilter: cardFilter, padding: "30px", borderRadius: "16px", border: `1px solid ${goldColor}`, position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}><button onClick={() => playAudio(activePrayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: goldColor, border: "none", borderRadius: "50%", width: "45px", height: "45px", fontSize: "20px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>🔊</button><h3 style={{ color: goldColor, marginBottom: "25px", textAlign: "center", fontSize:"24px", fontWeight: "normal" }}>{pendantBead === 0 ? "The Our Father" : pendantBead === 4 ? "The Glory Be" : `Hail Mary (${pendantBead}/3)`}</h3><div style={{ fontSize: "18px" }}>{renderPrayerText(activePrayer)}</div>{pendantBead >= 1 && pendantBead <= 3 && ( <div style={{ marginTop: "20px", textAlign: "center", color: subTextColor, fontStyle: "italic", fontSize: "14px" }}>For an increase in {pendantBead === 1 ? "Faith" : pendantBead === 2 ? "Hope" : "Charity"}.</div> )}</div></div> )}
          {stage === "decades" && ( <div style={{ animation: "fadeIn 1s ease", marginTop: "30px" }}>{currentMysteryData && ( <div style={{ textAlign: "center", marginBottom: "20px" }}><p style={{ color: goldColor, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 10px 0" }}>Decade {currentDecade + 1}</p><h2 style={{ fontSize: "26px", margin: "0 0 20px 0", fontWeight: "normal" }}>{currentMysteryData.title}</h2>{currentBead === 0 && ( <div style={{ padding: "25px", backgroundColor: cardBg, backdropFilter: cardFilter, borderRadius: "16px", border: `1px solid ${borderColor}`, fontSize: "15px", color: textColor, textAlign: "left", lineHeight: "1.6", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}><p style={{ margin: "0 0 15px 0", fontStyle:"italic" }}>"{currentMysteryData.verse}"</p><p style={{ margin: 0, color: subTextColor }}>{currentMysteryData.reflection}</p></div> )}</div> )}<div style={{ textAlign: "left", backgroundColor: cardBg, backdropFilter: cardFilter, padding: "30px", borderRadius: "16px", border: `1px solid ${borderColor}`, position: "relative", marginTop: displayMode === "text" ? "20px" : "0", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}><button onClick={() => playAudio(activePrayer)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: goldColor, border: "none", borderRadius: "50%", width: "45px", height: "45px", fontSize: "20px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>🔊</button><h3 style={{ color: goldColor, marginBottom: "25px", textAlign: "center", fontSize:"24px", fontWeight: "normal" }}>{screen === "rosary" ? (currentBead === 0 ? "The Our Father" : currentBead === 11 ? "The Glory Be" : `Hail Mary (${currentBead}/10)`) : (currentBead === 0 || currentBead === 11 ? "Large Bead" : `Small Bead (${currentBead}/10)`)}</h3><div style={{ fontSize: "18px" }}>{renderPrayerText(activePrayer)}{screen === "rosary" && currentBead === 11 && ( <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: `1px solid ${borderColor}` }}><p style={{ color: subTextColor, fontSize: "12px", marginBottom: "10px", textTransform:"uppercase", letterSpacing: "1px", textAlign: "center" }}>The Fatima Prayer</p>{renderPrayerText(prayers.fatimaPrayer)}</div> )}{screen === "rosary" && currentBead === 11 && customDecadePrayer && ( <div style={{ marginTop: "30px", padding: "20px", backgroundColor: isLight ? "#f9f9f9" : "rgba(0,0,0,0.2)", borderRadius: "8px", borderLeft: `3px solid ${goldColor}` }}><p style={{ color: subTextColor, fontSize: "12px", marginBottom: "10px", textTransform:"uppercase", letterSpacing: "1px" }}>Personal Intention</p><p style={{ color: textColor, fontStyle:"italic", whiteSpace:"pre-wrap", margin:0, fontSize: "16px", lineHeight: "1.6" }}>{customDecadePrayer}</p></div> )}</div></div></div> )}
          {stage === "outro" && ( <div style={{ textAlign: "center", marginTop: "40px", animation: "fadeIn 1s ease" }}><h2 style={{ fontSize: "28px", color: goldColor, marginBottom: "30px", fontWeight: "normal" }}>Concluding Prayers</h2><div style={{ textAlign: "left", backgroundColor: cardBg, backdropFilter: cardFilter, padding: "30px", borderRadius: "16px", border: `1px solid ${borderColor}`, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>{renderPrayerText(screen === "rosary" ? prayers.hailHolyQueen : chapletPrayers.closing)}{screen === "rosary" && customClosingPrayer && ( <div style={{ marginTop: "30px", padding: "20px", backgroundColor: isLight ? "#f9f9f9" : "rgba(0,0,0,0.2)", borderRadius: "8px", borderLeft: `3px solid ${goldColor}` }}><p style={{ color: subTextColor, fontSize: "12px", marginBottom: "10px", textTransform:"uppercase", letterSpacing: "1px" }}>Additional Prayer</p><p style={{ color: textColor, fontStyle:"italic", whiteSpace:"pre-wrap", margin:0, fontSize: "16px", lineHeight: "1.6" }}>{customClosingPrayer}</p></div> )}</div></div> )}
          <div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: "560px", zIndex: 50, display: "flex", gap: "10px" }}><button onClick={prevPrayer} style={{ backgroundColor: cardBg, backdropFilter: cardFilter, color: textColor, padding: "18px", width: "30%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: `1px solid ${borderColor}`, cursor: "pointer", textTransform: "uppercase" }}>← Back</button><button onClick={nextPrayer} style={{ backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", padding: "18px", width: "70%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>{stage === "outro" ? "Finish ✓" : "Next ➔"}</button></div>
        </div>
      );})()}
      
      {/* REMAINDER COMPRESSED SCREENS: Library, Stats, Journal, My Lists, Stations */}
      {screen === "library" && ( <div style={{ maxWidth: "500px", margin: "0 auto" }}><header style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}><button onClick={() => { selectedPrayer ? setSelectedPrayer(null) : setScreen("home"); }} style={{ fontSize: "16px", background: "none", color: subTextColor, border: "none", marginRight: "20px", cursor:"pointer" }}>← Back</button><h1 style={{ fontSize: "20px", color: goldColor, fontWeight:"normal" }}>{selectedPrayer ? selectedPrayer.title : "Library"}</h1></header>{selectedPrayer ? ( <div style={{ backgroundColor: cardBg, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}`, position: "relative", whiteSpace: "pre-wrap", lineHeight: "1.7", fontSize: "18px" }}> <button onClick={() => playAudio(selectedPrayer.text)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: goldColor, border: "none", borderRadius: "50%", width: "45px", height: "45px", fontSize: "20px", cursor:"pointer", boxShadow:"0 4px 10px rgba(0,0,0,0.2)" }}>🔊</button> <div style={{ color: subTextColor, fontSize: "14px", marginBottom: "15px", fontStyle: "italic", textTransform:"uppercase" }}>Category: {selectedPrayer.category}</div> {selectedPrayer.text} <div style={{ marginTop: "30px", borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}> <p style={{ fontSize: "14px", color: subTextColor, marginBottom: "10px" }}>Add to a list:</p> {customLists.map((list, idx) => ( <button key={idx} onClick={() => addPrayerToList(selectedPrayer, idx)} style={{ display: "block", width: "100%", padding: "12px", marginBottom: "10px", backgroundColor: isLight ? "#f9f9f9" : "#1a1a2e", border: `1px solid ${borderColor}`, color: textColor, borderRadius: "8px", cursor:"pointer" }}>+ Add to {list.name}</button> ))} </div></div>) : ( <><input type="text" placeholder="Search prayers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: cardBg, color: textColor, border: `1px solid ${borderColor}`, marginBottom: "20px", fontSize: "16px", boxSizing:"border-box" }} /><div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{filteredPrayers.map((prayer, idx) => (<div key={idx} onClick={() => setSelectedPrayer(prayer)} style={{ backgroundColor: cardBg, padding: "16px", borderRadius: "12px", border: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor:"pointer" }}><div><h3 style={{ fontSize: "16px", margin: 0, fontWeight:"normal" }}>{prayer.title}</h3></div><div style={{ color: goldColor, fontSize: "18px" }}>➔</div></div>))}</div></>)}</div> )}
      {screen === "myLists" && ( <div style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "100px" }}><header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}><div style={{ display: "flex", alignItems: "center" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: subTextColor, border: "none", marginRight: "20px", cursor:"pointer" }}>← Back</button><h1 style={{ fontSize: "24px", color: goldColor, fontWeight:"normal" }}>My Devotions</h1></div><button onClick={createNewList} style={{ fontSize: "24px", background: "none", border: "none", color: goldColor, cursor:"pointer" }}>➕</button></header><div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>{customLists.map((list, listIdx) => ( <div key={listIdx} style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "16px", border: `1px solid ${borderColor}` }}><h3 style={{ fontSize: "20px", marginBottom: "5px" }}>{list.name}</h3><p style={{ color: subTextColor, fontSize: "14px", marginBottom: "15px" }}>{list.prayers.length} Prayers</p>{list.prayers.length > 0 && (<div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{list.prayers.map((p: any, pIdx: number) => (<div key={pIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isLight ? "#f9f9f9" : "#1a1a2e", padding: "10px", borderRadius: "8px", border: `1px solid ${borderColor}` }}><span style={{ fontSize: "14px", color: textColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{p.title}</span><div style={{ display: "flex", gap: "10px" }}><button onClick={() => movePrayer(listIdx, pIdx, -1)} style={{ background: "none", border: "none", color: pIdx === 0 ? "#444" : goldColor, fontSize: "16px", cursor:"pointer" }}>↑</button><button onClick={() => movePrayer(listIdx, pIdx, 1)} style={{ background: "none", border: "none", color: pIdx === list.prayers.length - 1 ? "#444" : goldColor, fontSize: "16px", cursor:"pointer" }}>↓</button><button onClick={() => removePrayer(listIdx, pIdx)} style={{ background: "none", border: "none", color: "#ff4444", fontSize: "16px", marginLeft: "5px", cursor:"pointer" }}>✕</button></div></div>))}</div>)}{list.prayers.length > 0 ? ( <button onClick={() => { setActiveListIndex(listIdx); setCurrentListStep(0); setScreen("customList"); }} style={{ width: "100%", padding: "12px", backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", fontWeight: "bold", border: "none", borderRadius: "30px", fontSize: "16px", cursor:"pointer", textTransform:"uppercase" }}>▶ Pray List</button> ) : ( <button onClick={() => setScreen("library")} style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: goldColor, border: `1px solid ${goldColor}`, borderRadius: "30px", fontSize: "14px", cursor:"pointer", textTransform:"uppercase" }}>+ Add prayers</button> )}</div> ))}</div></div> )}
      {screen === "customList" && activeListIndex !== null && (() => { const list = customLists[activeListIndex]; const prayer = list.prayers[currentListStep]; return ( <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><button onClick={quitToHome} style={{ background: "none", color: subTextColor, border: "none", fontSize: "24px", cursor:"pointer" }}>✕</button><div style={{ fontSize: "12px", color: goldColor, fontWeight: "bold", textTransform:"uppercase", letterSpacing:"2px" }}>{list.name}</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? goldColor : "transparent", color: isAutoPlay ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: `1px solid ${goldColor}`, padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight:"bold" }}>{isAutoPlay ? "AUTO ON" : "AUTO OFF"}</button></header><div style={{ textAlign: "center", marginBottom: "20px" }}><p style={{ color: subTextColor, fontSize: "14px", textTransform:"uppercase", letterSpacing:"1px" }}>Prayer {currentListStep + 1} of {list.prayers.length}</p></div><div style={{ textAlign: "left", backgroundColor: cardBg, padding: "30px", borderRadius: "16px", border: `1px solid ${borderColor}`, position: "relative", whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "18px", boxShadow:"0 10px 30px rgba(0,0,0,0.05)" }}><button onClick={() => playAudio(prayer.text)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: goldColor, border: "none", borderRadius: "50%", width: "45px", height: "45px", fontSize: "20px", cursor:"pointer", boxShadow:"0 4px 10px rgba(0,0,0,0.2)" }}>🔊</button><h3 style={{ color: goldColor, marginBottom: "20px", fontSize:"24px", textAlign:"center", fontWeight:"normal" }}>{prayer.title}</h3>{prayer.text}</div><div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: "560px", display: "flex", gap: "10px" }}><button onClick={prevPrayer} style={{ backgroundColor: cardBg, color: textColor, padding: "18px", width: "30%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: `1px solid ${borderColor}`, cursor: "pointer", textTransform: "uppercase" }}>← Back</button><button onClick={nextPrayer} style={{ backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", padding: "18px", width: "70%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none", cursor:"pointer", textTransform:"uppercase", letterSpacing:"1px", boxShadow:"0 10px 20px rgba(0,0,0,0.3)" }}>{currentListStep === list.prayers.length - 1 ? "Finish ✓" : "Next ➔"}</button></div></div> ); })()}
      {screen === "stations" && (() => { const station = stationsOfCross[currentStation]; return ( <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><button onClick={quitToHome} style={{ background: "none", color: subTextColor, border: "none", fontSize: "24px", cursor: "pointer" }}>✕</button><div style={{ fontSize: "12px", color: goldColor, fontWeight: "bold", textTransform:"uppercase", letterSpacing:"2px" }}>Via Dolorosa</div><button onClick={() => setIsAutoPlay(!isAutoPlay)} style={{ background: isAutoPlay ? goldColor : "transparent", color: isAutoPlay ? (isLight ? "#fff" : "#1a1a2e") : textColor, border: `1px solid ${goldColor}`, padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight:"bold" }}>{isAutoPlay ? "AUTO ON" : "AUTO OFF"}</button></header><div style={{ textAlign: "center", marginBottom: "30px" }}><h1 style={{ fontSize: "60px", color: goldColor, margin: "0", fontWeight:"normal" }}>{station.numeral}</h1><h2 style={{ fontSize: "24px", color: textColor, margin: "10px 0 20px 0", fontWeight:"normal" }}>{station.title}</h2></div><div style={{ textAlign: "left", backgroundColor: cardBg, backdropFilter: cardFilter, padding: "30px", borderRadius: "16px", border: `1px solid ${borderColor}`, position: "relative", boxShadow:"0 10px 30px rgba(0,0,0,0.05)", animation: "fadeIn 1s ease" }}><button onClick={() => playAudio(station.adoration, station.reflection)} style={{ position: "absolute", top: "-20px", right: "20px", backgroundColor: goldColor, border: "none", borderRadius: "50%", width: "45px", height: "45px", fontSize: "20px", cursor:"pointer", boxShadow:"0 4px 10px rgba(0,0,0,0.2)" }}>🔊</button><h3 style={{ color: goldColor, marginBottom: "15px", fontSize:"18px", textTransform:"uppercase" }}>Adoration</h3><div style={{ fontSize: "18px", lineHeight: "1.6" }}>{renderPrayerText(station.adoration)}</div><div style={{ borderTop: `1px solid ${borderColor}`, margin: "20px 0" }}></div><h3 style={{ color: goldColor, marginBottom: "10px", fontSize:"18px", textTransform:"uppercase" }}>Reflection</h3><p style={{ fontSize: "16px", fontStyle: "italic", lineHeight:"1.6", margin:0, color:subTextColor }}>"{station.reflection}"</p></div><div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: "560px", display: "flex", gap: "10px" }}><button onClick={prevPrayer} style={{ backgroundColor: cardBg, backdropFilter: cardFilter, color: textColor, padding: "18px", width: "30%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: `1px solid ${borderColor}`, cursor: "pointer", textTransform: "uppercase" }}>← Back</button><button onClick={nextPrayer} style={{ backgroundColor: goldColor, color: isLight && !currentBackgroundImage ? "#fff" : "#1a1a2e", padding: "18px", width: "70%", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", border: "none", cursor:"pointer", textTransform:"uppercase", letterSpacing:"1px", boxShadow:"0 10px 20px rgba(0,0,0,0.3)" }}>Next Station ➔</button></div></div> ); })()}
      {screen === "stats" && ( <div style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "100px" }}><header style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}><button onClick={() => setScreen("home")} style={{ fontSize: "16px", background: "none", color: subTextColor, border: "none", marginRight: "20px", cursor: "pointer" }}>← Back</button><h1 style={{ fontSize: "24px", color: goldColor, fontWeight:"normal" }}>My Progress</h1></header><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}><div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", textAlign: "center", border: `1px solid ${borderColor}` }}><h3 style={{ fontSize: "30px", color: goldColor, margin:0 }}>{totalRosaries}</h3><p style={{ color: subTextColor, margin:0, fontSize:"12px", textTransform:"uppercase", marginTop:"5px" }}>Rosaries</p></div><div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", textAlign: "center", border: `1px solid ${borderColor}` }}><h3 style={{ fontSize: "30px", color: goldColor, margin:0 }}>{totalChaplets}</h3><p style={{ color: subTextColor, margin:0, fontSize:"12px", textTransform:"uppercase", marginTop:"5px" }}>Chaplets</p></div></div><div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform:"uppercase" }}>Weekly Activity</h2><div style={{ display: "flex", justifyContent: "space-between", height: "100px", alignItems: "flex-end", gap: "8px", paddingBottom: "10px", borderBottom: `1px solid ${borderColor}` }}>{weeklyData.map((val, i) => ( <div key={i} style={{ flex: 1, backgroundColor: val > 0 ? goldColor : (isLight ? "#eee" : "#333"), height: `${(val / maxWeekly) * 100}%`, minHeight: "5px", borderRadius: "4px 4px 0 0", transition: "height 0.5s ease" }}></div> ))}</div><div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: subTextColor, fontSize: "12px", fontWeight: "bold" }}><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div></div><div style={{ backgroundColor: cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "20px" }}><h2 style={{ fontSize: "16px", color: goldColor, margin: "0 0 15px 0", textTransform:"uppercase" }}>Milestone Badges</h2><div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}><div style={{ opacity: totalRosaries >= 1 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>🥉</div><p style={{ fontSize: "12px", color: subTextColor, marginTop:"5px" }}>1st Rosary</p></div><div style={{ opacity: streak >= 7 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>🔥</div><p style={{ fontSize: "12px", color: subTextColor, marginTop:"5px" }}>7-Day Streak</p></div><div style={{ opacity: totalRosaries >= 50 ? 1 : 0.3, textAlign: "center" }}><div style={{ fontSize: "40px" }}>👑</div><p style={{ fontSize: "12px", color: subTextColor, marginTop:"5px" }}>50 Rosaries</p></div></div></div></div> )}
      {screen === "journal" && ( <div style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "100px", textAlign: "center", marginTop: "40px" }}><h1 style={{ fontSize: "60px", margin: 0 }}>🕊️</h1><h2 style={{ fontSize: "28px", color: goldColor, marginBottom: "10px", fontWeight:"normal" }}>Prayer Complete!</h2><p style={{ color: subTextColor, fontSize: "16px", marginBottom: "30px" }}>Time prayed: {formatTime(sessionSeconds)}</p><div style={{ textAlign: "left", backgroundColor: cardBg, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}`, marginBottom: "30px" }}><h3 style={{ fontSize: "18px", color: goldColor, margin: "0 0 10px 0", textTransform:"uppercase" }}>Spiritual Journal</h3><textarea value={journalEntry} onChange={(e) => setJournalEntry(e.target.value)} placeholder="Dear Lord..." style={{ width: "100%", height: "150px", padding: "12px", borderRadius: "8px", backgroundColor: isLight ? "#f9f9f9" : "#1a1a2e", color: textColor, border: `1px solid ${borderColor}`, fontSize: "16px", fontFamily: "inherit", resize:"none", boxSizing:"border-box" }} /></div><button onClick={() => { setJournalEntry(""); quitToHome(); }} style={{ backgroundColor: goldColor, color: isLight ? "#fff" : "#1a1a2e", padding: "16px", width: "100%", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", border: "none", cursor:"pointer", textTransform:"uppercase" }}>Save & Return Home</button></div> )}

    </div>
  );
}
