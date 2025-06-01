// src/pages/Organizer/OrganizerDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaPlus,
  FaClipboardList
} from 'react-icons/fa';
import './OrganizerDashboardPage.css';

const OrganizerDashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/events?sort=latest');
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        const myEvents = res.data.data.filter((e) => e.organizer_id === userId);
        setEvents(myEvents);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = events.length;
  const approved = events.filter((e) => e.status === 'Approved').length;
  const pending = events.filter((e) => e.status === 'Pending').length;
  const rejected = events.filter((e) => e.status === 'Rejected').length;

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="org-dashboard loading-state">
          <p className="loading-text">Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="org-dashboard">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="org-title">Organizer Dashboard</h1>

        {/* Stats Grid */}
        <div className="org-stats">
          <div className="stat-card total">
            <FaClipboardList className="stat-icon" />
            <p>Total Events</p>
            <h3>{total}</h3>
          </div>
          <div className="stat-card approved">
            <FaCheckCircle className="stat-icon" />
            <p>Approved</p>
            <h3>{approved}</h3>
          </div>
          <div className="stat-card pending">
            <FaHourglassHalf className="stat-icon" />
            <p>Pending</p>
            <h3>{pending}</h3>
          </div>
          <div className="stat-card rejected">
            <FaTimesCircle className="stat-icon" />
            <p>Rejected</p>
            <h3>{rejected}</h3>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="org-upcoming">
          <h2>Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <p className="muted-text">No upcoming events.</p>
          ) : (
            <div className="upcoming-cards">
              {upcoming.map((e) => (
                <div className="upcoming-card" key={e.id}>
                  <FaCalendarAlt className="upcoming-icon" />
                  <div>
                    <h4>{e.title}</h4>
                    <p>
                      {new Date(e.date).toLocaleDateString()} at {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="org-actions">
          <Link to="/events/create" className="action-btn primary">
            <FaPlus /> Create New Event
          </Link>
          <Link to="/organizer/my-events" className="action-btn secondary">
            <FaClipboardList /> View My Events
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizerDashboardPage;
