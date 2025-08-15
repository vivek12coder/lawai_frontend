// API Response Interfaces
export interface LegalQAResponse {
  answer: string;
  confidence: number;
}

export interface DocumentAnalysisResponse {
  summary: string;
  category: string;
  document_id: string;
}

const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'
};

export default config;