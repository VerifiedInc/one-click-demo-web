import { useController } from 'react-hook-form';
import { RadioGroup } from '@mui/material';

import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { OneClickContentTitle } from '~/features/customConfig/types';

export function TitleField() {
  const title = useController<CustomDemoForm>({
    name: 'content.title',
  });
  const isHosted = useController<CustomDemoForm>({
    name: 'isHosted',
  });

  return (
    <SectionAccordion
      title='1-Click Language'
      description='What word appears after "1-Click" on the hosted page, in the title and CTA button'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  content?: {\n    title?: enum \n  }\n}`}</pre>
        </>
      }
      sx={{
        opacity: isHosted.field.value ? 1 : 0.5,
        '& .MuiAccordionDetails-root': {
          py: 0.5,
        },
      }}
      data-testid='custom-demo-dialog-title-accordion'
    >
      <RadioGroup {...title.field}>
        <RadioOption
          isDefault
          value={OneClickContentTitle.Signup}
          title={OneClickContentTitle.Signup}
          description='"1-Click Signup"'
          tip='Signup'
          disabled={!isHosted.field.value}
        />
        <RadioOption
          value={OneClickContentTitle.Login}
          title={OneClickContentTitle.Login}
          description='"1-Click Login"'
          tip='Login'
          disabled={!isHosted.field.value}
        />
        <RadioOption
          value={OneClickContentTitle.Verify}
          title={OneClickContentTitle.Verify}
          description='"1-Click Verify"'
          tip='Verify'
          disabled={!isHosted.field.value}
        />
        <RadioOption
          value={OneClickContentTitle.Apply}
          title={OneClickContentTitle.Apply}
          description='"1-Click Apply"'
          tip='Apply'
          disabled={!isHosted.field.value}
        />
        <RadioOption
          value={OneClickContentTitle.Access}
          title={OneClickContentTitle.Access}
          description='"1-Click Access"'
          tip='Access'
          disabled={!isHosted.field.value}
        />
      </RadioGroup>
    </SectionAccordion>
  );
}
