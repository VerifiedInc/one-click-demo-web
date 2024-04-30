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
            sx={{ fontSize: '16px', fontWeight: '400' }}
          >
            {title}
          </Typography>
          <Tooltip title={tip}>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Stack>
        {description && (
          <Typography
            variant='body2'
            color='text.disabled'
            sx={{ fontSize: '12px', fontWeight: '400', pl: 6.25 }}
          >
            {description}
          </Typography>
        )}
      </Stack>
      <Box>
        {isDefault && (
          <Chip size='small' label='Default' color='info' variant='outlined' />
        )}
      </Box>
    </Stack>
  );
}
