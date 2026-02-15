const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  
});

// =======================
// CREATE ORDER
// =======================
router.post("/create-order/:eventId", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ message: "free evnt does not need payment" });

    const quantity = req.body.quantity || 1;

    const amount = event.price * quantity * 100; // convert to paise

    const options = {
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({ order });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/verify-payment", auth, async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      quantity
    } = req.body;

    // 🔐 Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.availableSeats < quantity)
      return res.status(400).json({ message: "Not enough seats available" });

    // 🔥 Reduce seats
    event.availableSeats -= quantity;
    await event.save();

    // 🔥 Generate bookingId + QR
    const bookingId = "BOOK" + Date.now();
    const qrCodeImage = await QRCode.toDataURL(bookingId);

    const booking = new Booking({
      userId: req.user.id,
      eventId: event._id,
      eventname: event.title,
      name : req.body.name,
      email : req.body.email,
      age : req.body.age,
      collegeId : req.body.collegeId,
      collegeName : req.body.collegeName,
      location : req.body.location,
      linkedin : req.body.linkedin,
      customResponses: req.body.customResponses || [],
      quantity,
      bookingId,
      qrCode: qrCodeImage,
      paymentStatus: "paid",
      paymentId: razorpay_payment_id
    });

    await booking.save();

    res.json({
      message: "Payment successful 🎉",
      booking
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;