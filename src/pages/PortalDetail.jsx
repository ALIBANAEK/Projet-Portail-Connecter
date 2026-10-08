import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortals } from "../context/PortalContext";
import { useAuth } from "../context/AuthContext";
import { PortalGraphic } from "../components/PortalGraphic";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  History,
  CheckCircle2,
  HelpCircle,
  Layers,
  Edit2,
  Check,
  X,
  Crown,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

export function PortalDetail() {
  const { id } = useParams();
  const { getPortalById, getPossibleTransitions, updatePortalState, updatePortalName, PORTAL_STATES } =
    usePortals();
  const { currentUser } = useAuth();

  const [notification, setNotification] = useState(null);

  // Édition du nom du portail
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Affichage du code digicode
  const [showDigicode, setShowDigicode] = useState(false);

  // Test du digicode (simulation digicode)
  const [inputCode, setInputCode] = useState("");
  const [codeFeedback, setCodeFeedback] = useState(null);

  const portal = getPortalById(id);

  if (!portal) {
    return (
      <div className="not-found-card">
        <h2>Portail introuvable</h2>
        <p>Le portail avec l'identifiant "{id}" n'existe pas ou a été supprimé.</p>
        <Link to="/" className="primary-btn">
          <ArrowLeft size={16} />
          <span>Retourner à la liste des portails</span>
        </Link>
      </div>
    );
  }

  const possibleStates = getPossibleTransitions(portal.currentState);
  const allStates = [PORTAL_STATES.CLOSED, PORTAL_STATES.HALF_OPEN, PORTAL_STATES.OPEN];
  const isOwner = currentUser && portal.primaryUser === currentUser.username;

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStateChange = (targetState) => {
    updatePortalState(portal.id, targetState);
    showToast("success", `Le portail est passé avec succès à l'état : "${targetState}".`);
  };

  const handleStartEditName = () => {
    setNameInput(portal.name);
    setIsEditingName(true);
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const success = updatePortalName(portal.id, nameInput);
    if (success) {
      setIsEditingName(false);
      showToast("success", `Le nom du portail a été renommé en "${nameInput.trim()}".`);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
  };

  // Simulation test digicode
  const handleVerifyDigicode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    if (inputCode.trim() === portal.digicode) {
      setCodeFeedback({
        type: "success",
        message: "Code valide ! Accès déverrouillé.",
      });
      // Si fermé, on propose ou déclenche l'ouverture
      if (portal.currentState === PORTAL_STATES.CLOSED) {
        updatePortalState(portal.id, PORTAL_STATES.OPEN);
        showToast("success", "Code digicode validé : Portail ouvert automatiquement !");
      }
    } else {
      setCodeFeedback({
        type: "error",
        message: "Code incorrect. Veuillez réessayer.",
      });
    }

    setTimeout(() => {
      setCodeFeedback(null);
    }, 3500);
  };

  const getStateBadgeClass = (state) => {
    switch (state) {
      case PORTAL_STATES.OPEN:
        return "badge-state badge-open";
      case PORTAL_STATES.HALF_OPEN:
        return "badge-state badge-half";
      case PORTAL_STATES.CLOSED:
      default:
        return "badge-state badge-closed";
    }
  };

  const getStateDescription = (state) => {
    switch (state) {
      case PORTAL_STATES.CLOSED:
        return "Accès totalement verrouillé. Aucun passage autorisé.";
      case PORTAL_STATES.HALF_OPEN:
        return "Ouverture partielle pour passage piéton ou aération de zone.";
      case PORTAL_STATES.OPEN:
        return "Accès totalement dégagé et ouvert au trafic.";
      default:
        return "";
    }
  };

  return (
    <div className="portal-detail-page">
      {/* Top Navigation Bar */}
      <div className="detail-topbar">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          <span>Retour à la liste des portails</span>
        </Link>
        <span className="portal-id-tag">ID: {portal.id}</span>
      </div>

      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          <CheckCircle2 size={20} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Detail Header Card */}
      <div className="portal-hero-card">
        <div className="hero-content">
          <div className="hero-titles">
            <span className="hero-category">Fiche descriptive du portail</span>

            {/* Editable Portal Name */}
            {!isEditingName ? (
              <div className="hero-name-row">
                <h1 className="hero-name">{portal.name}</h1>
                <button
                  type="button"
                  className="edit-name-btn"
                  onClick={handleStartEditName}
                  title="Modifier le nom du portail"
                >
                  <Edit2 size={16} />
                  <span>Modifier le nom</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="edit-name-form">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="edit-name-input"
                  placeholder="Nouveau nom du portail"
                  autoFocus
                  required
                />
                <button type="submit" className="save-name-btn" title="Enregistrer">
                  <Check size={16} />
                  <span>Enregistrer</span>
                </button>
                <button
                  type="button"
                  className="cancel-name-btn"
                  onClick={handleCancelEditName}
                  title="Annuler"
                >
                  <X size={16} />
                  <span>Annuler</span>
                </button>
              </form>
            )}

            {/* Primary User Banner */}
            <div className="primary-user-badge-banner">
              <Crown size={18} className="text-amber-500" />
              <div>
                <span className="primary-user-title">Utilisateur principal :</span>
                <strong> {portal.primaryUser || "Non assigné"}</strong>
                {isOwner ? (
                  <span className="owner-chip">⭐ Vous êtes l'administrateur principal</span>
                ) : (
                  <span className="owner-chip other">Défini par la première connexion</span>
                )}
              </div>
            </div>

            <div className="hero-meta">
              <span className="meta-item">
                <MapPin size={16} />
                {portal.location}
              </span>
              <span className="meta-item">
                <Clock size={16} />
                {portal.lastUpdated}
              </span>
            </div>

            <p className="hero-description">{portal.description}</p>
          </div>

          <div className="current-state-panel">
            <span className="current-state-title">État Actuel</span>
            <div className={`current-state-badge-lg ${getStateBadgeClass(portal.currentState)}`}>
              <span className="state-pulse-indicator"></span>
              <span className="state-text-lg">{portal.currentState}</span>
            </div>
            <p className="state-explainer">{getStateDescription(portal.currentState)}</p>
          </div>
        </div>

        {/* Visual Animated Gate Rendering */}
        <div className="hero-graphic-wrap">
          <PortalGraphic state={portal.currentState} size="large" />
        </div>
      </div>

      {/* Digicode and State Transitions Grid */}
      <div className="detail-grid">
        {/* Left Column: Possible transitions action box */}
        <div className="detail-section-card transition-action-card">
          <div className="section-card-header">
            <div className="section-icon-wrap accent">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>États où il peut aller</h3>
              <p className="section-subtitle">
                Transitions d'état autorisées depuis l'état actuel : <strong>"{portal.currentState}"</strong>
              </p>
            </div>
          </div>

          <div className="transitions-list">
            {possibleStates.length === 0 ? (
              <p className="empty-transitions">Aucune transition disponible depuis cet état.</p>
            ) : (
              possibleStates.map((targetState) => (
                <div key={targetState} className="transition-target-item">
                  <div className="target-left-info">
                    <div className="target-state-pill-wrap">
                      <span className={getStateBadgeClass(targetState)}>
                        {targetState}
                      </span>
                    </div>
                    <p className="target-state-desc">{getStateDescription(targetState)}</p>
                  </div>

                  <button
                    type="button"
                    className="apply-transition-btn"
                    onClick={() => handleStateChange(targetState)}
                  >
                    <span>Passer à "{targetState}"</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="transition-notes">
            <HelpCircle size={16} />
            <span>
              Les transitions modifient instantanément l'état dans la maquette et alimentent le journal d'activité.
            </span>
          </div>

          {/* Digicode Control & Simulation */}
          <div className="digicode-section-box">
            <div className="digicode-header">
              <div className="digicode-title-wrap">
                <KeyRound size={18} className="text-primary" />
                <h4>Contrôle d'accès Digicode</h4>
              </div>

              {portal.digicode && (
                <div className="digicode-display-wrap">
                  <span className="digicode-label">Code configuré :</span>
                  <span className="digicode-val">
                    {showDigicode ? portal.digicode : "••••"}
                  </span>
                  <button
                    type="button"
                    className="toggle-digicode-btn"
                    onClick={() => setShowDigicode(!showDigicode)}
                    title={showDigicode ? "Masquer le digicode" : "Afficher le digicode"}
                  >
                    {showDigicode ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyDigicode} className="digicode-tester-form">
              <label htmlFor="test-code">Tester le digicode physique :</label>
              <div className="digicode-input-group">
                <input
                  id="test-code"
                  type="text"
                  placeholder="Tapez le code (ex: 1234)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="digicode-input"
                />
                <button type="submit" className="test-code-btn">
                  Valider le code
                </button>
              </div>

              {codeFeedback && (
                <div className={`code-feedback ${codeFeedback.type}`}>
                  {codeFeedback.type === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <HelpCircle size={16} />
                  )}
                  <span>{codeFeedback.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Global State Matrix & Status Overview */}
        <div className="detail-section-card status-overview-card">
          <div className="section-card-header">
            <div className="section-icon-wrap">
              <Layers size={20} />
            </div>
            <div>
              <h3>Matrice de l'ensemble des états</h3>
              <p className="section-subtitle">Vue globale des 3 états du système de portail</p>
            </div>
          </div>

          <div className="all-states-matrix">
            {allStates.map((stateItem) => {
              const isCurrent = stateItem === portal.currentState;
              const isReachable = possibleStates.includes(stateItem);

              return (
                <div
                  key={stateItem}
                  className={`matrix-row ${isCurrent ? "current" : isReachable ? "reachable" : "unreachable"}`}
                >
                  <div className="matrix-row-title">
                    <span className={getStateBadgeClass(stateItem)}>{stateItem}</span>
                  </div>
                  <div className="matrix-row-status">
                    {isCurrent && (
                      <span className="status-label current">
                        <CheckCircle2 size={15} /> État en cours
                      </span>
                    )}
                    {!isCurrent && isReachable && (
                      <span className="status-label reachable">
                        ➔ Accessible immédiatement
                      </span>
                    )}
                    {!isCurrent && !isReachable && (
                      <span className="status-label unreachable">Non accessible</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* History log of state changes */}
          <div className="history-section">
            <div className="history-header">
              <History size={16} />
              <h4>Historique des transitions récentes</h4>
            </div>

            <div className="history-timeline">
              {portal.history && portal.history.length > 0 ? (
                portal.history.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-transition">
                        <span className="from-state">{item.from}</span>
                        <ArrowRight size={13} className="timeline-arrow" />
                        <span className="to-state">{item.to}</span>
                      </div>
                      <span className="timeline-time">{item.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-history">Aucune transition enregistrée pour le moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
