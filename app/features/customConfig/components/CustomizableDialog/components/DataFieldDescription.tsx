import { TextField } from '@mui/material';

import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';

export function DataFieldDescription() {
  return (
    <DataFieldSection
      title='Field Description'
      description='What text appears under the field'
    >
      <TextField
        label='description'
        color='success'
        size='small'
        className='original'
        helperText='Optional — defaults to empty'
      />
    </DataFieldSection>
  );
}
