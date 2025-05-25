import axios from 'axios';
import { supabase } from './supabaseClient';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// API services
export const analysisService = {
  // Upload and analyze sequence
  analyzeSequence: async (file, threshold = 0.75) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('threshold', threshold);
    
    return api.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Run BLAST on sequence
  runBlast: async (file, evalue = 1e-10, maxHits = 10) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evalue', evalue);
    formData.append('max_hits', maxHits);
    
    return api.post('/api/blast', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get reference genes
  getReferenceGenes: async () => {
    return api.get('/api/reference-genes');
  },
  
  // Get analysis history
  getAnalysisHistory: async () => {
    return api.get('/api/history');
  },
  
  // Get analysis result by ID
  getAnalysisResult: async (id) => {
    return api.get(`/api/results/${id}`);
  },
};

export const authService = {
  // Register user
  register: async (userData) => {
    return api.post('/api/register', userData);
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    return api.get('/api/users/me');
  },
};

export default api;
