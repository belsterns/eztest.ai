"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Link,
} from "@mui/material";
import ForgotPassword from "./forgotPassword";
import Card from "../../elements/card/card";
import Button from "../../elements/button/button";

interface Field {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  validation?: (value: string) => string | null;
}
interface AuthFormProps {
  formType: "log-in" | "register";
  fields: Field[];
  submitBtn: (formData: Record<string, string>) => void;
}

export default function AuthForm({ formType, fields, submitBtn }: AuthFormProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [open, setOpen] = useState(false);
    const isLogIn = formType === "log-in";
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      let data: Record<string, string> = {};
      let newErrors: { [key: string]: string } = {};
  
      // Validate input fields
      fields.forEach(({ name, validation }) => {
        const value = formData.get(name) as string;
        data[name] = value;
        if (validation) {
          const error = validation(value);
          if (error) newErrors[name] = error;
        }
      });
  
      setErrors(newErrors);
  
      // If no errors, call the submit callback
      if (Object.keys(newErrors).length === 0) {
        submitBtn(data);
      }
    };
  

  return (
    <Card variant="outlined" >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        { isLogIn ? "Log In" : "Register"}
      </Typography>

      <Box
        component="form"
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        onSubmit={handleSubmit}
      >
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
            />
          </FormControl>
        ))}

        { isLogIn && (
          <Link component="button" type="button" onClick={() => setOpen(true)}>
            Forgot your password?
          </Link>
        )}

        {/* <FormControlLabel
          control={<Checkbox name="rememberMe" color="primary" />}
          label="Remember me"
        /> */}

        <ForgotPassword open={open} handleClose={() => setOpen(false)} />

        <Button type="submit" fullWidth variant="contained">
          {isLogIn ? "Log In" : "Register"}
        </Button>

        <Typography sx={{ textAlign: "center" }}>
          { isLogIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={ isLogIn ? "/register" : "/log-in"} variant="body2">
            { isLogIn ? "Register" : "Log In"}
          </Link>
        </Typography>
      </Box>

      {/* <Divider>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<GitHubIcon />}
        onClick={() => alert("Log in with GitHub")}
      >
        Log in with GitHub
      </Button> */}
    </Card>
  );
}
