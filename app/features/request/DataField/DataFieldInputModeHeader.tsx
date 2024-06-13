import { Stack, SxProps } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

import { When } from '~/components/When';
import TextButton from '~/components/buttons/TextButton';
import { DataFieldLabel } from '~/features/request/DataField/DataFieldLabel';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

type DataFieldInputModeHeaderProps = {
  sx?: SxProps;
};

/**
 * Component that displays the header on input mode for a data field.
 * @constructor
 */
export function DataFieldInputModeHeader(
  props: Readonly<DataFieldInputModeHeaderProps>
) {
  const { credentialDisplayInfo, handleToggleEditModeCredential } =
    useCredentialsDisplayItem();
  const instancesLength = credentialDisplayInfo.instances.length;
  const isComposite = credentialDisplayInfo.children?.length;
  const hasMoreInstances = instancesLength > 1;

  if (!isComposite && !hasMoreInstances) return null;

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      spacing={1}
      mb={2}
      {...props}
    >
      <When value={isComposite}>
        <DataFieldLabel label={<DataFieldLabelText />} />
      </When>
      <When value={hasMoreInstances}>
        <TextButton
          startIcon={<ChevronLeft />}
          type='button'
          onClick={() => handleToggleEditModeCredential(false)}
          sx={{ alignSelf: 'flex-end', marginLeft: 'auto!important' }}
        >
          Back
        </TextButton>
      </When>
    </Stack>
  );
}
