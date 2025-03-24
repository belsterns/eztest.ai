
import type { Metadata } from 'next';
import Box from '@mui/material/Box';

export const metadata: Metadata = {
  title: "EZTest.AI Login",
  description: "EZTest.AI LogIn Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',               
      }}
    >
      {children}
    </Box>
  );
}
