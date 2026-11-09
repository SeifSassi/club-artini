import { useState, useEffect } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import EventForm from "./components/EventForm";
import EventCard from "./components/EventCard";

function App() {
  // Utilisateur connecté : on le relit depuis localStorage pour garder la session
  // après un rechargement de la page
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  // useEffect : au premier affichage, on charge les événements (public)
  useEffect(() => {
    api
      .get("/evenements")
      .then((res) => setEvenements(res.data))
      .catch(() => setErreur("Impossible de charger les événements."))
      .finally(() => setChargement(false));
  }, []);

  // Appelée par AuthForm après un login / register réussi
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const ajouterEvenement = (evenement) => {
    setEvenements((prev) =>
      [...prev, evenement].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
  };

  const supprimerEvenement = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    try {
      await api.delete(`/evenements/${id}`);
      setEvenements((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setErreur(err.response?.data?.message || "Suppression impossible.");
    }
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
      />

      <header className="hero">
        <h1>Club Artini</h1>
        <p>Annonces, événements et retours des membres du club.</p>
      </header>

      <main className="container">
        {/* Rendu conditionnel : formulaire d'ajout visible seulement si connecté */}
        {user ? (
          <EventForm onAdd={ajouterEvenement} />
        ) : (
          <p className="info">
            Mode visiteur (lecture seule).{" "}
            <button className="link" onClick={() => setShowAuth(true)}>
              Connectez-vous
            </button>{" "}
            pour publier un événement ou donner votre avis.
          </p>
        )}

        {erreur && <p className="error">{erreur}</p>}

        <h2 className="section-title">Événements à venir</h2>

        {chargement ? (
          <p>Chargement...</p>
        ) : evenements.length === 0 ? (
          <p>Aucun événement pour le moment.</p>
        ) : (
          <div className="grid">
            {evenements.map((ev) => (
              <EventCard
                key={ev._id}
                evenement={ev}
                user={user}
                onDelete={supprimerEvenement}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        © 2025–2026 Club Artini — École Polytechnique de Sousse
      </footer>

      {showAuth && (
        <AuthForm onSuccess={handleLogin} onClose={() => setShowAuth(false)} />
      )}
    </>
  );
}

export default App;
