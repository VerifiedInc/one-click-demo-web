import * as zod from 'zod';

import { phoneSchema } from './phone.schema';
import { shortenBirthDateSchema } from './birthDate.schema';

export const oneClickNonHostedSchema = zod.object({
  phone: phoneSchema,
  birthDate: shortenBirthDateSchema,
});
