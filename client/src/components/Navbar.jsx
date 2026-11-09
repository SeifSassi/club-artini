function Navbar({ user, onLogout, onShowAuth }) {
  return (
    <nav className="navbar">
      <span className="brand">Club Artini</span>
      <div className="nav-right">
        {user ? (
          <>
            <span className="welcome">Bonjour, {user.nom}</span>
            <button className="btn btn-outline" onClick={onLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <button className="btn" onClick={onShowAuth}>
            Connexion / Inscription
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
