const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware "sentinelle" : vérifie le header  Authorization: Bearer <token>
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  // 1. Le header doit exister et commencer par "Bearer "
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé : token manquant" });
  }

  try {
    // 2. On extrait le token puis on le vérifie avec la clé secrète
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. On retrouve l'utilisateur (sans son mot de passe) et on l'attache à la requête
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = protect;
