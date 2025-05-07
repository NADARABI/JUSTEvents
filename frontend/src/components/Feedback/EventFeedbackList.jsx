// src/components/Feedback/EventFeedbackList.jsx
import React, { useEffect, useState } from 'react';
import { fetchEventFeedback } from '../../services/feedbackService';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './eventFeedback.css';

const EventFeedbackList = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(false);

        if (!eventId) {
          console.error('❌ Event ID is missing.');
          setError(true);
          setLoading(false);
          return;
        }

        const res = await fetchEventFeedback(eventId);

        if (res.data && res.data.success) {
          console.log("✅ Feedback List:", res.data.data);
          setFeedbacks(res.data.data);
        } else {
          console.error('❌ Unexpected response format:', res.data);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('❌ Error fetching feedback:', error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId]);

  // Display states
  if (loading) return <p className="text-center mt-4">Loading feedback...</p>;
  if (error) return <p className="text-center mt-4">Failed to load feedback. Please try again later.</p>;
  if (feedbacks.length === 0) return <p className="text-center mt-4">No feedback yet for this event.</p>;

  return (
    <div className="feedback-list">
      <h4 className="feedback-heading">What Attendees Said</h4>
      {feedbacks.map(({ id, rating, comment, created_at, user_name }) => (
        <div key={id} className="feedback-item">
          <div className="feedback-meta">
            <span className="feedback-user">{user_name || 'Anonymous Attendee'}</span>
            <span className="feedback-date">
              {created_at ? new Date(created_at).toLocaleDateString('en-GB') : "N/A"}
            </span>
          </div>

          <p className="feedback-comment">“{comment}”</p>

          <div className="feedback-rating">
            {[...Array(5)].map((_, index) =>
              index < rating ? (
                <FaStar key={index} color="#f5b301" />
              ) : (
                <FaRegStar key={index} color="#c7c7c7" />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventFeedbackList;
