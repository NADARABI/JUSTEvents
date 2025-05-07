import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './OrganizerNavbar.css';

const OrganizerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="organizer-navbar">
      <div className="logo">JUSTEvents</div>
      <ul className="nav-links">
        <li><NavLink to="/organizer/dashboard" activeclassname="active">Dashboard</NavLink></li>
        <li><NavLink to="/organizer/my-events" activeclassname="active">My Events</NavLink></li>
        <li><NavLink to="/events/create" activeclassname="active">Create Event</NavLink></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default OrganizerNavbar;
