import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { deleteEvent } from '../../services/eventService';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get('/events?sort=latest');
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
        const myEvents = res.data.data.filter(e => e.organizer_id === userId);
        setEvents(myEvents);
      } catch (err) {
        console.error('Failed to load events', err);
        toast.error('Error loading your events');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete event");
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Rejected') return 'status-rejected';
    return '';
  };

  if (loading) return <div className="text-center text-[#113A5D] mt-10">Loading...</div>;

  const statusCount = {
    All: events.length,
    Approved: events.filter(e => e.status === 'Approved').length,
    Pending: events.filter(e => e.status === 'Pending').length,
    Rejected: events.filter(e => e.status === 'Rejected').length,
  };

  return (
    <div className="my-events-container">
      <h1 className="my-events-heading">My Events</h1>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`filter-btn ${
              filterStatus === status ? 'active' : ''
            }`}
          >
            {status} ({statusCount[status]})
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <p className="text-center text-[#113A5D]">You haven’t created any events yet.</p>
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
                    src={event.imageUrl || '/placeholder.png'}
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
