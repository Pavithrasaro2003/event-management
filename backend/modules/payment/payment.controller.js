const PaymentSubmission = require("./payment.model");
const Booking = require("../booking/booking.model");
const Event = require("../event/event.model");
const User = require("../admin/admin.model");

// ─────────────────────────────────────────────────────────────────────────────
// POST /payment/submit
// Attender submits a UPI transaction ID for a booking
// ─────────────────────────────────────────────────────────────────────────────
const submitPayment = async (req, res) => {
  try {
    const { bookingId, transactionId, upiId } = req.body;
    const userId = req.user.id;

    if (!bookingId || !transactionId) {
      return res.status(400).json({ message: "Booking ID and Transaction ID are required" });
    }

    const booking = await Booking.findByPk(bookingId, { include: [Event] });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure the booking belongs to the logged-in user
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if submission already exists
    const existing = await PaymentSubmission.findOne({ where: { bookingId } });
    if (existing) {
      return res.status(400).json({ message: "Payment already submitted for this booking" });
    }

    const submission = await PaymentSubmission.create({
      bookingId,
      userId,
      eventId: booking.eventId,
      amount: booking.totalAmount,
      transactionId,
      upiId: upiId || null,
      status: "approved",
    });

    // Auto-approve the booking immediately
    booking.paymentStatus = "paid";
    await booking.save();

    res.status(201).json({ message: "Payment processed successfully", submission });
  } catch (err) {
    console.error("submitPayment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /payment/my/:bookingId
// Attender checks the status of their payment submission for a specific booking
// ─────────────────────────────────────────────────────────────────────────────
const getMySubmission = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const submission = await PaymentSubmission.findOne({
      where: { bookingId, userId: req.user.id },
    });

    if (!submission) {
      return res.status(404).json({ message: "No payment submission found for this booking" });
    }

    res.json(submission);
  } catch (err) {
    console.error("getMySubmission error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /payment/pending
// Admin gets all pending payment submissions
// ─────────────────────────────────────────────────────────────────────────────
const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await PaymentSubmission.findAll({
      where: { status: "pending" },
      include: [
        { model: Booking, attributes: ["id", "ticketCount", "totalAmount"] },
        { model: User, attributes: ["id", "name", "email"] },
        { model: Event, attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(submissions);
  } catch (err) {
    console.error("getPendingSubmissions error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /payment/:id/approve
// Admin approves a payment submission
// ─────────────────────────────────────────────────────────────────────────────
const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await PaymentSubmission.findByPk(id);

    if (!submission) return res.status(404).json({ message: "Submission not found" });
    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Submission is not pending" });
    }

    // Update submission
    submission.status = "approved";
    await submission.save();

    // Update booking paymentStatus
    const booking = await Booking.findByPk(submission.bookingId);
    if (booking) {
      booking.paymentStatus = "paid";
      await booking.save();
    }

    res.json({ message: "Payment approved successfully", submission });
  } catch (err) {
    console.error("approvePayment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /payment/:id/reject
// Admin rejects a payment submission
// ─────────────────────────────────────────────────────────────────────────────
const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await PaymentSubmission.findByPk(id);

    if (!submission) return res.status(404).json({ message: "Submission not found" });
    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Submission is not pending" });
    }

    // Update submission
    submission.status = "rejected";
    await submission.save();

    res.json({ message: "Payment rejected successfully", submission });
  } catch (err) {
    console.error("rejectPayment error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  submitPayment,
  getMySubmission,
  getPendingSubmissions,
  approvePayment,
  rejectPayment,
};
