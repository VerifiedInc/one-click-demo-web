import { useMemo } from 'react';
import { Button, ButtonProps, SxProps, useTheme } from '@mui/material';

export function OriginalButton({ children, ...props }: ButtonProps) {
  const theme = useTheme() as unknown as any;
  const defaultProps = theme.components.MuiButton.defaultProps;
  const sx: SxProps = useMemo(() => {
    let style: SxProps = {
      ...defaultProps.sx,
      ...props.sx,
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
    };

    if (!props.disabled) {
      style = {
        ...style,
        backgroundColor: '#0dbc3d!important',
        color: '#fff!important',
        borderColor: '#0dbc3d!important',
      };
    }

    if (props.variant === 'text') {
      style = {
        ...style,
        backgroundColor: 'transparent',
        color: `${theme.palette.text.disabled} !important`,
        borderColor: 'transparent',
      };
    }

    return style;
  }, [defaultProps.sx, props.disabled, props.sx]);

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
