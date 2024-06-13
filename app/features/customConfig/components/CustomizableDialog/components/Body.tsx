import { PropsWithChildren, useState } from 'react';
import { Stack, SxProps } from '@mui/material';
import { Box } from '@mui/system';
import { CodeOff } from '@mui/icons-material';

import { OriginalButton } from '~/components/OriginalButton';

export function Body({ children }: PropsWithChildren) {
  const [showCode, setShowCode] = useState(false);

  const renderCodeButton = () => {
    const buttonStyle: SxProps = {
      position: 'relative',
      top: { xs: '0', md: '22px' },
      transform: { xs: 'rotate(0deg)', md: 'rotate(90deg)' },
      whiteSpace: 'nowrap',
      mt: { xs: 0, md: 4 },
      width: { xs: '100%', md: 'auto' },
    };
    return (
      <OriginalButton
        variant='text'
        size='small'
        startIcon={<CodeOff />}
        sx={buttonStyle}
      >
        Hide Code
      </OriginalButton>
    );
  };

  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        '& .MuiPaper-root': {
          width: 'auto',
          borderRadius: '6px!important',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: '391px',
          width: '100%',
          pt: 4,
          pb: 2.5,
        }}
      >
        {children}
      </Box>
      <Stack
        sx={{
          width: { xs: 'auto', md: '50px' },
          alignSelf: 'stretch',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {renderCodeButton()}
      </Stack>
    </Stack>
  );
}
