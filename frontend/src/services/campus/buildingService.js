import api from '../api';

export const getBuildings = async () => {
  const res = await api.get('/buildings');
  return res.data.data;
};

export const addBuilding = async (building) => {
  return api.post('/buildings', building);
};

export const updateBuilding = async (id, updates) => {
  return api.put(`/buildings/${id}`, updates);
};

export const deleteBuilding = async (id) => {
  return api.delete(`/buildings/${id}`);
};
