// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync with LocalStorage on Component Mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');

      if (savedUser && accessToken) {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error.message);
      // Clear the corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('accessToken');
    }
  }, []);

  // Sync State and LocalStorage on Login
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', userData.token);
    localStorage.setItem('role', userData.role);

    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);
  };

  // Clear State and LocalStorage on Logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);

    // Clear storage to trigger event in other tabs
    localStorage.setItem('logout', Date.now());
  };

  // Listen for LocalStorage Changes
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
    <UserContext.Provider value={{ user, role, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
