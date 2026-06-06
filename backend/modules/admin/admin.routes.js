const express = require("express");
const router = express.Router();
const { 
  createUser, 
  loginUser, 
  getProfile, 
  getDashboard,
  getOrganizers,
  updateOrganizer,
  deleteOrganizer
} = require("./admin.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

router.post("/create-user", auth, role("admin"), createUser); // Only admin can create users/organizers
router.post("/login", loginUser);

// Protected test route
router.get("/profile", auth, role("admin"), getProfile);

// Admin dashboard
router.get("/dashboard", auth, role("admin"), getDashboard);

// Organizer CRUD
router.get("/organizers", auth, role("admin"), getOrganizers);
router.put("/organizer/:id", auth, role("admin"), updateOrganizer);
router.delete("/organizer/:id", auth, role("admin"), deleteOrganizer);

module.exports = router;