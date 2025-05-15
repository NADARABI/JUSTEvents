import api from '../api';

export const getRooms = async () => {
  const res = await api.get('/rooms');
  return res.data.data;
};

export const getBuildings = async () => {
  const res = await api.get('/buildings');
  return res.data.data;
};

export const addRoom = async (room) => {
  return api.post('/rooms', room);
};

export const updateRoom = async (id, updates) => {
  return api.put(`/rooms/${id}`, updates);
};

export const deleteRoom = async (id) => {
  return api.delete(`/rooms/${id}`);
};
