import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '../services/themeprovidor/provider';
import { SessionProvider } from 'next-auth/react';
import { AlertProvider } from '../contexts/alertContext';
import Alert from '../elements/alert/alert';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <AppRouterCacheProvider>
            <ThemeProvider>
              <AlertProvider>
                {children}
                <Alert/>
              </AlertProvider> 
            </ThemeProvider>
        </AppRouterCacheProvider>
      </SessionProvider>
    </> 
  );
}
