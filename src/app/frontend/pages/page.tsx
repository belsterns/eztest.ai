'use client';

import { Button, Typography, Paper } from '@mui/material';

export default function Home() {
  return (
    <Paper sx={{ padding: 3, textAlign: 'center' }}>
      <Typography variant="h1">Welcome to My App</Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Paper>
  );
}
