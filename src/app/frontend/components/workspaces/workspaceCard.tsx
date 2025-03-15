import { Card, CardContent, Typography, IconButton, Box, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Workspace } from "./allWorkspaces";
import Link from "next/link";

interface CardProps {
    workspace: Workspace;
    onEdit?: (data: Workspace) => void;
    onDelete?: (uuid: string) => void;
}

export default function WorkspaceCard({ workspace, onEdit, onDelete }: CardProps) {
    const { uuid, name, description } = workspace;
    const [hovered, setHovered] = useState(false);
    const theme = useTheme();
    
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents link navigation when clicking the edit button
        if (onEdit) onEdit(workspace);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(uuid);
    };

    return (
        <Link href={`/workspaces/${uuid}/repositories`} passHref legacyBehavior>
            <Card
                variant="outlined"
                sx={{
                    width: 320,
                    height: 170,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 2,
                    borderRadius: 1,
                    position: "relative",
                    cursor: "pointer",
                    textDecoration: "none",
                    boxShadow:
                    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
                        ...theme.applyStyles("dark", {
                            boxShadow:
                            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
                        }),
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: hovered ? "flex" : "none",
                        gap: 1,
                    }}
                >
                    <IconButton size="small" onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }} />
                    </IconButton>
                    <IconButton size="small" onClick={handleDelete} color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        {name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}
