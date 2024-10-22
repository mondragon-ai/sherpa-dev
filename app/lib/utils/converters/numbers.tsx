/**
 * Converts a number to a string with 'k' for thousands and 'M' for millions.
 * @param num - The number to convert.
 * @returns A string representation of the number with 'k' for thousands and 'M' for millions.
 */
export const formatNumber = (num: number, trunc?: boolean): string => {
  if (num >= 1_000_000) {
    return trunc
      ? String(Math.round(num / 1_000_000)).replace(/\.00$/, "") + "M"
      : (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (num >= 1_000) {
    return trunc
      ? String(Math.round(num / 1_000)).replace(/\.00$/, "") + "K"
      : (num / 1_000).toFixed(2).replace(/\.00$/, "") + "k";
  }

  return num.toFixed(2).toString();
};

/**
 * Formats a number to a money string with commas and two decimal places.
 *
 * @param {number} num - The number to format.
 * @returns {string} The formatted money string.
 */
export const formatToMoney = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
