export const dateUtils = {
  /**
   * Convert date from YYYY-MM-DD to DD-MM-YYYY
   * @param date
   * @returns
   */
  toYYYYDDMM: (date: string): string => {
    // extract the components from the date format
    const [month, day, year] = date.split('-');
    return `${year}-${month}-${day}`;
  },
};
