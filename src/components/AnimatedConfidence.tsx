import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AnimatedConfidenceProps {
  value: number;
  show: boolean;
}

const AnimatedConfidence: React.FC<AnimatedConfidenceProps> = ({ value, show }) => {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setProgress(value * 100);
      }, 1000); // Start after typewriter effect
      return () => clearTimeout(timer);
    } else {
      setProgress(0);
    }
  }, [show, value]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return theme.palette.success.main;
    if (confidence >= 0.5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Confidence Score:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 1,
            color: getConfidenceColor(value),
            fontWeight: 'bold',
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getConfidenceColor(value),
            transition: 'transform 1s ease-in-out',
          },
        }}
      />
    </Box>
  );
};

export default AnimatedConfidence; 