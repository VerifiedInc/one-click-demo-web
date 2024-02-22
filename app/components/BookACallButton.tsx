import { useTheme } from '@emotion/react';
import { Button, ButtonProps } from '@mui/material';

import { WhiteLogoGreenCheck } from './WhiteLogoGreenCheck';

type BookACallButtonProps = ButtonProps;

export function BookACallButton(props: BookACallButtonProps) {
  const theme = useTheme() as unknown as any;
  console.log(theme.components.MuiButton);
  const defaultProps = theme.components.MuiButton.defaultProps;
  const href =
    'https://calendly.com/d/5fg-xmg-9r6/verified-inc-intro-call?text_color=000000&primary_color=0dbc3d';
  return (
    <Button
      {...defaultProps}
      href={href}
      {...props}
      startIcon={<WhiteLogoGreenCheck height={24} width={24} />}
      sx={{
        ...defaultProps.sx,
        ...props.sx,
        alignSelf: 'center',
        display: 'inline-flex',
        width: 'auto',
        fontFamily: ['"Lato"', 'sans-serif'].join(','),
        backgroundColor: '#0dbc3d!important',
        color: '#fff!important',
        borderColor: '#0dbc3d!important',
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'uppercase',
        borderRadius: 1,
      }}
    >
      Book a Call with Verified Inc.
    </Button>
  );
}
