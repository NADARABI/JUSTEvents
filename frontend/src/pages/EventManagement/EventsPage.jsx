// src/pages/EventManagement/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllEvents} from '../../services/eventService.js';
import EventCard from '../../components/Events/EventCard.jsx';
import Footer from '../../components/common/Footer.jsx';
import './eventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <div className="events-page-container">
        <h1 className="events-title">Discover Events at JUST</h1>

        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center">No upcoming events available.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default EventsPage;
