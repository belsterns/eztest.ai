import { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";

interface Field {
  label: string;
  name: string;
  type: string;
  required?: boolean;
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

  useEffect(() => {
    if (mode === "Edit") {
      setFormData(initialValues);
    }
  }, [mode, initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      onSubmit(submitData);
      onClose();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map(({ label, name, type, required }) => (
        <FormControl key={name}>
          <FormLabel>{label}</FormLabel>
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
            onChange={handleChange}
          />
        </FormControl>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "Edit" ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}
