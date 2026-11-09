const express = require("express");
const Feedback = require("../models/Feedback");
const Evenement = require("../models/Evenement");
const protect = require("../middleware/protect");

const router = express.Router();

// GET /api/feedbacks?evenement=<id>  -> liste publique des avis d'un événement
router.get("/", async (req, res) => {
  try {
    const filtre = req.query.evenement ? { evenement: req.query.evenement } : {};
    const feedbacks = await Feedback.find(filtre)
      .populate("auteur", "nom")
      .sort({ date: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// POST /api/feedbacks  -> ajout d'un avis (protégé)
router.post("/", protect, async (req, res) => {
  try {
    const { avis, evenement } = req.body;

    if (!avis || !evenement) {
      return res.status(400).json({ message: "Avis et événement obligatoires" });
    }

    const existe = await Evenement.findById(evenement);
    if (!existe) {
      return res.status(404).json({ message: "Événement introuvable" });
    }

    const feedback = await Feedback.create({
      avis,
      evenement,
      auteur: req.user._id,
    });

    const complet = await feedback.populate("auteur", "nom");
    res.status(201).json(complet);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// DELETE /api/feedbacks/:id  -> suppression (protégée, auteur uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    if (feedback.auteur.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez supprimer que vos propres avis" });
    }

    await feedback.deleteOne();
    res.json({ message: "Avis supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

module.exports = router;
