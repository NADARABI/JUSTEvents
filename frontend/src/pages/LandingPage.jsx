import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3500); // 3.5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: '100vh', padding: '1rem' }}
    >
      <h1 className="mb-3" style={{ fontSize: '2.5rem' }}>
        Welcome to <span className="text-primary">JUSTEvents</span>
      </h1>
      <p className="text-muted">Redirecting you to the login page...</p>
      <button onClick={() => navigate('/login')} className="btn btn-outline-primary mt-4">
        Skip Now
      </button>
    </div>
  );
};

export default LandingPage;