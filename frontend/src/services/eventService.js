import axios from 'axios';

export const createEvent = async (formData) => {
  const res = await axios.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const editEvent = async (id, formData) => {
  const res = await axios.put(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getEventById = async (id) => {
  const res = await axios.get(`/events/${id}`);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`/events/${id}`);
  return res.data;
};
