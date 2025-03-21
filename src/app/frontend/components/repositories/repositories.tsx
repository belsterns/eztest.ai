import Grid from '@mui/material/Grid2';
import { Button, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import FormDrawer from "../formDrawer/drawer";
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useAPICall';
import { usePathname } from 'next/navigation';
import BackDropLoader from '../../elements/loader/backDropLoader';
import RepoTable from './repoTable';

export interface Repository {
    uuid: string;
    user_uuid: string;
    repo_url: string;
    workspace_info: {
        uuid: string;
        name: string;
    };
    token: string;
    host_url: string;
    webhook_uuid: string;
    webhook_url: string;
    remote_origin: string;
    organization_name: string;
    repo_name: string;
    is_active: boolean;
    is_initialized: boolean;
    created_at: string;
    updated_at: string;
}

  
interface DrawerData {
    mode: "Add" | "Edit";
    module: "Repository";
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
    const [repositories,setRepositories] = useState<Repository[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] =useState<DrawerData>({
        mode: "Add",
        module: "Repository",
    });
    const [editRepoData,setEditRepoData] =  useState({});
    const workspace_uuid = pathName.split('/')[2];
    const { makeApiCall, success } = useApi();

    const handleOpenDrawer = () => setDrawerOpen(true); 
    const handleCloseDrawer = () => {
        setDrawerData({
            mode: "Add",
            module: "Repository",
        });
        setFormFields([
            { label: "Repository URL", name: "repo_url", type: "url", required: true },
            { label: "Personal Access Token", name: "token", type: "string", required: true },
        ]);
        setEditRepoData({});
        setDrawerOpen(false);
    }
    const [formFields, setFormFields] = useState<Field[]>([
        { label: "Repository URL", name: "repo_url", type: "url", required: true },
        { label: "Personal Access Token", name: "token", type: "string", required: true },
    ]);
    const [loader, setLoader] = useState({
        pageLoader: false
    });

    const handleFormSubmit = async (data: Record<string, string>) => {
        // Trim trailing slash from repo_url
        data.repo_url = data.repo_url.replace(/\/+$/, '');

        if(drawerData.mode === 'Add'){
            await makeApiCall({
                url: '/api/v1/repo',
                headers: {
                   "x-origin-token": `${data.token}`
                },
                method: 'POST',
                body: {
                    workspace_uuid: workspace_uuid ? workspace_uuid : data.workspace_uuid,
                    repo_url: data.repo_url
                },
                isShowAlert: true,
            });

            if (success) {
                getRepositories();
            }
        }
        else {
            await makeApiCall({
                url: `/api/v1/repo/${workspace_uuid}/${data.uuid}`,
                method: 'PATCH',
                headers: {
                    "x-origin-token": `${data.token}`
                 },
                body: {
                    ...data
                },
                isShowAlert: true,
            });
            
            if (success) {
                getRepositories();
            }
        }
       
    }

    const handleAddRepo = async () => {
        handleOpenDrawer();
    };

    const handleEditRepo = async (data: Repository) => {
        setFormFields([
            { label: "Repository URL", name: "repo_url", type: "url", required: true },
        ]);
    
        setEditRepoData({
            repo_url: data.repo_url,
            uuid: data.uuid,
            token: data.token
        });
    
        setDrawerData({
            mode: "Edit",
            module: "Repository",
        });
    
        handleOpenDrawer();
    };

    const handleDeleteRepo = async (data: Repository) => {
        await makeApiCall({
            url: `/api/v1/repo/${data.workspace_info.uuid}/${data.uuid}`,
            method: 'DELETE',
            isShowAlert: true
        });
        if (success) {
            setRepositories((prevRepos) =>
                prevRepos.filter((repoObj) => repoObj.uuid !== data.uuid)
            );
        }
    }

    const handleInitRepo = async (data: Repository) => {
        const result = await makeApiCall({
            url: `/api/v1/initialize/${data.uuid}`,
            method: 'POST',
            body: {
                "repo_url": data.repo_url
            },
            isShowAlert: true
        });

        if (result) {
            setRepositories((prevRepos) =>
              prevRepos.map((repo) =>
                repo.uuid === data.uuid ? { ...repo, is_initialized: true } : repo
              )
            );
        }
    }

    const getRepositories = async() => {
        const result = await makeApiCall({
            url: `/api/v1/workspace/${workspace_uuid}/repo`,
            method: 'GET',
            setIsLoading: setLoader,
            loader: 'pageLoader'
        });

        setRepositories(result.data); 
    }

    useEffect(() => {
       getRepositories();
       // eslint-disable-next-line
    },[])

    return(
        <>
        <BackDropLoader isLoading={loader.pageLoader}/>
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

        <Grid container justifyContent={'center'} alignContent={'center'}>
           <RepoTable data={repositories} onEdit={handleEditRepo} onDelete={handleDeleteRepo} onInit={handleInitRepo}/>
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