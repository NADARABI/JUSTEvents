// src/pages/EventManagement/MyEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { deleteEvent } from '../../services/eventService';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch the user's events
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('You need to be logged in to view your events');
          return;
        }

        // Fetching the user's own events
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
  }, []);

  // Handle Event Deletion
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

  // Class Assignment for Event Status
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

  // Filter Count
  const statusCount = {
    All: events.length,
    Approved: events.filter(e => e.status === 'Approved').length,
    Pending: events.filter(e => e.status === 'Pending').length,
    Rejected: events.filter(e => e.status === 'Rejected').length,
  };

  if (loading) return <div className="loading-message">Loading your events...</div>;

  return (
    <div className="my-events-container">
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

      {events.length === 0 ? (
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
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
