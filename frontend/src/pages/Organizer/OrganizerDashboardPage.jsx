// src/pages/Organizer/OrganizerDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OrganizerDashboardPage.css';

const OrganizerDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
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

    fetchMyEvents();
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
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Organizer Dashboard</h1>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card total">
          <p>Total Events</p>
          <h3>{total}</h3>
        </div>
        <div className="stat-card approved">
          <p>Approved</p>
          <h3>{approved}</h3>
        </div>
        <div className="stat-card pending">
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>
        <div className="stat-card rejected">
          <p>Rejected</p>
          <h3>{rejected}</h3>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="upcoming-section">
        <h2>Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="muted-text">No upcoming events.</p>
        ) : (
          <ul className="upcoming-list">
            {upcoming.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong> — {new Date(e.date).toLocaleDateString()} at {e.time}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <Link to="/events/create" className="quick-btn primary">+ Create New Event</Link>
        <Link to="/organizer/my-events" className="quick-btn secondary">View My Events</Link>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
