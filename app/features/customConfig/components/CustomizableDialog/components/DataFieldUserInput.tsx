import { RadioGroup } from '@mui/material';

import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';

export function DataFieldUserInput() {
  const credentialRequestField = useCredentialRequestField();

  return (
    <DataFieldSection
      title='Allow User Input'
      description='Whether the user is allowed to add or edit data for this field'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  allowUserInput?: boolean\n}`}</pre>
        </>
      }
    >
      <RadioGroup
        value={credentialRequestField?.field.allowUserInput}
        onChange={(_, value) => {
          credentialRequestField?.fieldArray.update(
            credentialRequestField?.index,
            {
              ...credentialRequestField.field,
              allowUserInput: value === 'true',
            }
          );
        }}
      >
        <RadioOption
          isDefault
          value
          title='Yes'
          description='The user can add or edit data for the user to share'
          tip='true'
        />
        <RadioOption
          value={false}
          title='No'
          description="The user can't add or edit data"
          tip='false'
        />
      </RadioGroup>
    </DataFieldSection>
  );
}
