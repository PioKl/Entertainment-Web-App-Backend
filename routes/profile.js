const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload obrazka profilowego
router.post(
  "/profile-pic",
  authenticateToken,
  upload.single("profilePic"),
  async (req, res) => {
    console.log("Otrzymany plik:", req.file); // Loguj odebrany plik
    try {
      const user = await User.findById(req.user.id); // Identyfikator użytkownika z tokena JWT

      if (!user) {
        console.error("Użytkownik nie został znaleziony:", req.user.id); // Loguj błąd
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = req.file.buffer;
      await user.save();

      res.json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Pobranie obrazka profilowego
router.get("/profile-pic", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.profilePic) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", "image/png");
    res.send(user.profilePic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
