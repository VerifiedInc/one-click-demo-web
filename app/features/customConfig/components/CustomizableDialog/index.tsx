import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, SxProps } from '@mui/material';

import { EnvironmentStep } from '~/features/customConfig/components/CustomizableDialog/components/EnvironmentStep';
import {
  CustomDemoForm,
  customDemoFormSchema,
} from '~/features/customConfig/validators/form';
import { mapFormState } from '~/features/customConfig/mappers/mapFormState';
import { useState } from 'react';
import { CustomizeStep } from '~/features/customConfig/components/CustomizableDialog/components/CustomizeStep';

const dialogStyle: SxProps = {
  '& .MuiPaper-root': {
    maxWidth: '391px',
    width: '100%',
    borderRadius: '6px!important',
    pt: 4,
    pb: 2.5,
  },
  '& .MuiTypography-root': {
    fontFamily: 'Lato !important',
    textAlign: 'center',
  },
  '& .MuiTypography-h1': {
    fontSize: '34px',
    fontWeight: '800!important',
  },
  '& .MuiTypography-h2': {
    fontWeight: '800!important',
  },
};

export function CustomizableDialog() {
  const [showDetailStep, setShowDetailStep] = useState(false);
  const form = useForm<CustomDemoForm>({
    resolver: zodResolver(customDemoFormSchema),
    defaultValues: mapFormState({}),
    mode: 'all',
  });

  return (
    <Dialog
      open
      onClose={() => {
        console.log('should close');
      }}
      sx={dialogStyle}
    >
      <FormProvider {...form}>
        {!showDetailStep && (
          <EnvironmentStep onCustomizePress={() => setShowDetailStep(true)} />
        )}
        {showDetailStep && (
          <CustomizeStep onBackPress={() => setShowDetailStep(false)} />
        )}
      </FormProvider>
    </Dialog>
  );
}
