'use client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeletePopupProps {
  open: boolean;
  element: string;
  element_name: string;
  handleClose: () => void;
  handleDelete: () => void;
}

export default function DeletePopup({ open, element, element_name, handleClose, handleDelete }: DeletePopupProps) {
  const handleConfirmDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleDelete();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleConfirmDelete,
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>{`Delete ${element}`}</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          {`Are you sure? You want to delete ${element} ${element_name}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="error" type="submit">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
