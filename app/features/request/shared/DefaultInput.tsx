import { FC, forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

import { inputStyle } from '~/styles/input';

/**
 * A wrapper around the MUI TextField component to encapsulate some common defaults.
 * Primarily intended for use creating more specific Input components rather than for direct use.
 *
 * @param {TextFieldProps} props DefaultInput takes the same props as the MUI TextField component.
 * It sets default values for variant ('outlined') and margin ('normal').
 */
const DefaultInput: FC<TextFieldProps> = (
  { variant = 'outlined', margin = 'normal', ...props },
  ref: any
) => {
  return (
    <TextField
      inputRef={ref}
      {...inputStyle}
      variant={variant}
      margin={margin}
      fullWidth
      {...props}
    />
  );
};

export default forwardRef(DefaultInput as any);
