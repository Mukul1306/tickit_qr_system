const router = require("express").Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const QRCode = require("qrcode");


// ==========================================
// 🔥 CREATE BOOKING
// ==========================================
router.post("/create/:eventId", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.availableSeats <= 0)
      return res.status(400).json({ message: "No seats available" });

    // 🔥 Build custom responses dynamically
    const customResponses = req.body.customResponses || [];

   
    

    console.log("CUSTOM RESPONSES:", customResponses); // ✅ CORRECT PLACE

    // Reduce seat
    event.availableSeats -= 1;
    await event.save();

    const bookingId = "BOOK" + Date.now();

    const booking = new Booking({
      userId: req.user.id,
      eventId: event._id,

      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      collegeId: req.body.collegeId,
      collegeName: req.body.collegeName,
      location: req.body.location,
      linkedin: req.body.linkedin,
      utrNumber: req.body.utrNumber,

       customResponses,  // 🔥 THIS WAS MISSING

      bookingId,
      paymentStatus: "success"
    });

    await booking.save();

    const qr = await QRCode.toDataURL(bookingId);

    res.json({
      message: "Booking successful",
      qrCode: qr
    });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================================
// 🔥 GET BOOKINGS FOR EVENT (Admin)
// ==========================================
router.get("/event-bookings/:eventId", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your event" });

    const bookings = await Booking.find({
      eventId: req.params.eventId
    }).populate("userId");

    res.json(bookings);

  } catch (error) {
    console.error("FETCH BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================================
// 🔥 DELETE BOOKING
// ==========================================
router.delete("/delete/:bookingId", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const event = await Event.findById(booking.eventId);

    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your event" });

    // Restore seat
    event.availableSeats += 1;
    await event.save();

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================================
// 🔥 VERIFY QR
// ==========================================
// ==========================================
// 🔥 VERIFY QR (Scanner)
// ==========================================
router.get("/verify/:bookingId", auth, async (req, res) => {
  try {

    const booking = await Booking.findOne({
      bookingId: req.params.bookingId
    })
    .populate("eventId", "title location date")
    .populate("userId", "name email");

    if (!booking)
      return res.status(404).json({ message: "Invalid Ticket" });

    res.json({
      bookingId: booking.bookingId,
      name: booking.name,
      email: booking.email,
      age: booking.age,

      event: {
        title: booking.eventId.title,
        location: booking.eventId.location,
        date: booking.eventId.date
      },

      customResponses: booking.customResponses || [],

      isCheckedIn: booking.isCheckedIn,
      checkInTime: booking.checkInTime
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================================
// 🔥 CHECK-IN
// ==========================================
router.put("/checkin/:bookingId", auth, async (req, res) => {
  try {

    const booking = await Booking.findOne({
      bookingId: req.params.bookingId
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.isCheckedIn)
      return res.json({ message: "Already checked in" });

    booking.isCheckedIn = true;
    booking.checkInTime = new Date();
    await booking.save();

    res.json({ message: "Entry marked successfully" });

  } catch (error) {
    console.error("CHECKIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;