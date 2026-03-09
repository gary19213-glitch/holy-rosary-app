export const prayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  creed: "I believe in God, the Father Almighty...",
  // FEATURE #27: We split the prayers into Leader and Response!
  hailMary: {
    leader: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.",
    response: "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
  },
  gloryBe: {
    leader: "Glory be to the Father, and to the Son, and to the Holy Spirit.",
    response: "As it was in the beginning, is now, and ever shall be, world without end. Amen."
  },
  hailHolyQueen: "Hail, Holy Queen, Mother of Mercy..."
};

export const chapletPrayers = {
  opening: "You expired, Jesus...",
  eternalFather: {
    leader: "Eternal Father, I offer you the Body and Blood, Soul and Divinity of Your Dearly Beloved Son, Our Lord, Jesus Christ.",
    response: "In atonement for our sins and those of the whole world."
  },
  sorrowfulPassion: {
    leader: "For the sake of His sorrowful Passion.",
    response: "Have mercy on us and on the whole world."
  },
  holyGod: "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.",
  closing: "Eternal God, in whom mercy is endless..."
};

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    decades: [
      { title: "1st: The Annunciation", fruit: "Humility", verse: "Mary said, 'Behold, I am the handmaid of the Lord.'", reflection: "Imagine the angel Gabriel appearing to Mary." },
      { title: "2nd: The Visitation", fruit: "Love of Neighbor", verse: "Elizabeth cried out, 'Most blessed are you among women.'", reflection: "Mary hastens to help her cousin." },
      { title: "3rd: The Nativity", fruit: "Poverty in Spirit", verse: "She gave birth to her firstborn son...", reflection: "Jesus is born in a humble stable." },
      { title: "4th: The Presentation", fruit: "Obedience", verse: "They took him up to Jerusalem...", reflection: "Mary and Joseph obey the law of God." },
      { title: "5th: Finding Jesus in the Temple", fruit: "Joy in Finding Jesus", verse: "They found him in the temple...", reflection: "Mary and Joseph find Jesus." }
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
// FEATURE #50 & #52: THE PRAYER LIBRARY DATABASE
export const prayerLibrary = [
  { 
    title: "Morning Offering", 
    category: "Morning",
    text: "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day in union with the Holy Sacrifice of the Mass throughout the world. I offer them for all the intentions of Your Sacred Heart: the salvation of souls, reparation for sin, and the reunion of all Christians. I offer them for the intentions of our bishops and of all Apostles of Prayer, and in particular for those recommended by our Holy Father this month. Amen." 
  },
  { 
    title: "St. Michael the Archangel", 
    category: "Spiritual Warfare",
    text: "St. Michael the Archangel, defend us in battle, be our protection against the wickedness and snares of the devil. May God rebuke him we humbly pray; and do thou, O Prince of the Heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen." 
  },
  { 
    title: "The Angelus", 
    category: "Marian",
    text: "V. The Angel of the Lord declared to Mary:\nR. And she conceived of the Holy Spirit.\n(Hail Mary...)\n\nV. Behold the handmaid of the Lord:\nR. Be it done unto me according to Thy word.\n(Hail Mary...)\n\nV. And the Word was made Flesh:\nR. And dwelt among us.\n(Hail Mary...)\n\nPray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ." 
  },
  { 
    title: "Act of Contrition", 
    category: "Penitential",
    text: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all-good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen." 
  },
  { 
    title: "Prayer to Guardian Angel", 
    category: "Saints",
    text: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen." 
  }
];
