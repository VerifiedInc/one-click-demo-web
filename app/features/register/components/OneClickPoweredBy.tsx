import { Box } from '@mui/material';

export function OneClickPoweredBy() {
  return (
    <Box
      component='img'
      src='/1-click-powered-by.svg'
      alt='1-Click Signup powered by Verified Inc.'
      px={4}
      mt={2}
      width='100%'
      sx={{ textAlign: 'center' }}
    />
  );
}
