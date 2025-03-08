'use client'
import { Box } from '@mui/material';
import Header from '../../../components/header/header';
import Repository from '@/app/frontend/components/repositories/repositories';

export default function Repositories() {
  const breadCrumbItems = [
    {label: 'All Repositories' , route: '/repositories'}
  ];
   
  return (
    <>
      <Header breadCrumbItems={breadCrumbItems}/>
      <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Repository module={'allRepositories'}/>
      </Box>
    </>
  );
}
