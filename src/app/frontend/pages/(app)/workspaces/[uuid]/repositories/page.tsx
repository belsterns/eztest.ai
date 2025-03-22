'use client'
import { Box } from '@mui/material';
import Repository from '@/app/frontend/components/repositories/repositories';
import { useContext, useEffect } from 'react';
import { WorkspaceContext } from '@/app/frontend/contexts/workspaceContext';

export default function Repositories() {
  const workspaceData = useContext(WorkspaceContext);

  useEffect(() => {
    const workspaceName = workspaceData.workspace_name || 'Workspace';
    document.title = `Repositories - ${workspaceName} - EZTest.ai`
  },[workspaceData])

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Repository module={'workspace'}/>
      </Box>
    </>
  );
}
