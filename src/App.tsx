import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LegalQA from './components/LegalQA';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import BalanceIcon from '@mui/icons-material/Balance';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Create a custom theme with law and AI aesthetics
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a90e2', // Modern blue
      light: '#5c9ee6',
      dark: '#2171cd',
    },
    secondary: {
      main: '#e6b34a', // Gold accent
      light: '#edc275',
      dark: '#c99632',
    },
    background: {
      default: '#1a1a2e', // Deep blue-black
      paper: '#232342',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3cc',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<LegalQA />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
