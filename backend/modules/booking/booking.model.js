const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = require("../admin/admin.model");
const Event = require("../event/event.model");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  customerCity: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  customerState: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  customerCountry: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  specialNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
  },
  ticketCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "confirmed",
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

// Associations
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(Booking, { foreignKey: "eventId" });
Booking.belongsTo(Event, { foreignKey: "eventId" });

module.exports = Booking;