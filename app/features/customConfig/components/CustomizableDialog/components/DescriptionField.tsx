import { useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { debounce } from 'lodash';
import { TextField } from '@mui/material';

import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { CustomDemoForm } from '~/features/customConfig/validators/form';

export function DescriptionField() {
  const field = useController<CustomDemoForm>({
    name: 'content.description',
  });

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
      title='Description'
      description='What text appears under the title on the hosted page'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  content?: {\n    description?: string \n  }\n}`}</pre>
        </>
      }
    >
      <TextField
        {...field.field}
        value={value}
        onChange={handleChange}
        error={!!field.fieldState.error}
        helperText={
          field.fieldState.error?.message || 'Optional — defaults to empty'
        }
        label='Description'
        color='success'
        size='small'
        className='original'
      />
    </SectionAccordion>
  );
}
