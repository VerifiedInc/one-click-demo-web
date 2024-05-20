import { useMemo } from 'react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { useNavigate, useSearchParams } from '@remix-run/react';
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
import { getOneClickUseCase } from '~/features/oneClick/useCases/getOneClickUseCase';
import { InputMask } from '~/components/InputMask';

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const oneClick = await getOneClickUseCase({ context, request });

  if (oneClick?.success) return json(oneClick.success);

  // No credentials found, so user should be redirected to the register page.
  return redirect('/register' + searchParams.toString());
};

export default function PersonalInformation() {
  const brand = useBrand();
  const { fields, isValid, requiredFields } = usePersonalInformationFields();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const dashboardPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  const successPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/verified${searchParamsString ? `?${searchParamsString}` : ''}`;
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

  const isRequired = (fieldName: string) => requiredFields.includes(fieldName);

  const handleGetStarted = () => {
    if (typeof window === 'undefined') {
      navigate(dashboardPageLink);
      return;
    }
    navigate(successPageLink);
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
        {Object.values(fields).map((field) => {
          const maskOptions = (field as any)?.maskOptions;
          return (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label + (isRequired(field.name) ? ' *' : '')}
              value={field.value}
              onChange={field.change}
              error={!!field.error}
              helperText={field.error}
              sx={fieldSx}
              InputProps={{
                inputComponent: maskOptions ? (InputMask as any) : undefined,
              }}
              inputProps={{ ...maskOptions }}
            />
          );
        })}
        <Box sx={buttonContainerSx}>
          <Button onClick={handleGetStarted} fullWidth disabled={!isValid}>
            Get Started
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
