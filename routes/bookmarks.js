const express = require("express");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Endpoint do pobierania zakładek użytkownika
router.get("/bookmarks", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ bookmarked: user.bookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do dodawania zakładki
router.post("/bookmark", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    if (!user.bookmarked.includes(movieId)) {
      user.bookmarked.push(movieId); // Dodaj do zakładek
      await user.save();
    }

    res.json({
      message: "Bookmark added successfully",
      bookmarked: user.bookmarked,
    }); // Zwróć aktualne zakładki
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do usuwania zakładki

router.delete("/bookmark", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { movieId } = req.body;
    console.log("Usuwany movieId:", movieId);
    console.log("Aktualne zakładki:", user.bookmarked);

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    // Konwertuj movieId na String
    const movieIdStr = movieId.toString();

    // Sprawdenie, czy movieId jest w zakładkach
    if (!user.bookmarked.includes(movieIdStr)) {
      return res.status(400).json({ message: "Movie not in bookmarks" });
    }

    // Znajdź indeks movieId w zakładkach
    const index = user.bookmarked.indexOf(movieIdStr);
    if (index > -1) {
      user.bookmarked.splice(index, 1); // Usuń z zakładek
    }

    await user.save();
    console.log("Zakładki po usunięciu:", user.bookmarked);

    res.json({
      message: "Bookmark removed successfully",
      bookmarked: user.bookmarked,
    }); // Zwróć aktualne zakładki
  } catch (error) {
    console.error("Błąd podczas usuwania zakładki:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
