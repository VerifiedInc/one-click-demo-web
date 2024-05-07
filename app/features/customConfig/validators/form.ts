import * as zod from 'zod';
import {
  OneClickContentTitle,
  OneClickContentVerificationOptions,
  OneClickEnvironment,
} from '~/features/customConfig/types';
import { CredentialRequestDto, MandatoryEnum } from '@verifiedinc/core-types';

export const customDemoFormSchema = zod.object({
  environment: zod.nativeEnum(OneClickEnvironment),
  verificationOptions: zod.nativeEnum(OneClickContentVerificationOptions),
  isHosted: zod.boolean(),
  content: zod.object({
    title: zod.nativeEnum(OneClickContentTitle),
    description: zod.string().optional(),
  }),
  redirectUrl: zod.string().url().optional(),
  credentialRequests: zod.array(
    zod.object({
      allowUserInput: zod.boolean(),
      description: zod.string().optional(),
      mandatory: zod.nativeEnum(MandatoryEnum),
      type: zod.string().min(1),
    })
  ),
});

export type CustomDemoForm = Omit<
  zod.infer<typeof customDemoFormSchema>,
  'credentialRequests'
> & {
  credentialRequests: CredentialRequestDto[];
};
