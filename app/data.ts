export function getLiturgicalInfo() {
  const today = new Date(); const month = today.getMonth(); const date = today.getDate();
  let season = "Ordinary Time"; let color = "#1a2e1a"; 
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) { season = "Advent"; color = "#2d1b2e"; } 
  else if ((month === 11 && date >= 25) || (month === 0 && date <= 12)) { season = "Christmas Time"; color = "#2e2d1a"; } 
  else if (month === 2 || month === 3) { season = "Lent"; color = "#2d1b2e"; } 
  else if (month === 4) { season = "Easter Season"; color = "#2e2d1a"; } 
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
  holyGod: "Holy God, Holy Mighty One...", closing: "Eternal God, in whom mercy is endless..."
};

// FIXED IMAGES (Direct Source Links)
export const stationsOfCross = [
  { numeral: "I", title: "Jesus is condemned to death", image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/1_Jesus_is_condemned_to_death.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because, by Your holy cross..." }, reflection: "Consider how Jesus Christ..." },
  { numeral: "II", title: "Jesus carries His cross", image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/2_Jesus_carries_his_cross.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because, by Your holy cross..." }, reflection: "Consider Jesus as He walked..." },
  { numeral: "III", title: "Jesus falls the first time", image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/3_Jesus_falls_the_first_time.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because, by Your holy cross..." }, reflection: "Consider the first fall of Jesus..." },
  { numeral: "IV", title: "Jesus meets His Mother", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/4_Jesus_meets_his_mother.jpg", adoration: { leader: "We adore You, O Christ...", response: "Because, by Your holy cross..." }, reflection: "Consider how the Son met His Mother..." }
];

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    decades: [
      { title: "1st: The Annunciation", image: "https://upload.wikimedia.org/wikipedia/commons/0/07/Leonardo_da_Vinci_-_Annunciation_-_Google_Art_Project.jpg", fruit: "Humility", verse: "Mary said, 'Behold, I am the handmaid of the Lord.'", reflection: "Imagine the angel Gabriel appearing to Mary." },
      { title: "2nd: The Visitation", image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Domenico_Ghirlandaio_-_Visitation_-_WGA8628.jpg", fruit: "Love of Neighbor", verse: "Elizabeth cried out, 'Most blessed are you.'", reflection: "Mary hastens to help her cousin." },
      { title: "3rd: The Nativity", image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_-_WGA11653.jpg", fruit: "Poverty in Spirit", verse: "She gave birth to her firstborn son...", reflection: "Jesus is born in a humble stable." },
      { title: "4th: The Presentation", image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Presentation_at_the_Temple_%28Ambrogio_Lorenzetti%29.jpg", fruit: "Obedience", verse: "They took him up to Jerusalem...", reflection: "Mary and Joseph obey." },
      { title: "5th: Finding Jesus", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Jesus_among_the_Doctors-Veronese.jpg", fruit: "Joy in Finding Jesus", verse: "They found him in the temple...", reflection: "Mary and Joseph find Jesus." }
    ]
  }
};

export function getTodaysMystery() { return "Joyful"; }
export const prayerLibrary = [{ title: "Morning Offering", category: "Morning", text: "O Jesus, through the Immaculate Heart of Mary..." }];
