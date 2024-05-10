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
    >
      <RadioGroup {...title.field}>
        <RadioOption
          isDefault
          value={OneClickContentTitle.Signup}
          title={OneClickContentTitle.Signup}
          description='"1-Click Signup"'
          tip='Signup'
        />
        <RadioOption
          value={OneClickContentTitle.Signin}
          title={OneClickContentTitle.Signin}
          description='"1-Click Signin"'
          tip='Signin'
        />
        <RadioOption
          value={OneClickContentTitle.Verify}
          title={OneClickContentTitle.Verify}
          description='"1-Click Verify"'
          tip='Verify'
        />
        <RadioOption
          value={OneClickContentTitle.Apply}
          title={OneClickContentTitle.Apply}
          description='"1-Click Apply"'
          tip='Apply'
        />
      </RadioGroup>
    </SectionAccordion>
  );
}
