import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Reads from your .env
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, //set timeout to 10 seconds
});

// Add token automatically (enable later if needed)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
