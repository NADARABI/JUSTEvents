import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user'));
      const role = localStorage.getItem('role');

      if (token && userData && role) {
        if (roles.length > 0 && !roles.includes(role)) {
          console.warn(`Role ${role} is not authorized for this page.`);
          setIsAuthorized(false);
        } else {
          console.log("User is authorized with role:", role);
          setIsAuthorized(true);
        }
      }
    } catch (error) {
      console.error("Error checking user data:", error.message);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    console.warn("User is not authorized, redirecting to login.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
