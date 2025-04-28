import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { verifyEmail, resendVerificationCode } from '../../services/authService';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await verifyEmail(email, code);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email);
      toast.success('Verification code resent!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Check your email for a code</h2>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Verification Code"
          name="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code"
        />

        <PrimaryButton text="Submit" onClick={handleVerify} isLoading={loading} />

        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={handleResendCode}>
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
