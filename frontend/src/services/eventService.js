// src/services/eventService.js
import api from './api';

/**
 * =============================
 * Public Routes for Landing Page
 * =============================
 */
export const getPopularEventsPublic = () => api.get('/analytics/popular-events-public');
export const getPublicStats = () => api.get('/analytics/summary-public');

/**
 * =============================
 * Fetch All Events
 * =============================
 * @param {string} query - Optional query string (e.g., `?category=Tech`)
 */
export const getAllEvents = (query = '') => api.get(`/api/events${query}`);

/**
 * =============================
 * Fetch Popular Events (Protected Route)
 * =============================
 */
export const getPopularEvents = () => api.get('/analytics/popular-events');

/**
 * =============================
 * Fetch Event Details by ID
 * =============================
 * @param {number} id - Event ID
 */
export const getEventById = (id) => api.get(`/api/events/${id}`);

/**
 * =============================
 * Create New Event (Organizer Only)
 * =============================
 * @param {Object} formData - Form data including event details
 */
export const createEvent = async (formData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("No token found, are you logged in?");
    throw new Error("Unauthorized: You need to log in first.");
  }

  try {
    const response = await api.post('/api/events', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create event:", error.message);
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: You are not allowed to create events.");
    } else {
      throw new Error("Failed to create event. Please try again.");
    }
  }
};

/**
 * =============================
 * Edit Event (Organizer Only)
 * =============================
 * @param {number} id - Event ID
 * @param {Object} formData - Form data including event details
 */
export const editEvent = async (id, formData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("No token found, are you logged in?");
    throw new Error("Unauthorized: You need to log in first.");
  }

  try {
    const response = await api.put(`/api/events/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to edit event:", error.message);
    throw error;
  }
};

/**
 * =============================
 * Delete Event (Organizer Only)
 * =============================
 * @param {number} id - Event ID
 */
export const deleteEvent = async (id) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("No token found, are you logged in?");
    throw new Error("Unauthorized: You need to log in first.");
  }

  try {
    const response = await api.delete(`/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete event:", error.message);
    throw error;
  }
};

/**
 * =============================
 *  Consolidated Object Export
 * =============================
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
