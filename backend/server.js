const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();
const { sequelize } = require("./config/db");

require("./modules/admin/admin.model");
require("./modules/event/event.model");
require("./modules/booking/booking.model");

sequelize.sync({ alter: true });
const adminRoutes = require("./modules/admin/admin.routes");
const organizerRoutes = require("./modules/organizer/organizer.routes");
const attenderRoutes = require("./modules/attender/attender.routes");
const eventRoutes = require("./modules/event/event.routes");
const bookingRoutes = require("./modules/booking/booking.routes");

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/organizer", organizerRoutes);
app.use("/attender", attenderRoutes);
app.use("/event", eventRoutes);
app.use("/booking", bookingRoutes);

// test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// start server + DB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await connectDB();
});