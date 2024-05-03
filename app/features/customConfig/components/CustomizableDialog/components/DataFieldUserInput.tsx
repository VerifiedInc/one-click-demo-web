import { RadioGroup } from '@mui/material';

import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';

export function DataFieldUserInput() {
  return (
    <DataFieldSection
      title='Allow User Input'
      description='Whether the user is allowed to add or edit data for this field'
    >
      <RadioGroup>
        <RadioOption
          isDefault
          value='true'
          title='Yes'
          description='The user can add or edit data for the user to share'
          tip='true'
        />
        <RadioOption
          value='false'
          title='No'
          description="The user can't add or edit data"
          tip='false'
        />
      </RadioGroup>
    </DataFieldSection>
  );
}
