import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Source {
  document: string;
  snippet: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
  confidence: 'high' | 'medium' | 'low';
}

export interface QueryRequest {
  question: string;
}

export const queryDocuments = async (question: string): Promise<QueryResponse> => {
  const response = await axios.post<QueryResponse>(`${API_BASE_URL}/query`, {
    question
  });
  return response.data;
};

export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};
