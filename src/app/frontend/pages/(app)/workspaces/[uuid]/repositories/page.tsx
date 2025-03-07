'use client'
import { Box } from '@mui/material';
import Repository from '@/app/frontend/components/repositories/repositories';

export default function Repositories() {

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>  
        <Repository module={'workspace'}/>
      </Box>
    </>
  );
}
