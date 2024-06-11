import { Box } from '@mui/material';
import {
  CredentialDto,
  CredentialSchemaDto,
  PresentationRequestDto,
} from '@verifiedinc/core-types';

import CredentialsDisplayProvider from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import CredentialsDisplay from '~/features/request/CredentialsDisplay/CredentialsDisplay';

export function RequestBody({
  presentationRequest,
  credentials,
  schema,
}: {
  presentationRequest: PresentationRequestDto;
  credentials: CredentialDto[];
  schema: CredentialSchemaDto['schemas'];
}) {
  const content = () => (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
      sx={{ flex: 1, width: '100%' }}
    >
      <CredentialsDisplayProvider
        value={{
          credentialRequests: presentationRequest.credentialRequests,
          credentials,
          receiverName: undefined,
          schema: { schemas: schema },
        }}
      >
        <CredentialsDisplay />
      </CredentialsDisplayProvider>
    </Box>
  );

  return (
    <Box
      display='flex'
      flex={1}
      sx={{
        // Traverse the card image elements to apply flex to them.
        '& > div, & > div > div': {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        },
      }}
    >
      {content()}
    </Box>
  );
}
