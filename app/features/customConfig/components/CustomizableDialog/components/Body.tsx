import { PropsWithChildren, useEffect, useState } from 'react';
import { IconButton, Stack, SxProps } from '@mui/material';
import { Box } from '@mui/system';
import { Code, CodeOff, Share } from '@mui/icons-material';

import { OriginalButton } from '~/components/OriginalButton';
import { CodeBlock } from '~/features/customConfig/components/CustomizableDialog/components/CodeBlock';
import { useShareDemo } from '~/features/share/hooks/useShareDemo';

export function Body({ children }: PropsWithChildren) {
  const [showCode, setShowCode] = useState(false);
  const [mount, setMount] = useState(false);
  const { handleShareDemo } = useShareDemo();

  const renderCodeButton = () => {
    const buttonStyle: SxProps = {
      position: 'relative',
      top: { xs: '0', md: '22px' },
      transform: { xs: 'rotate(0deg)', md: 'rotate(90deg) translateX(32px)' },
      whiteSpace: 'nowrap',
      mt: { xs: 0, md: 0 },
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
        position: 'relative',
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
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          alignSelf: 'flex-start',
          flexShrink: 0,
          maxWidth: '391px',
          width: '100%',
          pb: 2.5,
        }}
      >
        <Stack sx={{ justifyContent: 'flex-end' }}>
          <IconButton
            onClick={handleShareDemo}
            sx={{
              width: '43px',
              height: '43px',
              flexShrink: 0,
              aspectRatio: '1',
              ml: 'auto',
              mr: 0.5,
              mt: 0.5,
              color: 'text.disabled',
            }}
          >
            <Share fontSize='small' />
          </IconButton>
        </Stack>
        {children}
      </Box>
      <Stack
        sx={{
          position: 'relative',
          alignSelf: 'stretch',
          backgroundColor: 'white',
        }}
      >
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            alignSelf: 'stretch',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }}
        >
          <Stack
            sx={{
              position: { xs: 'static', md: 'sticky' },
              top: 0,
              flexShrink: 0,
              width: { xs: 'auto', md: '50px' },
              alignSelf: 'stretch',
            }}
          >
            {renderCodeButton()}
          </Stack>
        </Box>
      </Stack>
      {showCode && mount && <CodeBlock />}
    </Stack>
  );
}
