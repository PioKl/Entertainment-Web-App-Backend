const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: Buffer },
  bookmarked: {
    type: [
      {
        id: { type: String, required: true }, // Id filmu/serialu
        type: { type: String, required: true, enum: ["movie", "tv"] }, //typ: movie lub tv
      },
    ],
  }, // Tablica stringów dla bookmarked z domyślną wartością []
});

const User = mongoose.model("User", userSchema);

module.exports = User;
