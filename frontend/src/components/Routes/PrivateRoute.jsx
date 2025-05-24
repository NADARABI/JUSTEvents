import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isLoggedIn, role, isTokenValid, logout } = useUser();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const validateAccess = async () => {
      const tokenStillValid = isTokenValid();

      if (!tokenStillValid) {
        toast.error('Session expired. Please log in again.');
        logout();
        setRedirectPath('/login');
      } else if (
        (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) ||
        (typeof roles === 'string' && role !== roles)
      ) {
        toast.error('Access denied: insufficient role.');
        setRedirectPath('/login');
      }

      setChecked(true);
    };

    validateAccess();
  }, [isLoggedIn, role, roles, isTokenValid, logout]);

  if (!checked) return null; // wait for validation

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
