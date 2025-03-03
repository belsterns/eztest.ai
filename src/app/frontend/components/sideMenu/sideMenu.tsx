'use client';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './menuContent';
import OptionsMenu from './optionsMenu';
import { useSession } from 'next-auth/react';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const{data: session} = useSession();

    return (
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          [`& .${drawerClasses.paper}`]: {
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            mt: 'calc(var(--template-frame-height, 0px) + 4px)',
            p: 1.5,
          }}
        >
          EzTest.AI
        </Box>
        <Divider />
        <Box
          sx={{
            overflow: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MenuContent />
        </Box>
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Avatar
            sizes="small"
            alt="Riley Carter"
            src="/static/images/avatar/7.jpg"
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ mr: 'auto' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              lineHeight: '16px', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
              maxWidth: '100px'
            }}
          >
            {session?.user.full_name}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
              maxWidth: '130px'
            }}
          >
             {session?.user.email}
          </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Drawer>
    );
}
