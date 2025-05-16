import api from '../api'; 

// GET /bookings/pending → fetch all pending booking requests
export const getPendingBookings = async () => {
  const response = await api.get('/booking/bookings/pending');
  return response.data.data; // Extract the data array
};

// PATCH /bookings/:id → approve or reject a booking
export const reviewBooking = async (id, status) => {
  const response = await api.patch(`/booking/bookings/${id}`, { status });
  return response.data.message; // return message for feedback
};

export const getBookingStats = async () => {
  const res = await api.get('/booking/bookings/stats');
  return res.data.data;
};
