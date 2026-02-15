const router = require("express").Router();
const Help = require("../models/Help");
const auth = require("../middleware/auth");

// ======================================
// 🔥 USER SEND HELP REQUEST
// ======================================
router.post("/create", auth, async (req, res) => {
  try {

    const help = new Help({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,  // 🔥 PHONE ADDED
      role: req.user.role,
      subject: req.body.subject,
      message: req.body.message
    });

    await help.save();

    res.json({ message: "Help request sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================
// 👑 SUPER ADMIN - GET ALL REQUESTS
// ======================================
router.get("/all", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const requests = await Help.find()
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================================
// 👑 SUPER ADMIN - MARK RESOLVED
// ======================================
router.put("/resolve/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const help = await Help.findById(req.params.id);

    if (!help)
      return res.status(404).json({ message: "Request not found" });

    help.status = "resolved";
    await help.save();

    res.json({ message: "Marked as resolved" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
