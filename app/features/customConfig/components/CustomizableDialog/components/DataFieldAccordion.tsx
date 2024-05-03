import { ReactNode, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { CheckCircle, ChevronLeft, Delete, Menu } from '@mui/icons-material';

import { DataFieldOptionType } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldOptionType';
import { DataFieldDescription } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldDescription';
import { DataFieldMandatory } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldMandatory';
import { DataFieldUserInput } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldUserInput';

type DataFieldAccordionProps = {
  defaultExpanded?: boolean;
  title: ReactNode;
};

export function DataFieldAccordion(props: DataFieldAccordionProps) {
  const { defaultExpanded, title } = props;
  const [expanded, setOpen] = useState(defaultExpanded);
  const theme = useTheme();
  const chevronClassName = 'chevron';

  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: 'none',
        '&::before': {
          display: 'none',
        },
        my: '0px !important',
        mt: 0,
        p: '8px !important',
      }}
    >
      <AccordionSummary
        onClick={() => setOpen((prev) => !prev)}
        expandIcon={
          <>
            <IconButton size='small'>
              <Delete
                fontSize='small'
                sx={{
                  transform: 'rotate(0deg)',
                }}
              />
            </IconButton>
            <Stack
              className={chevronClassName}
              sx={{ ml: 1, alignSelf: 'center' }}
            >
              <ChevronLeft
                fontSize='small'
                sx={{
                  color: '#0dbc3d',
                  transform: 'rotate(0deg)',
                }}
              />
            </Stack>
          </>
        }
        sx={{
          px: 0,
          minHeight: 'auto!important',
          '& .MuiAccordionSummary-content': {
            my: '0px !important',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            alignSelf: 'flex-start',
            transform: 'rotate(0deg) !important',
            [`& .${chevronClassName}`]: {
              transition: 'transform .3s',
            },
            '&.Mui-expanded': {
              [`& .${chevronClassName}`]: {
                transform: 'rotate(-90deg)',
              },
            },
          },
        }}
      >
        <Stack sx={{ alignItems: 'flex-start', mr: 0.5 }}>
          <Stack direction='column' alignItems='flex-start' spacing={0}>
            <Stack direction='row' alignItems='center' spacing={1}>
              <IconButton size='small' color='success'>
                <Menu />
              </IconButton>
              <Typography
                variant='body1'
                sx={{ fontSize: '16px', fontWeight: '800' }}
              >
                {title}
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={0.5} pl={5.25}>
              <CheckCircle
                sx={{ fontSize: '12px', color: theme.palette.text.disabled }}
              />
              <Typography
                variant='body1'
                color='text.disabled'
                sx={{ fontSize: '12px', fontWeight: '400' }}
              >
                Allow User Input
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <DataFieldOptionType />
          <DataFieldDescription />
          <DataFieldMandatory />
          <DataFieldUserInput />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
