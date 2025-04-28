import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('name', response.name);

      toast.success('Login successful!');
      // Redirect based on role
      navigate('/'); // لاحقاً نحط Route حسب الرول
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:5000/auth/microsoft';
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Welcome Back to JUSTEvents!</h2>
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          name="email"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          name="password"
        />
        <PrimaryButton text="Log In" onClick={handleLogin} isLoading={loading} />

        <div className="text-end mt-2">
          <a href="/forgot-password" className="small">Forgot password?</a>
        </div>

        <div className="text-center my-3">
          <span>Or sign in with</span>
        </div>

        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <div className="my-2"></div>
        <SSOButton provider="google" onClick={handleGoogleLogin} />

        <div className="text-center mt-4">
          <span>New to JUSTEvents? </span><a href="/register">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
