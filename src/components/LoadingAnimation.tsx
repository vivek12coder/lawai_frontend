import React from 'react';
import { Box, keyframes } from '@mui/material';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const wave = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const LoadingAnimation: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        height: '100px',
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `${wave} 1s ease-in-out infinite`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
      <Box
        sx={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'secondary.main',
          animation: `${pulse} 1.5s ease-in-out infinite`,
          ml: 2,
        }}
      />
    </Box>
  );
};

export default LoadingAnimation; 