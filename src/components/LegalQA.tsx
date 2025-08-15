import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Alert,
  Container,
  Typography,
  useTheme,
  Tooltip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import LoadingAnimation from './LoadingAnimation';
import ChatMessage from './ChatMessage';
import AnimatedConfidence from './AnimatedConfidence';
import config from '../config';

interface Message {
  text: string;
  isAi: boolean;
  timestamp: Date;
  confidence?: number;
}

const LegalQA: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a question');
      return;
    }

    const userMessage: Message = {
      text: input,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setShowConfidence(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${config.apiUrl}/legal-qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData?.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.answer) {
        throw new Error('No answer received from the server');
      }

      const aiMessage: Message = {
        text: data.answer,
        isAi: true,
        timestamp: new Date(),
        confidence: data.confidence || 0,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? (err.name === 'AbortError' 
            ? 'Request timed out. Please try again.' 
            : err.message)
        : 'An unexpected error occurred. Please try again.';
      
      setError(errorMessage);
      console.error('Error in legal QA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypewriterComplete = () => {
    setShowConfidence(true);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(255,153,51,0.08) 0%, rgba(255,255,255,0.05) 50%, rgba(19,136,8,0.08) 100%)'
      }}
    >
      {/* Header with Back Button */}
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(10,61,145,0.25)',
        position: 'sticky',
        top: 0,
        background: 'linear-gradient(90deg, rgba(255,153,51,0.25) 0%, rgba(255,255,255,0.35) 50%, rgba(19,136,8,0.25) 100%)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}>
        <Tooltip title="Back to Home">
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: '#0a3d91',
              '&:hover': {
                backgroundColor: 'rgba(74,144,226,0.1)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <GavelIcon sx={{ color: '#0a3d91', fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{
            color: '#0a3d91',
            fontWeight: 'bold',
          }}
        >
          Legal AI Chat
        </Typography>
      </Box>

      {/* Chat Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative'
      }}>
        {/* Ashoka Chakra watermark */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0.06,
            zIndex: 0,
          }}
        >
          <Box component="svg" viewBox="0 0 200 200" sx={{ width: 220, height: 220 }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke="#0a3d91" strokeWidth="6" />
            <circle cx="100" cy="100" r="4" fill="#0a3d91" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 65 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={100 + 65 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="#0a3d91"
                strokeWidth="3"
              />
            ))}
          </Box>
        </Box>
        {messages.length === 0 && (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              gap: 2,
            }}
          >
            <GavelIcon sx={{ fontSize: 48, color: '#0a3d91' }} />
            <Typography variant="h6" color="text.secondary">
              Ask any legal question about Indian law
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type your question below to get started
            </Typography>
          </Box>
        )}

        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isAi={message.isAi}
            timestamp={message.timestamp}
            animate={message.isAi && index === messages.length - 1}
            onAnimationComplete={handleTypewriterComplete}
          />
        ))}

        {loading && (
          <Box sx={{ alignSelf: 'flex-start', ml: 7 }}>
            <LoadingAnimation />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {showConfidence && messages.length > 0 && messages[messages.length - 1].confidence && (
          <Box sx={{ ml: 7 }}>
            <AnimatedConfidence 
              value={messages[messages.length - 1].confidence!} 
              show={showConfidence}
            />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

        {/* Input Area */}
        <Paper 
          component="form" 
          onSubmit={handleSubmit}
        sx={{
          p: 2,
          background: 'linear-gradient(90deg, rgba(255,153,51,0.06) 0%, rgba(255,255,255,0.06) 50%, rgba(19,136,8,0.06) 100%)',
          borderTop: '1px solid rgba(10,61,145,0.15)',
          display: 'flex',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          variant="outlined"
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(10,61,145,0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#0a3d91',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0a3d91',
              }
            },
          }}
        />
        <Button
          variant="contained"
          disableElevation
          type="submit"
          startIcon={<SendIcon />}
          disabled={loading || !input.trim()}
          sx={{
            px: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #FF9933 0%, #138808 100%)',
            color: '#0a3d91',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #e6872c 0%, #0f6e06 100%)',
              boxShadow: '0 6px 18px rgba(10,61,145,0.25)'
            },
            '&.Mui-disabled': {
              background: 'linear-gradient(90deg, rgba(255,153,51,0.4) 0%, rgba(19,136,8,0.4) 100%)',
              color: 'rgba(10,61,145,0.6)'
            }
          }}
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default LegalQA; 