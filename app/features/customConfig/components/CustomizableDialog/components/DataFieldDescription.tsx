import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';

export function DataFieldDescription() {
  const credentialRequestField = useCredentialRequestField();
  const field = useController<CustomDemoForm>({
    name: `${credentialRequestField?.path as any}.description` as any,
  });
  return (
    <DataFieldSection
      title='Field Description'
      description='What text appears under the field'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  description?: string\n}`}</pre>
        </>
      }
    >
      <TextField
        {...field.field}
        error={!!field.fieldState.error}
        helperText={
          field.fieldState.error?.message || 'Optional — defaults to empty'
        }
        label='Description'
        color='success'
        size='small'
        className='original'
      />
    </DataFieldSection>
  );
}
