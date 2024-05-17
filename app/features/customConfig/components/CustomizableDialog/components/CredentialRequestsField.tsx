import { useFieldArray, useFormContext } from 'react-hook-form';
import { Paper, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';

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
            <Paper
              sx={{
                p: '0!important',
                width: `calc(100% - ${level * 30}px)!important`,
                alignSelf: 'flex-end',
              }}
            >
              <DataFieldAccordion />
            </Paper>
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
          onClick={() =>
            fieldArray.append(buildDataFieldValue('', customConfig.schemas!))
          }
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
      <Stack spacing={2}>
        <CredentialRequestField />
      </Stack>
    </SectionAccordion>
  );
}
