// src/services/savedEventsService.js
import api from './api';

/**
 * ✅ Get All Saved Events for the Logged-In User
 */
export const getSavedEvents = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('❌ Token not found. Are you logged in?');
    throw new Error('Unauthorized - Token not found');
  }

  try {
    const response = await api.get('/api/saved-events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Return data if successful
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('❌ Unauthorized - Invalid token');
      throw new Error('Unauthorized - Invalid token');
    } else {
      console.error('❌ Failed to fetch saved events:', error.message);
      throw new Error('Failed to fetch saved events');
    }
  }
};

/**
 * ✅ Save Event
 * Adds an event to the user's saved list
 */
export const saveEvent = async (eventId) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('❌ Token not found. Are you logged in?');
    throw new Error('Unauthorized - Token not found');
  }

  try {
    const response = await api.post(`/api/events/${eventId}/save`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ If successful, return the response message
    return response.data.message;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('❌ Unauthorized - Invalid token');
      throw new Error('Unauthorized - Invalid token');
    } else if (error.response && error.response.status === 409) {
      console.error('❌ Event already saved');
      throw new Error('Event already saved');
    } else {
      console.error('❌ Failed to save event:', error.message);
      throw new Error('Failed to save event');
    }
  }
};

/**
 * ✅ Unsave Event
 * Removes an event from the user's saved list
 */
export const unsaveEvent = async (eventId) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('❌ Token not found. Are you logged in?');
    throw new Error('Unauthorized - Token not found');
  }

  try {
    await api.delete(`/api/events/${eventId}/save`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('❌ Unauthorized - Invalid token');
      throw new Error('Unauthorized - Invalid token');
    } else {
      console.error('❌ Failed to unsave event:', error.message);
      throw new Error('Failed to unsave event');
    }
  }
};
