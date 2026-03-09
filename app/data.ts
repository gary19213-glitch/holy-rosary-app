// --- LITURGICAL CALENDAR ---
export function getLiturgicalInfo() {
  const today = new Date(); const month = today.getMonth(); const date = today.getDate();
  let season = "Ordinary Time"; let color = "#1a2e1a"; // Green
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) { season = "Advent"; color = "#2d1b2e"; } // Purple
  else if ((month === 11 && date >= 25) || (month === 0 && date <= 12)) { season = "Christmas Time"; color = "#2e2d1a"; } // Gold
  else if (month === 2 || month === 3) { season = "Lent"; color = "#2d1b2e"; } // Purple
  else if (month === 4) { season = "Easter Season"; color = "#2e2d1a"; } // Gold
  return { season, color };
}

// --- BASIC PRAYERS ---
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

// FEATURE #46 & #48: STATIONS OF THE CROSS DATA
export const stationsOfCross = [
  { numeral: "I", title: "Jesus is condemned to death", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider how Jesus Christ, after being scourged and crowned with thorns, was unjustly condemned by Pilate to die on the cross." },
  { numeral: "II", title: "Jesus carries His cross", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider Jesus as He walked this road with the cross on His shoulders, thinking of us, and offering to His Father the death He was about to suffer." },
  { numeral: "III", title: "Jesus falls the first time", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider the first fall of Jesus. Loss of blood from the scourging and crowning with thorns had so weakened Him that He could hardly walk." },
  { numeral: "IV", title: "Jesus meets His Mother", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider how the Son met His Mother on His way to Calvary. Jesus and Mary gazed at each other and their looks became as so many arrows to wound those hearts which loved each other so tenderly." }
  // (We will add Stations V through XIV later, just using 4 to test the engine!)
];

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
  return (days[new Date().getDay()] === "Tuesday" || days[new Date().getDay()] === "Friday") ? "Sorrowful" : "Joyful";
}

export const prayerLibrary = [
  { title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." }
];
