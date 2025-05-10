import axios from 'axios';

const API_URL = '/booking';

export const createBooking = async (data) => {
  return await axios.post(`${API_URL}/bookings`, data);
};

export const getMyBookings = async () => {
  return await axios.get(`${API_URL}/bookings/me`);
};

export const cancelBooking = async (id) => {
  return await axios.delete(`${API_URL}/bookings/${id}`);
};

export const getPendingBookings = async () => {
  return await axios.get(`${API_URL}/bookings/pending`);
};

export const reviewBooking = async (id, status) => {
  return await axios.patch(`${API_URL}/bookings/${id}`, { status });
};

export const getBookingStats = async () => {
  return await axios.get(`${API_URL}/bookings/stats`);
};
