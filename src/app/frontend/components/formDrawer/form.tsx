import { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, TextField, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface Field {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // Only for select fields
}

interface FormProps {
  mode: "Add" | "Edit";
  fields: Field[];
  initialValues?: Record<string, string>;
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
}

export default function DynamicForm({ mode, fields, initialValues = {}, onSubmit, onClose }: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (mode === "Edit") {
      setFormData(initialValues);
      console.log("Init Values : " , initialValues)
    }
  }, [mode, initialValues]);

  const handleChangeSelectField = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value as string };
        setIsUpdated(JSON.stringify(updatedData) !== JSON.stringify(initialValues));
        return updatedData;
      });
    }
  };
  
  const handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value as string };
        setIsUpdated(JSON.stringify(updatedData) !== JSON.stringify(initialValues));
        return updatedData;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(({ name, label, required }) => {
      if (required && !formData[name]) {
        newErrors[name] = `${label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let submitData = { ...formData };

      if (mode === "Edit") {
        submitData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialValues[key]) {
            acc[key] = formData[key];
          }
          return acc;
        }, {} as Record<string, string>);

        if (initialValues.uuid) {
          submitData.uuid = initialValues.uuid;
        }
      }

      const data: any = { uuid: formData.uuid, ...submitData };
      if (formData.token) {
          data.token = formData.token;
      }
      onSubmit(data);
      onClose();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map(({ label, name, type, required, options }) => (
        <FormControl key={name} fullWidth>
          <FormLabel>{label}</FormLabel>
          {type === "select" && options ? (
            <Select
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChangeSelectField}
              error={!!errors[name]}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              id={name}
              name={name}
              type={type}
              required={required}
              fullWidth
              variant="outlined"
              error={!!errors[name]}
              helperText={errors[name]}
              value={formData[name] || ""}
              onChange={handleChangeTextField}
            />
          )}
        </FormControl>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={mode === "Edit" && !isUpdated}>
          {mode === "Edit" ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}