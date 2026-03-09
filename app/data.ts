export function getLiturgicalInfo() {
  const today = new Date(); const month = today.getMonth(); const date = today.getDate();
  let season = "Ordinary Time"; let color = "#1a2e1a"; 
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) { season = "Advent"; color = "#2d1b2e"; } 
  else if ((month === 11 && date >= 25) || (month === 0 && date <= 12)) { season = "Christmas Time"; color = "#2e2d1a"; } 
  else if (month === 2 || month === 3) { season = "Lent"; color = "#2d1b2e"; } 
  else if (month === 4) { season = "Easter Season"; color = "#2e2d1a"; } 
  return { season, color };
}

// FEATURE 69 & 70: SAINT OF THE DAY ENGINE
export function getTodaySaint() {
  const today = new Date();
  const dateString = `${today.getMonth() + 1}-${today.getDate()}`; // Formats like "3-19" for March 19

  const saintsCalendar: any = {
    "1-1": { name: "Mary, Mother of God", feastType: "Solemnity", bio: "The highest title of the Blessed Virgin Mary." },
    "1-28": { name: "St. Thomas Aquinas", feastType: "Memorial", bio: "Dominican friar, philosopher, and Doctor of the Church." },
    "2-14": { name: "St. Valentine", feastType: "Memorial", bio: "A 3rd-century Roman saint and martyr." },
    "3-17": { name: "St. Patrick", feastType: "Feast", bio: "The Apostle of Ireland who used the shamrock to teach the Trinity." },
    "3-19": { name: "St. Joseph, Husband of Mary", feastType: "Solemnity", bio: "Foster father of Jesus and patron of the Universal Church." },
    "4-29": { name: "St. Catherine of Siena", feastType: "Memorial", bio: "Dominican tertiary, mystic, and Doctor of the Church." },
    "5-1": { name: "St. Joseph the Worker", feastType: "Memorial", bio: "Honoring the dignity of human labor." },
    "6-13": { name: "St. Anthony of Padua", feastType: "Memorial", bio: "Franciscan friar known for his powerful preaching and lost items." },
    "8-15": { name: "The Assumption of Mary", feastType: "Solemnity", bio: "Mary is taken body and soul into heavenly glory." },
    "10-4": { name: "St. Francis of Assisi", feastType: "Memorial", bio: "Founder of the Franciscans, lover of poverty and creation." },
    "11-1": { name: "All Saints", feastType: "Solemnity", bio: "Honoring all the holy men and women in heaven." },
    "12-8": { name: "The Immaculate Conception", feastType: "Solemnity", bio: "Mary conceived without original sin." },
    "12-12": { name: "Our Lady of Guadalupe", feastType: "Feast", bio: "Patroness of the Americas." }
  };

  // If today isn't in our hardcoded list, return a generic daily message
  return saintsCalendar[dateString] || { name: "No Major Feast Today", feastType: "Ferial Day", bio: "A day of ordinary liturgical observance." };
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
  holyGod: "Holy God, Holy Mighty One...", closing: "Eternal God, in whom mercy is endless..."
};

export const stationsOfCross = [
  { numeral: "I", title: "Jesus is condemned to death", image: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=800&q=80", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider how Jesus Christ, after being scourged and crowned with thorns, was unjustly condemned by Pilate to die on the cross." },
  { numeral: "II", title: "Jesus carries His cross", image: "https://images.unsplash.com/photo-1544158498-5c4d347dcbc3?w=800&q=80", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider Jesus as He walked this road with the cross on His shoulders, thinking of us, and offering to His Father the death He was about to suffer." },
  { numeral: "III", title: "Jesus falls the first time", image: "https://images.unsplash.com/photo-1598421889819-216e9112de90?w=800&q=80", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider the first fall of Jesus." },
  { numeral: "IV", title: "Jesus meets His Mother", image: "https://images.unsplash.com/photo-1574341258673-455bfa052ee6?w=800&q=80", adoration: { leader: "We adore You, O Christ, and we praise You.", response: "Because, by Your holy cross, You have redeemed the world." }, reflection: "Consider how the Son met His Mother on His way to Calvary." }
];

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    decades: [
      { title: "1st: The Annunciation", image: "https://images.unsplash.com/photo-1599933391942-d17a7eec6bf1?w=800&q=80", fruit: "Humility", verse: "Mary said, 'Behold, I am the handmaid of the Lord.'", reflection: "Imagine the angel Gabriel appearing to Mary." },
      { title: "2nd: The Visitation", image: "https://images.unsplash.com/photo-1597010486884-3c6c06a4b272?w=800&q=80", fruit: "Love of Neighbor", verse: "Elizabeth cried out, 'Most blessed are you.'", reflection: "Mary hastens to help her cousin." },
      { title: "3rd: The Nativity", image: "https://images.unsplash.com/photo-1543338575-b6d43e5db7ff?w=800&q=80", fruit: "Poverty in Spirit", verse: "She gave birth to her firstborn son...", reflection: "Jesus is born in a humble stable." },
      { title: "4th: The Presentation", image: "https://images.unsplash.com/photo-1614050212871-331da90472f8?w=800&q=80", fruit: "Obedience", verse: "They took him up to Jerusalem...", reflection: "Mary and Joseph obey." },
      { title: "5th: Finding Jesus", image: "https://images.unsplash.com/photo-1546484475-7f7bc5579d46?w=800&q=80", fruit: "Joy in Finding Jesus", verse: "They found him in the temple...", reflection: "Mary and Joseph find Jesus." }
    ]
  }
};

export function getTodaysMystery() { return "Joyful"; }

export const prayerLibrary = [
  { title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." },
  { title: "St. Michael the Archangel", category: "Spiritual Warfare", text: "St. Michael the Archangel, defend us in battle..." },
  { title: "The Angelus", category: "Marian", text: "V. The Angel of the Lord declared to Mary:\nR. And she conceived of the Holy Spirit.\n(Hail Mary...)" }
];
