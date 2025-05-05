// src/api.js
import axios from 'axios';

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set timeout to 10 seconds
});

// Debug log
console.log("AXIOS BASE URL:", api.defaults.baseURL);

// Add token automatically 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
