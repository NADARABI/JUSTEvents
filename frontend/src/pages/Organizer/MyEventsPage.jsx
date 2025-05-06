import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusClass = (status) => {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Rejected') return 'status-rejected';
    return '';
  };

  if (loading) return <div className="text-center text-[#113A5D] mt-10">Loading...</div>;

  return (
    <div className="my-events-container">
      <h1 className="my-events-heading">My Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-[#113A5D]">You haven’t created any events yet.</p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-[#062743]">{event.title}</h2>
                <span className={`event-status ${getStatusClass(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{event.date} at {event.time}</p>
              <div className="mt-4 flex justify-end gap-4">
                <Link
                  to={`/events/edit/${event.id}`}
                  className="bg-[#113A5D] text-white px-4 py-2 rounded hover:bg-[#4F959D] transition"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
