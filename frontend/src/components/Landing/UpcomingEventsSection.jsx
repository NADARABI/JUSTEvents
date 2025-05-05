// src/components/Landing/UpcomingEventsSection.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { CalendarDays } from 'lucide-react';
import './upcomingEventsSection.css';
import { Link } from 'react-router-dom';

const mockEvents = [
    {
        id: 1,
        title: "AI & Robotics Meetup",
        date: "2025-05-25",
        description: "Explore the latest in robotics at JUST’s tech hub!",
      },
      {
        id: 2,
        title: "JUST Chess Open",
        date: "2025-05-27",
        description: "Students and staff go head-to-head in our chess challenge.",
      },
      {
        id: 3,
        title: "Startup Pitch Night",
        date: "2025-05-30",
        description: "Support student startups and vote for your favorite pitch.",
      },
];

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await api.get('/api/events?upcoming=true'); 
        setEvents(res.data?.length ? res.data : mockEvents);
      } catch (err) {
        console.error('Failed to fetch upcoming events:', err);
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <section className="upcoming-events-calendar">
      <div className="section-title-with-icon">
        <CalendarDays size={22} />
        <h2>Upcoming Events</h2>
      </div>

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : events.length > 0 ? (
        <ul className="calendar-event-list">
          {events.map((event) => {
            const d = new Date(event.date);
            const day = d.toLocaleDateString('en-US', { day: '2-digit' });
            const month = d.toLocaleDateString('en-US', { month: 'short' });
            const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <li className="calendar-event-card" key={event.id}>
                <div className="calendar-date-box">
                  <div className="calendar-day">{day}</div>
                  <div className="calendar-month">{month}</div>
                  <div className="calendar-weekday">{weekday}</div>
                </div>
                <div className="calendar-event-info">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <Link to={`/events/${event.id}`} className="calendar-event-link">View Details</Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty-text">No upcoming events available.</p>
      )}
    </section>
  );
};

export default UpcomingEventsSection;
