'use client';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import ColorModeSelect from '../../../services/themeprovidor/theme/ColorModeSelect';
import Content from '../../../components/auth/content';
import AuthForm from '@/app/frontend/components/auth/authForm';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useAlertManager } from '@/app/frontend/hooks/useAlertManager';
import BackDropLoading from '@/app/frontend/elements/loader/backDropLoader';
import { StaticMessages } from '@/app/frontend/constants/app';

export default function LogIn() {
  const { data: session } = useSession();
  const showAlert = useAlertManager();
  const [loader,setLoader] = useState(false);

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    try {
      setLoader(true);
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,
        redirectTo: "/workspaces"
      });
    } catch {
      showAlert(StaticMessages.InternalServerError, true);
    } finally {
      setLoader(false); 
    }
  };

  return (
    <>
      {!session && (
        <>
          <BackDropLoading isLoading={loader}/>
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
          </Stack>
        </>
      )}
    </>
  );
}
