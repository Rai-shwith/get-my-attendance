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

const data14  = [
  { id: "A1", label: "A1", front: null, back: "B1", left: null, right: "A2" },
  { id: "A2", label: "A2", front: null, back: "B2", left: "A1", right: "A3" },
  { id: "A3", label: "A3", front: null, back: "B3", left: "A2", right: "A4" },
  { id: "A4", label: "A4", front: null, back: "B4", left: "A3", right: "A5" },
  { id: "A5", label: "A5", front: null, back: "B5", left: "A4", right: "A6" },
  { id: "A6", label: "A6", front: null, back: "B6", left: "A5", right: "A7" },
  { id: "A7", label: "A7", front: null, back: "B7", left: "A6", right: "A8" },
  { id: "A8", label: "A8", front: null, back: "B8", left: "A7", right: "A9" },
  { id: "A9", label: "A9", front: null, back: "B9", left: "A8", right: "A10" },
  { id: "A10", label: "A10", front: null, back: "B10", left: "A9", right: null },

  { id: "B1", label: "B1", front: "A1", back: "C1", left: null, right: "B2" },
  { id: "B2", label: "B2", front: "A2", back: "C2", left: "B1", right: "B3" },
  { id: "B3", label: "B3", front: "A3", back: "C3", left: "B2", right: "B4" },
  { id: "B4", label: "B4", front: "A4", back: "C4", left: "B3", right: "B5" },
  { id: "B5", label: "B5", front: "A5", back: "C5", left: "B4", right: "B6" },
  { id: "B6", label: "B6", front: "A6", back: "C6", left: "B5", right: "B7" },
  { id: "B7", label: "B7", front: "A7", back: "C7", left: "B6", right: "B8" },
  { id: "B8", label: "B8", front: "A8", back: "C8", left: "B7", right: "B9" },
  { id: "B9", label: "B9", front: "A9", back: "C9", left: "B8", right: "B10" },
  { id: "B10", label: "B10", front: "A10", back: "C10", left: "B9", right: null },

  { id: "C1", label: "C1", front: "B1", back: "D1", left: null, right: "C2" },
  { id: "C2", label: "C2", front: "B2", back: "D2", left: "C1", right: "C3" },
  { id: "C3", label: "C3", front: "B3", back: "D3", left: "C2", right: "C4" },
  { id: "C4", label: "C4", front: "B4", back: "D4", left: "C3", right: "C5" },
  { id: "C5", label: "C5", front: "B5", back: "D5", left: "C4", right: "C6" },
  { id: "C6", label: "C6", front: "B6", back: "D6", left: "C5", right: "C7" },
  { id: "C7", label: "C7", front: "B7", back: "D7", left: "C6", right: "C8" },
  { id: "C8", label: "C8", front: "B8", back: "D8", left: "C7", right: "C9" },
  { id: "C9", label: "C9", front: "B9", back: "D9", left: "C8", right: "C10" },
  { id: "C10", label: "C10", front: "B10", back: "D10", left: "C9", right: null },

  { id: "D1", label: "D1", front: "C1", back: "E1", left: null, right: "D2" },
  { id: "D2", label: "D2", front: "C2", back: "E2", left: "D1", right: "D3" },
  { id: "D3", label: "D3", front: "C3", back: "E3", left: "D2", right: "D4" },
  { id: "D4", label: "D4", front: "C4", back: "E4", left: "D3", right: "D5" },
  { id: "D5", label: "D5", front: "C5", back: "E5", left: "D4", right: "D6" },
  { id: "D6", label: "D6", front: "C6", back: "E6", left: "D5", right: "D7" },
  { id: "D7", label: "D7", front: "C7", back: "E7", left: "D6", right: "D8" },
  { id: "D8", label: "D8", front: "C8", back: "E8", left: "D7", right: "D9" },
  { id: "D9", label: "D9", front: "C9", back: "E9", left: "D8", right: "D10" },
  { id: "D10", label: "D10", front: "C10", back: "E10", left: "D9", right: null },

  { id: "E1", label: "E1", front: "D1", back:  "F1", left: null, right: "E2" },
  { id: "E2", label: "E2", front: "D2", back:  "F2", left: "E1", right: "E3" },
  { id: "E3", label: "E3", front: "D3", back:  "F3", left: "E2", right: "E4" },
  { id: "E4", label: "E4", front: "D4", back:  "F4", left: "E3", right: "E5" },
  { id: "E5", label: "E5", front: "D5", back:  "F5", left: "E4", right: "E6" },
  { id: "E6", label: "E6", front: "D6", back:  "F6", left: "E5", right: "E7" },
  { id: "E7", label: "E7", front: "D7", back:  "F7", left: "E6", right: "E8" },
  { id: "E8", label: "E8", front: "D8", back:  "F8", left: "E7", right: "E9" },
  { id: "E9", label: "E9", front: "D9", back:  "F9", left: "E8", right: "E10" },
  { id: "E10", label: "E10", front: "D10", back: "F10", left: "E9", right: null },

  { id: "F1", label: "F1", front: "E1", back: null, left: null, right: "F2" },
  { id: "F2", label: "F2", front: "E2", back: null, left: "F1", right: "F3" },
  { id: "F3", label: "F3", front: "E3", back: null, left: "F2", right: "F4" },
  { id: "F4", label: "F4", front: "E4", back: null, left: "F3", right: "F5" },
  { id: "F5", label: "F5", front: "E5", back: null, left: "F4", right: "F6" },
  { id: "F6", label: "F6", front: "E6", back: null, left: "F5", right: "F7" },
  { id: "F7", label: "F7", front: "E7", back: null, left: "F6", right: "F8" },
  { id: "F8", label: "F8", front: "E8", back: null, left: "F7", right: "F9" },
  { id: "F9", label: "F9", front: "E9", back: null, left: "F8", right: "F10" },
  { id: "F10", label: "F10", front: "E10", back: null, left: "F9", right: null }
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
// setData(data1) // three 2 x 3 isolated networks
setData(data14) // 60 students
console.log(data);
