import api from '../api';

export const getTotalBookings = async () => {
  const res = await api.get('/analytics/bookings/total');
  return res.data.data;
};

export const getMostUsedRooms = async () => {
  const res = await api.get('/analytics/bookings/most-used');
  return res.data.data;
};

export const getBookingTrends = async () => {
  const res = await api.get('/analytics/bookings/trends');
  return res.data.data;
};

export const getBookingsByBuilding = async () => {
  const res = await api.get('/analytics/bookings/by-building');
  return res.data.data;
};

export const getBookingCancelRate = async () => {
  const res = await api.get('/analytics/bookings/cancel-rate');
  return res.data.data;
};
