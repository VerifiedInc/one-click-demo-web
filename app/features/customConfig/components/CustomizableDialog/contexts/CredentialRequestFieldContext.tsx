import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';

import { CustomDemoForm } from '~/features/customConfig/validators/form';

type CredentialRequestFieldContext = PropsWithChildren & {
  path: string | undefined;
  field: FieldArrayWithId<CustomDemoForm, 'credentialRequests'>;
  fieldArray: UseFieldArrayReturn<CustomDemoForm, 'credentialRequests'>;
  index: number;
  level: number;
};

const Context = createContext<CredentialRequestFieldContext | null>(null);

export const useCredentialRequestField = () => {
  return useContext(Context);
};

export function CredentialRequestFieldProvider({
  children,
  ...props
}: CredentialRequestFieldContext) {
  return <Context.Provider value={props}>{children}</Context.Provider>;
}
