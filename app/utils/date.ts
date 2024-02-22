export const dateUtils = {
  /**
   * Convert date from MM-DD-YYYY to YYYY-MM-DD
   * @param date
   * @returns
   */
  toYYYYDDMM: (date: string): string => {
    // extract the components from the date format
    const [month, day, year] = date.split('-');
    return `${year}-${month}-${day}`;
  },
};
