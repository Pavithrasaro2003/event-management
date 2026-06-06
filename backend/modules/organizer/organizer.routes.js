const express = require("express");
const router = express.Router();
const {
  getProfile,
  getDashboard,
  getDashboardStats,
  getUpcomingEvents,
  getRecentBookings,
  getRevenueAnalytics,
  getNotifications,
} = require("./organizer.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Profile
router.get("/profile", auth, role("organizer"), getProfile);

// Legacy dashboard (backwards compat)
router.get("/dashboard", auth, role("organizer"), getDashboard);

// ── New Dashboard API endpoints ───────────────────────────────────────────────
router.get("/dashboard/stats",           auth, role("organizer"), getDashboardStats);
router.get("/dashboard/upcoming-events", auth, role("organizer"), getUpcomingEvents);
router.get("/dashboard/recent-bookings", auth, role("organizer"), getRecentBookings);
router.get("/dashboard/revenue",         auth, role("organizer"), getRevenueAnalytics);
router.get("/dashboard/notifications",   auth, role("organizer"), getNotifications);

module.exports = router;
