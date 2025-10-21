import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload image to server
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Generate headshot using AI
export const generateHeadshot = async (imageData, style) => {
  const response = await api.post('/api/generate-headshot', {
    imageData,
    style,
  });

  return response.data;
};

// Revise headshot with iterative editing
export const reviseHeadshot = async (imageData, revisionPrompt, style) => {
  const response = await api.post('/api/revise-headshot', {
    imageData,
    revisionPrompt,
    style,
  });

  return response.data;
};

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
