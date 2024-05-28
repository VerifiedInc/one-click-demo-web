import {
  Dialog,
  DialogActions,
  DialogTitle,
  SxProps,
  Typography,
} from '@mui/material';
import { OriginalButton } from '~/components/OriginalButton';

const dialogStyle: SxProps = {
  '& .MuiPaper-root': {
    maxWidth: '391px',
    width: '100%',
    borderRadius: '6px!important',
    pt: 0,
    pb: 2.5,
  },
  '& .MuiTypography-root': {
    fontFamily: 'Lato !important',
    textAlign: 'center',
  },
  '& .MuiTypography-h1': {
    fontSize: '34px',
    fontWeight: '800!important',
  },
  '& .MuiTypography-h2': {
    fontWeight: '800!important',
  },
};

const buttonStyle: SxProps = {
  minHeight: 20,
  mt: 2,
  py: 1,
  px: 1.25,
  fontWeight: '800',
  fontSize: '13px',
};

type DataFieldDeleteModalProps = {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
};

export function DataFieldDeleteModal({
  open,
  onClose,
  onConfirm,
}: DataFieldDeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose} sx={dialogStyle}>
      <DialogTitle sx={{ fontWeight: '800' }}>Delete Data Field?</DialogTitle>
      <Typography
        textAlign='left'
        alignSelf='flex-start'
        fontSize='16px'
        fontWeight='400'
        px={3}
      >
        Are you sure you want to delete this data field?
      </Typography>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <OriginalButton
          color='error'
          size='small'
          onClick={onClose}
          sx={buttonStyle}
          data-testid='custom-demo-dialog-data-field-delete-cancel-button'
        >
          Don't Delete
        </OriginalButton>
        <OriginalButton
          variant='text'
          size='small'
          onClick={onConfirm}
          sx={buttonStyle}
          data-testid='custom-demo-dialog-data-field-delete-confirm-button'
        >
          Delete
        </OriginalButton>
      </DialogActions>
    </Dialog>
  );
}
