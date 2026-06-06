const Event = require("../event/event.model");
const Booking = require("../booking/booking.model");
const User = require("../admin/admin.model");
const { Op, fn, col, literal } = require("sequelize");

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/profile
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard/stats
// Returns: totalEvents, activeEvents, upcomingEvents,
//          totalTicketsSold, totalRevenue, pendingPayments, totalBookings
// ─────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    // Fetch all organizer events and bookings in parallel
    const [myEvents, allBookings] = await Promise.all([
      Event.findAll({ where: { createdBy: organizerId } }),
      Booking.findAll({
        include: [
          {
            model: Event,
            where: { createdBy: organizerId },
            required: true,
            attributes: [],
          },
        ],
      }),
    ]);

    const eventIds = myEvents.map((e) => e.id);

    const totalEvents = myEvents.length;
    const activeEvents = myEvents.filter((e) => e.status === "active").length;
    const upcomingEvents = myEvents.filter(
      (e) => e.date >= today && e.status !== "paused"
    ).length;

    const totalTicketsSold = allBookings.reduce(
      (sum, b) => sum + (b.ticketCount || 0),
      0
    );
    const totalRevenue = allBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );
    const totalBookings = allBookings.length;
    const pendingPayments = allBookings.filter(
      (b) => b.paymentStatus === "pending"
    ).length;

    res.json({
      totalEvents,
      activeEvents,
      upcomingEvents,
      totalTicketsSold,
      totalRevenue,
      totalBookings,
      pendingPayments,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard/upcoming-events
// Returns events with date >= today, including booking counts
// ─────────────────────────────────────────────────────────────────────────────
const getUpcomingEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const events = await Event.findAll({
      where: {
        createdBy: organizerId,
        date: { [Op.gte]: today },
        status: { [Op.ne]: "paused" },
      },
      order: [["date", "ASC"]],
      limit: 6,
    });

    // For each event fetch booking count and revenue
    const enriched = await Promise.all(
      events.map(async (ev) => {
        const bookings = await Booking.findAll({ where: { eventId: ev.id } });
        const ticketsSold = bookings.reduce((s, b) => s + b.ticketCount, 0);
        const revenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
        const bookingCount = bookings.length;

        return {
          ...ev.toJSON(),
          ticketsSold,
          availableTickets: ev.capacity,
          totalCapacityOrig: ev.totalCapacity || ev.capacity + ticketsSold,
          revenue,
          bookingCount,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("getUpcomingEvents error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard/recent-bookings
// Returns last 10 bookings for this organizer's events
// ─────────────────────────────────────────────────────────────────────────────
const getRecentBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const bookings = await Booking.findAll({
      include: [
        {
          model: Event,
          where: { createdBy: organizerId },
          required: true,
          attributes: ["id", "title", "date", "location", "category"],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    res.json(bookings);
  } catch (err) {
    console.error("getRecentBookings error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard/revenue
// Returns monthly revenue array + per-event revenue for charts
// ─────────────────────────────────────────────────────────────────────────────
const getRevenueAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const myEvents = await Event.findAll({ where: { createdBy: organizerId } });
    const eventIds = myEvents.map((e) => e.id);

    if (!eventIds.length) {
      return res.json({ monthly: [], perEvent: [], ticketsPerEvent: [] });
    }

    const allBookings = await Booking.findAll({
      where: { eventId: { [Op.in]: eventIds } },
      include: [
        { model: Event, attributes: ["id", "title"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    // ── Monthly revenue (last 6 months) ───────────────────────────────────
    const monthlyMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = { revenue: 0, tickets: 0 };
    }

    allBookings.forEach((b) => {
      const d = new Date(b.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap[key] !== undefined) {
        monthlyMap[key].revenue += b.totalAmount || 0;
        monthlyMap[key].tickets += b.ticketCount || 0;
      }
    });

    const monthly = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      revenue: parseFloat(data.revenue.toFixed(2)),
      tickets: data.tickets,
    }));

    // ── Per-event revenue ─────────────────────────────────────────────────
    const perEventMap = {};
    allBookings.forEach((b) => {
      const title = b.Event?.title || `Event #${b.eventId}`;
      if (!perEventMap[title]) perEventMap[title] = { revenue: 0, tickets: 0 };
      perEventMap[title].revenue += b.totalAmount || 0;
      perEventMap[title].tickets += b.ticketCount || 0;
    });

    const perEvent = Object.entries(perEventMap).map(([event, data]) => ({
      event,
      revenue: parseFloat(data.revenue.toFixed(2)),
      tickets: data.tickets,
    }));

    res.json({ monthly, perEvent });
  } catch (err) {
    console.error("getRevenueAnalytics error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard/notifications
// Returns new bookings as notification items (last 20)
// ─────────────────────────────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const bookings = await Booking.findAll({
      include: [
        {
          model: Event,
          where: { createdBy: organizerId },
          required: true,
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    const notifications = bookings.map((b) => ({
      id: b.id,
      message: `${b.customerName} booked ${b.ticketCount} ticket${
        b.ticketCount > 1 ? "s" : ""
      } for "${b.Event?.title}"`,
      customerName: b.customerName,
      eventName: b.Event?.title,
      ticketCount: b.ticketCount,
      amount: b.totalAmount,
      time: b.createdAt,
      read: false,
    }));

    res.json({ notifications, unreadCount: notifications.length });
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /organizer/dashboard  (kept for backwards compat)
// ─────────────────────────────────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  return getDashboardStats(req, res);
};

module.exports = {
  getProfile,
  getDashboard,
  getDashboardStats,
  getUpcomingEvents,
  getRecentBookings,
  getRevenueAnalytics,
  getNotifications,
};
