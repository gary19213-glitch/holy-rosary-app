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
    "3-19": { name: "St. Joseph, Husband of Mary", type: "Solemnity", bio: "Foster father of Jesus and patron of the Universal Church." },
    "8-15": { name: "The Assumption of Mary", type: "Solemnity", bio: "Mary is taken body and soul into heavenly glory." },
    "11-1": { name: "All Saints", type: "Solemnity", bio: "Honoring all the holy men and women in heaven." },
    "12-12": { name: "Our Lady of Guadalupe", type: "Feast", bio: "Patroness of the Americas." }
  };
  // If no feast today, generate a dynamic Daily Devotion message so the box never disappears!
  return saintsCalendar[dateString] || { name: "Daily Devotion", type: "Ferial Day", bio: "Let us offer today's works, joys, and sufferings to the Lord." };
}

// BILINGUAL PRAYER DATABASE
export const prayers = {
  signOfCross: { en: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", la: "In nomine Patris, et Filii, et Spiritus Sancti. Amen." },
  creed: { en: "I believe in God, the Father Almighty...", la: "Credo in Deum, Patrem omnipotentem..." },
  ourFather: { 
    en: { leader: "Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven.", response: "Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen." },
    la: { leader: "Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra.", response: "Panem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen." }
  },
  hailMary: { 
    en: { leader: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.", response: "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen." },
    la: { leader: "Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus.", response: "Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. Amen." }
  },
  gloryBe: { 
    en: { leader: "Glory be to the Father, and to the Son, and to the Holy Spirit.", response: "As it was in the beginning, is now, and ever shall be, world without end. Amen." },
    la: { leader: "Gloria Patri, et Filio, et Spiritui Sancto.", response: "Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen." }
  },
  fatimaPrayer: { en: "O My Jesus, forgive us our sins, save us from the fires of hell...", la: "Domine Iesu, dimitte nobis debita nostra, salva nos ab igne inferiori..." },
  hailHolyQueen: { en: "Hail, Holy Queen, Mother of Mercy...", la: "Salve Regina, Mater misericordiae..." }
};

export const chapletPrayers = {
  opening: { en: "You expired, Jesus...", la: "Exspirasti, Iesu..." },
  eternalFather: { 
    en: { leader: "Eternal Father, I offer you the Body and Blood, Soul and Divinity of Your Dearly Beloved Son, Our Lord, Jesus Christ.", response: "In atonement for our sins and those of the whole world." },
    la: { leader: "Pater aeterne, offero tibi Corpus et Sanguinem, animam et divinitatem dilectissimi Filii Tui, Domini nostri, Iesu Christi.", response: "In propitiatione pro peccatis nostris et totius mundi." }
  },
  sorrowfulPassion: { 
    en: { leader: "For the sake of His sorrowful Passion.", response: "Have mercy on us and on the whole world." },
    la: { leader: "Pro dolorosa Eius passione.", response: "Miserere nobis et totius mundi." }
  },
  holyGod: { en: "Holy God, Holy Mighty One...", la: "Sanctus Deus, Sanctus Fortis..." }, closing: { en: "Eternal God, in whom mercy is endless...", la: "Deus aeterne, in quo misericordia est infinita..." }
};

export const stationsOfCross = [
  { numeral: "I", title: "Jesus is condemned", image: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=800&q=80", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider how Jesus Christ was unjustly condemned." },
  { numeral: "II", title: "Jesus carries His cross", image: "https://images.unsplash.com/photo-1544158498-5c4d347dcbc3?w=800&q=80", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider Jesus offering to His Father the death He was about to suffer." },
  { numeral: "III", title: "Jesus falls the first time", image: "https://images.unsplash.com/photo-1598421889819-216e9112de90?w=800&q=80", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider the first fall of Jesus." },
  { numeral: "IV", title: "Jesus meets His Mother", image: "https://images.unsplash.com/photo-1574341258673-455bfa052ee6?w=800&q=80", adoration: { leader: "We adore You, O Christ...", response: "Because by Your holy cross..." }, reflection: "Consider how the Son met His Mother on His way to Calvary." }
];

export const mysteries = {
  joyful: { name: "The Joyful Mysteries", decades: [
    { title: "1st: The Annunciation", image: "https://images.unsplash.com/photo-1599933391942-d17a7eec6bf1?w=800&q=80", verse: "Mary said, 'Behold, I am the handmaid...'" },
    { title: "2nd: The Visitation", image: "https://images.unsplash.com/photo-1597010486884-3c6c06a4b272?w=800&q=80", verse: "Elizabeth cried out, 'Most blessed are you.'" },
    { title: "3rd: The Nativity", image: "https://images.unsplash.com/photo-1543338575-b6d43e5db7ff?w=800&q=80", verse: "She gave birth to her firstborn son..." },
    { title: "4th: The Presentation", image: "https://images.unsplash.com/photo-1614050212871-331da90472f8?w=800&q=80", verse: "They took him up to Jerusalem..." },
    { title: "5th: Finding Jesus", image: "https://images.unsplash.com/photo-1546484475-7f7bc5579d46?w=800&q=80", verse: "They found him in the temple..." }
  ]},
  sorrowful: { name: "The Sorrowful Mysteries", decades: [
    { title: "1st: Agony in the Garden", image: "https://images.unsplash.com/photo-1544158498-5c4d347dcbc3?w=800&q=80", verse: "His sweat became like drops of blood." },
    { title: "2nd: The Scourging", image: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=800&q=80", verse: "Pilate took Jesus and had him scourged." },
    { title: "3rd: Crowning with Thorns", image: "https://images.unsplash.com/photo-1598421889819-216e9112de90?w=800&q=80", verse: "They wove a crown out of thorns." },
    { title: "4th: Carrying the Cross", image: "https://images.unsplash.com/photo-1574341258673-455bfa052ee6?w=800&q=80", verse: "Carrying the cross himself..." },
    { title: "5th: The Crucifixion", image: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&q=80", verse: "They crucified him there." }
  ]},
  glorious: { name: "The Glorious Mysteries", decades: [
    { title: "1st: The Resurrection", image: "https://images.unsplash.com/photo-1544158498-5c4d347dcbc3?w=800&q=80", verse: "He has been raised; he is not here." },
    { title: "2nd: The Ascension", image: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=800&q=80", verse: "He was lifted up, and a cloud took him." },
    { title: "3rd: Pentecost", image: "https://images.unsplash.com/photo-1598421889819-216e9112de90?w=800&q=80", verse: "They were all filled with the holy Spirit." },
    { title: "4th: The Assumption", image: "https://images.unsplash.com/photo-1574341258673-455bfa052ee6?w=800&q=80", verse: "A great sign appeared in the sky, a woman..." },
    { title: "5th: The Coronation", image: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&q=80", verse: "On her head a crown of twelve stars." }
  ]},
  luminous: { name: "The Luminous Mysteries", decades: [
    { title: "1st: Baptism in the Jordan", image: "https://images.unsplash.com/photo-1544158498-5c4d347dcbc3?w=800&q=80", verse: "This is my beloved Son." },
    { title: "2nd: Wedding at Cana", image: "https://images.unsplash.com/photo-1601058269784-9125f4d1c5a9?w=800&q=80", verse: "Do whatever he tells you." },
    { title: "3rd: Proclamation of the Kingdom", image: "https://images.unsplash.com/photo-1598421889819-216e9112de90?w=800&q=80", verse: "Repent, and believe in the gospel." },
    { title: "4th: The Transfiguration", image: "https://images.unsplash.com/photo-1574341258673-455bfa052ee6?w=800&q=80", verse: "His face shone like the sun." },
    { title: "5th: Institution of the Eucharist", image: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&q=80", verse: "This is my body, which will be given for you." }
  ]}
};

export function getTodaysMysterySet() {
  const day = new Date().getDay();
  if (day === 1 || day === 6) return "joyful";
  if (day === 2 || day === 5) return "sorrowful";
  if (day === 3 || day === 0) return "glorious";
  return "luminous"; // Thursday
}

export const prayerLibrary = [
  { title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." },
  { title: "St. Michael the Archangel", category: "Spiritual Warfare", text: "St. Michael the Archangel, defend us in battle..." }
];
