import { useMemo } from 'react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import {
  Box,
  Button,
  Stack,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';

import { useBrand } from '~/hooks/useBrand';
import { usePersonalInformationFields } from '~/features/personalInformation/hooks/usePersonalInformationFields';
import { PersonalInformationLoader } from '~/features/personalInformation/types';
import { getOneClickUseCase } from '~/features/oneClick/useCases/getOneClickUseCase';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const oneClick = await getOneClickUseCase({ request });

  if (oneClick?.success) return json(oneClick.success);

  // No credentials found, so user should be redirected to the register page.
  return redirect('/register' + searchParams.toString());
};

export default function PersonalInformation() {
  const brand = useBrand();
  const { fields, isValid, requiredFields } = usePersonalInformationFields();
  const { oneClickDB } = useLoaderData<PersonalInformationLoader>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const dashboardPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  const fieldSx: SxProps = { width: '100%' };
  const buttonContainerSx: SxProps = {
    position: 'sticky',
    bottom: 0,
    py: 2,
    zIndex: 2,
    background:
      'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 1) 35%)',
  };

  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    if (!oneClickDB.presentationRequest.brand.clientUrl) {
      return dashboardPageLink;
    }

    const url = new URL(window.location.href);
    const _redirectUrl = new URL(
      oneClickDB.presentationRequest.brand.clientUrl
    );
    const optedOut = url.searchParams.get('optedOut');
    const verificationOptions = url.searchParams.get('verificationOptions');
    const isHosted = url.searchParams.get('isHosted');

    _redirectUrl.searchParams.set('1ClickUuid', oneClickDB.uuid);

    if (optedOut) {
      _redirectUrl.searchParams.set('optedOut', optedOut);
    }

    if (verificationOptions) {
      _redirectUrl.searchParams.set('verificationOptions', verificationOptions);
    }

    if (isHosted) {
      _redirectUrl.searchParams.set('isHosted', isHosted);
    }

    return _redirectUrl.toString();
  }, [oneClickDB]);

  const isRequired = (fieldName: string) => requiredFields.includes(fieldName);

  const handleGetStarted = () => {
    if (typeof window === 'undefined') {
      navigate(dashboardPageLink);
      return;
    }
    window.location.href = redirectUrl;
  };

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        {brand.name}
      </Typography>
      <Typography
        variant='h3'
        mt={2.5}
        mb={1}
        fontWeight={400}
        textAlign='center'
      >
        Please fill the information below to get started
      </Typography>
      <Stack
        direction='column'
        spacing={2}
        mb={0}
        mt={4}
        width='100%'
        position='relative'
      >
        {Object.values(fields).map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label + (isRequired(field.name) ? ' *' : '')}
            value={field.value}
            onChange={field.change}
            error={!!field.error}
            helperText={field.error}
            sx={fieldSx}
          />
        ))}
        <Box sx={buttonContainerSx}>
          <Button onClick={handleGetStarted} fullWidth disabled={!isValid}>
            Get Started
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
