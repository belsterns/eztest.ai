'use client';

import * as React from 'react';
import AppTheme from './theme/AppTheme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppTheme>
      {children}
    </AppTheme>
  );
}
