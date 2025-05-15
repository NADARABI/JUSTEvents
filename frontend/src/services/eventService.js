// src/services/eventService.js
import axios from './api'; // Axios instance with baseURL + token config

/**
 * Public Routes for Landing Page
 */
export const getPopularEventsPublic = () => axios.get('/analytics/popular-events-public');
export const getPublicStats = () => axios.get('/analytics/summary-public');

/**
 * Fetch all events, with optional query parameters for filtering
 * @param {string} query - Optional query string (e.g., `?category=Tech`)
 */
export const getAllEvents = (query = '') => axios.get(`/api/events${query}`);

/**
 * Fetch popular events (Protected Route)
 */
export const getPopularEvents = () => axios.get('/analytics/popular-events');

/**
 * Fetch event details by ID
 * @param {number} id - Event ID
 */
export const getEventById = (id) => axios.get(`/api/events/${id}`);

/**
 * Create a new event (Organizer Only)
 * @param {Object} formData - Form data including event details
 */
export const createEvent = async (formData) => {
  const res = await axios.post('/api/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

/**
 * Edit an existing event (Organizer Only)
 * @param {number} id - Event ID
 * @param {Object} formData - Form data including event details
 */
export const editEvent = async (id, formData) => {
  const res = await axios.put(`/api/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

/**
 * Delete an event (Organizer Only)
 * @param {number} id - Event ID
 */
export const deleteEvent = async (id) => {
  const res = await axios.delete(`/api/events/${id}`);
  return res.data;
};

/**
 * Consolidated object export
 */
const eventService = {
  getAllEvents,
  getPopularEvents,
  getPopularEventsPublic,
  getEventById,
  getPublicStats,
  createEvent,
  editEvent,
  deleteEvent
};

export default eventService;
