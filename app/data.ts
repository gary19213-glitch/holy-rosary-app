export function getLiturgicalInfo() {
  const today = new Date(); const month = today.getMonth(); const date = today.getDate();
  let season = "Ordinary Time"; let color = "#1a2e1a"; 
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) { season = "Advent"; color = "#2d1b2e"; } 
  else if ((month === 11 && date >= 25) || (month === 0 && date <= 12)) { season = "Christmas Time"; color = "#2e2d1a"; } 
  else if (month === 2 || month === 3) { season = "Lent"; color = "#2d1b2e"; } 
  else if (month === 4) { season = "Easter Season"; color = "#2e2d1a"; } 
  return { season, color };
}

export function getTodaySaint() {
  const today = new Date();
  const dateString = `${today.getMonth() + 1}-${today.getDate()}`;
  const saintsCalendar: any = {
    "1-1": { name: "Mary, Mother of God", type: "Solemnity", bio: "The highest title of the Blessed Virgin Mary." },
    "3-19": { name: "St. Joseph, Husband of Mary", type: "Solemnity", bio: "Foster father of Jesus." },
    "8-15": { name: "The Assumption of Mary", type: "Solemnity", bio: "Mary is taken into heavenly glory." },
    "11-1": { name: "All Saints", type: "Solemnity", bio: "Honoring all the holy men and women." },
    [dateString]: { name: "St. Michael & The Angels", type: "Feast", bio: "Defenders of heaven and protectors of the Church." }
  };
  return saintsCalendar[dateString] || { name: "Daily Devotion", type: "Ferial Day", bio: "Let us offer today's works, joys, and sufferings to the Lord." };
}

export const prayers = {
  signOfCross: { en: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", la: "In nomine Patris, et Filii, et Spiritus Sancti. Amen." },
  creed: { en: "I believe in God, the Father Almighty...", la: "Credo in Deum, Patrem omnipotentem..." },
  ourFather: { en: { leader: "Our Father, Who art in heaven...", response: "Give us this day our daily bread..." }, la: { leader: "Pater noster, qui es in caelis...", response: "Panem nostrum quotidianum da nobis hodie..." } },
  hailMary: { en: { leader: "Hail Mary, full of grace...", response: "Holy Mary, Mother of God..." }, la: { leader: "Ave Maria, gratia plena...", response: "Sancta Maria, Mater Dei..." } },
  gloryBe: { en: { leader: "Glory be to the Father...", response: "As it was in the beginning..." }, la: { leader: "Gloria Patri, et Filio...", response: "Sicut erat in principio..." } },
  fatimaPrayer: { en: "O My Jesus, forgive us our sins...", la: "Domine Iesu, dimitte nobis debita nostra..." },
  hailHolyQueen: { en: "Hail, Holy Queen, Mother of Mercy...", la: "Salve Regina, Mater misericordiae..." }
};

export const chapletPrayers = {
  opening: { en: "You expired, Jesus...", la: "Exspirasti, Iesu..." },
  eternalFather: { en: { leader: "Eternal Father, I offer you...", response: "In atonement for our sins..." }, la: { leader: "Pater aeterne, offero tibi...", response: "In propitiatione pro peccatis nostris..." } },
  sorrowfulPassion: { en: { leader: "For the sake of His sorrowful Passion.", response: "Have mercy on us..." }, la: { leader: "Pro dolorosa Eius passione.", response: "Miserere nobis..." } },
  holyGod: { en: "Holy God, Holy Mighty One...", la: "Sanctus Deus, Sanctus Fortis..." }, closing: { en: "Eternal God, in whom mercy is endless...", la: "Deus aeterne, in quo misericordia est infinita..." }
};

// LOOK HERE: We are pointing to your local files!
export const stationsOfCross = [
  { numeral: "I", title: "Jesus is condemned", image: "/station-1.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider how Jesus Christ was unjustly condemned." },
  { numeral: "II", title: "Jesus carries His cross", image: "/station-2.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider Jesus offering to His Father the death He was about to suffer." }
];

export const mysteries = {
  joyful: { name: "The Joyful Mysteries", decades: [
    // LOOK HERE: Pointing to your local pictures!
    { title: "1st: The Annunciation", image: "/joyful-1.jpg", verse: "Mary said, 'Behold, I am the handmaid...'" },
    { title: "2nd: The Visitation", image: "/joyful-2.jpg", verse: "Elizabeth cried out, 'Most blessed are you.'" },
    { title: "3rd: The Nativity", image: "/joyful-3.jpg", verse: "She gave birth to her firstborn son..." },
    { title: "4th: The Presentation", image: "/joyful-4.jpg", verse: "They took him up to Jerusalem..." },
    { title: "5th: Finding Jesus", image: "/joyful-5.jpg", verse: "They found him in the temple..." }
  ]},
  sorrowful: { name: "The Sorrowful Mysteries", decades: [
    { title: "1st: Agony in the Garden", image: "/sorrowful-1.jpg", verse: "His sweat became like drops of blood." }
  ]},
  glorious: { name: "The Glorious Mysteries", decades: [
    { title: "1st: The Resurrection", image: "/glorious-1.jpg", verse: "He has been raised; he is not here." }
  ]},
  luminous: { name: "The Luminous Mysteries", decades: [
    { title: "1st: Baptism in the Jordan", image: "/luminous-1.jpg", verse: "This is my beloved Son." }
  ]}
};

export function getTodaysMysterySet() { return "joyful"; }

export const prayerLibrary = [
  { title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." }
];
