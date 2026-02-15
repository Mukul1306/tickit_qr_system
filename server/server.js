const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const adRoutes = require("./routes/adRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true
  }
));

app.use(express.json());

app.get("/", (req, res) => {
  res.send ("Event management API is running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/super-admin", superAdminRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/help", require("./routes/helpRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
