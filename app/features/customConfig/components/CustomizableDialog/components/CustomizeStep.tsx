import { useFormContext } from 'react-hook-form';
import { IconButton, Stack, Typography } from '@mui/material';
import { ArrowBack, PlayArrow } from '@mui/icons-material';

import { OriginalButton } from '~/components/OriginalButton';
import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { RedirectUrlField } from '~/features/customConfig/components/CustomizableDialog/components/RedirectUrlField';
import { DescriptionField } from '~/features/customConfig/components/CustomizableDialog/components/DescriptionField';
import { TitleField } from '~/features/customConfig/components/CustomizableDialog/components/TitleField';
import { HostedField } from '~/features/customConfig/components/CustomizableDialog/components/HostedField';
import { VerificationOptionsField } from '~/features/customConfig/components/CustomizableDialog/components/VerificationOptionsField';
import { CredentialRequestsField } from '~/features/customConfig/components/CustomizableDialog/components/CredentialRequestsField';

export function CustomizeStep({
  onBackPress,
}: Readonly<{ onBackPress(): void }>) {
  const formContext = useFormContext<CustomDemoForm>();

  return (
    <>
      <Stack sx={{ width: '100%', position: 'relative' }}>
        <IconButton
          onClick={onBackPress}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            my: 'auto',
            width: '51px',
            height: 'auto',
            flexShrink: 0,
            aspectRatio: '1',
            ml: 0.5,
          }}
        >
          <ArrowBack fontSize='large' />
        </IconButton>
        <Typography variant='h2'>Customize Demo</Typography>
      </Stack>
      <CredentialRequestsField />
      <VerificationOptionsField />
      <HostedField />
      <TitleField />
      <DescriptionField />
      <RedirectUrlField />
      <Stack>
        <OriginalButton
          type='submit'
          sx={{ fontSize: '15px' }}
          startIcon={<PlayArrow />}
          disabled={!formContext.formState.isValid}
        >
          Start Demo
        </OriginalButton>
      </Stack>
    </>
  );
}
