import { CredentialRequestDto } from '@verifiedinc/core-types';

import { OneClickOptions } from '~/coreAPI.server';

import {
  OneClickContentTitle,
  OneClickContentVerificationOptions,
} from '~/features/customConfig/types';

export const mapOneClickOptions = (data: any): Partial<OneClickOptions> => {
  const mapCredentialRequests = (
    credentialRequest: CredentialRequestDto
  ): CredentialRequestDto => {
    const _data: CredentialRequestDto = {
      type: credentialRequest.type,
      mandatory: credentialRequest.mandatory,
      description: credentialRequest.description,
      allowUserInput: credentialRequest.allowUserInput,
    };

    if (!Array.isArray(_data.children)) {
      return _data;
    }

    return {
      ..._data,
      children: _data.children.map(mapCredentialRequests),
    };
  };

  return {
    verificationOptions:
      data.verificationOptions || OneClickContentVerificationOptions.OnlyCode,
    isHosted: data.isHosted ?? true,
    content: {
      title: data?.content?.title || OneClickContentTitle.Signup,
      description: data?.content?.description,
    },
    redirectUrl: data.redirectUrl,
    credentialRequests: (data.credentialRequests || []).map(
      mapCredentialRequests
    ),
  };
};
