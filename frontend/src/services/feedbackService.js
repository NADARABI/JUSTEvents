// src/services/feedbackService.js
import axios from './api'; // Axios instance with baseURL + token config

/**
 * Public: Fetch recent public feedback for the Landing Page
 */
export const getRecentFeedbackPublic = () => axios.get('/api/recent-public');

/**
 * Submit feedback for a specific event (Protected)
 * @param {number} eventId - The ID of the event
 * @param {object} payload - The feedback data (comment, rating)
 */
export const submitFeedback = (eventId, payload) => axios.post(`/api/events/${eventId}/feedback`, payload);

/**
 * Fetch all feedback for a specific event
 * @param {number} eventId - The ID of the event
 */
export const fetchEventFeedback = (eventId) => axios.get(`/api/events/${eventId}/feedback`);

/**
 * Consolidated object export
 */
const feedbackService = {
  getRecentFeedbackPublic,
  submitFeedback,
  fetchEventFeedback,
};

export default feedbackService;
