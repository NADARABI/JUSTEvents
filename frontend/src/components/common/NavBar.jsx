import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBookmark, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import SearchBar from '../Landing/SearchBar';
import { useUser } from '../../context/UserContext';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout, loading, user } = useUser();

  // Debug Context
  useEffect(() => {
    console.log('[NavBar] Context →', { isLoggedIn, role, user });
  }, [isLoggedIn, role, user]);

  if (loading) return null;

  const handleLogout = () => {
    logout();
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

            {/* Booking Related Links */}
            {['student', 'organizer', 'visitor'].includes(role?.toLowerCase()) && (
              <>
              <NavLink to="/bookings/me" className="nav-link">
              <FaCalendarAlt style={{ marginRight: '5px' }} /> My Bookings
              </NavLink>

              <NavLink to="/bookings/new" className="nav-link">
              <FaCalendarAlt style={{ marginRight: '5px' }} /> Book a Room
              </NavLink>
              </>
            )}

            {/* Organizer */}
            {role === 'Organizer' && (
              <>
                <NavLink to="/organizer/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/organizer/my-events" className="nav-link">My Events</NavLink>
                <NavLink to="/events/create" className="nav-link">Create Event</NavLink>
              </>
            )}

            {/* Campus Admin */}
            {role === 'Campus Admin' && (
              <>
                <NavLink to="/campus-admin/room-requests" className="nav-link">Pending Bookings</NavLink>
                <NavLink to="/campus-admin/analytics" className="nav-link">Analytics</NavLink>
                <NavLink to="/campus-admin/manage-buildings" className="nav-link">Manage Buildings</NavLink>
                <NavLink to="/campus-admin/manage-rooms" className="nav-link">Manage Rooms</NavLink>
              </>
            )}

            {/* System Admin */}
            {role === 'System Admin' && (
              <>
                {/* Add System Admin links here if needed */}
              </>
            )}

            <button className="btn logout-button" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '5px' }} /> Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
