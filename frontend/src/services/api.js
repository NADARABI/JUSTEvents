import axios from 'axios';
import { toast } from 'react-toastify';

let navigateHandler = null;

export const setNavigateHandler = (fn) => {
  navigateHandler = fn;
};

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

console.log("AXIOS CONNECTED →", api.defaults.baseURL);

// Request Interceptor: Inject Access Token
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

// Response Interceptor: Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt refresh token only once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Missing refresh token');

        const res = await axios.post('http://localhost:5000/auth/refresh', {
          token: refreshToken,
        });

        const newAccessToken = res.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        throw new Error('Invalid refresh response');
      } catch (refreshErr) {
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        if (navigateHandler) {
          navigateHandler('/login');
        } else {
          window.location.href = '/login';
        }

        return Promise.reject(refreshErr);
      }
    }

    // Other error types (optional logging or UI feedback)
    return Promise.reject(error);
  }
);

export default api;
