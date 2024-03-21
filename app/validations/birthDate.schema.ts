import * as zod from 'zod';

export const birthDateSchema = zod.string().refine((value: string) => {
  const regex = /\d{2}-\d{2}-\d{4}/;
  if (regex.test(value)) {
    const now = new Date();
    const minDate = new Date('1900-01-01');
    const maxDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    const [month, date, year] = value.split('-');
    // Safari does not support the format mm-dd-yyyy, thus having to use yyyy-mm-dd
    const fixedDate = `${year}-${month}-${date}`;
    const valueDate = new Date(fixedDate);

    if (valueDate >= minDate && valueDate <= maxDate) {
      const date = Date.parse(String(new Date(fixedDate)));
      return !isNaN(date);
    }
  }
  return false;
}, 'Birthday is invalid');
