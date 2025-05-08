// src/components/common/NavBar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchBar from '../Landing/SearchBar';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  
  // State for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  // Listen for storage changes and update state
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="logo-text">
          <img src="/logo.jpg" alt="JUSTEvents Logo" className="navbar-logo-img" />
        </NavLink>
      </div>

      <div className="navbar-center">
        <SearchBar fromNav={true} />
      </div>

      <nav className="navbar-right">
        <NavLink to="/events" className="nav-link">Browse Events</NavLink>

        {!isLoggedIn ? (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/saved" className="nav-link">Saved Events</NavLink>
            <NavLink to="/organizer/dashboard" className="nav-link">Dashboard</NavLink>

            <button 
              className="btn btn-danger nav-link logout-button" 
              style={{ marginLeft: '10px', cursor: 'pointer' }} 
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
