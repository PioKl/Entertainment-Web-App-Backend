/* Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. */
require("dotenv").config();
/* ExpressJS allows us to set up middleware to respond to HTTP Requests. */
const express = require("express");
/* Mongoose is a MongoDB client library providing object modeling for use in an asynchronous environment. Mongoose supports both promises and callbacks. */
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../routes/auth");

const app = express();
const port = process.env.PORT || 5000;

// Konfiguracja CORS

app.use(
  cors({
    //domeny frontendowe
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Dozwolone metody HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Dozwolone nagłówki
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Używanie routera dla ścieżki, na razie będzie /api/auth
app.use("/api/auth", userRoutes);

// Połączenie z MongoDB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Zamknij serwer w przypadku błędu połączenia z bazą danych
  });

// Endpoint testowy
app.get("/api/entertainmentData", (req, res) => {
  res.send("API is working!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Eksportowanie aplikacji (ważne dla Vercel)
module.exports = app;
