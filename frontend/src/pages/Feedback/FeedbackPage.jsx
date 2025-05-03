import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { submitFeedback } from '../../services/feedbackService';
import PrimaryButton from '../../components/common/PrimaryButton';
import Footer from '../../components/common/Footer';
import './feedback.css';

const FeedbackPage = () => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment) {
      toast.warning('Please fill in both fields');
      return;
    }

    if (comment.length > 500) {
      toast.error('Comment must be under 500 characters');
      return;
    }

    try {
      setLoading(true);
      await submitFeedback(null, rating, comment);
      toast.success('Feedback submitted successfully!');
      setRating('');
      setComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="feedback-form-container">
        <div className="feedback-card">
          <h2>Give Feedback on Your Experience</h2>

          <div className="mb-3 text-start">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="">Select rating</option>
              <option value={5}>🌟 Excellent</option>
              <option value={4}>👍 Good</option>
              <option value={3}>😐 Average</option>
              <option value={2}>👎 Poor</option>
              <option value={1}>😡 Very Poor</option>
            </select>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label">Your Feedback</label>
            <textarea
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>

          <PrimaryButton text="Submit Feedback" onClick={handleSubmit} isLoading={loading} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeedbackPage;
