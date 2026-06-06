const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  togglePauseEvent,
  deleteEvent,
  getEventAttendees,
  getOrganizerAnalytics,
  sendAnnouncement,
} = require("./event.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

router.post("/create", auth, role("organizer"), createEvent);
router.get("/", getEvents);
router.get("/my-events", auth, role("organizer"), getMyEvents);
router.get("/analytics", auth, role("organizer"), getOrganizerAnalytics);
router.get("/:id", getEventById);
router.get("/:id/attendees", auth, role("organizer", "admin"), getEventAttendees);
router.put("/:id", auth, role("organizer", "admin"), updateEvent);
router.patch("/:id/pause", auth, role("organizer", "admin"), togglePauseEvent);
router.post("/:id/announce", auth, role("organizer", "admin"), sendAnnouncement);
router.delete("/:id", auth, role("organizer", "admin"), deleteEvent);

module.exports = router;
