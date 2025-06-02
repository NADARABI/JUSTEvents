// src/pages/EventManagement/MyEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { deleteEvent } from '../../services/eventService';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('You need to be logged in to view your events');
          return;
        }

        const res = await api.get('/api/my-events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(res.data.data);
      } catch (err) {
        console.error('Failed to load events:', err.message);
        toast.error('Error loading your events');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [location.key]);

  const handleDelete = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error("Delete error", err.message);
      toast.error("Failed to delete event");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const statusCount = {
    All: events.length,
    Approved: events.filter(e => e.status === 'Approved').length,
    Pending: events.filter(e => e.status === 'Pending').length,
    Rejected: events.filter(e => e.status === 'Rejected').length,
  };

  return (
    <>
      <NavBar />
      <div className="my-events-container">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1 className="my-events-heading">My Events</h1>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
            >
              {status} ({statusCount[status]})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading-message">Loading your events...</p>
        ) : events.length === 0 ? (
          <p className="no-events-message">You haven’t created any events yet.</p>
        ) : (
          <div className="event-card-list">
            {events
              .filter((event) =>
                filterStatus === 'All' ? true : event.status === filterStatus
              )
              .map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img
                      src={event.image_url ? `/images/${event.image_url}` : '/placeholder.png'}
                      alt={event.title}
                    />
                  </div>
                  <div className="event-details">
                    <h2>{event.title}</h2>
                    <p className="event-date-time">{event.date} at {event.time}</p>
                    <p className={`event-status ${getStatusClass(event.status)}`}>{event.status}</p>
                    <div className="event-actions">
                      <Link
                        to={`/events/edit/${event.id}`}
                        className="action-btn edit-btn"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="action-btn delete-btn"
                      >
                        Delete
                      </button>
                      {event.status === 'Approved' && (
                        <Link
                          to={`/events/${event.id}/rsvps`}
                          className="action-btn view-btn"
                        >
                          View RSVPs
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyEventsPage;
