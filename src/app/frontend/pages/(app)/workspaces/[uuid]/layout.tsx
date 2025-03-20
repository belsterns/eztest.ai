'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useApi } from '@/app/frontend/hooks/useAPICall';
import {
  useEffect,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';
import Header from '@/app/frontend/components/header/header';
import WorkspaceTabs from '@/app/frontend/components/workspaces/workspaceTabs';
import BackDropLoader from '@/app/frontend/elements/loader/backDropLoader';

interface Workspace {
  uuid: string;
  name: string;
}

interface WorkspaceContextProps {
  workspace: Workspace;
  setWorkspace: Dispatch<SetStateAction<Workspace>>;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const useWorkspace = (): WorkspaceContextProps => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProps {
  children: ReactNode;
}

export default function Workspace({ children }: WorkspaceProps) {
  const pathName = usePathname();
  const { makeApiCall } = useApi();
  const [workspace, setWorkspace] = useState<Workspace>({ uuid: '', name: '' });
  const [loader, setLoader] = useState({
    pageLoader: false,
  });

  const getWorkspaceDetails = async () => {
    const uuid = pathName?.split('/')[2];
    if (!uuid) return;

    try {
      const response = await makeApiCall({
        url: `/api/v1/workspace/${uuid}`,
        method: 'GET',
        setIsLoading: setLoader,
        loader: 'pageLoader',
      });

      if (response?.data) {
        setWorkspace({
          uuid: response.data.uuid || '',
          name: response.data.name || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch workspace details:', error);
    }
  };

  useEffect(() => {
    getWorkspaceDetails();
  }, []);

  const breadCrumbItems = [
    { label: 'Workspaces', route: '/workspaces' },
    { label: workspace.name || '...', route: `/workspaces/${workspace.uuid}` },
  ];

  return (
    <>
      <BackDropLoader isLoading={loader.pageLoader} />
      <Header breadCrumbItems={breadCrumbItems} />
      <Box
        sx={{
          width: '100%',
          maxWidth: { sm: '100%', md: '1700px' },
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <WorkspaceTabs />
        <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
          {children}
        </WorkspaceContext.Provider>
      </Box>
    </>
  );
}
