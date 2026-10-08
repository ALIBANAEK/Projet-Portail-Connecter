import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, KeyRound, User, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export function Login() {
  const { login, users } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Veuillez renseigner votre identifiant et mot de passe.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    }, 250); // slight delay to feel like a real auth flow
  };

  const handleQuickLogin = (user) => {
    setIdentifier(user.username);
    setPassword(user.password);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge-icon">
            <LogIn size={26} />
          </div>
          <h2>Connexion</h2>
          <p>Accédez à la gestion et au contrôle des portails</p>
        </div>

        {error && (
          <div className="alert-banner error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="identifier">Identifiant (Nom d'utilisateur ou Email)</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="identifier"
                type="text"
                placeholder="ex: Alexandre ou alexandre.dev@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            <span>{isLoading ? "Connexion en cours..." : "Se connecter"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Mock Login helpers */}
        <div className="mock-quickfill-section">
          <div className="mock-title">
            <Sparkles size={15} />
            <span>Comptes de test (Mocks préenregistrés)</span>
          </div>
          <div className="mock-chips">
            {users.slice(0, 2).map((user) => (
              <button
                key={user.id}
                type="button"
                className="mock-chip-btn"
                onClick={() => handleQuickLogin(user)}
                title={`Remplir automatiquement avec ${user.username}`}
              >
                <strong>{user.username}</strong>
                <span className="text-muted">({user.password})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{" "}
            <Link to="/register" className="accent-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
