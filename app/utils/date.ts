export const dateUtils = {
  /**
   * Convert date from MM-DD-YYYY to YYYY-MM-DD
   * @param date
   * @returns
   */
  toYYYYDDMM: (date: string): string => {
    // extract the components from the date format
    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day}`;
  },
  /**
   * Formats a timestamp into a pretty format from MMDD to MM/DD/YYYY always enforcing year to be 1970.
   * @param date
   * @returns
   */
  formatDateMMDD: (date: string) => {
    const formattedDate = date.slice(0, 2) + '/' + date.slice(2, 4) + '/1970';
    return formattedDate;
  },
};
