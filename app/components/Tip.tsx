import { PropsWithChildren } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Code } from '@mui/icons-material';

export function Tip({ children }: PropsWithChildren) {
  return (
    <Tooltip title={children} arrow>
      <IconButton
        size='small'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Code />
      </IconButton>
    </Tooltip>
  );
}
