// src/components/common/NavBar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchBar from '../Landing/SearchBar';
import { FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();

  // State Definitions
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Listen for storage changes and update state
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Handle Logout Logic
   * This removes the user session and redirects to the login page
   */
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Logo and Branding */}
      <div className="navbar-left">
        <NavLink to="/" className="logo-text">
          <img src="/logo.jpg" alt="JUSTEvents Logo" className="navbar-logo-img" />
        </NavLink>
      </div>

      {/* Center Search Bar */}
      <div className="navbar-center">
        <SearchBar fromNav={true} />
      </div>

      {/* Navigation Links */}
      <nav className="navbar-right">
        <NavLink to="/events" className="nav-link">Browse Events</NavLink>

        {!isLoggedIn ? (
          // Links for Guest Users
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        ) : (
          // Links for Logged-In Users
          <>
            {/* Saved Events (Available for All Users) */}
            <NavLink to="/saved" className="nav-link">
              <FaBookmark style={{ marginRight: '5px' }} /> Saved Events
            </NavLink>

            {/* Organizer-Specific Links */}
            {role === 'Organizer' && (
              <>
                <NavLink to="/organizer/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/organizer/my-events" className="nav-link">My Events</NavLink> 
                <NavLink to="/events/create" className="nav-link">Create Event</NavLink> 
              </>
            )}

            {/* Campus Admin Links */}
            {role === 'Campus Admin' && (
              <>
              {/* <NavLink to="/campus-admin/dashboard" className="nav-link">Dashboard</NavLink> */}
              <NavLink to="/campus-admin/room-requests" className="nav-link">Room Requests</NavLink>
              <NavLink to="/campus-admin/analytics" className="nav-link">Analytics</NavLink>
              {/* <NavLink to="/campus-admin/manage-rooms" className="nav-link">Manage Rooms</NavLink> */}
              </>
            )
            }

            {/* System Admin Links */}
            {role === 'System Admin' && (
              <>
                {/* <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/admin/pending-users" className="nav-link">Pending Users</NavLink>
                <NavLink to="/admin/pending-events" className="nav-link">Pending Events</NavLink>
                <NavLink to="/admin/notifications" className="nav-link">Notifications</NavLink> */}
              </>
            )}

            {/* Logout Button */}
            <button 
              className="btn btn-danger nav-link logout-button" 
              style={{ marginLeft: '10px', cursor: 'pointer' }} 
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
