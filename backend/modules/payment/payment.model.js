const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = require("../admin/admin.model");
const Booking = require("../booking/booking.model");
const Event = require("../event/event.model");

const PaymentSubmission = sequelize.define("PaymentSubmission", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Booking, key: "id" },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Event, key: "id" },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  // pending | approved | rejected
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

// Associations
Booking.hasOne(PaymentSubmission, { foreignKey: "bookingId" });
PaymentSubmission.belongsTo(Booking, { foreignKey: "bookingId" });

User.hasMany(PaymentSubmission, { foreignKey: "userId" });
PaymentSubmission.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(PaymentSubmission, { foreignKey: "eventId" });
PaymentSubmission.belongsTo(Event, { foreignKey: "eventId" });

module.exports = PaymentSubmission;
