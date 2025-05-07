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
 * Consolidated object export
 */
const eventService = {
  getAllEvents,
  getPopularEvents,
  getPopularEventsPublic,
  getEventById,
  getPublicStats,
};

export default eventService;
