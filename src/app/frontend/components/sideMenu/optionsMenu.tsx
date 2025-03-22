'use client';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from '../../elements/button/menuButton';
import ColorModeIconDropdown from '../../services/themeprovidor/theme/ColorModeIconDropdown';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const MenuItem = styled(MuiMenuItem)({
    width: '9rem',
    zIndex: 100,
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
        <MenuButton
            aria-label="Open menu"
            onClick={handleClick}
            sx={{ borderColor: 'transparent' }}   
        >
            <MoreVertRoundedIcon />
        </MenuButton>
        
        <Menu
            anchorEl={anchorEl}
            id="menu"
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            sx={{
                [`& .${listClasses.root}`]: {
                    padding: '4px',
                },
                [`& .${paperClasses.root}`]: {
                    padding: 0,
                },
                [`& .${dividerClasses.root}`]: {
                    margin: '4px -4px',
                },
            }}
        >
            {/* Theme Selector */}
            <MenuItem>
             <ColorModeIconDropdown />
            </MenuItem>

            <Divider />

            {/* Logout Option */}
            <MenuItem onClick={handleClose} sx={{ [`& .${listItemIconClasses.root}`]: { ml: 'auto', minWidth: 0 } }}>
            <ListItemText  onClick={() => signOut({ redirectTo: '/login' })}>Logout</ListItemText>
            <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            </MenuItem>
        </Menu>
    </>
  );
}
