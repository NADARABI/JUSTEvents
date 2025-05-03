import api from './api';

export const getSavedEvents = () => api.get('/saved-events');

export const unsaveEvent = (eventId) => api.delete(`/saved-events/${eventId}`);