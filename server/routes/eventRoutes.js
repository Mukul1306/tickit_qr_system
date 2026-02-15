const router = require("express").Router();
const Event = require("../models/Event");
const VolunteerRequest = require("../models/VolunteerRequest");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");


// ======================================================
// 🟢 CREATE EVENT (Event Admin Only)
// ======================================================

router.post("/create", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const event = new Event({
      ...req.body,
      adminId: req.user.id,
      availableSeats: req.body.totalSeats,
      assignedVolunteers: [],
      status: "pending" // 🔥 Important
    });

    await event.save();
    res.json(event);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🟢 GET ALL APPROVED EVENTS (Public Homepage)
// ======================================================

router.get("/", async (req, res) => {
  try {
    const { search, date } = req.query;

    let query = { status: "approved" };

    // 🔎 Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 📅 Filter by exact date
    if (date) {
      const selectedDate = new Date(date);

      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.json(events);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================
// GET TRENDING EVENTS
// =====================================
router.get("/trending", async (req, res) => {
  try {

    const events = await Event.find({
      status: "approved",
      isTrending: true
    })
    .sort({ createdAt: -1 })
    .limit(4);

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 🔵 ADMIN - GET VOLUNTEER REQUESTS FOR EVENT
// ======================================================

router.get("/volunteer-requests/:eventId", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Make sure admin owns event
    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your event" });

    const requests = await VolunteerRequest.find({
      eventId: req.params.eventId,
      status: "pending"
    }).populate("volunteerId", "name email");

    res.json(requests);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 🟢 GET EVENTS CREATED BY EVENT ADMIN
// ======================================================

router.get("/admin-events", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const events = await Event.find({
      adminId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🟢 UPDATE EVENT (Owner Only)
// ======================================================

router.put("/update/:id", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🟢 DELETE EVENT (Owner Only)
// ======================================================

router.delete("/delete/:id", auth, async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Booking.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 👑 SUPER ADMIN - GET ALL EVENTS
// ======================================================

router.get("/super/all-events", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const events = await Event.find()
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/superadmin/stats", auth, async (req, res) => {
  if (req.user.role !== "super_admin")
    return res.status(403).json({ message: "Access denied" });

  const events = await Event.find();

  const result = await Promise.all(
    events.map(async (event) => {
    const count = await Booking.countDocuments({
          eventId: event._id,
          paymentStatus: { $in: ["paid", "success"] }
        });

      return {
        ...event._doc,
        totalRegistrations: count
      };
    })
  );

  res.json(result);
});


// ==========================================
// 💰 SUPER ADMIN - TOTAL REVENUE
// ==========================================
router.get("/superadmin/total-revenue", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const bookings = await Booking.find({
      paymentStatus: { $in: ["paid", "success"] }
    }).populate("eventId");

    const totalRevenue = bookings.reduce((sum, booking) => {
      const price = booking.eventId?.price || 0;
      const quantity = booking.quantity || 1;
      return sum + price * quantity;
    }, 0);

    res.json({ totalRevenue });

  } catch (error) {
    console.log("TOTAL REVENUE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 👑 SUPER ADMIN - APPROVE / REJECT EVENT
// ======================================================

router.put("/super/update-status/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const { status } = req.body;

    if (!["approved", "pending"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    event.status = status;
    await event.save();

    res.json({ message: "Event status updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 👑 SUPER ADMIN - DELETE ANY EVENT
// ======================================================

router.delete("/super/delete/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    await Booking.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({ message: "Event deleted by Super Admin" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🔵 VOLUNTEER - GET ASSIGNED EVENTS
// ======================================================

router.get("/volunteer-events", auth, async (req, res) => {
  try {

    if (req.user.role !== "volunteer")
      return res.status(403).json({ message: "Access denied" });

    const events = await Event.find({
      assignedVolunteers: req.user.id,
      status: "approved"
    });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================================
// 🔵 VOLUNTEER - REQUEST TO JOIN EVENT
// ======================================================

router.post("/request-volunteer/:eventId", auth, async (req, res) => {
  try {

    if (req.user.role !== "volunteer")
      return res.status(403).json({ message: "Access denied" });

    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const existing = await VolunteerRequest.findOne({
      volunteerId: req.user.id,
      eventId: req.params.eventId
    });

    if (existing)
      return res.json({ message: "Already requested" });

    const request = new VolunteerRequest({
      volunteerId: req.user.id,
      eventId: req.params.eventId,
      status: "pending"
    });

    await request.save();

    res.json({ message: "Request sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/handle-volunteer/:requestId", auth, async (req, res) => {
  try {

    if (req.user.role !== "event_admin")
      return res.status(403).json({ message: "Access denied" });

    const { status } = req.body;

    const request = await VolunteerRequest.findById(req.params.requestId);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    const event = await Event.findById(request.eventId);

    if (event.adminId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your event" });

    request.status = status;
    await request.save();

    // 🔥 If approved → assign volunteer
    if (status === "approved") {
      if (!event.assignedVolunteers.includes(request.volunteerId)) {
        event.assignedVolunteers.push(request.volunteerId);
        await event.save();
      }
    }

    res.json({ message: "Request updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
// ======================================================
// 🔵 GET SINGLE EVENT (Public)
// ======================================================

router.get("/:id", async (req, res) => {
  try {

    const event = await Event.findById(req.params.id)
      .populate("assignedVolunteers", "name email");

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json(event);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




// SUPER ADMIN - TOGGLE TRENDING
router.put("/super/toggle-trending/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    event.isTrending = !event.isTrending;
    await event.save();

    res.json({
      message: "Trending status updated",
      isTrending: event.isTrending
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;