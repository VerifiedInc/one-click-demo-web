import { useController } from 'react-hook-form';
import { RadioGroup } from '@mui/material';

import { OneClickContentVerificationOptions } from '~/features/customConfig/types';
import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';

export function VerificationOptionsField() {
  const verificationOptions = useController<CustomDemoForm>({
    name: 'verificationOptions',
  });

  return (
    <SectionAccordion
      title='Verification Options'
      description='What options the SMS includes for the user to verify their phone number'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  verificationOptions?: enum\n}`}</pre>
        </>
      }
      sx={{
        '& .MuiAccordionDetails-root': {
          py: 0.5,
        },
      }}
    >
      <RadioGroup {...verificationOptions.field}>
        <RadioOption
          isDefault
          value={OneClickContentVerificationOptions.OnlyCode}
          title='Only code'
          description='Only a verification code (6 digit OTP)'
          tip={OneClickContentVerificationOptions.OnlyCode}
        />
        <RadioOption
          value={OneClickContentVerificationOptions.OnlyLink}
          title='Only link'
          description='Only a verification link (URL)'
          tip={OneClickContentVerificationOptions.OnlyLink}
        />
        <RadioOption
          value={OneClickContentVerificationOptions.BothLinkAndCode}
          title='Both code and link'
          description='Both a verification link and code'
          tip={OneClickContentVerificationOptions.BothLinkAndCode}
        />
      </RadioGroup>
    </SectionAccordion>
  );
}
