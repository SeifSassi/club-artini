const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Fabrique un token JWT valable 7 jours contenant l'id de l'utilisateur
const genererToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register  -> inscription
router.post("/register", async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hachage du mot de passe (10 = nombre de tours de salage)
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, email, password: hash });

    res.status(201).json({
      token: genererToken(user._id),
      user: { id: user._id, nom: user.nom, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// POST /api/auth/login  -> connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    // Même message d'erreur dans les deux cas pour ne pas révéler si l'email existe
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    // Compare le mot de passe saisi avec le hash stocké
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.json({
      token: genererToken(user._id),
      user: { id: user._id, nom: user.nom, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

module.exports = router;
