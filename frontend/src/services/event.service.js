import api from './api';

export const getAllEvents = async () => {
  const response = await api.get('/event');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/event/${id}`);
  return response.data;
};

export const createEvent = async (formData) => {
  // formData is a FormData object built by the caller (includes the image file).
  // We must set Content-Type to multipart/form-data so Multer can parse the file.
  const response = await api.post('/event/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
