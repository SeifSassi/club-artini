import { useState } from "react";
import api from "../api";

// Formulaire contrôlé : chaque champ est lié à un state React
function AuthForm({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login"); // "login" ou "register"
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    setErreur("");
    setEnvoi(true);
    try {
      const url = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login" ? { email, password } : { nom, email, password };
      const res = await api.post(url, body);
      onSuccess(res.data); // { token, user }
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur de connexion au serveur.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{mode === "login" ? "Connexion" : "Inscription"}</h2>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (6 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erreur && <p className="error">{erreur}</p>}

        <button className="btn" type="submit" disabled={envoi}>
          {envoi ? "Veuillez patienter..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <p className="switch">
          {mode === "login" ? "Pas encore membre ?" : "Déjà membre ?"}{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErreur("");
            }}
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
