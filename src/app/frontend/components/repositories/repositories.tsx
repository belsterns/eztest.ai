import Grid from '@mui/material/Grid2';
import { Button, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import FormDrawer from "../formDrawer/drawer";
import { useState } from 'react';
import { useApi } from '../../hooks/useAPICall';
import { usePathname } from 'next/navigation';
import { WorkspaceItem } from '../workspaces/allWorkspaces';
import { useAlertManager } from '../../hooks/useAlertManager';

export interface Repository {
    uuid: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;  
    updated_at: string; 
};

interface DrawerData {
    mode: "Add" | "Edit";
    module: "Repository";
}

interface WorkspaceListItem {
    label: string,
    value: string
}

interface Field {
    label: string;
    name: string;
    type: "text" | "url" | "string" | "select"; 
    required?: boolean;
    options?: { label: string; value: string }[];
}
  

interface props {
    module: string
}

export default function Repositories({module}: props){
    const pathName = usePathname();
    const [workspaceList, setWorkspaceList] = useState<WorkspaceListItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] =useState<DrawerData>({
        mode: "Add",
        module: "Repository",
    });
    const [editRepoData,setEditRepoData] =  useState({});
    const workspace_uuid = pathName.split('/')[2];
    const { makeApiCall } = useApi();
    const showAlert = useAlertManager();

    const handleOpenDrawer = () => setDrawerOpen(true); 
    const handleCloseDrawer = () => {
        setDrawerData({
            mode: "Add",
            module: "Repository",
        });
        setEditRepoData({});
        setDrawerOpen(false);
    }
    const [formFields, setFormFields] = useState<Field[]>([
        { label: "Repository URL", name: "repo_url", type: "url", required: true },
        { label: "Personal Access Token", name: "repo_pat", type: "string", required: true },
    ]);

    const handleFormSubmit = async (data: Record<string, string>) => {
        console.log(`repo submitted data ---> ${JSON.stringify(data)}`);
        if(drawerData.mode === 'Add'){
            await makeApiCall({
                url: '/api/v1/repo',
                headers: {
                   "x-origin-token": `${data.repo_pat}`
                },
                method: 'POST',
                body: {
                    workspace_uuid: workspace_uuid ? workspace_uuid : data.workspace_uuid,
                    repo_url: data.repo_url
                },
                isShowAlert: true,
            });
        }
       
    }

    const handleAddRepo = async () => {
        if (module === "workspace") {
            handleOpenDrawer();
            return;
        }
    
        // Check if workspaces are already in state
        if (workspaceList.length === 0) {
            const result = await makeApiCall({
                url: "/api/v1/workspace",
                method: "GET",
            });
    
            if (!result.data || result.data.length === 0) {
                showAlert("Need a workspace to add a repository!", false);
                return;
            }
    
            // Update workspace list state
            const newWorkspaceList: WorkspaceListItem[] = result.data.map(
                ({ workspace }: WorkspaceItem) => ({
                    label: workspace.name,
                    value: workspace.uuid,
                })
            );
    
            await setWorkspaceList(newWorkspaceList);
        }
    
        // Add workspace dropdown field only if it doesn't exist already
        setFormFields((prevFields) => {
            const alreadyHasWorkspaceField = prevFields.some(
                (field) => field.name === "workspace_uuid"
            );
    
            if (alreadyHasWorkspaceField) return prevFields;
    
            return [
                ...prevFields,
                {
                    label: "Workspace",
                    name: "workspace_uuid",
                    type: "select",
                    required: true,
                    options: workspaceList,
                },
            ];
        });
    
        handleOpenDrawer();
    };

    return(
        <>
        <Grid
            container
            sx={{ width: "100%", position: "relative" }}
            justifyContent={module === "allRepositories" ? "space-between" : "flex-end"}
            alignItems="center"
            >
            {module === "allRepositories" && (
                <Typography component="h3" variant="h6" sx={{ mb: 2, mt: 2 }}>
                  All Repositories
                </Typography>
            )}

            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                sx={{
                display: { xs: "none", sm: "flex" }, 
                }}
                onClick={() => handleAddRepo()}
            >
                Add Repository
            </Button>

            {/* Floating button for mobile */}
            <Button
                variant="contained"
                color="primary"
                sx={{
                display: { xs: "flex", sm: "none" },
                position: "fixed",
                bottom: 16,
                right: 16,
                minWidth: "48px",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                p: 0, 
                }}
                onClick={() => handleOpenDrawer()}
            >
                <AddIcon />
            </Button>
            </Grid>

        <FormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          module={drawerData.module}
          mode={drawerData.mode}
          fields={formFields}
          initialValues={editRepoData}
          onSubmit={handleFormSubmit}
        />

        </>
    )
}