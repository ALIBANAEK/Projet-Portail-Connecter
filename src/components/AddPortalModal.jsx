import React, { useState } from "react";
import { usePortals } from "../context/PortalContext";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, KeyRound, MapPin, AlignLeft, X, ShieldCheck, AlertCircle } from "lucide-react";

export function AddPortalModal({ isOpen, onClose }) {
  const { addPortal } = usePortals();
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [digicode, setDigicode] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Veuillez renseigner un nom pour le portail.");
      return;
    }

    if (!digicode.trim()) {
      setError("Veuillez renseigner le code du digicode.");
      return;
    }

    const res = addPortal({
      name,
      digicode,
      location,
      description,
    });

    if (res.success) {
      setName("");
      setDigicode("");
      setLocation("");
      setDescription("");
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="avatar-badge">
              <PlusCircle size={22} />
            </div>
            <div>
              <h3>Ajouter un Portail</h3>
              <p className="subtitle">Configuration avec code digicode</p>
            </div>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-banner error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="info-group">
              <label className="info-label" htmlFor="portal-name">
                <span>Nom du portail *</span>
              </label>
              <input
                id="portal-name"
                type="text"
                className="custom-form-input"
                placeholder="ex: Portail Entrée Ouest"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="info-group">
              <label className="info-label" htmlFor="portal-digicode">
                <KeyRound size={15} />
                <span>Code du digicode (même code que le digicode) *</span>
              </label>
              <input
                id="portal-digicode"
                type="text"
                className="custom-form-input"
                placeholder="ex: 1234 ou 4589#"
                value={digicode}
                onChange={(e) => setDigicode(e.target.value)}
                required
              />
              <span className="help-text">Ce code permettra le déverrouillage physique et numérique du portail.</span>
            </div>

            <div className="info-group">
              <label className="info-label" htmlFor="portal-location">
                <MapPin size={15} />
                <span>Emplacement / Zone (optionnel)</span>
              </label>
              <input
                id="portal-location"
                type="text"
                className="custom-form-input"
                placeholder="ex: Allée Centrale - Parking B"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="info-group">
              <label className="info-label" htmlFor="portal-desc">
                <AlignLeft size={15} />
                <span>Description (optionnel)</span>
              </label>
              <textarea
                id="portal-desc"
                className="custom-form-textarea"
                rows="2"
                placeholder="ex: Portail motorisé à battants pour véhicules autorisés."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="primary-user-callout">
              <ShieldCheck size={18} className="text-primary" />
              <div>
                <strong>Utilisateur principal désigné :</strong>
                <p>
                  Votre compte (<strong>{currentUser?.username}</strong>) sera enregistré comme l'utilisateur principal de ce portail.
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="close-btn">
              Créer le portail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
