import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronLeft, Info } from '@mui/icons-material';
import { ReactNode } from 'react';

type SectionAccordionProps = {
  children: ReactNode;
  expanded?: boolean;
  title: string;
  description?: string;
  tip?: ReactNode;
};

export function SectionAccordion(props: SectionAccordionProps) {
  const { children, expanded, title, description, tip } = props;
  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: 'none',
        '&::before': {
          display: 'none',
        },
        py: '0px !important',
        my: '0px !important',
      }}
    >
      <AccordionSummary
        expandIcon={
          <ChevronLeft
            fontSize='large'
            sx={{ color: '#0dbc3d', transform: 'rotate(0deg)' }}
          />
        }
        sx={{
          '& .MuiAccordionSummary-content': {
            my: '0px !important',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            '&.Mui-expanded': {
              transform: 'rotate(-90deg)',
            },
          },
        }}
      >
        <Stack sx={{ alignItems: 'flex-start' }}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Typography
              variant='body1'
              sx={{ fontSize: '20px', fontWeight: '800' }}
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
              sx={{ fontSize: '16px', fontWeight: '400' }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
