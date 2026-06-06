const Event = require("./event.model");
const Booking = require("../booking/booking.model");
const User = require("../admin/admin.model");
const { Op } = require("sequelize");

// Create event (organizer only)
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, startTime, endTime, capacity, price, category } = req.body;

    if (!title || !location || !date || !capacity || price === undefined) {
      return res.status(400).json({ message: "title, location, date, capacity and price are required" });
    }

    const event = await Event.create({
      title,
      description: description || "",
      location,
      date,
      startTime: startTime || "00:00:00",
      endTime: endTime || "23:59:00",
      capacity: Number(capacity),
      totalCapacity: Number(capacity), // track original capacity for progress bar
      price: Number(price),
      category: category || "General",
      status: "active",
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all events (public/anyone)
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { status: { [Op.ne]: "paused" } } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events created by this organizer (includes paused)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { createdBy: req.user.id } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by id (public/anyone)
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event (organizer only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own events" });
    }

    await event.update(req.body);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle pause/active for an event
const togglePauseEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    event.status = event.status === "paused" ? "active" : "paused";
    await event.save();
    res.json({ message: `Event ${event.status}`, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event (organizer only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own events" });
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendees list for an event (organizer)
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.findAll({
      where: { eventId: req.params.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    const attendees = bookings.map((b) => ({
      bookingId: b.id,
      userId: b.User?.id,
      name: b.User?.name,
      email: b.User?.email,
      ticketCount: b.ticketCount,
      totalAmount: b.totalAmount,
      status: b.status,
    }));

    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get organizer analytics
const getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const myEvents = await Event.findAll({ where: { createdBy: organizerId } });
    const eventIds = myEvents.map((e) => e.id);

    const activeCount = myEvents.filter((e) => e.status === "active").length;

    // total revenue from all bookings for organizer's events
    const bookings = await Booking.findAll({
      where: { eventId: { [Op.in]: eventIds.length ? eventIds : [0] } },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // recent 5 registrations
    const recent = bookings.slice(0, 5).map((b) => ({
      bookingId: b.id,
      name: b.User?.name,
      email: b.User?.email,
      eventId: b.eventId,
      ticketCount: b.ticketCount,
      totalAmount: b.totalAmount,
      bookedAt: b.createdAt,
    }));

    res.json({ totalRevenue, activeEventsCount: activeCount, recentRegistrations: recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send announcement to all attendees of an event (simulated — logged to console)
const sendAnnouncement = async (req, res) => {
  try {
    const { message: announcementMsg } = req.body;
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.findAll({
      where: { eventId: req.params.id },
      include: [{ model: User, attributes: ["name", "email"] }],
    });

    const recipients = bookings.map((b) => b.User?.email).filter(Boolean);

    // In production you'd send emails here. For now we log and return the list.
    console.log(`📢 Announcement for "${event.title}": ${announcementMsg}`);
    console.log("Recipients:", recipients);

    res.json({
      message: `Announcement sent to ${recipients.length} attendees`,
      recipients,
      announcementText: announcementMsg,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
