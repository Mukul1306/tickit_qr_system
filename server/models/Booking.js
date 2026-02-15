const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
    quantity: {
    type: Number,
    default: 1
  },

     
  name: String,
  email: String,
  age: Number,

  eventname: String, // 🔥 ADDED THIS FOR EASY ACCESS IN USER ORDERS
location: String, // 🔥 ADDED THIS TO SHOW BOOKING DATE IN USER ORDERS
  collegeId: String,
  collegeName: String,
  linkedin: String,
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
    
  qrCode :{
    type: String
  },

  isCheckedIn: {
    type: Boolean,
    default: false
  },

  checkInTime: Date

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
