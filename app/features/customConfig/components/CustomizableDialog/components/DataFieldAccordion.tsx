import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Paper,
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
import { useDrag, useDrop } from 'react-dnd';
import { useFormContext } from 'react-hook-form';

import { prettyField } from '~/utils/credential';

import { RequiredLabel } from '~/components/RequiredLabel';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { DataFieldOptionType } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldOptionType';
import { DataFieldDescription } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldDescription';
import { DataFieldMandatory } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldMandatory';
import { DataFieldUserInput } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldUserInput';
import { DataFieldDeleteModal } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldDeleteModal';

type DataFieldAccordionProps = {
  defaultExpanded?: boolean;
};

export function DataFieldAccordion(props: DataFieldAccordionProps) {
  const { defaultExpanded } = props;
  const credentialRequestField = useCredentialRequestField();
  const formContext = useFormContext<CustomDemoForm>();
  const credentialRequests = formContext.watch('credentialRequests');
  const isNew: boolean = (credentialRequestField?.field as any).isNew;

  const [expanded, setOpen] = useState(defaultExpanded || isNew || false);
  const [modalOpen, setModalOpen] = useState(false);

  const accordionRef = useRef<HTMLDivElement | null>(null);

  const fieldType = credentialRequestField?.field.type;
  const type = prettyField(fieldType || 'Choose a type...');

  const theme = useTheme();
  const chevronClassName = 'chevron';

  const canDrop = useCallback(
    (item: typeof credentialRequestField) => {
      const source = item;
      const target = credentialRequestField;

      if (!source || !target) return false;

      const getParentPath = (path: string) =>
        path.split('.').slice(0, -2).join('.');

      const sourcePath = getParentPath((source?.path as string) || '');
      const targetPath = getParentPath((target?.path as string) || '');
      const isSameGroup = sourcePath === targetPath;

      const fromLevel = source.level as number;
      const fromIndex = source.index as number;
      const toLevel = target.level as number;
      const toIndex = target.index as number;

      // Allow to drop only on the same level and different index
      if (fromLevel !== toLevel || fromIndex === toIndex || !isSameGroup) {
        return false;
      }

      return true;
    },
    [credentialRequestField]
  );

  const [{ opacity }, drag, preview] = useDrag(
    () => ({
      type: 'data-field-drag',
      item: () => credentialRequestField,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0 : 1,
      }),
    }),
    [credentialRequestField, credentialRequests]
  );

  const [{ opacity: dropOpacity }, drop] = useDrop(
    () => ({
      accept: 'data-field-drag',
      canDrop(item) {
        return canDrop(item as typeof credentialRequestField);
      },
      drop(item) {
        const source = item as typeof credentialRequestField;
        const target = credentialRequestField;

        if (!source || !target) return;
        if (!canDrop(source)) return;

        const fromIndex = source.index as number;
        const toIndex = target.index as number;

        credentialRequestField.fieldArray.move(fromIndex, toIndex);
      },
      collect: (monitor) => {
        if (monitor.isOver()) {
          return {
            opacity: monitor.canDrop() ? 0.4 : 1,
          };
        }
        return {
          opacity: 1,
        };
      },
    }),
    [credentialRequestField, credentialRequests]
  );

  const handleRemove = () => {
    if (!credentialRequestField) return;
    setModalOpen(false);
    credentialRequestField.fieldArray.remove(credentialRequestField.index);
  };

  const renderTitle = () => {
    const typographyStyle = {
      fontStyle: fieldType ? 'normal' : 'italic',
      fontSize: '16px',
      fontWeight: '800',
      textAlign: 'left !important',
      alignSelf: 'flex-start',
    };

    return (
      <Typography variant='body1' sx={typographyStyle}>
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

  useEffect(() => {
    if (!isNew) return;
    accordionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isNew]);

  return (
    <Stack
      ref={drop}
      sx={{ position: 'relative', width: '100%', opacity: dropOpacity }}
    >
      <Paper
        ref={(element) => preview(element)}
        sx={{
          p: '0!important',
          width: `calc(100% - ${
            (credentialRequestField?.level || 0) * 30
          }px)!important`,
          alignSelf: 'flex-end',
          opacity,
        }}
      >
        <Box>
          <Accordion
            defaultExpanded={isNew}
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
                    data-testid='custom-demo-dialog-data-field-delete-button'
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
                    <IconButton
                      ref={drag}
                      size='small'
                      color='success'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      sx={{ cursor: 'grab' }}
                    >
                      <Menu />
                    </IconButton>
                    {renderTitle()}
                  </Stack>
                  {renderUserInput()}
                </Stack>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 3 }}>
              {expanded && (
                <Stack spacing={2}>
                  <DataFieldOptionType />
                  <DataFieldDescription />
                  <DataFieldMandatory />
                  <DataFieldUserInput />
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
      <DataFieldDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRemove}
      />
    </Stack>
  );
}
