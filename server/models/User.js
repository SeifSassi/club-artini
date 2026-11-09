const mongoose = require("mongoose");

// Modèle 1 : Membre du club
const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Contiendra le mot de passe HACHÉ (jamais en clair)
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
