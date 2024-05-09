import { useMemo } from 'react';
import { Button, ButtonProps, SxProps, useTheme } from '@mui/material';

export function OriginalButton({ children, ...props }: ButtonProps) {
  const theme = useTheme() as unknown as any;
  const defaultProps = theme.components.MuiButton.defaultProps;
  const sx: SxProps = useMemo(() => {
    let style: SxProps = {
      ...defaultProps.sx,
      alignSelf: 'center',
      display: 'flex',
      width: 'auto',
      minHeight: 30,
      fontFamily: ['"Lato"', 'sans-serif'].join(','),
      lineHeight: 1.75,
      textAlign: 'center',
      textTransform: 'uppercase !important',
      borderRadius: 1,
      py: 1,
      px: 3,
      ...props.sx,
    };

    if (!props.disabled) {
      style = {
        ...style,
        backgroundColor: '#0dbc3d!important',
        color: '#fff!important',
        borderColor: '#0dbc3d!important',
      };

      if (props.color === 'error') {
        style = {
          ...style,
          borderColor: `${theme.palette.error.main}!important`,
          backgroundColor: `${theme.palette.error.main}!important`,
        };
      }
    }

    if (props.variant === 'text') {
      style = {
        ...style,
        backgroundColor: 'transparent',
        color: `${theme.palette.text.disabled} !important`,
        borderColor: 'transparent',
      };
    }

    if (props.variant === 'outlined') {
      style = {
        ...style,
        backgroundColor: 'transparent',
        color: '#0dbc3d!important',
        borderColor: '#0dbc3d!important',
      };
    }

    if (props.size === 'small') {
      style = {
        ...style,
        minHeight: 20,
        py: 1,
        px: 2,
        fontSize: '16px',
      };
    }

    return style;
  }, [
    defaultProps.sx,
    props.disabled,
    props.size,
    props.sx,
    props.variant,
    theme.palette.text.disabled,
  ]);

  return (
    <Button
      {...defaultProps}
      {...props}
      sx={{
        ...defaultProps.sx,
        ...props.sx,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
