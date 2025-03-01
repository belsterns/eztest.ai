'use client'
import { Box, Typography } from '@mui/material';
import Header from '../../../components/header/header';

export default function Users() {
  const breadCrumbItems = [
    {label:'Belsterns' , route: '/workspaces'},
    {label: 'Users' , route: '/users'}
  ];
   
  return (
    <>
      <Header breadCrumbItems={breadCrumbItems}/>
      <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Typography sx={{justifyContent:'center' , alignContent:'center', height:'40rem'}}>
          USERS GRID
        </Typography>
      </Box>
    </>
  );
}
