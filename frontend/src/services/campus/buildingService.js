import api from '../api';

// Get all buildings
export const getBuildings = async () => {
  const res = await api.get('/buildings');
  return res.data.data;
};

// Create a building
export const addBuilding = async (building) => {
  return api.post('/buildings', building);
};

// Update a building
export const updateBuilding = async (id, updates) => {
  return api.put(`/buildings/${id}`, updates);
};

// Delete a building
export const deleteBuilding = async (id) => {
  return api.delete(`/buildings/${id}`);
};
