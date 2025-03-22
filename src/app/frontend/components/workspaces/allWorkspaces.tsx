import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import FormDrawer from "../formDrawer/drawer";
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useAPICall';
import WorkspaceCard from './workspaceCard';
import Workspace from '../../pages/(app)/workspaces/page';

export interface Workspace {
    uuid: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;  
    updated_at: string; 
};

export interface WorkspaceItem {
    workspace: Workspace;
};

interface DrawerData {
    mode: "Add" | "Edit";
    module: "Workspace";
}

export default function AllWorkspaces(){
    const [allWorkspaces, setAllWorkspaces] = useState<WorkspaceItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] =useState<DrawerData>({
        mode: "Add",
        module: "Workspace",
    });
    const [editCardData,setEditCardData] =  useState({});
    const { makeApiCall, success } = useApi();

    const handleOpenDrawer = () => setDrawerOpen(true); 
    const handleCloseDrawer = () => {
        setDrawerData({
            mode: "Add",
            module: "Workspace",
        });
        setEditCardData({});
        setDrawerOpen(false);
    }

    const formFields = [
        { label: "Workspace Name *", name: "name", type: "text", required: true },
        { label: "Description *", name: "description", type: "textarea", required: true },
    ];

    const handleFormSubmit = async (data: Record<string, string>) => {
        if(drawerData.mode === 'Add'){
            const result = await makeApiCall({
                url: '/api/v1/workspace',
                method: 'POST',
                body: {
                    name: data.name,
                    description: data.description
                },
                isShowAlert: true,
            });

            setAllWorkspaces([
                ...allWorkspaces, 
                {
                    workspace: {
                        uuid: result.data.uuid,
                        name: result.data.name,
                        description: result.data.description,
                        is_active: result.data.is_active,
                        created_at: result.data.created_at,
                        updated_at: result.data.updated_at
                    }
                }
            ]);
        }
        else {
            const { uuid, ...updatedFields } = data;
            const result = await makeApiCall({
                url: `/api/v1/workspace/${uuid}`,  
                method: "PATCH",
                body: updatedFields,
                isShowAlert: true,
            });

            setAllWorkspaces((prevWorkspaces) =>
                prevWorkspaces.map((workspaceObj) =>
                    workspaceObj.workspace.uuid === result.data.uuid
                        ? { workspace: result.data } 
                        : workspaceObj 
                )
            );
            
        }
        
        if(success) {
            handleCloseDrawer();
        }
    };

    const handleFormUpdate = async (data: Workspace) => {
        setEditCardData({
            uuid: data.uuid,
            name: data.name,
            description: data.description
        });
        setDrawerData({
            mode: 'Edit',
            module: 'Workspace'
        });
        handleOpenDrawer();
    }

    const handleDeleteWorkspace = async (uuid: string) => {
        await makeApiCall({
            url: `/api/v1/workspace/${uuid}`,  
            method: "DELETE",
            isShowAlert: true,
        });

        if (success) {
            setAllWorkspaces((prevWorkspaces) =>
                prevWorkspaces.filter((workspaceObj) => workspaceObj.workspace.uuid !== uuid)
            );
        }
    }

    const getAllWorkspaces = async() => {
        const result = await makeApiCall({
            url: '/api/v1/workspace/list',
            method: 'GET',
            isShowAlert: false,
        });

        if (result?.data) {
            setAllWorkspaces(result.data);
        }
    }

    useEffect(() => {
        getAllWorkspaces();
        // eslint-disable-next-line
    },[]);

    return(
        <>
        <Grid container sx={{ width: "100%", position: "relative" }} justifyContent="space-between" alignItems="center">
            <Typography component="h3" variant="h6" sx={{ mb: 2, mt: 2 }}>
                All Workspaces
            </Typography>

            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                sx={{
                display: { xs: "none", sm: "flex" }, 
                }}
                onClick={() => handleOpenDrawer()}
            >
                Add Workspace
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

        <Grid container spacing={4}>
            {allWorkspaces.map(({ workspace }) => (
                <Grid key={workspace.uuid}>
                    <WorkspaceCard 
                      workspace={workspace}   
                      onEdit={handleFormUpdate} 
                      onDelete={handleDeleteWorkspace} 
                    />
                </Grid>
            ))}
        </Grid>

        <FormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          module={drawerData.module}
          mode={drawerData.mode}
          fields={formFields}
          initialValues={editCardData}
          onSubmit={handleFormSubmit}
        />

        </>
    )
}