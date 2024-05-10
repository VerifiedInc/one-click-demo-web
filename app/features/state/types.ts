import { CustomDemoForm } from '~/features/customConfig/validators/form';

export type MappedState = {
  uuid: string;
  state: CustomDemoForm;
  dummyBrand: string;
  realBrand: string;
  createdAt: Date;
  updatedAt: Date;
};
