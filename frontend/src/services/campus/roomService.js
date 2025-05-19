import api from '../api';

// Get all rooms (with building name)
export const getRooms = async () => {
  const res = await api.get('/api/rooms');
  return res.data.data;
};

// Create a room
export const addRoom = async (room) => {
  return api.post('/api/rooms', room);
};

// Update a room
export const updateRoom = async (id, updates) => {
  return api.put(`/api/rooms/${id}`, updates);
};

// Delete a room
export const deleteRoom = async (id) => {
  return api.delete(`/api/rooms/${id}`);
};
