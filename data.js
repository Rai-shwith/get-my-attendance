// Raw data from the backend
const shuffleArray = (array) => {
  const shuffledArray = array.slice(); // Create a copy to avoid mutating the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

// NOTE: Ideal data 3 x 3
const data0 = [
  { id: "A", label: "A", front: null, back: "D", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "E", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "F", left: "B", right: null },
  { id: "D", label: "D", front: "A", back: null, left: null, right: "E" },
  { id: "E", label: "E", front: "B", back: null, left: "D", right: "F" },
  { id: "F", label: "F", front: "C", back: null, left: "E", right: null },

  { id: "Z", label: "Z", front: null, back: null, left: null, right: null },
];

// NOTE: Isolated data
const data1 = [
  { id: "A", label: "A", front: null, back: "D", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "E", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "F", left: "B", right: null },
  { id: "D", label: "D", front: "A", back: null, left: null, right: "E" },
  { id: "E", label: "E", front: "B", back: null, left: "D", right: "F" },
  { id: "F", label: "F", front: "C", back: null, left: "E", right: null },

  { id: "G", label: "G", front: null, back: "J", left: null, right: "H" },
  { id: "H", label: "H", front: null, back: "K", left: "G", right: "I" },
  { id: "I", label: "I", front: null, back: "L", left: "H", right: null },
  { id: "J", label: "J", front: "G", back: null, left: null, right: "K" },
  { id: "K", label: "K", front: "H", back: null, left: "J", right: "L" },
  { id: "L", label: "L", front: "I", back: null, left: "K", right: null },

  { id: "M", label: "M", front: null, back: "P", left: null, right: "N" },
  { id: "N", label: "N", front: null, back: "Q", left: "M", right: "O" },
  { id: "O", label: "O", front: null, back: "R", left: "N", right: null },
  { id: "P", label: "P", front: "M", back: null, left: null, right: "Q" },
  { id: "Q", label: "Q", front: "N", back: null, left: "P", right: "R" },
  { id: "R", label: "R", front: "O", back: null, left: "Q", right: null },
];

// NOTE: Ideal data 4 x 4
const data2 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

// NOTE: Ideal data 4 x 4 with the unfilled last row
const data3 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: "Q", left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: "R", left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },

  { id: "Q", label: "Q", front: "N", back: null, left: null, right: "R" },
  { id: "R", label: "R", front: "O", back: null, left: "Q", right: null },
];

// NOTE: Cheater data in  4x4  Z is in between I and J
const data4 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "Z" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },

  { id: "Z", label: "Z", front: null, back: null, left: "E", right: "F" }, // Cheater

  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

// NOTE: Cheater data in  4x4  Z is in between I and J
const data45 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },

  { id: "Z", label: "Z", front: null, back: null, left: "E", right: "F" }, // Cheater

  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

// NOTE: Cheater data in  4x4 where Z is in between O and P
const data5 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "Z" },
  { id: "Z", label: "Z", front: "K", back: null, left: "O", right: null }, // Cheater
  { id: "P", label: "P", front: "L", back: "Z", left: "O", right: null },
];

// NOTE: Cheater data in  4x4 where Z is in between O and P
const data6 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "Z", label: "Z", front: "K", back: null, left: "O", right: "P" }, // Cheater
  { id: "P", label: "P", front: "L", back: null, left: "Z", right: null },
];

//   NOTE: Discontinued data in column C
const data7 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: null, left: "B", right: "D" }, // cheater
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

//   NOTE: Discontinued data in column B
const data8 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: null, left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "Z", label: "Z", front: "K", back: null, left: "O", right: "P" }, // Cheater
  { id: "P", label: "P", front: "L", back: null, left: "Z", right: null },
];

// NOTE: Break the network in first row
const data9 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: null }, // here
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

// NOTE: Break the network in second row
const data10 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: "A", back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: null },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

// NOTE: Extra Node from Right Side and Front  Left and bottom
const data11 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: "X", back: "G", left: "B", right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "X", label: "X", front: null, back: "C", left: null, right: null },

  { id: "E", label: "E", front: "A", back: "I", left: "Y", right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: "Z" }, // here

  { id: "Y", label: "Y", front: null, back: null, left: null, right: "E" },

  { id: "Z", label: "Z", front: null, back: null, left: "H", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: "J", right: "L" },
  { id: "L", label: "L", front: "H", back: "P", left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: "J", back: null, left: "M", right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },

  // { id: "W", label: "W", front: "O", back: null, left: null, right: null },
];

// NOTE: Break the network in many points
const data12 = [
  { id: "A", label: "A", front: null, back: "E", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "F", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "G", left: null, right: "D" },
  { id: "D", label: "D", front: null, back: "H", left: "C", right: null },

  { id: "E", label: "E", front: null, back: "I", left: null, right: "F" },
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: null },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: null, left: "G", right: null },

  { id: "I", label: "I", front: null, back: "M", left: null, right: "J" },
  { id: "J", label: "J", front: "F", back: "N", left: "I", right: "K" },
  { id: "K", label: "K", front: "G", back: "O", left: null, right: "L" },
  { id: "L", label: "L", front: "H", back: null, left: "K", right: null },

  { id: "M", label: "M", front: "I", back: null, left: null, right: "N" },
  { id: "N", label: "N", front: null, back: null, left: null, right: "O" },
  { id: "O", label: "O", front: "K", back: null, left: "N", right: "P" },
  { id: "P", label: "P", front: "L", back: null, left: "O", right: null },
];

const data13 = [
  { id: "A", label: "A", front: null, back: null, left: null, right: null }, // Cheater
  { id: "B", label: "B", front: null, back: null, left: null, right: null }, // Cheater
  { id: "C", label: "C", front: null, back: null, left: null, right: null }, // Cheater
  { id: "D", label: "D", front: null, back: null, left: null, right: null }, // Cheater
  { id: "E", label: "E", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "F", label: "F", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "G", label: "G", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "H", label: "H", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "I", label: "I", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "J", label: "J", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "K", label: "K", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "L", label: "L", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "M", label: "M", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "N", label: "N", front: null, back: null, left: null, right: null }, // Cheater
  // { id: "O", label: "O", front: null, back: null, left: null, right: null }, // Cheater
];

let data;
let shuffle = true;

// NOTE: Function to set the data with shuffle option
const setData = (inputData) => {
  if (shuffle) data = shuffleArray(inputData);
  else data = inputData;
};

// setData(data0) // 2 X 3 with  1 unconnected node
// setData(data2) // 4 x 4 network
// setData(data3) // 4 x 4 network with 2 nodes at the last row
// setData(data4); // 4 x 4 with Z node tried to enter himself and F node helped him
// setData(data45); // 4 x 4 with Z node tried to enter himself
// setData(data5); // 4 X 4 with Z node tried to enter at the corner
// setData(data6) // same as before but the direction is different
// setData(data7) // missing edge from C to G 
// setData(data8) // missing edge and Z node error
// setData(data11) // extending network from all 4 sides
// setData(data12) // multiple missing edges
// setData(data13) // multiple isolated single nodes
setData(data1) // three 2 x 3 isolated networks

console.log(data);
