import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  ChevronLeft,
  Close,
  Delete,
  Menu,
} from '@mui/icons-material';
import { MandatoryEnum } from '@verifiedinc/core-types';

import { RequiredLabel } from '~/components/RequiredLabel';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { DataFieldOptionType } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldOptionType';
import { DataFieldDescription } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldDescription';
import { DataFieldMandatory } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldMandatory';
import { DataFieldUserInput } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldUserInput';
import { DataFieldDeleteModal } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldDeleteModal';
import { prettyField } from '~/utils/credential';

type DataFieldAccordionProps = {
  defaultExpanded?: boolean;
};

export function DataFieldAccordion(props: DataFieldAccordionProps) {
  const { defaultExpanded } = props;
  const credentialRequestField = useCredentialRequestField();
  const isNew: boolean = (credentialRequestField?.field as any).isNew;

  const [expanded, setOpen] = useState(defaultExpanded || isNew || false);
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const chevronClassName = 'chevron';

  const handleRemove = () => {
    if (!credentialRequestField) return;
    setModalOpen(false);
    credentialRequestField.fieldArray.remove(credentialRequestField.index);
  };

  const renderTitle = () => {
    const type = prettyField(credentialRequestField?.field.type || '');
    return (
      <Typography
        variant='body1'
        sx={{
          fontSize: '16px',
          fontWeight: '800',
          textAlign: 'left !important',
          alignSelf: 'flex-start',
        }}
      >
        {credentialRequestField?.field.mandatory !== MandatoryEnum.NO ? (
          <RequiredLabel>{type}</RequiredLabel>
        ) : (
          type
        )}
      </Typography>
    );
  };

  const renderUserInput = () => {
    const allowUserInput = credentialRequestField?.field?.allowUserInput;

    return (
      <Stack direction='row' alignItems='center' spacing={0.5} pl={5.25}>
        {allowUserInput ? (
          <CheckCircle
            sx={{ fontSize: '12px', color: theme.palette.text.disabled }}
          />
        ) : (
          <Close
            sx={{ fontSize: '12px', color: theme.palette.text.disabled }}
          />
        )}
        <Typography
          variant='body1'
          color='text.disabled'
          sx={{
            fontSize: '12px',
            fontWeight: '400',
            alignSelf: 'flex-start',
            textAlign: 'left!important',
          }}
        >
          Allow User Input
        </Typography>
      </Stack>
    );
  };

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
      data-testid='custom-demo-dialog-data-field-accordion'
    >
      <AccordionSummary
        onClick={() => setOpen((prev) => !prev)}
        expandIcon={
          <>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
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
              {renderTitle()}
            </Stack>
            {renderUserInput()}
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
      <DataFieldDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRemove}
      />
    </Accordion>
  );
}
