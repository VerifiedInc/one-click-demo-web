import {
  Dialog,
  FormControl,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { useBrand } from '~/hooks/useBrand';
import { SectionAccordion } from '~/components/CustomizableDialog/components/SectionAccordion';
import { OriginalButton } from '~/components/OriginalButton';
import { PlayArrow, Tune } from '@mui/icons-material';
import { RadioOption } from '~/components/CustomizableDialog/components/RadioOption';

export function CustomizableDialog() {
  const brand = useBrand();
  return (
    <Dialog
      open
      onClose={() => {
        console.log('should close');
      }}
      sx={{
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
      }}
    >
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
        expanded
        title='Dummy or Real Data'
        tip={
          <>
            Sandbox: https://core-api.sandbox-verifiedinc.com
            <br />
            Production: https://core-api.verified.inc
          </>
        }
      >
        <FormControl>
          <RadioGroup>
            <RadioOption
              name='environment'
              value='sandbox'
              title='Dummy data (sandbox)'
              description='Random example data'
              tip='Sandbox: https://core-api.sandbox-verifiedinc.com'
            />
            <RadioOption
              name='environment'
              value='production'
              title='Real, verified data (production)'
              description='Like SSN, DOB, Address, Name'
              tip='Production: https://core-api.verified.inc'
            />
          </RadioGroup>
        </FormControl>
      </SectionAccordion>
      <Stack>
        <OriginalButton sx={{ fontSize: '15px' }} startIcon={<PlayArrow />}>
          Start Demo
        </OriginalButton>
        <OriginalButton
          variant='text'
          sx={{ fontSize: '13px ', mt: 1.25 }}
          startIcon={<Tune />}
        >
          Customize Demo
        </OriginalButton>
      </Stack>
    </Dialog>
  );
}
