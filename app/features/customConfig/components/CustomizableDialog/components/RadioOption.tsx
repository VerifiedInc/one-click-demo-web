import { ReactNode } from 'react';
import {
  Chip,
  IconButton,
  Radio,
  RadioProps,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { Box } from '@mui/system';
import { Tip } from '~/components/Tip';

type RadioOptionProps = RadioProps & {
  isDefault?: boolean;
  title: string;
  description?: string;
  tip?: ReactNode;
};
export function RadioOption(props: RadioOptionProps) {
  const { isDefault, title, description, tip, ...radioProps } = props;
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Stack sx={{ alignItems: 'flex-start' }}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Radio
            {...radioProps}
            sx={{
              ...radioProps.sx,
              '&.Mui-checked': {
                color: '#0dbc3d',
              },
            }}
          />
          <Typography
            variant='body1'
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              textAlign: 'left !important',
            }}
          >
            {title}
          </Typography>
          <Tip>{tip}</Tip>
        </Stack>
        {description && (
          <Typography
            variant='body2'
            color='text.disabled'
            sx={{
              textAlign: 'left !important',
              alignSelf: 'flex-start',
              fontSize: '12px',
              fontWeight: '400',
              pl: 6.25,
            }}
          >
            {description}
          </Typography>
        )}
      </Stack>
      <Box sx={{ mt: 1, alignSelf: 'flex-start' }}>
        {isDefault && (
          <Chip
            size='small'
            label='Default'
            color='info'
            variant='outlined'
            sx={{ fontFamily: 'Lato' }}
          />
        )}
      </Box>
    </Stack>
  );
}
