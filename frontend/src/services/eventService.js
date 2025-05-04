// src/services/eventService.js
import axios from './api'; // Axios instance with baseURL + token config

// Get all approved/public events
export const getAllEvents = (query = '') => {
  return axios.get(`/events${query}`);
};

// Get popular events for landing page
export const getPopularEvents = () => {
  return axios.get('/analytics/popular-events');
};

// Get event by ID
export const getEventById = (id) => {
  return axios.get(`/events/${id}`);
};

// Named export + default object (avoids ESLint warning)
const eventService = {
  getAllEvents,
  getPopularEvents,
  getEventById,
};

export default eventService;
