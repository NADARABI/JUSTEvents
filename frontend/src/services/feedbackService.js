import axios from 'axios';

// Submit feedback for a specific event
export const submitFeedback = (eventId, rating, comment) => {
  return axios.post('/feedback/submit', { eventId, rating, comment });
};

// Fetch feedback for a specific event
export const fetchEventFeedback = (eventId) => {
  return axios.get(`/feedback/events/${eventId}/feedback`);
};
