import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CredentialSchemaDto } from '@verifiedinc/core-types';

import { path } from '~/routes/schemas';

type CustomConfigContext = {
  schemas: CredentialSchemaDto['schemas'] | null;
};

const Context = createContext<CustomConfigContext | null>(null);

export function useCustomConfig() {
  return useContext(Context) as CustomConfigContext;
}

export function CustomConfigProvider({ children }: PropsWithChildren) {
  const [schemas, setSchemas] = useState<CredentialSchemaDto['schemas'] | null>(
    null
  );

  // Fetch the schemas
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handleUpdateStatus = async () => {
      const response = await fetch(path(), {
        signal,
        method: 'GET',
      });
      const { data } = await response.json();
      setSchemas(data);
    };

    handleUpdateStatus();

    return () => controller.abort();
  }, []);

  return <Context.Provider value={{ schemas }}>{children}</Context.Provider>;
}
