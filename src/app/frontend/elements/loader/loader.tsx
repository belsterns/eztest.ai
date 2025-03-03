import React from 'react';
import { CircularProgress } from '@mui/material';

interface AppLoadingProps {
  sx?: object;
  size?: number;
}

export default function AppLoading({ sx, size }: AppLoadingProps) {
  return (
    <CircularProgress data-testid="loading" size={size || 25} sx={{ ...sx }} />
  );
}
