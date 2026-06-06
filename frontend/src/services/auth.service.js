import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

// Based on backend routes, create-user is in admin
export const createUser = async (userData) => {
  const response = await api.post('/admin/create-user', userData);
  return response.data;
};
