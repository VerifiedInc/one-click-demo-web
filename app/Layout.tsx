import { PropsWithChildren, useMemo } from 'react';
import { useSearchParams } from '@remix-run/react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useBrand } from './hooks/useBrand';
import { FileBugButton } from './components/FileBugButton';
import { CustomizableDialog } from '~/features/customConfig/components/CustomizableDialog';

export default function Layout({ children }: PropsWithChildren) {
  const brand = useBrand();
  const [searchParams] = useSearchParams();
  const dummyBrand = searchParams.get('dummyBrand');
  const realBrand = searchParams.get('realBrand');
  const isConfigHidden = searchParams.get('configOpen') === 'false';

  const shouldShowDialog = useMemo(() => {
    // if (!dummyBrand && !realBrand) return false;
    return !isConfigHidden;
  }, [dummyBrand, isConfigHidden, realBrand]);

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
      {shouldShowDialog && <CustomizableDialog />}
    </Box>
  );
}
