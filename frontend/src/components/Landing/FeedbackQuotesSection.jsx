// src/components/Landing/FeedbackQuotesSection.jsx
import React, { useEffect, useState } from 'react';
import './feedbackQuotesSection.css';
import feedbackService from '../../services/feedbackService';

const FeedbackQuotesSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await feedbackService.getRecentFeedbackPublic();
        const data = res.data || [];
        setFeedbacks(data);
      } catch (err) {
        console.error('Failed to load public feedback:', err);
        // fallback mock data
        setFeedbacks([
          {
            full_name: "Lina M.",
            text: "The AI workshop was eye-opening! Definitely coming back next semester.",
          },
          {
            full_name: "Omar H.",
            text: "I loved the marathon. Great energy and a sense of community at JUST!",
          },
          {
            full_name: "Ranya T.",
            text: "Organizers were super responsive. Feedback was actually applied later!",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <section className="feedback-quotes-section">
      <h2 className="section-title">What Students Are Saying</h2>

      {loading ? (
        <p className="loading-text">Loading feedback...</p>
      ) : feedbacks.length > 0 ? (
        <div className="feedback-grid">
          {feedbacks.map((item, index) => (
            <div className="feedback-card" key={index}>
              <p className="feedback-text">“{item.comment}”</p>
              <span className="feedback-user">— {item.user_name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">No public feedback available yet.</p>
      )}
    </section>
  );
};

export default FeedbackQuotesSection;
