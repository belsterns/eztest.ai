'use client'
import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { WorkspaceContext } from '@/app/frontend/contexts/workspaceContext';

export default function Users() {
   const workspaceData = useContext(WorkspaceContext)

   useEffect(() => {
      const workspaceName = workspaceData.workspace_name || 'Workspace';
      document.title = `Workspace Member - ${workspaceName} - EZTest.ai`
    },[workspaceData])
  
  
  return (
    <>
        <Typography sx={{justifyContent:'center' , alignContent:'center', height:'35rem'}}>
          USERS GRID
        </Typography>
    </>
  );
}
