'use client'
import { Box, Typography } from '@mui/material';
import Header from '../../../components/header/header';

export default function Repositories() {
  const breadCrumbItems = [
    {label: 'Repositories' , route: '/repositories'}
  ];
   
  return (
    <>
      <Header breadCrumbItems={breadCrumbItems}/>
      <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Typography sx={{justifyContent:'center' , alignContent:'center', height:'40rem'}}>
          REPOSITORIES GRID
        </Typography>
      </Box>
    </>
  );
}
