import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { requestPasswordReset } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async () => {
    try {
      setLoading(true);
      await requestPasswordReset(email);
      toast.success('Check your email for the reset link.');
      navigate('/check-email'); // optional if you want another page to show check-email
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Reset your password</h2>
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          name="email"
        />
        <PrimaryButton text="Continue" onClick={handleRequestReset} isLoading={loading} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
