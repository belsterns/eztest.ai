'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '../services/themeprovidor/provider';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <AppRouterCacheProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
      </SessionProvider>
    </> 
  );
}
