/**
 * Generate a pseudo-random string
 * @param {number} length the length of the string to generate
 * @returns {string} the generated string
 */
export const generateRandomString = (length: number): string => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
