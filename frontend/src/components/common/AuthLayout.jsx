import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../pages/Authentication/auth.css';
import Footer from './Footer.jsx'; 

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
      <Footer />
    </div>
  );
};

export default AuthLayout;