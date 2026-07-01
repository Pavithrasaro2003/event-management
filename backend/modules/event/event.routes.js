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
const upload = require("../../middleware/upload");

// Upload middleware is scoped ONLY to this route — no other route is affected.
// upload.single('image') handles a single file field named 'image'.
// If Multer rejects the file (wrong type / too large) it passes an error to
// the next error-handling middleware before the controller even runs.
router.post(
  "/create",
  auth,
  role("organizer"),
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Return a clear 400 with the Multer error message
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createEvent
);
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
