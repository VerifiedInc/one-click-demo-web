import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { Tip } from '~/components/Tip';

type DataFieldSectionProps = {
  children: ReactNode;
  title: string;
  description?: string;
  tip?: ReactNode;
};

export function DataFieldSection(props: DataFieldSectionProps) {
  const { children, title, description, tip } = props;

  return (
    <Stack>
      <Stack direction='row' alignItems='center' spacing={0.5}>
        <Typography
          variant='body1'
          sx={{ fontSize: '16px', fontWeight: '700' }}
        >
          {title}
        </Typography>
        <Tip>{tip}</Tip>
      </Stack>
      {description && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            textAlign: 'left !important',
            fontSize: '12px',
            fontWeight: '400',
          }}
        >
          {description}
        </Typography>
      )}
      <Stack sx={{ mt: 3 }}>{children}</Stack>
    </Stack>
  );
}
