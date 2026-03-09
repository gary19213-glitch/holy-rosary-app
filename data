// This file is the "Brain" of our app. It holds all the text.

export const prayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  creed: "I believe in God, the Father Almighty, Creator of heaven and earth...",
  ourFather: "Our Father, Who art in heaven, hallowed be Thy name...",
  hailMary: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
  ohMyJesus: "O My Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.",
  hailHolyQueen: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope..."
};

export const mysteries = {
  joyful: {
    name: "The Joyful Mysteries",
    days: ["Monday", "Saturday"],
    decades: [
      {
        title: "1st: The Annunciation",
        fruit: "Humility",
        verse: "Mary said, 'Behold, I am the handmaid of the Lord. May it be done to me according to your word.' (Luke 1:38)",
        reflection: "Imagine the angel Gabriel appearing to Mary. Let us pray for the grace to accept God's will with a humble heart."
      },
      {
        title: "2nd: The Visitation",
        fruit: "Love of Neighbor",
        verse: "Elizabeth, filled with the Holy Spirit, cried out in a loud voice and said, 'Most blessed are you among women, and blessed is the fruit of your womb.' (Luke 1:41-42)",
        reflection: "Mary hastens to help her cousin. Let us pray for the grace to serve others with joy."
      }
      // We will add the other 3 decades, and the Sorrowful, Glorious, and Luminous later!
    ]
  }
};

// Feature #11: Auto-Suggest Mystery based on the day
export function getTodaysMystery() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  
  if (today === "Monday" || today === "Saturday") return "Joyful";
  if (today === "Tuesday" || today === "Friday") return "Sorrowful";
  if (today === "Wednesday" || today === "Sunday") return "Glorious";
  if (today === "Thursday") return "Luminous";
  
  return "Joyful";
}
