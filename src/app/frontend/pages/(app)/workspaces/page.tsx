'use client'
import { Box, Typography } from '@mui/material';
import Header from '../../../components/header/header';

export default function Workspace() {
  const breadCrumbItems = [
    {label:'Belsterns' , route: '/workspaces'},
    {label: 'Workspaces' , route: '/workspaces'}
  ];

  return (
    <>
      <Header breadCrumbItems={breadCrumbItems}/>
      <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Typography sx={{justifyContent:'center' , alignContent:'center', height:'40rem'}}>
          WORKSPACE GRID
        </Typography>
      </Box>
    </>
  );
}
