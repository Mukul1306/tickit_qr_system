const router = require("express").Router();
const Ad = require("../models/Ad");
const auth = require("../middleware/auth");

// ========================
// CREATE AD (Admin)
// ========================
router.post("/create", auth, async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

   const ad = new Ad({
  title: req.body.title,
  description: req.body.description,
  imageUrl: req.body.imageUrl,
  redirectUrl: req.body.redirectUrl,
  status: "pending",
  createdBy: req.user.id
});

    await ad.save();

    res.json({ message: "Ad created successfully" });

  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 


   // SUPER ADMIN - GET ALL ADS
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "super_admin")
    return res.status(403).json({ message: "Access denied" });

  const ads = await Ad.find().sort({ createdAt: -1 });

  res.json(ads);
});


// ========================
// GET MY ADS (Admin)
// ========================
router.get("/my-ads", auth, async (req, res) => {
  const ads = await Ad.find({ createdBy: req.user.id });
  res.json(ads);
});

// ========================
// GET APPROVED ADS (Public)
// ========================
router.get("/approved", async (req, res) => {
  const ads = await Ad.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(ads);
});

// ========================
// SUPER ADMIN APPROVE AD
// ========================
router.put("/approve/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const ad = await Ad.findById(req.params.id);

    if (!ad)
      return res.status(404).json({ message: "Ad not found" });

    ad.status = "approved";
    await ad.save();

    res.json({
      message: "Ad approved successfully",
      ad
    });

  } catch (error) {
    console.log("APPROVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ========================
// SUPER ADMIN REJECT AD
// ========================
router.put("/reject/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const ad = await Ad.findById(req.params.id);

    if (!ad)
      return res.status(404).json({ message: "Ad not found" });

    ad.status = "rejected";
    await ad.save();

    res.json({
      message: "Ad rejected successfully",
      ad
    });

  } catch (error) {
    console.log("REJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


 

// ========================
// TRACK CLICK
// ========================
router.put("/click/:id", async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } }
    );

    res.json({ message: "Click counted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Track Impression
router.put("/impression/:id", async (req, res) => {
  try {

    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 }
    });

    res.json({ message: "Impression counted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/delete/:id", auth, async (req, res) => {
  try {

    const ad = await Ad.findById(req.params.id);

    if (!ad)
      return res.status(404).json({ message: "Ad not found" });

    if (
      req.user.role !== "super_admin" &&
      ad.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ad.deleteOne();

    res.json({ message: "Ad deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;