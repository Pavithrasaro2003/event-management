const Booking = require("./booking.model");
const Event = require("../event/event.model");
const User = require("../admin/admin.model");
const { Op } = require("sequelize");

// ─────────────────────────────────────────────────────────────────────────────
// POST /booking/create  (attender only)
// Accepts full customer form data + creates booking + reduces capacity
// ─────────────────────────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const {
      eventId,
      ticketCount,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerState,
      customerCountry,
      company,
      specialNotes,
    } = req.body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }
    if (!ticketCount || ticketCount < 1) {
      return res.status(400).json({ message: "Ticket count must be at least 1" });
    }

    // ── Find event ────────────────────────────────────────────────────────
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.capacity < ticketCount) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // ── Create booking ────────────────────────────────────────────────────
    const totalAmount = event.price * ticketCount;

    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      customerCity: customerCity || "",
      customerState: customerState || "",
      customerCountry: customerCountry || "",
      company: company || "",
      specialNotes: specialNotes || "",
      ticketCount,
      totalAmount,
      status: "confirmed",
      paymentStatus: "pending",
    });

    // ── Reduce available capacity ─────────────────────────────────────────
    event.capacity -= ticketCount;
    await event.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /booking/my-bookings  (attender – own bookings with full event details)
// ─────────────────────────────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Event,
          attributes: [
            "id", "title", "location", "date", "startTime",
            "endTime", "price", "category", "status",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /booking/:id  (attender or admin – cancel booking)
// ─────────────────────────────────────────────────────────────────────────────
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Event] });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    // Restore capacity
    const event = booking.Event;
    if (event) {
      event.capacity += booking.ticketCount;
      await event.save();
    }

    await booking.destroy();
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /booking/organizer/all  (organizer – all bookings for their events)
// ─────────────────────────────────────────────────────────────────────────────
const getOrganizerBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // page & search support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const bookings = await Booking.findAll({
      include: [
        {
          model: Event,
          where: { createdBy: organizerId },
          attributes: ["id", "title", "date", "location", "category"],
          required: true,
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      where: search
        ? {
            [Op.or]: [
              { customerName: { [Op.iLike]: `%${search}%` } },
              { customerEmail: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {},
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json(bookings);
  } catch (err) {
    console.error("getOrganizerBookings error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /booking/organizer/event/:eventId  (organizer – attendees for one event)
// ─────────────────────────────────────────────────────────────────────────────
const getBookingsByEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Verify event belongs to organizer
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy !== organizerId)
      return res.status(403).json({ message: "Unauthorized" });

    const sort = req.query.sort || "latest";
    const search = req.query.search || "";

    let order = [["createdAt", "DESC"]];
    if (sort === "oldest") order = [["createdAt", "ASC"]];
    if (sort === "highestTickets") order = [["ticketCount", "DESC"]];

    const bookings = await Booking.findAll({
      where: {
        eventId: req.params.eventId,
        ...(search
          ? {
              [Op.or]: [
                { customerName: { [Op.iLike]: `%${search}%` } },
                { customerEmail: { [Op.iLike]: `%${search}%` } },
              ],
            }
          : {}),
      },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order,
    });

    res.json({ event, bookings });
  } catch (err) {
    console.error("getBookingsByEvent error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  deleteBooking,
  getOrganizerBookings,
  getBookingsByEvent,
};
