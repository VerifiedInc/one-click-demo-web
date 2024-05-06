import {
  OneClickContentTitle,
  OneClickContentVerificationOptions,
} from '~/features/customConfig/types';
import { CustomDemoForm } from '~/features/customConfig/validators/form';

export const mapFormState = (data: any): CustomDemoForm => {
  return {
    environment: data.environment,
    verificationOptions:
      data.verificationOptions || OneClickContentVerificationOptions.OnlyCode,
    isHosted: data.isHosted ?? true,
    content: {
      title: data?.content?.title || OneClickContentTitle.Signup,
      description: data?.content?.description,
    },
    redirectUrl: data.redirectUrl,
    credentialRequests: data.credentialRequests || [],
  };
};
