import api from './api'; // axios instance

export const register = (name, email, password, role) => {
  return api.post('/auth/register', { name, email, password, role });
};

export const verifyEmail = (email, code) => {
  return api.post('/auth/verify', { email, code });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password }).then((res) => res.data);
};

export const requestPasswordReset = (email) => {
  return api.post('/auth/reset-password-request', { email });
};

export const resetPassword = (token, newPassword) => {
  return api.post('/auth/reset-password-submit', { token, newPassword });
};

export const resendVerificationCode = (email) => {
    return api.post('/auth/resend-code', { email });
  };
  