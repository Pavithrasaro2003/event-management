import api from './api';

export const getAllEvents = async () => {
  const response = await api.get('/event');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/event/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/event/create', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/event/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/event/${id}`);
  return response.data;
};
