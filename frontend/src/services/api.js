import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // السيرفر تبع الباكند
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
