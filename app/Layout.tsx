import { Alert, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useMemo, type PropsWithChildren } from 'react';

import { useBrand } from './hooks/useBrand';
import { useAppContext } from './context/AppContext';
import { FileBugButton } from './components/FileBugButton';

export default function Layout({ children }: PropsWithChildren) {
  const brand = useBrand();
  const appContext = useAppContext();

  const noticeLink = useMemo(() => {
    if (typeof window === 'undefined') return;

    if (appContext.config.noticeButtonLink) {
      const pageUrl = new URL(window.location.href);
      const brand = pageUrl.searchParams.get('brand');
      const switchBrand = pageUrl.searchParams.get('switchBrand');
      const url = new URL(appContext.config.noticeButtonLink);

      if (brand && switchBrand) {
        // Swap brand and switchBrand query params so that the user can swap it between them in different environments
        url.searchParams.set('brand', switchBrand);
        url.searchParams.set('switchBrand', brand);
      }

      return url.toString();
    }
  }, [appContext.config.noticeButtonLink]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container
        maxWidth='xs'
        sx={{
          position: 'relative',
          paddingX: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {appContext.config.noticeEnabled && (
          <Alert
            severity='info'
            sx={{
              mt: 2,
              color: 'text.secondary',
              a: { color: 'text.secondary' },
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: appContext.config.noticeText,
              }}
            />
            <br />
            <Button
              href={noticeLink || ''}
              variant='text'
              sx={{
                display: 'inline-block',
                mt: 0.5,
                color: 'text.secondary',
              }}
            >
              {appContext.config.noticeButtonText}
            </Button>
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4.5,
            mb: 2,
          }}
        >
          {brand.logo && (
            <img
              alt={`${brand.name} logo`}
              src={brand.logo}
              style={{ maxWidth: 80 }}
            />
          )}
        </Box>
        {children}
        <Box mb={3} mx='auto'>
          <FileBugButton />
        </Box>
      </Container>
    </Box>
  );
}
