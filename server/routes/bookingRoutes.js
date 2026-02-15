const router = require("express").Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const QRCode = require("qrcode");


router.post("/create/:eventId", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const quantity = Number(req.body.quantity) || 1;

    const maxLimit = event.isPaid ? 4 : 2;

    if (quantity > maxLimit) {
      return res.status(400).json({
        message: `You can book maximum ${maxLimit} tickets`
      });
    }

    const userBookings = await Booking.aggregate([
      {
        $match: {
          userId: req.user.id,
          eventId: event._id
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const alreadyBooked =
      userBookings.length > 0 ? userBookings[0].total : 0;

    if (alreadyBooked + quantity > maxLimit) {
      return res.status(400).json({
        message: `Booking limit exceeded`
      });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({
        message: "Not enough seats available"
      });
    }

    // 🔥 FREE EVENT → create directly
    if (!event.isPaid) {

      event.availableSeats -= quantity;
      await event.save();

      const bookingId = "BOOK" + Date.now();
      const qrCodeImage = await QRCode.toDataURL(bookingId);

      const booking = new Booking({
        userId: req.user.id,
        eventId: event._id,
        eventname: event.title,
        quantity,
        qrCode: qrCodeImage,
        bookingId,
        paymentStatus: "success"
      });

      await booking.save();

      return res.json({
        message: "Free ticket booked successfully",
        qrCode: qrCodeImage
      });
    }

    // 🔥 PAID EVENT → DO NOT CREATE BOOKING HERE
    return res.json({
      message: "Proceed to payment",
      amount: event.price * quantity
    });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//  ==========================================
// 🔥 confirm (No Payment)
// ==========================================
 router.post("/confirm/:eventId", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.eventId);
    const quantity = Number(req.body.quantity);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.availableSeats < quantity)
      return res.status(400).json({ message: "Seats not available" });

    event.availableSeats -= quantity;
    await event.save();

    const bookingId = "BOOK" + Date.now();
    const qrCodeImage = await QRCode.toDataURL(bookingId);

    const booking = new Booking({
      userId: req.user.id,
      eventId: event._id,
      name : req.body.name,
      email : req.body.email,
      age : req.body.age,
      collegeId : req.body.collegeId,
      collegeName : req.body.collegeName,
      location : req.body.location,
      linkedin : req.body.linkedin,
      customResponses: req.body.customResponses || [],
      eventname: event.title,
      quantity,
      qrCode: qrCodeImage,
      bookingId,
      paymentStatus: "success"
    });

    await booking.save();

    res.json({
      message: "Payment successful. Ticket generated.",
      qrCode: qrCodeImage
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 🔥 GET MY BOOKINGS (User)
// ==========================================
router.get("/my-bookings", auth, async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.user.id   // 👈 IMPORTANT
    })
      .populate("eventId")
      .sort({ createdAt: -1 });
      

    res.json(bookings);

  } catch (error) {
    console.error("MY BOOKINGS ERROR:", error);
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


router.post("/validate/:eventId", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.eventId);
    const quantity = Number(req.body.quantity) || 1;

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const maxLimit = event.isPaid ? 4 : 2;

    if (quantity > maxLimit)
      return res.status(400).json({
        message: `Max ${maxLimit} tickets allowed`
      });

    const userBookings = await Booking.aggregate([
      {
        $match: {
          userId: req.user.id,
          eventId: event._id
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const alreadyBooked =
      userBookings.length > 0 ? userBookings[0].total : 0;

    if (alreadyBooked + quantity > maxLimit)
      return res.status(400).json({
        message: `Limit exceeded. You already booked ${alreadyBooked}`
      });

    if (event.availableSeats < quantity)
      return res.status(400).json({
        message: "Not enough seats available"
      });

    res.json({ message: "Validation passed" });

  } catch (error) {
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
      collegeId: booking.collegeId,
      collegeName: booking.collegeName,
      location: booking.location,
      linkedin: booking.linkedin, 
      quantity: booking.quantity,
      customResponses: booking.customResponses || [],

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