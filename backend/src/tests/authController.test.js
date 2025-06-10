import {
  register,
  verifyEmail,
  login,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
  requestRole,
  refreshToken as refreshTokenFn,
} from '../controllers/authController.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { sendResponse } from '../utils/sendResponse.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';

jest.mock('../models/User.js');
jest.mock('../utils/sendEmail.js');
jest.mock('../utils/sendResponse.js');
jest.mock('../models/RefreshToken.js');
jest.mock('jsonwebtoken');

describe('authController', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {} };
    res = {};
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if any field is missing', async () => {
      req.body = { name: 'Test', email: '', password: '123', role: 'Student' };
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'All fields are required');
    });

    it('should return 400 if email format is invalid', async () => {
      req.body = { name: 'Test', email: 'invalid', password: '123', role: 'Student' };
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid email format');
    });

    it('should return 400 if role is invalid', async () => {
      req.body = { name: 'Test', email: 'test@email.com', password: '123', role: 'InvalidRole' };
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid role selection');
    });

    it('should return 400 if email already in use', async () => {
      req.body = { name: 'Test', email: 'test@email.com', password: '123', role: 'Student' };
      User.findByEmail.mockResolvedValue({ id: 1 });
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email already in use');
    });

    it('should return 201 and send email on successful registration', async () => {
      req.body = { name: 'Test', email: 'test@email.com', password: '123', role: 'Student' };
      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({});
      sendEmail.mockResolvedValue();
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('Registration successful'));
    });

    it('should return 500 if sendEmail fails', async () => {
      req.body = { name: 'Test', email: 'test@email.com', password: '123', role: 'Student' };
      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({});
      sendEmail.mockRejectedValue(new Error('fail'));
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to send verification email');
    });

    it('should return 500 if an unexpected error occurs', async () => {
      req.body = { name: 'Test', email: 'test@email.com', password: '123', role: 'Student' };
      User.findByEmail.mockRejectedValue(new Error('DB error'));
      await register(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error during registration');
    });
  });

  // verifyEmail
  describe('verifyEmail', () => {
    it('should return 400 if email or code is missing', async () => {
      req.body = { email: '', code: '' };
      await verifyEmail(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email and code are required');
    });
    it('should return 404 if user not found', async () => {
      req.body = { email: 'a@a.com', code: '123' };
      User.findByEmail.mockResolvedValue(null);
      await verifyEmail(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'User not found');
    });
    it('should return 400 if already verified', async () => {
      req.body = { email: 'a@a.com', code: '123' };
      User.findByEmail.mockResolvedValue({ is_verified: true });
      await verifyEmail(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email already verified');
    });
    it('should return 400 if code is invalid', async () => {
      req.body = { email: 'a@a.com', code: '123' };
      User.findByEmail.mockResolvedValue({ is_verified: false, verification_code: '999' });
      await verifyEmail(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid verification code');
    });
    it('should verify email successfully', async () => {
      req.body = { email: 'a@a.com', code: '123' };
      User.findByEmail.mockResolvedValue({ is_verified: false, verification_code: '123' });
      User.verifyEmail.mockResolvedValue();
      await verifyEmail(req, res);
      expect(User.verifyEmail).toHaveBeenCalledWith('a@a.com');
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Email verified successfully');
    });
    it('should handle errors', async () => {
      req.body = { email: 'a@a.com', code: '123' };
      User.findByEmail.mockRejectedValue(new Error('fail'));
      await verifyEmail(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Verification failed');
    });
  });

  // login
  describe('login', () => {
    it('should return 400 if email or password missing', async () => {
      req.body = { email: '', password: '' };
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email and password are required');
    });
    it('should return 404 if user not found', async () => {
      req.body = { email: 'a@a.com', password: '123' };
      User.findByEmail.mockResolvedValue(null);
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'User not found');
    });
    it('should return 401 if not verified', async () => {
      req.body = { email: 'a@a.com', password: '123' };
      User.findByEmail.mockResolvedValue({ is_verified: false });
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 401, 'Please verify your email first');
    });
    it('should return 401 if password is incorrect', async () => {
      req.body = { email: 'a@a.com', password: 'wrong' };
      User.findByEmail.mockResolvedValue({ is_verified: true, password_hash: 'hash' });
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 401, 'Incorrect password');
    });
    it('should login successfully', async () => {
      req.body = { email: 'a@a.com', password: '123' };
      const user = { id: 1, email: 'a@a.com', is_verified: true, password_hash: 'hash', role: 'Student', name: 'Test' };
      User.findByEmail.mockResolvedValue(user);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
      User.updateLastLogin.mockResolvedValue();
      jwt.sign.mockReturnValueOnce('access').mockReturnValueOnce('refresh');
      RefreshToken.save.mockResolvedValue();
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Login successful'), expect.objectContaining({ accessToken: 'access', refreshToken: 'refresh' }));
    });
    it('should handle errors', async () => {
      req.body = { email: 'a@a.com', password: '123' };
      User.findByEmail.mockRejectedValue(new Error('fail'));
      await login(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Login failed');
    });
  });

  // resendVerificationCode
  describe('resendVerificationCode', () => {
    it('should return 400 if email is missing', async () => {
      req.body = { email: '' };
      await resendVerificationCode(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email is required');
    });
    it('should return 404 if user not found', async () => {
      req.body = { email: 'a@a.com' };
      User.findByEmail.mockResolvedValue(null);
      await resendVerificationCode(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'User not found');
    });
    it('should return 400 if already verified', async () => {
      req.body = { email: 'a@a.com' };
      User.findByEmail.mockResolvedValue({ is_verified: true });
      await resendVerificationCode(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email already verified');
    });
    it('should send new code successfully', async () => {
      req.body = { email: 'a@a.com' };
      User.findByEmail.mockResolvedValue({ is_verified: false });
      User.updateVerificationCode.mockResolvedValue();
      sendEmail.mockResolvedValue();
      await resendVerificationCode(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('New verification code sent'));
    });
    it('should handle errors', async () => {
      req.body = { email: 'a@a.com' };
      User.findByEmail.mockRejectedValue(new Error('fail'));
      await resendVerificationCode(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to resend verification code');
    });
  });

  // requestPasswordReset
  describe('requestPasswordReset', () => {
    it('should return 400 if email is missing', async () => {
      req.body = { email: '' };
      await requestPasswordReset(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Email is required');
    });
    it('should return 500 if token not stored', async () => {
      req.body = { email: 'a@a.com' };
      User.storeResetToken.mockResolvedValue(false);
      await requestPasswordReset(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to store reset token');
    });
    it('should send reset link successfully', async () => {
      req.body = { email: 'a@a.com' };
      User.storeResetToken.mockResolvedValue(true);
      sendEmail.mockResolvedValue();
      await requestPasswordReset(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Password reset link sent'));
    });
    it('should handle errors', async () => {
      req.body = { email: 'a@a.com' };
      User.storeResetToken.mockRejectedValue(new Error('fail'));
      await requestPasswordReset(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error');
    });
  });

  // resetPassword
  describe('resetPassword', () => {
    it('should return 400 if token or newPassword missing', async () => {
      req.body = { token: '', newPassword: '' };
      await resetPassword(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Token and new password are required');
    });
    it('should return 400 if user not found', async () => {
      req.body = { token: 't', newPassword: 'n' };
      User.findByResetToken.mockResolvedValue(null);
      await resetPassword(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid or expired token');
    });
    it('should return 500 if password not updated', async () => {
      req.body = { token: 't', newPassword: 'n' };
      User.findByResetToken.mockResolvedValue({ email: 'a@a.com' });
      jest.spyOn(require('bcryptjs'), 'hash').mockResolvedValue('hashed');
      User.setResetPassword.mockResolvedValue(false);
      await resetPassword(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to update password');
    });
    it('should reset password successfully', async () => {
      req.body = { token: 't', newPassword: 'n' };
      User.findByResetToken.mockResolvedValue({ email: 'a@a.com' });
      jest.spyOn(require('bcryptjs'), 'hash').mockResolvedValue('hashed');
      User.setResetPassword.mockResolvedValue(true);
      User.clearResetToken.mockResolvedValue();
      await resetPassword(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Password reset successfully');
    });
    it('should handle errors', async () => {
      req.body = { token: 't', newPassword: 'n' };
      User.findByResetToken.mockRejectedValue(new Error('fail'));
      await resetPassword(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error');
    });
  });

  // requestRole
  describe('requestRole', () => {
    it('should return 400 if requested_role is invalid', async () => {
      req.user = { id: 1 };
      req.body = { requested_role: 'Invalid' };
      await requestRole(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Please select a valid role'));
    });
    it('should return 404 if user not found or update failed', async () => {
      req.user = { id: 1 };
      req.body = { requested_role: 'Organizer' };
      User.storeRoleRequest.mockResolvedValue(false);
      await requestRole(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('User not found'));
    });
    it('should submit role request successfully', async () => {
      req.user = { id: 1 };
      req.body = { requested_role: 'Organizer' };
      User.storeRoleRequest.mockResolvedValue(true);
      await requestRole(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('has been submitted successfully'));
    });
    it('should handle errors', async () => {
      req.user = { id: 1 };
      req.body = { requested_role: 'Organizer' };
      User.storeRoleRequest.mockRejectedValue(new Error('fail'));
      await requestRole(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('error occurred'));
    });
  });

  // refreshToken
  describe('refreshToken', () => {
    it('should return 400 if token is missing', async () => {
      req.body = { token: '' };
      await refreshTokenFn(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Refresh token is required');
    });
    it('should return 403 if token not found', async () => {
      req.body = { token: 't' };
      RefreshToken.findByToken.mockResolvedValue(null);
      await refreshTokenFn(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Invalid refresh token');
    });
    it('should return 403 if jwt.verify fails', async () => {
      req.body = { token: 't' };
      RefreshToken.findByToken.mockResolvedValue(true);
      jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('fail')));
      await refreshTokenFn(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Refresh token expired or invalid');
    });
    it('should generate new access token successfully', async () => {
      req.body = { token: 't' };
      RefreshToken.findByToken.mockResolvedValue(true);
      jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'a@a.com' }));
      jwt.sign.mockReturnValue('newAccess');
      User.findById.mockResolvedValue({ id: 1, email: 'a@a.com', role: 'Student', name: 'Test' });
      await refreshTokenFn(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('New access token generated'), { accessToken: 'newAccess' });
    });
    it('should handle errors', async () => {
      req.body = { token: 't' };
      RefreshToken.findByToken.mockRejectedValue(new Error('fail'));
      await refreshTokenFn(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error during token refresh');
    });
  });
}); 