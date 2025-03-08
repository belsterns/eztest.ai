import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import DynamicForm from "./form";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  module: string;
  mode: "Add" | "Edit";
  fields: { label: string; name: string; type: string; required?: boolean }[];
  initialValues?: Record<string, string>;
  onSubmit: (data: Record<string, string>) => void;
}

export default function DynamicDrawer({ open, onClose, module, mode, fields, initialValues = {}, onSubmit }: DrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: 350, "& .MuiDrawer-paper": { width: 550, p: 2 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {`${mode} ${module}`}
      </Typography>

      {/* Dynamic Form - Pass initial values when editing */}
      <DynamicForm mode={mode} fields={fields} initialValues={initialValues} onSubmit={onSubmit} onClose={onClose} />
    </Drawer>
  );
}
