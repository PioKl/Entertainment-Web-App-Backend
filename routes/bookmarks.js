const express = require("express");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

//Endpoint do pobierania zakładek użytkownika
router.get("/bookmarks", authenticateToken, async (req, res) => {
  try {
    //Znajdź użytkownika na podstawie ID w tokenie
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); //Użytkownik nie znaleziony
    }

    //Zwróć zakładki użytkownika
    res.json({ bookmarked: user.bookmarked }); // Zwraca obiekty z ID i typem
  } catch (error) {
    //Błąd serwera
    res.status(500).json({ message: error.message });
  }
});

//Endpoint do dodawania zakładki
router.post("/bookmark", authenticateToken, async (req, res) => {
  try {
    //Znajdź użytkownika na podstawie ID w tokenie
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); //Użytkownik nie znaleziony
    }

    const { movieId, type } = req.body;
    if (!movieId || !type) {
      return res
        .status(400)
        .json({ message: "Movie ID and type are required" });
    }

    const bookmark = { id: movieId.toString(), type };

    //Sprawdzenie, czy zakładka już istnieje
    if (
      !user.bookmarked.some(
        (item) => item.id === bookmark.id && item.type === bookmark.type
      )
    ) {
      user.bookmarked.push(bookmark); //Dodaj nową zakładkę
      await user.save(); //Zapisz zmiany w bazie danych
    }
    //Zwróć komunikat o dodaniu i zaktualizowane zakładki
    res.json({
      message: "Bookmark added successfully",
      bookmarked: user.bookmarked,
    });
  } catch (error) {
    //Błąd serwera
    res.status(500).json({ message: error.message });
  }
});

//Endpoint do usuwania zakładki
router.delete("/bookmark", authenticateToken, async (req, res) => {
  try {
    //Znajdź użytkownika na podstawie ID w tokenie
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { movieId, type } = req.body;
    if (!movieId || !type) {
      return res
        .status(400)
        .json({ message: "Movie ID and type are required" });
    }

    //Znajdź indeks zakładki
    const index = user.bookmarked.findIndex(
      (item) => item.id === movieId.toString() && item.type === type
    );

    //Gdy zakładka, do usunięcia, nie została znaleziona w tablicy user.bookmarked
    if (index === -1) {
      return res.status(400).json({ message: "Bookmark not found" });
    }

    user.bookmarked.splice(index, 1); //Usuń zakładkę
    await user.save(); //Zapisz zmiany w bazie danych

    //Zwróć komunikat o usunięciu i zaktualizowane zakładki
    res.json({
      message: "Bookmark removed successfully",
      bookmarked: user.bookmarked,
    });
  } catch (error) {
    //Błąd serwera
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
