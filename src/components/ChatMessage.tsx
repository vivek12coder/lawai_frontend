import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import TypewriterText from './TypewriterText';

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  timestamp: Date;
  confidence?: number;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isAi,
  timestamp,
  animate = false,
  onAnimationComplete,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexDirection: isAi ? 'row' : 'row-reverse',
        opacity: 0,
        animation: 'fadeSlideIn 0.3s ease-out forwards',
        '@keyframes fadeSlideIn': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: isAi ? 'primary.main' : 'secondary.main',
          width: 40,
          height: 40,
        }}
      >
        {isAi ? <SmartToyIcon /> : <PersonIcon />}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: isAi 
              ? 'rgba(74,144,226,0.1)' 
              : 'rgba(230,179,74,0.1)',
            borderColor: isAi 
              ? 'primary.main' 
              : 'secondary.main',
            borderWidth: 1,
            borderStyle: 'solid',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 15,
              [isAi ? 'left' : 'right']: -10,
              borderStyle: 'solid',
              borderWidth: '10px 10px 10px 0',
              borderColor: `transparent ${isAi ? theme.palette.primary.main : theme.palette.secondary.main} transparent transparent`,
              transform: isAi ? 'none' : 'scaleX(-1)',
            },
          }}
        >
          {animate ? (
            <TypewriterText 
              text={message} 
              onComplete={onAnimationComplete}
            />
          ) : (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {message}
            </Typography>
          )}
        </Paper>

        {/* Timestamp */}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            display: 'block',
            textAlign: isAi ? 'left' : 'right',
            color: 'text.secondary',
          }}
        >
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage; 