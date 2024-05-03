import { useFormContext } from 'react-hook-form';
import { Paper, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';

import { RequiredLabel } from '~/components/RequiredLabel';
import { OriginalButton } from '~/components/OriginalButton';

import { CustomDemoForm } from '~/features/customConfig/validators/form';
import { SectionAccordion } from '~/features/customConfig/components/CustomizableDialog/components/SectionAccordion';
import { DataFieldAccordion } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldAccordion';

export function CredentialRequestsField() {
  const form = useFormContext<CustomDemoForm>();
  const credentialRequestsValues = form.watch('credentialRequests');

  return (
    <SectionAccordion
      defaultExpanded
      title='Data Fields'
      description='What data your brand will ask the user to share'
      tip={
        <>
          <pre>POST /1-click</pre>
          <pre>{`{\n  content?: {\n    credentialRequests?: CredentialRequest[] \n  }\n}`}</pre>
        </>
      }
    >
      <Stack spacing={2}>
        {credentialRequestsValues.map((credentialRequest) => (
          <Paper key={credentialRequest.type} sx={{ p: '0!important' }}>
            <DataFieldAccordion
              defaultExpanded
              title={<RequiredLabel>First Name</RequiredLabel>}
            />
          </Paper>
        ))}
        <OriginalButton
          size='small'
          variant='outlined'
          startIcon={<Add />}
          fullWidth
          sx={{ width: '100%' }}
        >
          Add Data Field
        </OriginalButton>
      </Stack>
    </SectionAccordion>
  );
}
