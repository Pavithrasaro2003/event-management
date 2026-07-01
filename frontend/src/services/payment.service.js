import api from './api';

// Attender: Submit payment proof
export const submitPayment = async (data) => {
  const response = await api.post('/payment/submit', data);
  return response.data;
};

// Attender: Get payment submission status for a booking
export const getMySubmission = async (bookingId) => {
  const response = await api.get(`/payment/my/${bookingId}`);
  return response.data;
};

// Admin: Get all pending payment submissions
export const getPendingSubmissions = async () => {
  const response = await api.get('/payment/pending');
  return response.data;
};

// Admin: Approve a payment
export const approvePayment = async (id) => {
  const response = await api.patch(`/payment/${id}/approve`);
  return response.data;
};

// Admin: Reject a payment
export const rejectPayment = async (id) => {
  const response = await api.patch(`/payment/${id}/reject`);
  return response.data;
};
