import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth
import Login from '../modules/auth/Login';

// Admin
import AdminDashboard from '../modules/admin/AdminDashboard';
import ManageOrganizers from '../modules/admin/ManageOrganizers';

// Organizer
import OrganizerDashboard from '../modules/organizer/OrganizerDashboard';
import OrganizerBookings from '../modules/organizer/OrganizerBookings';
import CreateEvent from '../modules/organizer/CreateEvent';
import MyEvents from '../modules/organizer/MyEvents';
import EventAttendees from '../modules/organizer/EventAttendees';

// Attender
import AttenderDashboard from '../modules/attender/AttenderDashboard';
import EventList from '../modules/attender/EventList';
import EventDetails from '../modules/attender/EventDetails';
import MyBookings from '../modules/attender/MyBookings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/organizers" element={<ProtectedRoute allowedRoles={['admin']}><ManageOrganizers /></ProtectedRoute>} />

      {/* Organizer Routes */}
      <Route path="/organizer/dashboard" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/bookings" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerBookings /></ProtectedRoute>} />
      <Route path="/organizer/events" element={<ProtectedRoute allowedRoles={['organizer']}><MyEvents /></ProtectedRoute>} />
      <Route path="/organizer/create-event" element={<ProtectedRoute allowedRoles={['organizer']}><CreateEvent /></ProtectedRoute>} />
      <Route path="/organizer/events/:id/attendees" element={<ProtectedRoute allowedRoles={['organizer']}><EventAttendees /></ProtectedRoute>} />

      {/* Attender Routes */}
      <Route path="/attender/dashboard" element={<ProtectedRoute allowedRoles={['attender']}><AttenderDashboard /></ProtectedRoute>} />
      <Route path="/attender/events" element={<ProtectedRoute allowedRoles={['attender']}><EventList /></ProtectedRoute>} />
      <Route path="/attender/events/:id" element={<ProtectedRoute allowedRoles={['attender']}><EventDetails /></ProtectedRoute>} />
      <Route path="/attender/bookings" element={<ProtectedRoute allowedRoles={['attender']}><MyBookings /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
