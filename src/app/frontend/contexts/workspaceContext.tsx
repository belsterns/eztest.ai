'use client';

import { createContext } from 'react';

interface WorkspaceContextProps {
  workspace_name: string;
  workspace_uuid: string;
}

export const WorkspaceContext = createContext<WorkspaceContextProps>({
  workspace_name: 'Workspace',
  workspace_uuid: 'uuid',
});
