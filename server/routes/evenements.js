const express = require("express");
const Evenement = require("../models/Evenement");
const Feedback = require("../models/Feedback");
const protect = require("../middleware/protect");

const router = express.Router();

// GET /api/evenements  -> liste publique (visiteurs inclus)
// populate("auteur", "nom") remplace l'id de l'auteur par son nom
router.get("/", async (req, res) => {
  try {
    const evenements = await Evenement.find()
      .populate("auteur", "nom")
      .sort({ date: 1 });
    res.json(evenements);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// POST /api/evenements  -> ajout (protégé)
router.post("/", protect, async (req, res) => {
  try {
    const { titre, description, date, lieu } = req.body;

    if (!titre || !description || !date) {
      return res
        .status(400)
        .json({ message: "Titre, description et date sont obligatoires" });
    }

    const evenement = await Evenement.create({
      titre,
      description,
      date,
      lieu,
      auteur: req.user._id, // l'auteur vient du token, pas du client
    });

    const complet = await evenement.populate("auteur", "nom");
    res.status(201).json(complet);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// DELETE /api/evenements/:id  -> suppression (protégée, auteur uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    if (!evenement) {
      return res.status(404).json({ message: "Événement introuvable" });
    }

    if (evenement.auteur.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez supprimer que vos propres événements" });
    }

    // On supprime aussi les feedbacks liés à cet événement
    await Feedback.deleteMany({ evenement: evenement._id });
    await evenement.deleteOne();

    res.json({ message: "Événement supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

module.exports = router;
