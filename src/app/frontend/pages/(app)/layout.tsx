'use client'
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../../components/appNavbar/appNavbar';
import SideMenu from '../../components/sideMenu/sideMenu';

export default function Layout({
  children,
}: {
  disableCustomTheme?: boolean;
  children: React.ReactNode;
}) {

  return (
    <>
    <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            minHeight: '100vh',
            backgroundImage:
              theme.palette.mode === 'dark'
                ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
                : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
              {children}
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
