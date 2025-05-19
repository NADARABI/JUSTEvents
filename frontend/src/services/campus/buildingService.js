import api from '../api';

// Get all buildings
export const getBuildings = async () => {
  const res = await api.get('/api/buildings');
  return res.data.data;
};

// Create a building
export const addBuilding = async (building) => {
  return api.post('/api/buildings', building);
};

// Update a building
export const updateBuilding = async (id, updates) => {
  return api.put(`/api/buildings/${id}`, updates);
};

// Delete a building
export const deleteBuilding = async (id) => {
  return api.delete(`/api/buildings/${id}`);
};
