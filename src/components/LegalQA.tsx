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
    if (!input.trim()) return;

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
      const response = await fetch(`${config.apiUrl}/legal-qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.answer) {
        throw new Error('No answer received from the server');
      }

      const aiMessage: Message = {
        text: data.answer,
        isAi: true,
        timestamp: new Date(),
        confidence: data.confidence,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch answer. Please try again later.');
      console.error('Error fetching answer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypewriterComplete = () => {
    setShowConfidence(true);
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Back Button */}
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(10, 25, 41, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}>
        <Tooltip title="Back to Home">
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(74,144,226,0.1)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <GavelIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(45deg, #4a90e2, #e6b34a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
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
      }}>
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
            <GavelIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
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
          background: 'linear-gradient(135deg, rgba(74,144,226,0.05) 0%, rgba(230,179,74,0.05) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
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
                borderColor: 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
        <IconButton 
          type="submit" 
          disabled={loading || !input.trim()} 
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Container>
  );
};

export default LegalQA; 