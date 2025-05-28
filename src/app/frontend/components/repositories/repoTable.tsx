import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Repository } from "./repositories";
import DeletePopup from "../../elements/popup/deleteConfirmation";
import AppLoader from "../../elements/loader/loader";

interface CustomizedDataGridProps {
  columns: {
    field: string;
    headerName: string;
    width: number;
    renderCell?: (params: any) => React.ReactNode;
  }[];
  rows: Repository[];
  onInit?: (repo: Repository) => void;
  onEdit?: (repo: Repository) => void;
  onDelete?: (repo: Repository) => void;
  initLoader: { [key: string]: boolean };
}

export default function CustomizedDataGrid({
  columns,
  rows,
  onInit,
  onEdit,
  onDelete,
  initLoader,
}: CustomizedDataGridProps) {
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Repository | null>(null);

  const handleDeleteClick = (row: Repository) => {
    setSelectedRow(row);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && selectedRow) onDelete(selectedRow);
    setDeletePopupOpen(false);
  };

  const actionColumn = {
    field: "actions",
    headerName: "Action",
    width: 200,
    renderCell: (params: any) => (
      <>
        <Button
          variant="contained"
          size="small"
          onClick={() => onInit?.(params.row)}
          sx={{ marginRight: 1 }}
          disabled={params.row.is_initialized}
        >
          {initLoader[`initBtnLoader-${params.row.id}`] ? (
            <AppLoader size={18} sx={{ color: "white" }} />
          ) : (
            "Initialize"
          )}
        </Button>
        <IconButton color="primary" onClick={() => onEdit?.(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };

  const updatedColumns = [...columns, actionColumn];

  return (
    <>
      <DataGrid
        sx={{
          mt: 3,
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell": {
            alignContent: "center",
            whiteSpace: "normal",
            textOverflow: "ellipsis",
            lineHeight: "1.2",
            display: "block",
          },
        }}
        rows={rows}
        columns={updatedColumns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        hideFooter
        disableColumnResize
        density="standard"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "large",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />
      <DeletePopup
        open={deletePopupOpen}
        element="repository"
        element_name={selectedRow?.repo_name || ""}
        handleClose={() => setDeletePopupOpen(false)}
        handleDelete={handleDeleteConfirm}
      />
    </>
  );
}
