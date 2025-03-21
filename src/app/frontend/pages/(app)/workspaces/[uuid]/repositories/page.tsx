'use client'
import { Box } from '@mui/material';
import Repository from '@/app/frontend/components/repositories/repositories';
import { useEffect } from 'react';
import { useWorkspace } from '../layout';

export default function Repositories() {
  const workspaceData = useWorkspace();

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
