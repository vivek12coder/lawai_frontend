import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LegalQA from './components/LegalQA';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<LegalQA />} />
            <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
