const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = require("../admin/admin.model");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: "00:00:00",
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: "23:59:00",
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM("active", "paused", "completed"),
    defaultValue: "active",
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "General",
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Associations
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = Event;