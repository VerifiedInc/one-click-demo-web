import { useTheme } from '@emotion/react';
import { Button, ButtonProps } from '@mui/material';

import { VerifiedIncLogo } from './VerifiedIncLogo';

type BookACallButtonProps = ButtonProps;

export function BookACallButton(props: BookACallButtonProps) {
  const theme = useTheme() as unknown as any;
  const defaultProps = theme.components.MuiButton.defaultProps;
  const href =
    'https://calendly.com/d/5fg-xmg-9r6/verified-inc-intro-call?text_color=000000&primary_color=0dbc3d';
  return (
    <Button
      {...defaultProps}
      href={href}
      {...props}
      sx={{
        ...defaultProps.sx,
        ...props.sx,
        alignSelf: 'center',
        display: 'flex',
        width: 'auto',
        minHeight: 30,
        fontFamily: ['"Lato"', 'sans-serif'].join(','),
        lineHeight: 1.75,
        backgroundColor: '#0dbc3d!important',
        color: '#fff!important',
        borderColor: '#0dbc3d!important',
        textAlign: 'center',
        fontSize: 13,
        borderRadius: 1,
        py: 0.5,
        pl: 1.75,
        pr: 1.25,
      }}
    >
      Book a Call with{' '}
      {/* <WhiteLogoGreenCheck
        height={16}
        width={16}
        flexShrink={0}
        ml={0.5}
        mr={0.25}
        position='relative'
        top={-1}
      />{' '}
      Verified{' '}
      <Box component='span' fontSize={10} ml={0.25} lineHeight={0.5}>
        Inc.
      </Box> */}
      <VerifiedIncLogo ml={0.5} />
    </Button>
  );
}
