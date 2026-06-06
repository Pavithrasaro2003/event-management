import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getOrganizers = async () => {
  const response = await api.get('/admin/organizers');
  return response.data;
};

export const createOrganizer = async (data) => {
  const response = await api.post('/admin/create-user', { ...data, role: 'organizer' });
  return response.data;
};

export const updateOrganizer = async (id, data) => {
  const response = await api.put(`/admin/organizer/${id}`, data);
  return response.data;
};

export const deleteOrganizer = async (id) => {
  const response = await api.delete(`/admin/organizer/${id}`);
  return response.data;
};
