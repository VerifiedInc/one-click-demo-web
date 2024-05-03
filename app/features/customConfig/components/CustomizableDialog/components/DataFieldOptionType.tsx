import { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';
import { useCustomConfig } from '~/features/customConfig/contexts/CustomConfig';

export function DataFieldOptionType() {
  const { schemas } = useCustomConfig();

  const schemaValues = useMemo(() => {
    if (!schemas) return [];
    return Object.values(schemas)
      .map((schema) => ({
        label: schema.$id,
        value: schema.$id,
      }))
      .sort((a, b) => (a.label < b.label ? -1 : 1));
  }, [schemas]);

  return (
    <DataFieldSection
      title='Field Type'
      description='What type of user data this field is for'
    >
      <Autocomplete
        disablePortal
        options={schemaValues}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label='Type'
            color='success'
            size='small'
            className='original'
          />
        )}
        disabled={schemas === null}
      />
    </DataFieldSection>
  );
}
