import { CredentialRequestDto, MandatoryEnum } from '@verifiedinc/core-types';

export const defaultCredentialRequests: CredentialRequestDto[] = [
  {
    type: 'FullNameCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
    children: [
      {
        type: 'FirstNameCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
      {
        type: 'MiddleNameCredential',
        mandatory: MandatoryEnum.NO,
        allowUserInput: true,
      },
      {
        type: 'LastNameCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
    ],
  },
  {
    type: 'EmailCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
  },
  {
    type: 'PhoneCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
  },
  {
    type: 'AddressCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
    children: [
      {
        type: 'Line1Credential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
      {
        type: 'Line2Credential',
        mandatory: MandatoryEnum.NO,
        allowUserInput: true,
      },
      {
        type: 'CityCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
      {
        type: 'CountryCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
      {
        type: 'StateCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
      {
        type: 'ZipCodeCredential',
        mandatory: MandatoryEnum.IF_AVAILABLE,
        allowUserInput: true,
      },
    ],
  },
  {
    type: 'BirthDateCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
  },
  {
    type: 'SsnCredential',
    mandatory: MandatoryEnum.IF_AVAILABLE,
    allowUserInput: true,
  },
];
