import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrashAlt } from 'react-icons/fa';
import '../../pages/SavedEvents/savedEvents.css';

const SavedEventCard = ({ event, onUnsave }) => {
  return (
    <div className="event-glow-card">
      <div className="event-content">
        <h5>{event.title}</h5>
        <p>
          <FaCalendarAlt className="event-icon" /> {event.date} <br />
          <FaMapMarkerAlt className="event-icon" /> {event.location}
        </p>
        <button
          className="event-unsave-btn"
          onClick={() => onUnsave(event.id)}
        >
          <FaTrashAlt className="icon-space" /> Unsave
        </button>
      </div>
    </div>
  );
};

export default SavedEventCard;
