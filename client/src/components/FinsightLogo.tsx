import React from 'react';
import logo from '@/assets/Logo.png';
import { Box } from '@mui/material';

const FinsightLogo = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
      <img src={logo} alt="Finsight Logo" style={{ height: '300px', width: 'auto' }} />
    </Box>
  );
};

export default FinsightLogo;
