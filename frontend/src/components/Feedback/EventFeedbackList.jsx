import React, { useEffect, useState } from 'react';
import { fetchEventFeedback } from '../../services/feedbackService';
import './eventFeedback.css';

const EventFeedbackList = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetchEventFeedback(eventId);
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId]);

  if (loading) return <p className="text-center mt-4">Loading feedback...</p>;
  if (feedbacks.length === 0) return <p className="text-center mt-4">No feedback yet for this event.</p>;

  return (
    <div className="feedback-list">
      <h4 className="feedback-heading">What attendees said</h4>
      {feedbacks.map(({ id, rating, comment, created_at, user_name }) => (
        <div key={id} className="feedback-item">
          <div className="feedback-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
            ))}
          </div>
          <div className="feedback-meta">
            <span className="feedback-user">{user_name || 'Anonymous'}</span>
            <span className="feedback-date">{new Date(created_at).toLocaleDateString()}</span>
          </div>
          <p className="feedback-comment">"{comment}"</p>
        </div>
      ))}
    </div>
  );
};

export default EventFeedbackList;
