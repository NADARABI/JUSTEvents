import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import '../../pages/Authentication/auth.css';
import Footer from './Footer.jsx'; 

const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log(" Checking authentication state...");

    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (accessToken) {
      console.log(" User is authenticated.");
      setIsAuthenticated(true);
    } else if (role === "pending") {
      console.log(" User is pending. Allowing access to Request Role.");
      setIsPending(true);
    } else {
      console.warn(" User is not authenticated.");
    }

    //  Loading is complete
    setIsLoading(false);
  }, []);

  // NEW: Show a loader while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <h3>Loading...</h3>
      </div>
    );
  }

  // Allow these paths to render without authentication:
  const openPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/reset-password"
  ];

  if (openPaths.includes(location.pathname)) {
    console.log(` Allowing ${location.pathname} to render.`);
    return (
      <div className="auth-layout">
        <img src="/images/just.jpeg" alt="Background" className="auth-background" />
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
        <Footer />
      </div>
    );
  }

  //  Allow `/request-role` if the user is pending
  if (location.pathname === "/request-role" && isPending) {
    console.log(" Allowing `/request-role` to render for Pending role.");
    return (
      <div className="auth-layout">
        <img src="/images/just.jpeg" alt="Background" className="auth-background" />
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
        <Footer />
      </div>
    );
  }

  //  If not authenticated and not an open path, redirect to login
  if (!isAuthenticated && !isPending) {
    console.warn(" Not authenticated, redirecting to login.");
    return <Navigate to="/login" />;
  }

  //  Render Layout Normally
  console.log(" Authenticated. Rendering layout...");
  return (
    <div className="auth-layout">
      <img src="/images/just.jpeg" alt="Background" className="auth-background" />
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
      <Footer />
    </div>
  );
};

export default AuthLayout;
