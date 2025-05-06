// src/services/eventService.js
import axios from './api'; // Axios instance with baseURL + token config

// Public Routes (used in Landing Page)
const getPopularEventsPublic = () => {
  return axios.get('/analytics/popular-events-public');
};

const getPublicStats = () => {
  return axios.get('/analytics/summary-public');
};

//  Authenticated Routes (used inside dashboards)
export const getAllEvents = (query = '') => {
  return axios.get(`/events${query}`);
};

export const getPopularEvents = () => {
  return axios.get('/analytics/popular-events');
};

export const getEventById = (id) => {
  return axios.get(`/events/${id}`);
};

// Named exports for flexibility + default object for service import
const eventService = {
  getAllEvents,
  getPopularEvents,
  getPopularEventsPublic,
  getEventById,
  getPublicStats,
};

export default eventService;
