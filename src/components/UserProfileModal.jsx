import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, KeyRound, Eye, EyeOff, Trash2, LogOut, X, AlertTriangle, Camera, Trash } from "lucide-react";

export function UserProfileModal({ isOpen, onClose }) {
  const { currentUser, deleteAccount, updateAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    const success = deleteAccount();
    if (success) {
      onClose();
      navigate("/register");
    }
  };

  // Gestion du téléversement de la photo de profil
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La photo ne doit pas dépasser 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateAvatar(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="avatar-badge">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="avatar-img-circle" />
              ) : (
                <User size={22} />
              )}
            </div>
            <div>
              <h3>Mon Profil Utilisateur</h3>
              <p className="subtitle">Informations du compte actif</p>
            </div>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Photo de profil section */}
          <div className="profile-photo-section">
            <div className="profile-photo-wrapper">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Photo de profil" className="profile-avatar-large" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <User size={38} />
                </div>
              )}

              <button
                type="button"
                className="photo-upload-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Changer la photo de profil"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="photo-actions">
              <span className="photo-title">Photo de profil</span>
              <div className="photo-btn-row">
                <button
                  type="button"
                  className="photo-change-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={14} />
                  <span>{currentUser.avatar ? "Changer la photo" : "Ajouter une photo"}</span>
                </button>
                {currentUser.avatar && (
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={handleRemovePhoto}
                    title="Supprimer la photo"
                  >
                    <Trash size={14} />
                    <span>Retirer</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User identifier card */}
          <div className="info-group">
            <label className="info-label">
              <User size={16} />
              <span>Nom d'utilisateur (User)</span>
            </label>
            <div className="info-value-box">
              <span className="font-semibold">{currentUser.username}</span>
              <span className="user-tag">Actif</span>
            </div>
          </div>

          <div className="info-group">
            <label className="info-label">
              <span>Adresse Email</span>
            </label>
            <div className="info-value-box">
              <span>{currentUser.email}</span>
            </div>
          </div>

          {/* Password field with hidden / masked toggle */}
          <div className="info-group">
            <label className="info-label">
              <KeyRound size={16} />
              <span>Mot de passe (Caché)</span>
            </label>
            <div className="password-box">
              <span className="password-text">
                {showPassword ? currentUser.password : "•".repeat(currentUser.password.length || 10)}
              </span>
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                <span>{showPassword ? "Masquer" : "Révéler"}</span>
              </button>
            </div>
            <p className="help-text">Le mot de passe est masqué par défaut pour protéger votre confidentialité.</p>
          </div>

          {/* Account Creation Date */}
          {currentUser.createdAt && (
            <div className="info-group">
              <label className="info-label">Membre depuis</label>
              <div className="info-value-box text-sm">
                <span>{currentUser.createdAt}</span>
              </div>
            </div>
          )}

          {/* Supprimer le compte (Zone de danger retirée) */}
          <div className="account-delete-container">
            {!confirmDeleteOpen ? (
              <button
                type="button"
                className="danger-btn"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Trash2 size={16} />
                <span>Supprimer le compte</span>
              </button>
            ) : (
              <div className="delete-confirm-box">
                <div className="delete-confirm-header">
                  <AlertTriangle size={18} className="text-danger" />
                  <span>Confirmer la suppression définitive ?</span>
                </div>
                <p className="text-sm">
                  Cette action est irréversible. Votre compte sera supprimé du système de maquette.
                </p>
                <div className="delete-confirm-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setConfirmDeleteOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="danger-confirm-btn"
                    onClick={handleDeleteAccount}
                  >
                    Oui, supprimer mon compte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
          <button type="button" className="close-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
