import { Box, Typography } from '@mui/material';

import { isRequiredCredentialDisplayInfo } from '~/features/request/CredentialsDisplay/utils';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

type DataFieldLabelTextProps = {
  prefix?: string;
  hideRequired?: boolean;
};

/**
 * Component to display a credential label text, when required it renders an asterisk.
 * @constructor
 */
export function DataFieldLabelText(props: DataFieldLabelTextProps) {
  const { credentialDisplayInfo } = useCredentialsDisplayItem();

  if (
    isRequiredCredentialDisplayInfo({
      required: credentialDisplayInfo.credentialRequest?.required,
      mandatory: credentialDisplayInfo.credentialRequest?.mandatory,
    })
  ) {
    return (
      <Box
        component='span'
        sx={{
          display: 'block',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whitespace: 'pre',
        }}
      >
        {(props.prefix ?? '') + credentialDisplayInfo.label}{' '}
        {!props.hideRequired && (
          <Typography
            component='span'
            color='error'
            variant='subtitle2'
            sx={{ fontSize: 'inherit' }}
          >
            ✽
          </Typography>
        )}
      </Box>
    );
  }

  return <>{(props.prefix ?? '') + credentialDisplayInfo.label}</>;
}
