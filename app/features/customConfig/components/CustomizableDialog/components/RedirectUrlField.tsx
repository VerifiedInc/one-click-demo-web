import { useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { debounce } from 'lodash';
import { TextField } from '@mui/material';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';

export function RedirectUrlField() {
  const field = useController<CustomDemoForm>({ name: 'redirectUrl' });

  const [value, setValue] = useState(field.field.value || '');

  const debounceChange = useRef(
    debounce((value: string) => {
      // Update form state
      field.field.onChange({ target: { value } });
    }, 500)
  ).current;

  const handleChange = (e: any) => {
    setValue(e.target.value);
    debounceChange(e.target.value);
  };

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
        {...field.field}
        value={value}
        onChange={handleChange}
        error={!!field.fieldState.error}
        helperText={
          field.fieldState.error?.message ||
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
