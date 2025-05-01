import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../pages/Authentication/auth.css';

const AuthLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Blurred Background */}
      <img src="/images/just.jpeg" alt="Background" className="auth-background" />

      {/* Main Card in Center */}
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="auth-card text-start">
          {/* Logo Top Left */}
          <img
            src="/images/logo.jpg"
            alt="JUSTEvents Logo"
            style={{ width: '160px',height: '40px', marginBottom: '1rem' }}
          />

          {/* Dynamic Page Content */}
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-3" style={{ backgroundColor: '#002b5b', color: '#fff' }}>
        <div>© {new Date().getFullYear()} Jordan University of Science and Technology.</div>
        <div>Graduation Project — JUSTEvents Website.</div>
        <div>Supervised by Dr. Luay Alalawneh.</div>
      </footer>
    </div>
  );
};

export default AuthLayout;
