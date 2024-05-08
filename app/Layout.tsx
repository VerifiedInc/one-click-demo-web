import type { PropsWithChildren } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useBrand } from './hooks/useBrand';
import { useAppContext } from './context/AppContext';
import { FileBugButton } from './components/FileBugButton';
import { CustomizableDialog } from '~/features/customConfig/components/CustomizableDialog';

export default function Layout({ children }: PropsWithChildren) {
  const brand = useBrand();
  const appContext = useAppContext();
  const [searchParams] = useSearchParams();
  const isConfigHidden = searchParams.get('configOpen') === 'false';

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
      {!isConfigHidden && <CustomizableDialog />}
    </Box>
  );
}
