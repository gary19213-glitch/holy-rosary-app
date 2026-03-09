// --- LITURGICAL CALENDAR ENGINE (Features 67 & 71) ---
export function getLiturgicalInfo() {
  const today = new Date();
  const month = today.getMonth(); // 0 = Jan, 11 = Dec
  const date = today.getDate();

  // A simplified engine to find the season (You can expand this later!)
  let season = "Ordinary Time";
  let color = "#1a2e1a"; // Dark Green for Ordinary Time

  // Advent (Roughly late Nov to Dec 24)
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) {
    season = "Advent"; color = "#2d1b2e"; // Dark Purple
  }
  // Christmas (Dec 25 to mid Jan)
  else if ((month === 11 && date >= 25) || (month === 0 && date <= 12)) {
    season = "Christmas Time"; color = "#2e2d1a"; // Dark Gold/White
  }
  // Lent (Roughly late Feb/March to April) - Simplified for example
  else if (month === 2 || month === 3) {
    season = "Lent"; color = "#2d1b2e"; // Dark Purple
  }
  // Easter (Roughly April to May)
  else if (month === 4) {
    season = "Easter Season"; color = "#2e2d1a"; // Dark Gold/White
  }

  return { season, color };
}

export const prayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  creed: "I believe in God, the Father Almighty...",
  ourFather: { leader: "Our Father, Who art in heaven...", response: "Give us this day our daily bread..." },
  hailMary: { leader: "Hail Mary, full of grace...", response: "Holy Mary, Mother of God..." },
  gloryBe: { leader: "Glory be to the Father...", response: "As it was in the beginning..." },
  fatimaPrayer: "O My Jesus, forgive us our sins...",
  hailHolyQueen: "Hail, Holy Queen, Mother of Mercy..."
};

export const chapletPrayers = {
  opening: "You expired, Jesus...",
  eternalFather: { leader: "Eternal Father, I offer you...", response: "In atonement for our sins..." },
  sorrowfulPassion: { leader: "For the sake of His sorrowful Passion.", response: "Have mercy on us..." },
  holyGod: "Holy God, Holy Mighty One...",
  closing: "Eternal God, in whom mercy is endless..."
};

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    decades: [
      { title: "1st: The Annunciation", fruit: "Humility", verse: "Mary said, 'Behold, I am the handmaid of the Lord.'", reflection: "Imagine the angel Gabriel appearing to Mary." },
      { title: "2nd: The Visitation", fruit: "Love of Neighbor", verse: "Elizabeth cried out, 'Most blessed are you.'", reflection: "Mary hastens to help her cousin." },
      { title: "3rd: The Nativity", fruit: "Poverty in Spirit", verse: "She gave birth to her firstborn son...", reflection: "Jesus is born in a humble stable." },
      { title: "4th: The Presentation", fruit: "Obedience", verse: "They took him up to Jerusalem...", reflection: "Mary and Joseph obey." },
      { title: "5th: Finding Jesus", fruit: "Joy in Finding Jesus", verse: "They found him in the temple...", reflection: "Mary and Joseph find Jesus." }
    ]
  }
};

export function getTodaysMystery() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  if (today === "Monday" || today === "Saturday") return "Joyful";
  if (today === "Tuesday" || today === "Friday") return "Sorrowful";
  if (today === "Wednesday" || today === "Sunday") return "Glorious";
  if (today === "Thursday") return "Luminous";
  return "Joyful";
}

export const prayerLibrary = [
  { title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." }
];
