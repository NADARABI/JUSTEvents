import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../pages/Authentication/auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Blurred Background */}
      <img src="/images/just.jpeg" alt="Background" className="auth-background" />

      {/* Main Auth Content */}
      <main className="auth-main">
        <div className="auth-card text-start">
          <img
            src="/images/logo.jpg"
            alt="JUSTEvents Logo"
            style={{ width: '160px', height: '40px', marginBottom: '1rem' }}
          />
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div>© {new Date().getFullYear()} Jordan University of Science and Technology.</div>
        <div>Graduation Project — JUSTEvents Website.</div>
        <div>Supervised by Dr. Luay Alalawneh.</div>
      </footer>
    </div>
  );
};

export default AuthLayout;