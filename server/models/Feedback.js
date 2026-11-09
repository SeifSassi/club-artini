const mongoose = require("mongoose");

// Modèle 3 : Feedback (avis) lié à un événement
// Relation 1 -> N : un Evenement a plusieurs Feedbacks (champ evenement = ref Evenement)
const feedbackSchema = new mongoose.Schema(
  {
    avis: { type: String, required: true, trim: true },
    evenement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evenement",
      required: true,
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
