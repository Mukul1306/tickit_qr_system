const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
     
  name: String,
  email: String,
  age: Number,

  collegeId: String,
  collegeName: String,
  location: String,
  linkedin: String,

  utrNumber: String,

  bookingId: String,

  paymentStatus: {
    type: String,
    default: "success"
  },
   customResponses: {
  type: [
    {
      label: String,
      value: String
    }
  ],
  default: []
},
    

  isCheckedIn: {
    type: Boolean,
    default: false
  },

  checkInTime: Date

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
