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
  const isHosted = useController<CustomDemoForm>({
    name: 'isHosted',
  });

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
      sx={{
        opacity: isHosted.field.value ? 1 : 0.5,
      }}
      data-testid='custom-demo-dialog-description-accordion'
    >
      <TextField
        {...field.field}
        value={field.field.value}
        onChange={(e) => {
          field.field.onChange({ target: { value: e.target.value } });
        }}
        error={!!field.fieldState.error}
        helperText={
          field.fieldState.error?.message || 'Optional — defaults to empty'
        }
        label='Description'
        color='success'
        size='small'
        className='original'
        disabled={!isHosted.field.value}
      />
    </SectionAccordion>
  );
}
