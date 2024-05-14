import { useController, useFormContext } from 'react-hook-form';
import { Box, RadioGroup, Stack, Typography } from '@mui/material';
import { PlayArrow, Tune } from '@mui/icons-material';

import { useBrand } from '~/hooks/useBrand';

import { CustomDemoForm } from '~/features/customConfig/validators/form';

import { OriginalButton } from '~/components/OriginalButton';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { RadioOption } from '~/features/customConfig/components/CustomizableDialog/components/RadioOption';

export function EnvironmentStep({
  onCustomizePress,
}: Readonly<{ onCustomizePress(): void }>) {
  const brand = useBrand();

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
          {brand.name}
        </Typography>
        <Typography sx={{ mt: 3 }}>
          Experience the <i>fastest signup ever</i>. Sign up for {brand.name}{' '}
          with verified data in just 10 seconds.
        </Typography>
      </Stack>
      <SectionAccordion
        defaultExpanded
        title='Dummy or Real Data'
        tip={
          <>
            Sandbox
            <br />
            Production
          </>
        }
        sx={{
          '& .MuiAccordionDetails-root': {
            py: 0,
          },
        }}
      >
        <RadioGroup {...environment.field}>
          <RadioOption
            value='dummy'
            title='Dummy data (sandbox)'
            description='Random example data'
            tip='Sandbox'
          />
          <RadioOption
            value='real'
            title='Real, verified data (production)'
            description='Like SSN, DOB, Address, Name'
            tip='Production'
          />
        </RadioGroup>
      </SectionAccordion>
      <Stack>
        <OriginalButton
          type='submit'
          sx={{ fontSize: '15px' }}
          startIcon={<PlayArrow />}
          disabled={
            !environment.field.value || formContext.formState.isSubmitting
          }
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
