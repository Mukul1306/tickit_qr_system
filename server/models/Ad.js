const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({

  title: String,
  description: String,
  imageUrl: String,
  redirectUrl: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔥 TRACKING
  impressions: {
    type: Number,
    default: 0
  },

  clicks: {
    type: Number,
    default: 0
  },

  revenue: {
    type: Number,
    default: 0
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);