import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';
import { register } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.role) {
      toast.error('Please select a role');
      return;
    }
    try {
      setLoading(true);
      await register(form.name, form.email, form.password, form.role);
      toast.success('Registered successfully! Please verify your email.');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Registration failed');
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
      <h2 className="mb-4">Join JUSTEvents</h2>

      <InputField
        label="Username"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your username"
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
      />

      <div className="mb-3 text-start">
        <label className="form-label">Role Selection</label>
        <select
          className="form-select"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">Select a role</option>
          <option value="Student">Student</option>
          <option value="Organizer">Organizer</option>
          <option value="Visitor">Visitor</option>
          <option value="Campus Admin">Campus Admin</option>
        </select>
      </div>

      <PrimaryButton text="Create" onClick={handleRegister} isLoading={loading} />

      <div className="text-center my-3">
        <span>Or sign up with</span>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <SSOButton provider="google" onClick={handleGoogleLogin} />
      </div>
    </>
  );
};

export default RegisterPage;
