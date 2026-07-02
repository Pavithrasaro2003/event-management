const User = require("./admin.model");
const Event = require("../event/event.model");
const Booking = require("../booking/booking.model");
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require("../../utils/email.service");

// CREATE USER (temporary for testing, maybe update to specific roles or just general)
// CREATE USER (temporary for testing, maybe update to specific roles or just general)
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Send welcome email ONLY after successful organizer creation.
    // Email failures must NOT stop organizer creation – isolated in its own try/catch.
    if (user.role === 'organizer') {
      try {
        await sendWelcomeEmail(user.email, user.name, req.body.password);
      } catch (emailError) {
        console.error('Failed to send organizer welcome email:', emailError);
      }
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login controller
// Login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
    
    const roleMessage = `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} login successful`;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: roleMessage,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Admin Profile
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// GET Admin Dashboard
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrganizers = await User.count({ where: { role: 'organizer' } });
    const totalAttenders = await User.count({ where: { role: 'attender' } });
    const totalEvents = await Event.count();
    const totalBookings = await Booking.count();

    res.json({
      totalUsers,
      totalOrganizers,
      totalAttenders,
      totalEvents,
      totalBookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all organizers
const getOrganizers = async (req, res) => {
  try {
    const organizers = await User.findAll({
      where: { role: 'organizer' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE organizer
const updateOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    const organizer = await User.findOne({ where: { id, role: 'organizer' } });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    if (name) organizer.name = name;
    if (email) organizer.email = email;
    if (password) organizer.password = password;

    await organizer.save();
    
    const updatedOrganizer = organizer.toJSON();
    delete updatedOrganizer.password;
    
    res.json({ message: 'Organizer updated successfully', organizer: updatedOrganizer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE organizer
const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const organizer = await User.findOne({ where: { id, role: 'organizer' } });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    await organizer.destroy();
    res.json({ message: 'Organizer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  createUser, 
  loginUser,
  getProfile,
  getDashboard,
  getOrganizers,
  updateOrganizer,
  deleteOrganizer
};