import { useMemo } from 'react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { Link, useSearchParams } from '@remix-run/react';
import { Box, Typography, Stack, TextField, Button } from '@mui/material';

import { getOneClickUseCase } from '~/features/oneClick/useCases/getOneClickUseCase';
import { usePersonalInformationFields } from '~/features/personalInformation/hooks/usePersonalInformationFields';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const oneClick = await getOneClickUseCase({ request });

  if (oneClick?.success) return json(oneClick.success);

  // No credentials found, so user should be redirected to the register page.
  return redirect('/register' + searchParams.toString());
};

export default function Account() {
  const { fields } = usePersonalInformationFields();

  const [searchParams] = useSearchParams();
  const dashboardPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        My Account
      </Typography>
      <Stack
        direction='column'
        spacing={2}
        my={2}
        mt={4}
        width='100%'
        position='relative'
      >
        {Object.values(fields).map((field) => {
          if (!field.value) return null;
          const isSSN = field.name === 'ssn';
          const fieldValue = isSSN
            ? '•••-••-' + field.value.slice(0, 5)
            : field.value;
          return (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              value={fieldValue}
              onChange={field.change}
              InputProps={{ readOnly: true }}
              sx={{
                width: '100%',
                fieldset: { display: 'none', pointerEvents: 'none' },
              }}
            />
          );
        })}
        <Link to={dashboardPageLink}>
          <Button fullWidth>Go Back</Button>
        </Link>
      </Stack>
    </Box>
  );
}
