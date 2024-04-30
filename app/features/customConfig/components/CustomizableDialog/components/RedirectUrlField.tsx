import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { CustomDemoForm } from '~/features/customConfig/validators/form';

export function RedirectUrlField() {
  const redirectUrl = useController<CustomDemoForm>({ name: 'redirectUrl' });

  return (
    <SectionAccordion
      title='Redirect URL'
      description='Where the user is redirected after completing the flow'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  redirectUrl?: string\n}`}</pre>
        </>
      }
    >
      <TextField
        {...redirectUrl.field}
        error={!!redirectUrl.fieldState.error}
        helperText={
          redirectUrl.fieldState.error?.message ||
          "Optional — defaults to brand's global redirect URL"
        }
        label='Redirect URL'
        color='success'
        size='small'
        className='original'
      />
    </SectionAccordion>
  );
}
