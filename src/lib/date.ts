/**
 * Format date to locale string
 * @param {string} locale the locale (en, es)
 * @param {Date} date the date to format
 * @returns {string} the formatted date
 */
const formatDate = (locale: string, date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export default formatDate;
