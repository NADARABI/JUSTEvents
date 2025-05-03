import React from 'react';
import '../../pages/SavedEvents/savedEvents.css';

const SavedEventCard = ({ event, onUnsave }) => {
  return (
    <div className="event-glow-card">
      <div className="event-content">
        <h5>{event.title}</h5>
        <p>
          📅 {event.date} <br />
          📍 {event.location}
        </p>
        <button className="event-unsave-btn" onClick={() => onUnsave(event.id)}>
          ❌ Unsave
        </button>
      </div>
    </div>
  );
};

export default SavedEventCard;
