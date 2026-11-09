import { useState, useEffect } from "react";
import api from "../api";

// Composant réutilisable : une carte d'événement + ses feedbacks (relation 1 -> N)
function EventCard({ evenement, user, onDelete }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [texte, setTexte] = useState("");
  const [erreur, setErreur] = useState("");

  // Charge les avis de CET événement (se relance si l'id change)
  useEffect(() => {
    api
      .get(`/feedbacks?evenement=${evenement._id}`)
      .then((res) => setFeedbacks(res.data))
      .catch(() => setErreur("Avis indisponibles."));
  }, [evenement._id]);

  const ajouterFeedback = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      const res = await api.post("/feedbacks", {
        avis: texte,
        evenement: evenement._id,
      });
      setFeedbacks((prev) => [res.data, ...prev]);
      setTexte("");
    } catch (err) {
      setErreur(err.response?.data?.message || "Ajout impossible.");
    }
  };

  const supprimerFeedback = async (id) => {
    try {
      await api.delete(`/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setErreur(err.response?.data?.message || "Suppression impossible.");
    }
  };

  const dateAffichee = new Date(evenement.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Seul l'auteur voit le bouton de suppression de son événement
  const estAuteur = user && evenement.auteur && evenement.auteur._id === user.id;

  return (
    <article className="card event">
      <div className="event-head">
        <h3>{evenement.titre}</h3>
        {estAuteur && (
          <button
            className="btn btn-danger"
            onClick={() => onDelete(evenement._id)}
          >
            Supprimer
          </button>
        )}
      </div>

      <p className="meta">
        {dateAffichee} · {evenement.lieu} · par{" "}
        <strong>{evenement.auteur?.nom || "Membre"}</strong>
      </p>
      <p>{evenement.description}</p>

      <div className="feedbacks">
        <h4>Avis des membres ({feedbacks.length})</h4>

        {feedbacks.map((f) => (
          <div key={f._id} className="feedback">
            <p>
              <strong>{f.auteur?.nom || "Membre"}</strong> : {f.avis}
            </p>
            {user && f.auteur?._id === user.id && (
              <button className="link" onClick={() => supprimerFeedback(f._id)}>
                Supprimer
              </button>
            )}
          </div>
        ))}

        {user && (
          <form className="row" onSubmit={ajouterFeedback}>
            <input
              type="text"
              placeholder="Votre avis..."
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              required
            />
            <button className="btn" type="submit">
              Envoyer
            </button>
          </form>
        )}
        {erreur && <p className="error">{erreur}</p>}
      </div>
    </article>
  );
}

export default EventCard;
