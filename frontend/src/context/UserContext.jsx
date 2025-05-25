import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

let logoutTimer = null;

// --- Session Timer ---
const startSessionTimer = (token, logoutFn) => {
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const delay = expiryTime - Date.now();

    console.log(' JWT expires in (ms):', delay);

    if (logoutTimer) clearTimeout(logoutTimer);

    if (delay > 0) {
      logoutTimer = setTimeout(() => {
        console.log(' Session expired via timer');
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });
        logoutFn();
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 200);
      }, delay);
    }
  } catch (err) {
    console.error('JWT decode failed:', err.message);
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isTokenValid = () => {
    const token = localStorage.getItem('accessToken');
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const logout = () => {
    console.log(' Logging out user...');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.setItem('logout', Date.now());
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = null;
  };

  const login = (userData) => {
    console.log(' Logging in:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', userData.token);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('role', userData.role);
    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);
    startSessionTimer(userData.token, logout);
  };

  // Initial check or refresh on app load
  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!savedUser) return;

      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          if (decoded.exp * 1000 < Date.now()) throw new Error('Expired');
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setIsLoggedIn(true);
          startSessionTimer(accessToken, logout);
        } else {
          const res = await fetch('http://localhost:5000/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
          });

          const data = await res.json();
          const newToken = data?.data?.accessToken;

          if (newToken) {
            localStorage.setItem('accessToken', newToken);
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
            setIsLoggedIn(true);
            startSessionTimer(newToken, logout);
          } else {
            throw new Error('No access token returned');
          }
        }
      } catch (err) {
        console.warn('Silent refresh failed:', err.message);
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });
        logout();
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 200);
      }
    };

    init();
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        setUser(null);
        setRole(null);
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  return (
    <UserContext.Provider value={{ user, role, isLoggedIn, login, logout, isTokenValid }}>
      {children}
    </UserContext.Provider>
  );
};
