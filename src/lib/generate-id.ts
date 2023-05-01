/**
 * Generate a random ID
 * @param {number} len Length of the ID
 * @param {boolean} includeDigits Whether to include digits in the ID
 * @returns {string} the generated ID
 */
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

/**
 * Sample one element from an array
 * @param {Array<T>} arr the array to sample from
 * @returns {T} the sampled element
 */
const sampleOne = <T>(arr: Array<T>) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Sample multiple elements from an array
 * @param {Array<T>} arr the array to sample from
 * @param {number} len the number of elements to sample
 * @returns {Array<T>} the sampled element
 */
const sample = <T>(arr: Array<T>, len = 1) => {
  const output = [];

  for (let i = 0; i < len; i++) {
    output.push(sampleOne(arr));
  }

  return output;
};
