import axios from "axios";

// Instance Axios : l'URL de l'API vient de la variable d'environnement Vite
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

// Intercepteur de requête : avant CHAQUE requête, on lit le token dans
// localStorage et on l'ajoute au header  Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
