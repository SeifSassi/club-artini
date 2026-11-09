const mongoose = require("mongoose");

// Modèle 2 : Événement / Annonce du club
// Relation 1 -> N : un User publie plusieurs Evenements (champ auteur = ref User)
const evenementSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    lieu: { type: String, default: "Polytechnique Sousse", trim: true },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evenement", evenementSchema);
