import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

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

export default function DynamicDrawer({
  open,
  onClose,
  module,
  mode,
  fields,
  initialValues = {},
  onSubmit,
}: DrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 350,
        "& .MuiDrawer-paper": {
          width: 550,
          p: 2,
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))"
              : "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {`${mode} ${module}`}
      </Typography>

      {/* Dynamic Form - Pass initial values when editing */}
      <DynamicForm
        mode={mode}
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Drawer>
  );
}
