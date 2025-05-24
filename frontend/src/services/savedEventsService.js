// src/services/savedEventsService.js
import api from './api';

/**
 * Get All Saved Events for the Logged-In User
 */
export const getSavedEvents = async () => {
  try {
    const response = await api.get('/api/saved-events');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch saved events:', error.message);
    throw new Error('Failed to fetch saved events');
  }
};

/**
 * Save Event
 * Adds an event to the user's saved list
 */
export const saveEvent = async (eventId) => {
  try {
    const response = await api.post(`/api/events/${eventId}/save`);
    return response.data.message;
  } catch (error) {
    if (error.response?.status === 409) {
      console.error('Event already saved');
      throw new Error('Event already saved');
    }
    console.error('Failed to save event:', error.message);
    throw new Error('Failed to save event');
  }
};

/**
 * Unsave Event
 * Removes an event from the user's saved list
 */
export const unsaveEvent = async (eventId) => {
  try {
    await api.delete(`/api/events/${eventId}/save`);
  } catch (error) {
    console.error('Failed to unsave event:', error.message);
    throw new Error('Failed to unsave event');
  }
};
