// src/components/Feedback/FeedbackForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { submitFeedback } from '../../services/feedbackService';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PrimaryButton from '../../components/common/PrimaryButton';
import './feedbackForm.css';

const FeedbackForm = ({ eventId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.warning('Please fill in both fields');
      return;
    }

    if (comment.length > 500) {
      toast.error('Comment must be under 500 characters');
      return;
    }

    try {
      setLoading(true);
      await submitFeedback(eventId, { rating, comment });
      toast.success('Feedback submitted successfully!');
      setRating(0);
      setComment('');
      onFeedbackSubmitted(); // Refresh feedback list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2>Share Your Experience</h2>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => handleStarClick(star)}>
            {star <= rating ? <FaStar color="#FFD700" /> : <FaRegStar color="#C2C2C2" />}
          </span>
        ))}
      </div>

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        required
      />

      <PrimaryButton text="Submit Feedback" onClick={handleSubmit} isLoading={loading} />
    </form>
  );
};

export default FeedbackForm;
