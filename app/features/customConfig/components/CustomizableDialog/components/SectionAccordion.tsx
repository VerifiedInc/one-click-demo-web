import { ReactNode, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

import { Tip } from '~/components/Tip';

type SectionAccordionProps = {
  children: ReactNode;
  defaultExpanded?: boolean;
  title: string;
  description?: string;
  tip?: ReactNode;
  sx?: SxProps;
};

export function SectionAccordion(props: SectionAccordionProps) {
  const { children, defaultExpanded, title, description, tip } = props;
  const [expanded, setOpen] = useState(defaultExpanded || false);

  return (
    <Accordion
      expanded={expanded}
      sx={{
        ...props.sx,
        boxShadow: 'none',
        '&::before': {
          display: 'none',
        },
        py: '0px !important',
        my: '0px !important',
        mt: 2,
      }}
    >
      <AccordionSummary
        onClick={() => setOpen((prev) => !prev)}
        expandIcon={
          <ChevronLeft
            fontSize='large'
            sx={{
              color: '#0dbc3d',
              transform: 'rotate(0deg)',
            }}
          />
        }
        sx={{
          minHeight: 'auto!important',
          '& .MuiAccordionSummary-content': {
            my: '0px !important',
            alignSelf: 'flex-start',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            alignSelf: 'flex-start',
            '&.Mui-expanded': {
              transform: 'rotate(-90deg)',
            },
          },
        }}
      >
        <Stack sx={{ alignItems: 'flex-start', mr: 0.5 }}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Typography
              variant='body1'
              sx={{
                fontSize: '20px',
                fontWeight: '800',
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
                alignSelf: 'flex-start',
                textAlign: 'left!important',
                fontSize: '16px',
                fontWeight: '400',
              }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 3 }}>{children}</AccordionDetails>
    </Accordion>
  );
}
