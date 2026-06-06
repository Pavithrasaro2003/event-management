import api from './api';

// ── Attender ────────────────────────────────────────────────────────────────

/** Create a new booking with full customer details */
export const createBooking = async (bookingData) => {
  const response = await api.post('/booking/create', bookingData);
  return response.data;
};

/** Get logged-in attender's own bookings */
export const getMyBookings = async () => {
  const response = await api.get('/booking/my-bookings');
  return response.data;
};

/** Cancel a booking */
export const cancelBooking = async (id) => {
  const response = await api.delete(`/booking/${id}`);
  return response.data;
};

// ── Organizer ───────────────────────────────────────────────────────────────

/** Get all bookings for all of this organizer's events (with search/pagination) */
export const getOrganizerAllBookings = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/booking/organizer/all', {
    params: { page, limit, search },
  });
  return response.data;
};

/** Get bookings for a specific event (organizer only) */
export const getBookingsByEvent = async (eventId, sort = 'latest', search = '') => {
  const response = await api.get(`/booking/organizer/event/${eventId}`, {
    params: { sort, search },
  });
  return response.data;
};

// ── Dashboard API ───────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const response = await api.get('/organizer/dashboard/stats');
  return response.data;
};

export const getDashboardUpcomingEvents = async () => {
  const response = await api.get('/organizer/dashboard/upcoming-events');
  return response.data;
};

export const getDashboardRecentBookings = async () => {
  const response = await api.get('/organizer/dashboard/recent-bookings');
  return response.data;
};

export const getDashboardRevenue = async () => {
  const response = await api.get('/organizer/dashboard/revenue');
  return response.data;
};

export const getDashboardNotifications = async () => {
  const response = await api.get('/organizer/dashboard/notifications');
  return response.data;
};
