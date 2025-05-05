// src/components/Landing/FeedbackQuotesSection.jsx
import React from 'react';
import './feedbackQuotesSection.css';

const mockFeedback = [
  {
    user: "Lina M.",
    text: "The AI workshop was eye-opening! Definitely coming back next semester.",
  },
  {
    user: "Omar H.",
    text: "I loved the marathon. Great energy and a sense of community at JUST!",
  },
  {
    user: "Ranya T.",
    text: "Organizers were super responsive. Feedback was actually applied later!",
  },
];

const FeedbackQuotesSection = () => {
  return (
    <section className="feedback-quotes-section">
      <h2 className="section-title">What Students Are Saying</h2>
      <div className="feedback-grid">
        {mockFeedback.map((item, index) => (
          <div className="feedback-card" key={index}>
            <p className="feedback-text">“{item.text}”</p>
            <span className="feedback-user">— {item.user}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeedbackQuotesSection;
