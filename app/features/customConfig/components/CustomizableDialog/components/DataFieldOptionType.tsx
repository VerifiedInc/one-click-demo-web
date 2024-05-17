import { useEffect, useMemo, useRef } from 'react';
import { useController } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { CredentialRequestDto } from '@verifiedinc/core-types';

import { prettyField } from '~/utils/credential';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { useCustomConfig } from '~/features/customConfig/contexts/CustomConfig';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';
import { buildDataFieldValue } from '~/features/customConfig/components/CustomizableDialog/utils/buildDataFieldValue';

export function DataFieldOptionType() {
  const credentialRequestField = useCredentialRequestField();
  const isNew: boolean = (credentialRequestField?.field as any).isNew;
  const field = useController<CustomDemoForm>({
    name: `${credentialRequestField?.path as any}` as any,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { schemas } = useCustomConfig();
  const schemaValues = useMemo(() => {
    if (!schemas) return [];
    return Object.values(schemas)
      .map((schema) => ({
        label: prettyField(schema.$id),
        id: schema.$id,
      }))
      .filter((schema) => {
        const blacklist = ['IdentityCredential'];
        return !blacklist.includes(schema.id);
      })
      .sort((a, b) => (a.label < b.label ? -1 : 1));
  }, [schemas]);
  const selectedValue = useMemo(() => {
    const type = (field.field?.value as CredentialRequestDto)?.type;
    return schemaValues?.find((value) => value.id === type);
  }, [field, schemaValues]);

  useEffect(() => {
    if (!isNew) return;
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isNew]);

  return (
    <DataFieldSection
      key={JSON.stringify(selectedValue)}
      title='Field Type'
      description='What type of user data this field is for'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  type: string\n}`}</pre>
        </>
      }
    >
      <Autocomplete
        ref={inputRef}
        value={selectedValue}
        onChange={(_, value) => {
          if (!value) return;

          credentialRequestField?.fieldArray.update(
            credentialRequestField?.index,
            buildDataFieldValue(value.id, schemas!)
          );
        }}
        options={schemaValues}
        disablePortal
        renderInput={(params) => (
          <TextField
            {...params}
            label='Type'
            color='success'
            size='small'
            className='original'
            fullWidth
          />
        )}
        disabled={(credentialRequestField?.level || 0) > 0 || schemas === null}
      />
    </DataFieldSection>
  );
}
