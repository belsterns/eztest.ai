'use client';
import React, { createContext, useState } from 'react';

interface AlertContextType {
  alert: string;
  alertSeverity: boolean;
  alertOpen: boolean;
  alertHideDuration: number;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
  setAlertSeverity: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertHideDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [alert, setAlert] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertHideDuration, setAlertHideDuration] = useState<number>(1000);

  return (
    <AlertContext.Provider
      value={{
        alert,
        alertSeverity,
        alertOpen,
        alertHideDuration,
        setAlert,
        setAlertSeverity,
        setAlertOpen,
        setAlertHideDuration
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
