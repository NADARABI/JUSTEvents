// src/pages/EventManagement/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService.js';
import EventCard from '../../components/Events/EventCard.jsx';
import Footer from '../../components/common/Footer.jsx';
import './eventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const category = new URLSearchParams(location.search).get('category') || 'All';

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const title =
    category === 'All'
      ? 'Discover Events at JUST'
      : `Explore ${capitalize(category)} Events at JUST`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = location.search;
        const res = await getAllEvents(query);
        console.log(' Filtered events:', res.data);
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error(' Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [location.search]);

  return (
    <>
      <div className="events-page-container">
        <h1 className="events-title">{title}</h1>

        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="empty-text">No events available at this time.</p>
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
