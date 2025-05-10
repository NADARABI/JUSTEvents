import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';
import FeedbackForm from '../../components/Feedback/FeedbackForm';
import EventFeedbackList from '../../components/Feedback/EventFeedbackList';
import Footer from '../../components/common/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './eventDetailsPage.css';
import api from '../../services/api';
import { saveEvent, unsaveEvent, getSavedEvents } from '../../services/savedEventsService';
import { toast } from 'react-toastify';

const DEFAULT_HERO_IMAGE = "/images/default-event.jpg";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Definitions
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState("Organizer Not Found");
  const [location, setLocation] = useState("Room Not Found");
  const [loading, setLoading] = useState(true);
  const [refreshFeedback, setRefreshFeedback] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  /**
   * Handle Redirect from Login
   */
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath === `/events/${id}`) {
      localStorage.removeItem('redirectAfterLogin');
      setRefreshFeedback(true);
    }
  }, [id]);

  /**
   * Fetch Event, Organizer, and Room Details
   */
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);

        // Fetch Event Data
        const { data: eventRes } = await eventService.getEventById(id);
        setEvent(eventRes.data);

        // Parallel Fetch for Organizer and Room Info
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [organizerRes, roomRes] = await Promise.all([
          api.get(`/api/users/${eventRes.data.organizer_id}/basic`, { headers }),
          api.get(`/api/rooms/${eventRes.data.venue_id}/basic`, { headers })
        ]);


        // Set Organizer and Location
        setOrganizer(organizerRes.data.data.name);
        const roomData = roomRes.data.data;
        setLocation(`${roomData.name}, ${roomData.building}`);

        // Check if the event is already saved
        const savedEvents = await getSavedEvents();
        const isAlreadySaved = savedEvents.some(ev => ev.id === parseInt(id));
        setIsSaved(isAlreadySaved);

      } catch (err) {
        console.error('Failed to fetch event details:', err.message);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  /**
   * Handle Save/Unsave Click
   */
  const handleSaveToggle = async () => {
    const isLoggedIn = !!localStorage.getItem('accessToken');
    if (!isLoggedIn) {
      toast.warning('You need to be logged in to save events.');
      localStorage.setItem('redirectAfterLogin', `/events/${id}`);
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await unsaveEvent(id);
        toast.success('Event removed from saved list.');
      } else {
        await saveEvent(id);
        toast.success('Event saved successfully.');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error during save/unsave:', error.message);
      toast.error('Failed to update saved status.');
    }
  };

  /**
   * Conditional Render Logic
   */
  if (loading) return <p className="loading-text">Loading event details...</p>;
  if (!event) return <p className="loading-text">Event not found.</p>;

  return (
    <>
      {/*  Hero Section */}
      <div className="event-hero-full">
        <img
          src={event.image_url ? `/images/${event.image_url}` : DEFAULT_HERO_IMAGE}
          alt={event.title}
          className="event-hero-image-full"
        />
        <div className="event-hero-overlay-full">
          <h1 className="event-title-full">{event.title}</h1>
          <p className="event-category-full">{event.category}</p>
        </div>
      </div>

      {/* Event Information Section */}
      <div className="event-info-full">
        <div className="event-meta-full">
          <p>
            <FaMapMarkerAlt className="event-icon-full" />
            <strong> Location:</strong> {location}
          </p>
          <p>
            <FaCalendarAlt className="event-icon-full" />
            <strong> Date & Time:</strong> {new Date(event.date).toLocaleString()} at {event.time}
          </p>
          <p>
            <FaUser className="event-icon-full" />
            <strong> Organizer:</strong> {organizer}
          </p>
        </div>

        {/* Save/Unsave Button */}
        <button
          className={`save-event-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />} {isSaved ? 'Unsave Event' : 'Save Event'}
        </button>

        {/* Event Description */}
        <div className="event-description-full">
          <h2>About the Event</h2>
          <div className="description-content">
            {event.description
              ? event.description.split('\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              : <p>No description available.</p>}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="feedback-section-full">
          <h2 className="section-title-full">Feedback & Reviews</h2>
          <div className="feedback-container-full">
            <div className="feedback-form-wrapper">
              <FeedbackForm
                eventId={id}
                onFeedbackSubmitted={() => setRefreshFeedback(!refreshFeedback)}
              />
            </div>
            <div className="feedback-list-wrapper">
              <EventFeedbackList eventId={id} refresh={refreshFeedback} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsPage;
