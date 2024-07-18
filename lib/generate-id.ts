export const generateId = (len = 4, { includeDigits = false } = {}) => {
  const characters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  if (includeDigits) {
    characters.push("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
  }

  return sample(characters, len).join("");
};

const sampleOne = <T>(arr: Array<T>) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const sample = <T>(arr: Array<T>, len = 1) => {
  const output = [];

  for (let i = 0; i < len; i++) {
    output.push(sampleOne(arr));
  }

  return output;
};
