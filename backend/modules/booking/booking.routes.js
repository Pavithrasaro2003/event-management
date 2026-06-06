const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  deleteBooking,
  getOrganizerBookings,
  getBookingsByEvent,
} = require("./booking.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Attender routes
router.post("/create", auth, role("attender"), createBooking);
router.get("/my-bookings", auth, role("attender"), getMyBookings);
router.delete("/:id", auth, role("attender", "admin"), deleteBooking);

// Organizer routes – all bookings for organizer's events
router.get("/organizer/all", auth, role("organizer"), getOrganizerBookings);
router.get("/organizer/event/:eventId", auth, role("organizer"), getBookingsByEvent);

module.exports = router;
