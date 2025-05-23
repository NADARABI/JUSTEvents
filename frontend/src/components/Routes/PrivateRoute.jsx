import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isLoggedIn, role, isTokenValid, logout } = useUser();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isTokenValid()) {
      toast.error('Session expired. Please log in again.');
      logout(); 
      setRedirect(true);
    }
  }, [isTokenValid, logout]);

  if (redirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) ||
    (typeof roles === 'string' && role !== roles)
  ) {
    toast.error('Access denied: insufficient role.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
