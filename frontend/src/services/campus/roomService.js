import api from '../api';

// Get all rooms (with building name)
export const getRooms = async () => {
  const res = await api.get('/rooms');
  return res.data.data;
};

// Create a room
export const addRoom = async (room) => {
  return api.post('/rooms', room);
};

// Update a room
export const updateRoom = async (id, updates) => {
  return api.put(`/rooms/${id}`, updates);
};

// Delete a room
export const deleteRoom = async (id) => {
  return api.delete(`/rooms/${id}`);
};
