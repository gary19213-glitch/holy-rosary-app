export const prayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  creed: "I believe in God, the Father Almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord...",
  ourFather: "Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven...",
  hailMary: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
  ohMyJesus: "O My Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.",
  hailHolyQueen: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve..."
};

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    decades: [
      {
        title: "1st: The Annunciation",
        fruit: "Humility",
        verse: "Mary said, 'Behold, I am the handmaid of the Lord.' (Luke 1:38)",
        reflection: "Imagine the angel Gabriel appearing to Mary. Let us pray for the grace to accept God's will."
      },
      {
        title: "2nd: The Visitation",
        fruit: "Love of Neighbor",
        verse: "Elizabeth cried out, 'Most blessed are you among women.' (Luke 1:41-42)",
        reflection: "Mary hastens to help her cousin. Let us pray for the grace to serve others."
      },
      {
        title: "3rd: The Nativity",
        fruit: "Poverty in Spirit",
        verse: "She gave birth to her firstborn son and wrapped him in swaddling clothes. (Luke 2:7)",
        reflection: "Jesus is born in a humble stable. Let us pray for detachment from worldly things."
      },
      {
        title: "4th: The Presentation",
        fruit: "Obedience",
        verse: "They took him up to Jerusalem to present him to the Lord. (Luke 2:22)",
        reflection: "Mary and Joseph obey the law of God. Let us pray for the grace of obedience."
      },
      {
        title: "5th: Finding Jesus in the Temple",
        fruit: "Joy in Finding Jesus",
        verse: "After three days they found him in the temple, sitting in the midst of the teachers. (Luke 2:46)",
        reflection: "Mary and Joseph find Jesus after losing Him. Let us pray to always seek Christ."
      }
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
