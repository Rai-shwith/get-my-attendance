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
  { id: "F", label: "F", front: "B", back: "J", left: "E", right: "G" },
  { id: "G", label: "G", front: "C", back: "K", left: "F", right: "H" },
  { id: "H", label: "H", front: "D", back: "L", left: "G", right: null },

  { id: "I", label: "I", front: "E", back: "M", left: null, right: "Z" },
  { id: "Z", label: "Z", front: "E", back: "M", left: "I", right: "J" }, // Cheater
  { id: "J", label: "J", front: "F", back: "N", left: "Z", right: "K" },
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

// const data = shuffleArray(data1)

const data = [
  {
    id: "J",
    label: "J",
    front: "G",
    back: null,
    left: null,
    right: "K",
  },
  {
    id: "C",
    label: "C",
    front: null,
    back: "F",
    left: "B",
    right: null,
  },
  {
    id: "K",
    label: "K",
    front: "H",
    back: null,
    left: "J",
    right: "L",
  },
  {
    id: "D",
    label: "D",
    front: "A",
    back: null,
    left: null,
    right: "E",
  },
  {
    id: "B",
    label: "B",
    front: null,
    back: "E",
    left: "A",
    right: "C",
  },
  {
    id: "H",
    label: "H",
    front: null,
    back: "K",
    left: "G",
    right: "I",
  },
  {
    id: "G",
    label: "G",
    front: null,
    back: "J",
    left: null,
    right: "H",
  },
  {
    id: "E",
    label: "E",
    front: "B",
    back: null,
    left: "D",
    right: "F",
  },
  {
    id: "I",
    label: "I",
    front: null,
    back: "L",
    left: "H",
    right: null,
  },
  {
    id: "L",
    label: "L",
    front: "I",
    back: null,
    left: "K",
    right: null,
  },
  {
    id: "A",
    label: "A",
    front: null,
    back: "D",
    left: null,
    right: "B",
  },
  {
    id: "F",
    label: "F",
    front: "C",
    back: null,
    left: "E",
    right: null,
  },
];

console.log(data);
