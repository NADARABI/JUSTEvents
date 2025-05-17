// src/services/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Debug log
console.log("AXIOS CONNECTED →", api.defaults.baseURL);

// Token injection for secure routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); 

  const isPublic =
    config.url.includes('/public') ||
    config.url.includes('/auth') ||
    config.url === '/analytics/popular-events-public' ||
    config.url === '/analytics/summary-public' ||
    config.url === '/feedback/recent-public' ||
    (config.method === 'get' && /^\/events(\/\d+)?$/.test(config.url));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
