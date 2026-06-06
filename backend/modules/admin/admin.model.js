const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("admin", "organizer", "attender"),
    defaultValue: "attender",
  },
});

module.exports = User;