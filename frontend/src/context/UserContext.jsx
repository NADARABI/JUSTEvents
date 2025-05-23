import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

let logoutTimer = null;

// Handles session expiration
const startSessionTimer = (token, logoutFn) => {
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const delay = expiryTime - currentTime;

    console.log('⏱JWT Expiration Delay (ms):', delay);
    console.log('Token Expires At:', new Date(expiryTime).toLocaleTimeString());

    if (logoutTimer) clearTimeout(logoutTimer);

    if (delay > 0) {
      logoutTimer = setTimeout(() => {
        console.log('Timer triggered: Session expired.');
        toast.error('Session expired. Please log in again.');
        logoutFn();

        // Give toast a moment to show before redirect
        setTimeout(() => {
          window.location.href = '/login';
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

  // Validity check for token
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

  // Check localStorage and set session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');

      if (savedUser && accessToken) {
        const decoded = jwtDecode(accessToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          toast.error('Session expired. Please log in again.');
          logout();
          setTimeout(() => {
            window.location.href = '/login';
          }, 200);
        } else {
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setIsLoggedIn(true);
          console.log('Calling startSessionTimer on app load');
          startSessionTimer(accessToken, logout);
        }
      }
    } catch (error) {
      console.error('Token init decode error:', error.message);
      logout();
    }
  }, []);

  // Login handler
  const login = (userData) => {
    console.log('Calling startSessionTimer on login');
    console.log('Token value:', userData.token);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', userData.token);
    localStorage.setItem('role', userData.role);

    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);

    startSessionTimer(userData.token, logout);
  };

  //  Logout handler
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');

    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.setItem('logout', Date.now());

    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }
  };

  // Sync logout across browser tabs
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
    <UserContext.Provider
      value={{ user, role, isLoggedIn, login, logout, isTokenValid }}
    >
      {children}
    </UserContext.Provider>
  );
};
