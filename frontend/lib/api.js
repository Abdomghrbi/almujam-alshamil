import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

export const wordsAPI = {
  search: (params) => api.get('/api/search', { params }),
  suggest: (q) => api.get('/api/search/suggest', { params: { q } }),
  get: (word) => api.get(`/api/words/${encodeURIComponent(word)}`),
  create: (formData) => api.post('/api/words', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const moderationAPI = {
  pending: () => api.get('/api/moderation/pending'),
  review: (id, action) => api.patch(`/api/moderation/${id}`, { action }),
};

export default api;
