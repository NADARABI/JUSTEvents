import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await register(form.name, form.email, form.password, form.role);
      toast.success('Registered successfully! Please verify your email.');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h2 className="text-center mb-4">Join JUSTEvents</h2>
        
        <InputField
          label="Username"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <InputField
          label="Email Address"
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
        <div className="mb-3">
          <label className="form-label">Role Selection</label>
          <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Organizer">Organizer</option>
            <option value="Visitor">Visitor</option>
            <option value="Campus Admin">Campus Admin</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="terms" required />
          <label className="form-check-label" htmlFor="terms">
            I agree to JUSTEvents Terms & Conditions
          </label>
        </div>

        <PrimaryButton text="Create" onClick={handleRegister} isLoading={loading} />

        <div className="text-center my-3">
          <span>Or sign up with</span>
        </div>

        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <div className="my-2"></div>
        <SSOButton provider="google" onClick={handleGoogleLogin} />

        <div className="text-center mt-4">
          <span>Already have an account? </span><a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
