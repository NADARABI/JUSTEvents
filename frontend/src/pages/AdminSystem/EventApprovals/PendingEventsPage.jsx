import React, { useEffect, useState } from 'react';
import './PendingEventsPage.css';
import { fetchPendingEvents, reviewEvent } from '../../../services/adminService';
import { toast } from 'react-toastify';

const PendingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [reasonMap, setReasonMap] = useState({});

  useEffect(() => {
    fetchPendingEvents()
      .then(res => setEvents(res.data.data))
      .catch(() => toast.error("Failed to load pending events"));
  }, []);

  const handleAction = async (eventId, status) => {
    const reason = reasonMap[eventId] || '';
    if (status === 'Rejected' && reason.trim() === '') {
      toast.warning("Please provide a reason for rejection.");
      return;
    }

    try {
      await reviewEvent(eventId, { status, reason });
      toast.success(`Event ${status.toLowerCase()}!`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch {
      toast.error("Action failed");
    }
  };

  const handleReasonChange = (eventId, value) => {
    setReasonMap(prev => ({ ...prev, [eventId]: value }));
  };

  return (
    <div className="pending-events-page">
      <h2>Pending Event Approvals</h2>
      {events.length === 0 ? (
        <p className="empty-message">No events awaiting approval 🎉</p>
      ) : (
        <table className="event-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>Reason (if reject)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.organizer_name}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Reason"
                    value={reasonMap[event.id] || ''}
                    onChange={(e) => handleReasonChange(event.id, e.target.value)}
                  />
                </td>
                <td>
                  <button className="approve-btn" onClick={() => handleAction(event.id, 'Approved')}>Approve</button>
                  <button className="reject-btn" onClick={() => handleAction(event.id, 'Rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingEventsPage;
