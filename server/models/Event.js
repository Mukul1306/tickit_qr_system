const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  price: Number,
  imageUrl: String,
  upiId: String,

  isPaid: {
    type: Boolean,
    default: true
  },

  totalSeats: {
    type: Number,
    default: 100
  },

  availableSeats: {
    type: Number,
    default: 100
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
     // 🔥 THIS IS IMPORTANT
customFields: [
  {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["text", "email", "number"],
      default: "text"
    },
    required: {
      type: Boolean,
      default: false
    }
  }
]
,

  // 🔥 Add assigned volunteers properly inside schema
  assignedVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
