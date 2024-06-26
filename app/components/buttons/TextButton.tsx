import { ButtonProps } from '@mui/material';

import DefaultButton from './DefaultButton';
import { ForwardedRef, forwardRef } from 'react';

/**
 * A button designed to look like grey text
 * subtly indicates an available action
 *
 * TextButton is an abstraction over the MUI Button component
 * encapsulating props shared by buttons of this type.
 * See the Button component docs for props, options, etc. https://mui.com/components/buttons/
 *
 * @param children
 * @param type
 * @param variant
 * @param size
 * @param color
 * @param {ButtonProps} props TextButton takes the same props as the MUI button component
 * @param ref
 */
const TextButtonComponent = (
  {
    children,
    type = 'button',
    variant = 'text',
    size = 'small',
    color = 'neutral',
    ...props
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return (
    <DefaultButton
      ref={ref}
      type={type}
      variant={variant}
      size={size}
      color={color}
      {...props}
    >
      {children}
    </DefaultButton>
  );
};
const TextButton = forwardRef(TextButtonComponent);

export default TextButton;
