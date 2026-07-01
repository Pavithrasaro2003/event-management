const express = require("express");
const router = express.Router();
const { getProfile, registerAttender } = require("./attender.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Public registration route
router.post("/register", registerAttender);

// Protected test route
router.get("/profile", auth, role("attender"), getProfile);

module.exports = router;
