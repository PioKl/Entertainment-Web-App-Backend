const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: Buffer },
  bookmarked: { type: [String], default: [] }, // Tablica stringów dla bookmarked z domyślną wartością []
});

const User = mongoose.model("User", userSchema);

module.exports = User;
