'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import ColorModeSelect from '../../../services/themeprovidor/theme/ColorModeSelect';
import Content from '../../../components/sign-in/Content';
import AuthForm from '@/app/frontend/components/sign-in/AuthForm';
import { Alert } from '@mui/material';

export default function SignIn(props: { disableCustomTheme?: boolean }) {

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    try {
      console.log("Logging in with:", formData);
  
      const response = await fetch("https://your-api-url.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store user data in session storage
      sessionStorage.setItem("user", JSON.stringify(data.user));
  
      <Alert severity="success" color="success">
        data.message
      </Alert>
  
      // Redirect user after successful login
      window.location.href = "/home"; // Change this to your actual route
    } catch (error: any) {
      <Alert severity="error" color="error">
        data.message
      </Alert>
    }
  };
  

  return (
    <>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
          }}
        >
          <Stack
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{
              justifyContent: 'center',
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: 'auto',
            }}
          >
            <Content />
            <AuthForm
                formType="log-in"
                fields={[
                    { label: "Email", name: "email", type: "email", required: true, validation: (value) => (!/\S+@\S+\.\S+/.test(value) ? "Invalid email" : null) },
                    { label: "Password", name: "password", type: "password", required: true, validation: (value) => (value.length < 6 ? "Password too short" : null) }
                ]}
                submitBtn={handleLoginSubmit}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
