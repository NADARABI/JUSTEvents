import api from './api'; // Axios instance with token + baseURL

/**
 * =====================
 * User Management
 * =====================
 */
export const fetchPendingUsers = () => {
  console.log("Calling GET /admin/pending-users");
  return api.get('/admin/pending-users');
};


export const approveUser = (id) => api.patch(`/admin/approve/${id}`);

export const rejectUser = (id) => api.patch(`/admin/reject/${id}`);

/**
 * =====================
 * Event Approvals
 * =====================
 */
export const fetchPendingEvents = () => api.get('/approve/events');

export const reviewEvent = (eventId, payload) =>
  api.post(`/approve/event/${eventId}`, payload);

/**
 * =====================
 * Dashboard Analytics
 * =====================
 */
export const fetchTotalEvents = () => api.get('/analytics/total-events');

export const fetchTotalRSVPs = () => api.get('/analytics/total-rsvps');

export const fetchTopUsers = () => api.get('/analytics/users/most-engaged');

export const autoCloseExpired = () => api.patch('/analytics/events/auto-close-expired');

export const fetchEventOfWeek = () => api.get('/analytics/events/event-of-the-week');

/**
 * =====================
 * Notification Management
 * =====================
 */
export const fetchNotifications = () => api.get('/notifications');

export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);

export const markAllRead = () => api.patch('/notifications/mark-all-read');

export const deleteOldNotifications = () => api.delete('/notifications/cleanup-old');
