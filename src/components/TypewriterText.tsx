import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 30,
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <Box sx={{ minHeight: '100px' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          lineHeight: 1.8,
          '& .cursor': {
            borderRight: '2px solid',
            animation: 'blink 1s step-end infinite',
          },
          '@keyframes blink': {
            'from, to': { borderColor: 'transparent' },
            '50%': { borderColor: 'currentColor' },
          }
        }}
      >
        {displayedText}
        <span className="cursor">&nbsp;</span>
      </Typography>
    </Box>
  );
};

export default TypewriterText; 