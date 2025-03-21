'use client'
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useWorkspace } from '../layout';

export default function Users() {
   const workspaceData = useWorkspace();

   useEffect(() => {
      const workspaceName = workspaceData.workspace_name || 'Workspace';
      document.title = `Workspace Members - ${workspaceName} - EZTest.ai`
    },[workspaceData])
  
  return (
    <>
        <Typography sx={{justifyContent:'center' , alignContent:'center', height:'35rem'}}>
          USERS GRID
        </Typography>
    </>
  );
}
