import React from 'react';
import { Box, Typography } from '@mui/material';

const TopBar = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '98.4%',
        backgroundColor: '#37474f',
        color: 'white',
        padding: '4px',
        zIndex: 1000,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .animated-text': {
          animation: 'slideIn 5s ease-in-out infinite',
        },
      }}
    >
      <Typography
        variant="h6"
        component="div"
        className="animated-text"
      >
        Support the people of Palestine. Every donation counts.
      </Typography>
    </Box>
  );
};

export default TopBar;
