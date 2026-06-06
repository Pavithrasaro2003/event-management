const express = require("express");
const router = express.Router();
const { getProfile } = require("./attender.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Protected test route
router.get("/profile", auth, role("attender"), getProfile);

module.exports = router;
