require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const evenementRoutes = require("./routes/evenements");
const feedbackRoutes = require("./routes/feedbacks");

const app = express();

// CORS : autorise uniquement le front-end (Vercel) défini dans .env
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Permet de lire le JSON envoyé dans req.body
app.use(express.json());

// Route de test (utile pour vérifier que l'API répond sur Render)
app.get("/", (req, res) => {
  res.json({ message: "API Club Artini opérationnelle" });
});

app.use("/api/auth", authRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// Route inconnue -> 404 en JSON
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });
