const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// ======================================================
// 🔐 ONLY SUPER ADMIN ACCESS
// ======================================================

const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ======================================================
// 📊 DASHBOARD STATS
// ======================================================

router.get("/stats", auth, superAdminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });

    const paidBookings = await Booking.find({
      paymentStatus: "success"
    }).populate("eventId");

    let totalRevenue = 0;

    paidBookings.forEach((booking) => {
      if (booking.eventId?.isPaid) {
        totalRevenue += booking.eventId.price;
      }
    });

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalVolunteers,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 👥 GET ALL USERS
// ======================================================

router.get("/users", auth, superAdminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 🚫 SUSPEND USER
// ======================================================

router.put("/suspend-user/:id", auth, superAdminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.role === "super_admin")
      return res.status(400).json({ message: "Cannot suspend super admin" });

    user.isSuspended = true;
    await user.save();

    res.json({ message: "User suspended successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// ✅ ACTIVATE USER
// ======================================================

router.put("/activate-user/:id", auth, superAdminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isSuspended = false;
    await user.save();

    res.json({ message: "User activated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// ❌ DELETE USER
// ======================================================

router.delete("/delete-user/:id", auth, superAdminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.role === "super_admin")
      return res.status(400).json({ message: "Cannot delete super admin" });

    await Booking.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 🎫 GET ALL EVENTS
// ======================================================

router.get("/events", auth, superAdminOnly, async (req, res) => {
  try {
    const events = await Event.find().populate("adminId", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🗑 DELETE EVENT
// ======================================================

router.delete("/delete-event/:id", auth, superAdminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    await Booking.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;