'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useApi } from '@/app/frontend/hooks/useAPICall';
import { useEffect, useState } from 'react';
import Header from '@/app/frontend/components/header/header';
import WorkspaceTabs from '@/app/frontend/components/workspaces/workspaceTabs';

export default function Workspace({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { makeApiCall } = useApi();
  const [workspace, setWorkspace] = useState<{ uuid: string; name: string }>({uuid:"",name:""});

  const getWorkspaceDetails = async () => {
    const uuid = pathName?.split('/')[2];
    if (!uuid) return;

    const response = await makeApiCall({
      url: `/api/v1/workspace/${uuid}`,
      method: 'GET',
    });

    setWorkspace({
      uuid: response.data.uuid || "",
      name: response.data.name || ""
    });

  };
  
  useEffect(() => {
      document.title = `Workspace - ${workspace.name}`;
  },[workspace]);

  useEffect(() => {
    getWorkspaceDetails();
    // eslint-disable-next-line
  },[]);

  const breadCrumbItems = [
    { label: 'Workspaces', route: '/workspaces' },
    { label: workspace?.name || '...', route: `/workspaces/${workspace?.uuid}` },
  ];

  return (
    <>
      <Header breadCrumbItems={breadCrumbItems} />
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", md: "1700px" },
          height: "auto", 
          display: "flex",
          flexDirection: "column", 
          alignItems: "center",
        }}
      >
          <WorkspaceTabs />
          {children}
      </Box>
    </>
  );
}
