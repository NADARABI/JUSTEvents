import React from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from '../Landing/SearchBar';
import './navbar.css';

const NavBar = () => {
  // Optional: Add login check later using context or localStorage
  // const isLoggedIn = !!localStorage.getItem('accessToken');

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
        <NavLink to="/login" className="nav-link">Login</NavLink>
        <NavLink to="/register" className="nav-link">Register</NavLink>

        {/*
        // Uncomment this logic after login system is ready
        {isLoggedIn && (
          <>
            <NavLink to="/saved" className="nav-link">Saved</NavLink>
            <NavLink to="/dashboard/organizer/1" className="nav-link">Dashboard</NavLink>
          </>
        )}
        */}
      </nav>
    </header>
  );
};

export default NavBar;
