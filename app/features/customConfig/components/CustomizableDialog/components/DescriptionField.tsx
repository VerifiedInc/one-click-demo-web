import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';
import { CustomDemoForm } from '~/features/customConfig/validators/form';

export function DescriptionField() {
  const description = useController<CustomDemoForm>({
    name: 'content.description',
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
    >
      <TextField
        {...description.field}
        error={!!description.fieldState.error}
        helperText={
          description.fieldState.error?.message ||
          'Optional — defaults to empty'
        }
        label='Description'
        color='success'
        size='small'
        className='original'
      />
    </SectionAccordion>
  );
}
