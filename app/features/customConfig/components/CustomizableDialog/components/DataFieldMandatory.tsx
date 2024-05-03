import { MandatoryEnum } from '@verifiedinc/core-types';
import { RadioGroup } from '@mui/material';

import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { DataFieldSection } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldSection';

export function DataFieldMandatory() {
  return (
    <DataFieldSection
      title='Optional or Required'
      description="Whether it's optional or required for the user to share this data"
    >
      <RadioGroup>
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
