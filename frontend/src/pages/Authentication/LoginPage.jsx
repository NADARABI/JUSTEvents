import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';
import { login } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(form.email, form.password);
      toast.success('Login successful!');
      navigate('/dashboard'); // أو الصفحة الرئيسية بعد تسجيل الدخول
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
    <>
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
        <a href="/forgot-password">Forgot password?</a>
      </div>

      <div className="text-center my-3">Or sign in with</div>

      <div className="d-flex justify-content-center gap-3">
        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <SSOButton provider="google" onClick={handleGoogleLogin} />
      </div>

      <div className="text-center mt-4">
        Don’t have an account? <a href="/register">Create one</a>
      </div>
    </>
  );
};

export default LoginPage;
