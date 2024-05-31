import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

type CredentialRequestFieldContext = {
  dragRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const Context = createContext<CredentialRequestFieldContext | null>(null);

export const useCredentialRequestItem = () => {
  return useContext(Context);
};

export function CredentialRequestItemProvider({ children }: PropsWithChildren) {
  const dragRef = useRef<HTMLButtonElement | null>(null);
  return <Context.Provider value={{ dragRef }}>{children}</Context.Provider>;
}
