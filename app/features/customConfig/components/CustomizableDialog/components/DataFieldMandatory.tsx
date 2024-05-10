import { useController } from 'react-hook-form';
import { RadioGroup } from '@mui/material';
import { MandatoryEnum } from '@verifiedinc/core-types';

import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { CustomDemoForm } from '~/features/customConfig/validators/form';

export function DataFieldMandatory() {
  const credentialRequestField = useCredentialRequestField();
  const field = useController<CustomDemoForm>({
    name: `${credentialRequestField?.path as any}.mandatory` as any,
  });

  return (
    <DataFieldSection
      title='Optional or Required'
      description="Whether it's optional or required for the user to share this data"
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  mandatory?: enum\n}`}</pre>
        </>
      }
    >
      <RadioGroup
        value={field.field.value}
        onChange={(e) => {
          const value = e.target.value as MandatoryEnum;

          // Update form state
          field.field.onChange({ target: { value } });

          // Update array state
          credentialRequestField?.fieldArray.update(
            credentialRequestField?.index,
            {
              ...credentialRequestField.field,
              mandatory: value,
            }
          );
        }}
      >
        <RadioOption
          isDefault
          value={MandatoryEnum.NO}
          title='Optional'
          description='Optional for the user to share'
          tip={MandatoryEnum.NO}
        />
        <RadioOption
          value={MandatoryEnum.IF_AVAILABLE}
          title='Required if available'
          description='Required to share, if the user has it'
          tip={MandatoryEnum.IF_AVAILABLE}
        />
        <RadioOption
          value={MandatoryEnum.YES}
          title='Required'
          description="Required — flow fails if user doesn't have it"
          tip={MandatoryEnum.YES}
        />
      </RadioGroup>
    </DataFieldSection>
  );
}
