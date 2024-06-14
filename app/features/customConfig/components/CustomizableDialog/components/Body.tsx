import { PropsWithChildren, useEffect, useState } from 'react';
import { Stack, SxProps } from '@mui/material';
import { Box } from '@mui/system';
import { Code, CodeOff } from '@mui/icons-material';

import { OriginalButton } from '~/components/OriginalButton';
import { CodeBlock } from '~/features/customConfig/components/CustomizableDialog/components/CodeBlock';

export function Body({ children }: PropsWithChildren) {
  const [showCode, setShowCode] = useState(true);
  const [mount, setMount] = useState(false);

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
        startIcon={showCode ? <CodeOff /> : <Code />}
        sx={buttonStyle}
        onClick={() => setShowCode((prev) => !prev)}
      >
        {showCode ? 'Hide' : 'Show'} Code
      </OriginalButton>
    );
  };

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <Stack
      sx={{
        width: { xs: '100%', md: showCode ? '832px' : '100%' },
        flexDirection: { xs: 'column', md: 'row' },
        '& .MuiPaper-root': {
          width: 'auto',
          borderRadius: '6px!important',
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
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
          flexShrink: 0,
          width: { xs: 'auto', md: '50px' },
          alignSelf: 'stretch',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {renderCodeButton()}
      </Stack>
      {showCode && mount && <CodeBlock />}
    </Stack>
  );
}
