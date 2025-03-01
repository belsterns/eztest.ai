'use client';

import { useContext } from 'react';
import { AlertContext } from '../contexts/alertContext';

export function useAlertManager() {
  const { setAlert, setAlertSeverity, setAlertOpen, setAlertHideDuration } =
    useContext(AlertContext)!;

  const showAlert = (message: string, severity: boolean, duration?: number) => {
    setAlert(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
    setAlertHideDuration(duration || 6000);
  };

  return showAlert;
}
