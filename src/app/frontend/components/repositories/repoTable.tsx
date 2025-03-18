import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Repository } from './repositories';

interface CustomizedDataGridProps {
  columns: { field: string; headerName: string; width: number; renderCell?: (params: any) => React.ReactNode }[];
  rows: Repository[];
  onInit?: (repo: Repository) => void;
  onEdit?: (repo: Repository) => void;
  onDelete?: (repo: Repository) => void;
}

export default function CustomizedDataGrid({ columns, rows, onInit, onEdit, onDelete }: CustomizedDataGridProps) {
  const actionColumn = {
    field: 'actions',
    headerName: 'Action',
    width: 200,
    renderCell: (params: any) => (
      <>
        <Button
          variant="contained"
          size="small"
          onClick={() => onInit?.(params.row)}
          sx={{ marginRight: 1 }}
        >
          Initialize
        </Button>
        <IconButton color="primary" onClick={() => onEdit?.(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete?.(params.row)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };

  const updatedColumns = [...columns, actionColumn];

  return (
    <DataGrid
      sx={{ 
        mt: 3, 
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        }
      }}
      rows={rows}
      columns={updatedColumns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      hideFooter
      disableColumnResize
      density="standard"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'large',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
