// src/components/common/NavBar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchBar from '../Landing/SearchBar';
import { FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
            <NavLink to="/saved" className="nav-link">
              <FaBookmark style={{ marginRight: '5px' }} /> Saved Events
            </NavLink>

            {role === 'Organizer' && (
              <>
                <NavLink to="/organizer/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/organizer/my-events" className="nav-link">My Events</NavLink>
                <NavLink to="/events/create" className="nav-link">Create Event</NavLink>
              </>
            )}

            {role === 'Campus Admin' && (
              <>
                <NavLink to="/campus-admin/room-requests" className="nav-link">Room Requests</NavLink>
                <NavLink to="/campus-admin/analytics" className="nav-link">Analytics</NavLink>
                <NavLink to="/campus-admin/manage-buildings" className="nav-link">Manage Buildings</NavLink>
                <NavLink to="/campus-admin/manage-rooms" className="nav-link">Manage Rooms</NavLink>
              </>
            )}

            {role === 'System Admin' && (
              <>
                {/* Future system admin links here */}
              </>
            )}

            <button
              className="btn logout-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt style={{ marginRight: '5px' }} /> Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
