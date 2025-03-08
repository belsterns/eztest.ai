'use client';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupsIcon from '@mui/icons-material/Groups';
import { usePathname } from 'next/navigation';

const mainListItems = [
  { text: 'Workspaces', icon: <WorkspacesIcon />, route: '/workspaces' },
  { text: 'Repositories', icon: <AccountTreeIcon />, route: '/repositories' },
  { text: 'Users', icon: <GroupsIcon />, route: '/users' },
];

// const secondaryListItems = [];

export default function MenuContent() {
  const pathName = usePathname();
  const activeMenu = pathName.split('/')[1];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense sx={{ gap: 1 }}>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
             <Link href={item.route} passHref legacyBehavior>
                <ListItemButton 
                  selected={activeMenu === item.route }
                  component="a"
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
             </Link>
          </ListItem>
        ))}
      </List>
      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Link href={item.route} passHref legacyBehavior>
              <ListItemButton 
                selected={activeMenu === item.route }
                component="a"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
