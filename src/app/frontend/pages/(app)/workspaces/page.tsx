'use client'
import { Box } from '@mui/material';
import Header from '../../../components/header/header';
import AllWorkspaces from '@/app/frontend/components/workspaces/allWorkspaces';

export default function Workspace() {
  const breadCrumbItems = [
    {label: 'All Workspaces' , route: '/workspaces'}
  ];

  return (
    <>
      <Header breadCrumbItems={breadCrumbItems}/>
      <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }} alignItems="center">  
        <AllWorkspaces/>
      </Box>
    </>
  );
}
