'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '../services/themeprovidor/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
