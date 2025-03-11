import { Table, TableBody, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Typography, useTheme  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Repository as Repo } from "./repositories";
import { styled } from "@mui/material/styles";
import TableCellBase, { tableCellClasses } from "@mui/material/TableCell";
import { Grid2 as Grid }  from "@mui/material";


const StyledTableCell = styled(TableCellBase)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#041528" : "#527294",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "left",
    padding: "8px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "left",
    padding: "8px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface RepoTableProps {
  data: Repo[];
  onEdit?: (data: Repo) => void;
  onDelete?: (data: Repo) => void;
  onInit?: (data: Repo) => void;
}

export default function RepoTable({ data, onEdit, onDelete, onInit }: RepoTableProps) {

  const theme = useTheme(); 
  if (data.length === 0) {
    return (
        <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "60vh", 
          width: "100%", 
        }}
      >
        <Typography
          sx={{
            p: 2,
            textAlign: "center",
            backgroundColor: theme.palette.mode === "dark" ? "#041528" : "#527294",
            borderRadius: "8px",
            color: "white",
            minWidth: "300px", 
            maxWidth: "500px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          No Repositories Found
        </Typography>
      </Grid>
     
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: "20%" }}>Repository Name</StyledTableCell>
            <StyledTableCell sx={{ width: "25%" }}>Repository URL</StyledTableCell>
            <StyledTableCell sx={{ width: "15%" }}>Webhook</StyledTableCell>
            <StyledTableCell sx={{ width: "10%" }}>Host</StyledTableCell>
            <StyledTableCell sx={{ width: "10%" }}>Initialized</StyledTableCell>
            <StyledTableCell sx={{ width: "20%" }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((repo) => (
            <StyledTableRow key={repo.uuid}>
              <StyledTableCell>{repo.repo_name || "-"}</StyledTableCell>
              <StyledTableCell>{repo.repo_url || "-"}</StyledTableCell>
              <StyledTableCell>{repo.webhook_url || "-"}</StyledTableCell>
              <StyledTableCell>{repo.remote_origin || "-"}</StyledTableCell>
              <StyledTableCell>{repo.is_initialized ? "Yes" : "No"}</StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onInit?.(repo)}
                  sx={{ mr: 1 }}
                >
                  Initialize
                </Button>
                <IconButton color="primary" onClick={() => onEdit?.(repo)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete?.(repo)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
