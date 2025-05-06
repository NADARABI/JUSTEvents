import axios from 'axios';

// Create axios instance for the whole app
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Debug log
console.log(" AXIOS CONNECTED →", api.defaults.baseURL);

// Smart token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isPublic =
    config.url.includes('/public') ||
    config.url.includes('/auth') ||
    config.url === '/analytics/popular-events-public' ||
    config.url === '/analytics/summary-public' ||
    config.url === '/feedback/recent-public' ||
    (config.method === 'get' && config.url.startsWith('/events'));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
