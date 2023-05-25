/**
 * Slugify a string. Ex. "Hello World" -> "hello-world"
 * @param {string} str - The string to slugify
 * @returns {string} The slugified string
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};
