// src/pages/EventManagement/EventDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import eventService from '../../services/eventService';
import FeedbackForm from '../../components/Feedback/FeedbackForm';
import EventFeedbackList from '../../components/Feedback/EventFeedbackList';
import Footer from '../../components/common/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import './eventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await eventService.getEventById(id);
        console.log("Event details fetched:", res.data);
        setEvent(res.data.data);
      } catch (err) {
        console.error('Failed to fetch event details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <p className="loading-text">Loading event details...</p>;
  if (!event) return <p className="loading-text">Event not found.</p>;

  return (
    <>
      {/* Full-Width Hero Section */}
      <div className="event-hero-full">
        {event.image_url ? (
          <img
            src={`/images/${event.image_url}`}
            alt={event.title}
            className="event-hero-image-full"
          />
        ) : (
          <div className="event-hero-placeholder-full">Image Not Available</div>
        )}
        <div className="event-hero-overlay-full">
          <h1 className="event-title-full">{event.title}</h1>
          <p className="event-category-full">{event.category}</p>
        </div>
      </div>

      {/* Event Info */}
      <div className="event-info-full">
        <div className="event-meta-full">
          <p>
            <FaMapMarkerAlt className="event-icon-full" /> 
            <strong> Location:</strong> {event.location || "Not specified"}
          </p>
          <p>
            <FaCalendarAlt className="event-icon-full" /> 
            <strong> Date & Time:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <FaUser className="event-icon-full" /> 
            <strong> Organizer:</strong> {event.organizer_name || "Unknown"}
          </p>
        </div>

        <div className="event-description-full">
          <h2>About the Event</h2>
          <p>{event.description}</p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section-full">
        <h2 className="section-title-full">Share Your Experience</h2>
        <FeedbackForm eventId={id} onFeedbackSubmitted={() => window.location.reload()} />

        <div className="divider-full"></div>

        <h2 className="section-title-full">Attendee Feedback</h2>
        <EventFeedbackList eventId={id} />
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsPage;
