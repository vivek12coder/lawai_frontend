import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import config from '../config';
import { useNavigate } from 'react-router-dom';

interface AnalysisResult {
  summary: string;
  category: string;
  document_id: string;
}

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  border: '2px dashed #ccc',
  '&:hover': {
    border: '2px dashed #666',
    backgroundColor: theme.palette.grey[50],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const DocumentAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      console.log('Sending request to:', `${config.apiUrl}/api/analyze-document`);
      
      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file uploads
      
      // Add retry logic
      let retries = 2;
      let response;
      let lastError;

      while (retries >= 0) {
        try {
          response = await fetch(`${config.apiUrl}/api/analyze-document`, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
            },
            // Don't include credentials to avoid CORS preflight issues
            credentials: 'omit',
            signal: controller.signal
          });
          break; // If successful, exit the retry loop
        } catch (err) {
          lastError = err;
          if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Request timed out. The server took too long to respond. Please try again with a smaller file.');
          }
          retries--;
          if (retries < 0) throw err;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * (2 ** (2 - retries))));
        }
      }

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        console.error('Error analyzing document:', response?.status, response?.statusText);
        let errorMessage = `Failed to analyze document: ${response?.status || 'Unknown'} ${response?.statusText || ''}`;
        
        try {
          const errorData = await response?.json();
          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // If we can't parse JSON, try to get text
          try {
            const errorText = await response?.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            // Ignore text parsing errors
          }
        }
        
        console.error('Error details:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom color="primary">
        Legal Document Analyzer
      </Typography>

      <TextField
        fullWidth
        label="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        variant="outlined"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />

      <label htmlFor="file-input">
        <UploadBox
          sx={{ my: 2 }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="body1">
            {file ? file.name : 'Drag and drop or click to upload'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Supported formats: PDF, DOC, DOCX, TXT
          </Typography>
        </UploadBox>
      </label>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || !file}
        sx={{ mt: 2 }}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
      >
        {loading ? 'Analyzing...' : 'Analyze Document'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Analysis Results
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Document Category
            </Typography>
            <Typography variant="body1">{result.category}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              Summary
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {result.summary}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentAnalyzer;