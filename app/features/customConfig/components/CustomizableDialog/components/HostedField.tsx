import { useController } from 'react-hook-form';
import { RadioGroup } from '@mui/material';

import { useBrand } from '~/hooks/useBrand';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';

export function HostedField() {
  const brand = useBrand();
  const isHosted = useController<CustomDemoForm>({
    name: 'isHosted',
  });

  return (
    <SectionAccordion
      title={`Verified UI or ${brand.name} UI`}
      description='Who builds and hosts the user interface'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  isHosted: boolean\n}`}</pre>
        </>
      }
    >
      <RadioGroup
        {...isHosted.field}
        onChange={(_, value) => {
          isHosted.field.onChange({ target: { value: value === 'true' } });
        }}
      >
        <RadioOption
          isDefault
          value
          title='Verified UI'
          description='Verified Inc. hosts the page'
          tip='true'
        />
        <RadioOption
          value={false}
          title={`${brand.name} UI`}
          description={`${brand.name} hosts the page`}
          tip='false'
        />
      </RadioGroup>
    </SectionAccordion>
  );
}
