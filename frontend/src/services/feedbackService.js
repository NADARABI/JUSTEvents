import axios from './api'; // Uses configured baseURL + token

// Public: Fetch recent feedback (for Landing Page)
export const getRecentFeedbackPublic = () => {
  return axios.get('/api/recent-public');
};

// Submit feedback for a specific event (protected)
export const submitFeedback = (eventId, rating, comment) => {
  return axios.post('/feedback/submit', { eventId, rating, comment });
};

//  Fetch all feedback for a specific event (protected)
export const fetchEventFeedback = (eventId) => {
  return axios.get(`/feedback/events/${eventId}/feedback`);
};

// Export object if needed elsewhere
const feedbackService = {
  getRecentFeedbackPublic,
  submitFeedback,
  fetchEventFeedback,
};

export default feedbackService;
