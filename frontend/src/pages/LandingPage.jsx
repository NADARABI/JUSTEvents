import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3500); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center">
      <h1 style={{ fontSize: '2rem' }}>Welcome to JUSTEvents</h1>
      <p>Redirecting you to the login page...</p>
    </div>
  );
};

export default LandingPage;
