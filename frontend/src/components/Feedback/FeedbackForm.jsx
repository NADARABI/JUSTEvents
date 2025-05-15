import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './feedbackForm.css';

const MAX_COMMENT_LENGTH = 500;

const FeedbackForm = ({ eventId, onFeedbackSubmitted }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  /**
   * Restore State after Redirect from Login
   */
  useEffect(() => {
    const savedComment = localStorage.getItem('savedComment');
    const savedRating = localStorage.getItem('savedRating');
    if (savedComment) setComment(savedComment);
    if (savedRating) setRating(Number(savedRating));
  }, []);

  /**
   * Handle Form Submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Save form state before redirection
      localStorage.setItem('savedComment', comment);
      localStorage.setItem('savedRating', rating);
      localStorage.setItem('redirectAfterLogin', location.pathname);
      toast.warning("You need to be logged in to submit feedback.");
      navigate('/login');
      return;
    }

    try {
      setLoading(true); // Set loading state
      const token = localStorage.getItem('accessToken'); // Fetch the token

      // Submit feedback
      const response = await api.post(
        `/api/events/${eventId}/feedback`,
        {
          event_id: eventId,
          comment,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response
      if (response.data.success) {
        toast.success("Feedback submitted successfully!");

        // Clear saved data
        localStorage.removeItem('savedComment');
        localStorage.removeItem('savedRating');

        // Clear form state
        setComment('');
        setRating(5);

        // Trigger list refresh
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error.message);

      // Check for Specific Error Types
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Unauthorized. Please log in.");
          localStorage.setItem('savedComment', comment);
          localStorage.setItem('savedRating', rating);
          navigate('/login');
        } else if (error.response.status === 409) {
          toast.error("You have already submitted feedback for this event.");
        } else if (error.response.status === 403) {
          toast.error("You do not have permission to submit feedback for this event.");
        } else {
          toast.error("Failed to submit feedback. Please try again.");
        }
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  /**
   * Handle Star Click
   */
  const handleStarClick = (value) => setRating(value);

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>Share Your Experience</h3>

      {/* Star Rating */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`star ${num <= rating ? 'active' : ''}`}
            onClick={() => handleStarClick(num)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Textarea with Character Counter */}
      <textarea
        placeholder="Write your feedback... (Max 500 characters)"
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
        required
      />
      <div className="char-counter">
        {comment.length} / {MAX_COMMENT_LENGTH}
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
