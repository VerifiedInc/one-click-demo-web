import { useController, useFormContext } from 'react-hook-form';
import { Box, RadioGroup, Stack, Typography } from '@mui/material';
import { PlayArrow, Tune } from '@mui/icons-material';

import { useBrand } from '~/hooks/useBrand';

import { CustomDemoForm } from '~/features/customConfig/validators/form';

import { useAppContext } from '~/context/AppContext';
import { OriginalButton } from '~/components/OriginalButton';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';

export function EnvironmentStep({
  onCustomizePress,
}: Readonly<{ onCustomizePress(): void }>) {
  const brand = useBrand();
  const appContext = useAppContext();

  const formContext = useFormContext<CustomDemoForm>();
  const environment = useController<CustomDemoForm>({ name: 'environment' });

  return (
    <>
      <Stack
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box
          component='img'
          src='horizontal-green-logo.svg'
          alt=''
          sx={{ width: '162px', aspectRatio: 1 }}
        />
        <Typography variant='h1' sx={{ mt: 3 }}>
          Live Demo
        </Typography>
        <Typography variant='h2' sx={{ mt: 2 }}>
          1-Click Signup for
          {brand.logo && (
            <Box
              component='img'
              src={brand.logo}
              alt={`${brand.name} logo`}
              sx={{ maxWidth: 34, mx: 1, transform: 'translateY(8px)' }}
            />
          )}
          Hooli
        </Typography>
        <Typography sx={{ mt: 3 }}>
          Experience the <i>fastest signup ever</i>. Sign up for Hooli with
          verified data in just 10 seconds.
        </Typography>
      </Stack>
      <SectionAccordion
        defaultExpanded
        title='Dummy or Real Data'
        tip={
          <>
            Sandbox: {appContext.config.dummyDataUrl}
            <br />
            Production: {appContext.config.realDataUrl}
          </>
        }
      >
        <RadioGroup {...environment.field}>
          <RadioOption
            value='sandbox'
            title='Dummy data (sandbox)'
            description='Random example data'
            tip={`Sandbox: ${appContext.config.dummyDataUrl}`}
          />
          <RadioOption
            value='production'
            title='Real, verified data (production)'
            description='Like SSN, DOB, Address, Name'
            tip={`Production: ${appContext.config.realDataUrl}`}
          />
        </RadioGroup>
      </SectionAccordion>
      <Stack>
        <OriginalButton
          sx={{ fontSize: '15px' }}
          startIcon={<PlayArrow />}
          disabled={!formContext.formState.isValid}
        >
          Start Demo
        </OriginalButton>
        <OriginalButton
          onClick={onCustomizePress}
          variant='text'
          sx={{ fontSize: '13px ', mt: 1.25 }}
          startIcon={<Tune />}
        >
          Customize Demo
        </OriginalButton>
      </Stack>
    </>
  );
}
