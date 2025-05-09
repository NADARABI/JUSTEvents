// src/pages/Authentication/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api'; 
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.warning('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', form); 

      // Store data in local storage
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Login successful!');

      // Redirect based on role
      switch (data.role) {
        case 'Organizer':
          navigate('/organizer/dashboard');
          break;
        case 'Student':
          navigate('/events');
          break;
        case 'Campus Admin':
          navigate('/admin/pending-events');
          break;
        case 'System Admin':
          navigate('/admin/pending-users');
          break;
        default:
          navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${window.location.origin}/sso/callback`;
  };
  
  const handleMicrosoftLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/microsoft?redirect_uri=${window.location.origin}/sso/callback`;
  };

  return (
    <div className="auth-container">
      <h2 className="mb-4">Login to JUSTEvents</h2>

      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <PrimaryButton text="Login" onClick={handleLogin} isLoading={loading} />

      <div className="text-end mt-2">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      <div className="text-center my-3">Or sign in with</div>

      <div className="d-flex justify-content-center gap-3">
        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <SSOButton provider="google" onClick={handleGoogleLogin} />
      </div>

      <div className="text-center mt-4">
        Don’t have an account? <Link to="/register">Create one</Link>
      </div>
    </div>
  );
};

export default LoginPage;
