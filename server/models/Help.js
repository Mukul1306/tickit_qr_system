const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,     // 🔥 ADDED PHONE NUMBER
    required: true
  },
  role: {
    type: String,
    enum: ["user", "event_admin", "volunteer"],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open"
  }
}, { timestamps: true });

module.exports = mongoose.model("Help", helpSchema);
