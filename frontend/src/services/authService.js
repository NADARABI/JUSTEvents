import axios from 'axios';

// Register a new user
export const register = (name, email, password, role) =>
  axios.post('/auth/register', { name, email, password, role });

// Login with email & password
export const login = (email, password) =>
  axios.post('/auth/login', { email, password });

// Verify email with code
export const verifyEmail = (email, code) =>
  axios.post('/auth/verify', { email, code });

// Resend verification code
export const resendVerificationCode = (email) =>
  axios.post('/auth/resend-code', { email });

// Request password reset link
export const requestPasswordReset = (email) =>
  axios.post('/auth/reset-password-request', { email });

// Submit new password using token
export const resetPassword = (token, newPassword) =>
  axios.post('/auth/reset-password-submit', { token, newPassword });

// Request role change with optional attachment
export const requestRole = (requestedRole, attachment) => {
  const formData = new FormData();
  formData.append('requestedRole', requestedRole);
  if (attachment) {
    formData.append('attachment', attachment);
  }

  return axios.post('/auth/request-role', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Refresh access token (optional for future use)
export const refreshToken = () => axios.post('/auth/refresh-token');
