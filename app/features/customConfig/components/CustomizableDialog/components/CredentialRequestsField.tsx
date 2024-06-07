import React from 'react';
import { Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { OriginalButton } from '~/components/OriginalButton';
import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { buildDataFieldValue } from '~/features/customConfig/components/CustomizableDialog/utils/buildDataFieldValue';
import { useCustomConfig } from '~/features/customConfig/contexts/CustomConfig';
import { CredentialRequestFieldProvider } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { DataFieldAccordion } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldAccordion';

function CredentialRequestField({
  path = 'credentialRequests',
  level = 0,
}: Readonly<{ path?: string; level?: number }>) {
  const customConfig = useCustomConfig();
  const form = useFormContext<CustomDemoForm>();
  const fieldArray = useFieldArray<CustomDemoForm>({
    control: form.control,
    name: path as any,
  });

  return (
    <>
      {fieldArray.fields.map((field, index) => {
        const _path = `${path}.${index}`;
        return (
          <CredentialRequestFieldProvider
            key={_path + field.type}
            path={_path}
            field={field}
            fieldArray={fieldArray}
            index={index}
            level={level}
          >
            <DataFieldAccordion />
            {Array.isArray(field.children) && (
              <CredentialRequestField
                key={`${_path}.children`}
                path={`${_path}.children`}
                level={level + 1}
              />
            )}
          </CredentialRequestFieldProvider>
        );
      })}
      {path === 'credentialRequests' && (
        <OriginalButton
          type='button'
          onClick={() => {
            fieldArray.append({
              ...buildDataFieldValue('', customConfig.schemas!),
              isNew: true,
            } as any);
          }}
          size='small'
          variant='outlined'
          startIcon={<Add />}
          fullWidth
          sx={{ width: '100%' }}
        >
          Add Data Field
        </OriginalButton>
      )}
    </>
  );
}

export function CredentialRequestsField() {
  return (
    <SectionAccordion
      defaultExpanded
      title='Data Fields'
      description='What data your brand will ask the user to share'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  credentialRequests?: CredentialRequest[]\n}`}</pre>
        </>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <Stack spacing={2}>
          <CredentialRequestField />
        </Stack>
      </DndProvider>
    </SectionAccordion>
  );
}
