const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Rejestracja użytkownika
router.post("/register", async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Mail already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userEmail, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logowanie użytkownika
router.post("/login", async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid user mail or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid user mail or password" });
    }

    // Generowanie tokena
    const token = jwt.sign(
      { id: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
