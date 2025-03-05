'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useApi } from '@/app/frontend/hooks/useAPICall';
import { useEffect, useState } from 'react';
import Header from '@/app/frontend/components/header/header';
import WorkspaceTabs from '@/app/frontend/components/workspaces/workspaceTabs';

export default function Workspace() {
  const pathName = usePathname();
  const { makeApiCall } = useApi();
  const [workspace, setWorkspace] = useState<{ uuid: string; name: string } | null>(null);

  const getWorkspaceDetails = async () => {
    const uuid = pathName.split('/').pop();
    if (!uuid) return;

    const response = await makeApiCall({
      url: `/api/v1/workspace/${uuid}`,
      method: 'GET',
    });

    if (response?.data) {
      console.log(`wks data --> ${JSON.stringify(response.data)}`)
      setWorkspace(response.data);
      document.title = `Workspace - ${response.data.name}`;
    }
  };

  useEffect(() => {
    getWorkspaceDetails();
  });

  const breadCrumbItems = [
    { label: 'Workspaces', route: '/workspaces' },
    { label: workspace?.name || '...', route: `/workspaces/${workspace?.uuid}` },
  ];

  return (
    <>
      <Header breadCrumbItems={breadCrumbItems} />
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }} alignItems="center">
        <WorkspaceTabs />
      </Box>
    </>
  );
}
