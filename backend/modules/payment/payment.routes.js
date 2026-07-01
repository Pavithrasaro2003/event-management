const express = require("express");
const router = express.Router();
const {
  submitPayment,
  getMySubmission,
  getPendingSubmissions,
  approvePayment,
  rejectPayment,
} = require("./payment.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Attender Routes
router.post("/submit", auth, role("attender"), submitPayment);
router.get("/my/:bookingId", auth, role("attender"), getMySubmission);

// Admin Routes
router.get("/pending", auth, role("admin"), getPendingSubmissions);
router.patch("/:id/approve", auth, role("admin"), approvePayment);
router.patch("/:id/reject", auth, role("admin"), rejectPayment);

module.exports = router;
