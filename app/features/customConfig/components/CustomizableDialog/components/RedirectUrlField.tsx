import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';

export function RedirectUrlField() {
  const field = useController<CustomDemoForm>({ name: 'redirectUrl' });
  const isHosted = useController<CustomDemoForm>({
    name: 'isHosted',
  });

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
      sx={{
        opacity: isHosted.field.value ? 1 : 0.5,
      }}
    >
      <TextField
        {...field.field}
        value={field.field.value}
        onChange={(e) => {
          field.field.onChange({ target: { value: e.target.value } });
        }}
        error={!!field.fieldState.error}
        helperText={
          field.fieldState.error?.message ||
          "Optional — defaults to brand's global redirect URL"
        }
        label='Redirect URL'
        color='success'
        size='small'
        className='original'
        disabled={!isHosted.field.value}
      />
    </SectionAccordion>
  );
}
