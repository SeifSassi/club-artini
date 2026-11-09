import { useState } from "react";
import api from "../api";

// Formulaire d'ajout d'un événement (affiché uniquement aux utilisateurs connectés)
function EventForm({ onAdd }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [lieu, setLieu] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      // Le token JWT est ajouté automatiquement par l'intercepteur Axios
      const res = await api.post("/evenements", { titre, description, date, lieu });
      onAdd(res.data);
      setTitre("");
      setDescription("");
      setDate("");
      setLieu("");
    } catch (err) {
      setErreur(err.response?.data?.message || "Ajout impossible.");
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Publier un événement</h3>
      <input
        type="text"
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className="row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lieu (optionnel)"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
        />
      </div>
      {erreur && <p className="error">{erreur}</p>}
      <button className="btn" type="submit">
        Publier
      </button>
    </form>
  );
}

export default EventForm;
