'use client';

import React, { useContext } from 'react';
import { Snackbar, Alert as MuiAlert, Grid2 } from '@mui/material';
import { AlertContext } from '../../contexts/alertContext';

export default function AlertComponent() {
  const { alertOpen, setAlertOpen, alertSeverity, alert, alertHideDuration } =
    useContext(AlertContext)!;

  return (
    <Grid2 container justifyContent="center" alignItems="center">
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={alertHideDuration}
        onClose={() => setAlertOpen(false)}
      >
        <MuiAlert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity ? 'error' : 'success'}
          variant="filled"
          sx={{ color: 'white' }}
        >
          {alert}
        </MuiAlert>
      </Snackbar>
    </Grid2>
  );
}
