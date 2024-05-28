import { useController, useFormContext } from 'react-hook-form';
import { RadioGroup } from '@mui/material';

import { useBrand } from '~/hooks/useBrand';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';
import { OneClickContentTitle } from '~/features/customConfig/types';

export function HostedField() {
  const brand = useBrand();
  const isHosted = useController<CustomDemoForm>({
    name: 'isHosted',
  });
  const form = useFormContext<CustomDemoForm>();

  return (
    <SectionAccordion
      title={`Verified UI or ${brand.name} UI`}
      description='Who builds and hosts the user interface'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  isHosted?: boolean\n}`}</pre>
        </>
      }
      sx={{
        '& .MuiAccordionDetails-root': {
          py: 0.5,
        },
      }}
      data-testid='custom-demo-dialog-hosted-accordion'
    >
      <RadioGroup
        value={isHosted.field.value}
        onChange={(_, value) => {
          const isHostedValue = value === 'true';
          isHosted.field.onChange({ target: { value: isHostedValue } });

          if (!isHostedValue) {
            const url = new URL(window.location.href);
            form.setValue('content.title', OneClickContentTitle.Signup);
            form.setValue('content.description', '');
            form.setValue('redirectUrl', `${url.origin}/register`, {
              shouldValidate: true,
            });
          }
        }}
      >
        <RadioOption
          isDefault
          value
          title='Verified UI'
          description='Verified Inc. hosts the page'
          tip='true'
          inputProps={
            { 'data-testid': 'custom-demo-dialog-hosted-radio' } as any
          }
        />
        <RadioOption
          value={false}
          title={`${brand.name} UI`}
          description={`${brand.name} hosts the page`}
          tip='false'
          inputProps={
            { 'data-testid': 'custom-demo-dialog-non-hosted-radio' } as any
          }
        />
      </RadioGroup>
    </SectionAccordion>
  );
}
