# Club Artini — Application MERN

Application web de gestion d'un club étudiant (annonces, événements, avis des membres).
Projet MERN Stack — École Polytechnique de Sousse, Département Informatique, 2025–2026.

**Stack** : MongoDB Atlas · Express · React 18 (Vite) · Node.js · JWT · bcrypt · Axios

## Fonctionnalités

- **Visiteur (non connecté)** : lecture seule des événements et des avis.
- **Membre connecté** : publier un événement, supprimer ses événements, laisser et supprimer ses avis.
- Inscription / connexion sécurisées (mot de passe haché avec bcrypt, session par token JWT).

## Modèles Mongoose

| Modèle | Champs | Relation |
|---|---|---|
| `User` | nom, email, password (haché) | — |
| `Evenement` | titre, description, date, lieu, auteur | `auteur` → ref `User` (1 → N) |
| `Feedback` | avis, evenement, auteur, date | `evenement` → ref `Evenement` (1 → N), `auteur` → ref `User` |

`.populate("auteur", "nom")` est utilisé pour afficher le nom de l'auteur.

## API

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/evenements` | public |
| POST | `/api/evenements` | **protégé** (JWT) |
| DELETE | `/api/evenements/:id` | **protégé** (auteur) |
| GET | `/api/feedbacks?evenement=<id>` | public |
| POST | `/api/feedbacks` | **protégé** (JWT) |
| DELETE | `/api/feedbacks/:id` | **protégé** (auteur) |

Le middleware `protect` (`server/middleware/protect.js`) vérifie le header `Authorization: Bearer <token>`.

## Structure

```
club-artini/
├── server/        # API Express (routes/, models/, middleware/, server.js)
└── client/        # SPA React + Vite (src/components/, api.js, App.jsx)
```

## Lancer en local

### 1. Back-end
```bash
cd server
npm install
cp .env.example .env     # puis renseigner MONGO_URI et JWT_SECRET
npm run dev
```

### 2. Front-end
```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev
```
Ouvrir http://localhost:5173

## Déploiement Cloud

### MongoDB Atlas
1. Créer un cluster gratuit **M0**.
2. Créer un utilisateur de base de données (Database Access).
3. Network Access → autoriser `0.0.0.0/0` (nécessaire pour Render).
4. Copier la chaîne de connexion `mongodb+srv://...` → variable `MONGO_URI`.

### Render (API)
1. New → **Web Service**, relier le dépôt GitHub.
2. **Root Directory** : `server`
3. **Build Command** : `npm install` — **Start Command** : `npm start`
4. Variables d'environnement : `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (URL Vercel, sans `/` final).

### Vercel (Front-end)
1. New Project, relier le dépôt GitHub.
2. **Root Directory** : `client` (preset Vite détecté automatiquement).
3. Variable d'environnement : `VITE_API_URL` = `https://<votre-api>.onrender.com/api`
4. Déployer, puis reporter l'URL Vercel dans `CLIENT_URL` sur Render.

> Le plan gratuit de Render met l'API en veille : la première requête peut prendre ~50 secondes.

## Sécurité

- Aucun `.env` dans Git (voir `.gitignore`), seulement des `.env.example`.
- Mots de passe hachés (bcrypt, 10 tours de salage).
- Routes d'ajout/suppression protégées par JWT ; seul l'auteur peut supprimer son contenu.
