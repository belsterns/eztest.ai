'use client';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import ColorModeSelect from '../../../services/themeprovidor/theme/ColorModeSelect';
import Content from '../../../components/auth/content';
import AuthForm from '@/app/frontend/components/auth/authForm';
import { Alert } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const { data: session } = useSession();
  const errorMessage: string | null = null;
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    try {
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });
     
      if (response?.status == 500) {
        setAlertMessage({ type: "error", text: "Invalid User Name or Password" })
      } else {
        router.push('/workspaces');
      }   
    } catch (error: any) {
      setAlertMessage({ type: "error", text: `${error.message}`})
    }
  };

  return (
    <>
      {!session && (
        <>
          {alertMessage && <Alert severity={alertMessage.type}>{alertMessage.text}</Alert>}
          <CssBaseline enableColorScheme />
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <Stack
            direction="column"
            component="main"
            sx={[
              {
                alignContent: 'center',
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
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      required: true,
                      validation: (value) =>
                        !/\S+@\S+\.\S+/.test(value) ? "Invalid email" : null,
                    },
                    {
                      label: "Password",
                      name: "password",
                      type: "password",
                      required: true,
                      validation: (value) =>
                        value.length < 6 ? "Password too short" : null,
                    },
                  ]}
                  submitBtn={handleLoginSubmit}
                />
              </Stack>
            </Stack>
            {/* Display error message */}
            {errorMessage && (
              <Alert severity="error" color="error" sx={{ mt: 2, mx: "auto", width: "80%" }}>
                {errorMessage}
              </Alert>
            )}
          </Stack>
        </>
      )}
    </>
  );
}
