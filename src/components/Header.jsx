import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserProfileModal } from "./UserProfileModal";
import { User, Layers, LogIn } from "lucide-react";

export function Header() {
  const { currentUser } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          {/* Top Left: User Profile Icon as requested */}
          <div className="header-left">
            {currentUser ? (
              <button
                type="button"
                className="user-profile-trigger"
                onClick={() => setProfileModalOpen(true)}
                title="Afficher mes informations utilisateur"
                aria-label="Mon compte"
              >
                <div className="user-icon-circle">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="user-header-avatar" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="user-text-pill">
                  <span className="user-name">{currentUser.username}</span>
                  <span className="user-status-dot"></span>
                </div>
              </button>
            ) : (
              <Link to="/login" className="user-profile-trigger guest">
                <div className="user-icon-circle">
                  <LogIn size={18} />
                </div>
                <span className="user-name">Se connecter</span>
              </Link>
            )}
          </div>

          {/* Center: Branding & Navigation */}
          <div className="header-center">
            <Link to="/" className="brand-logo">
              <div className="brand-icon">
                <Layers size={22} />
              </div>
              <span className="brand-title">PortailManager</span>
            </Link>
          </div>

          {/* Right: Quick Navigation */}
          <div className="header-right">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Tous les portails
            </Link>
          </div>
        </div>
      </header>

      {/* User Info & Account Management Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
