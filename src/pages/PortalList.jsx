import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortals } from "../context/PortalContext";
import { useAuth } from "../context/AuthContext";
import { PortalGraphic } from "../components/PortalGraphic";
import { AddPortalModal } from "../components/AddPortalModal";
import {
  DoorClosed,
  DoorOpen,
  ArrowRight,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ShieldAlert,
  MapPin,
  Clock,
  Plus,
  Crown,
  KeyRound,
} from "lucide-react";

export function PortalList() {
  const navigate = useNavigate();
  const { portals, getPossibleTransitions, resetToDefaultPortals, PORTAL_STATES } = usePortals();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("ALL");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredPortals = portals.filter((portal) => {
    const matchesSearch =
      portal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (portal.primaryUser && portal.primaryUser.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterState === "ALL" ? true : portal.currentState === filterState;

    return matchesSearch && matchesFilter;
  });

  const countTotal = portals.length;
  const countClosed = portals.filter((p) => p.currentState === PORTAL_STATES.CLOSED).length;
  const countHalf = portals.filter((p) => p.currentState === PORTAL_STATES.HALF_OPEN).length;
  const countOpen = portals.filter((p) => p.currentState === PORTAL_STATES.OPEN).length;

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

  const handleCardClick = (portalId) => {
    navigate(`/portal/${portalId}`);
  };

  return (
    <div className="portal-list-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Supervision des Portails</h1>
          <p className="page-description">
            Consultez la liste des portails connectés, leur état actuel et pilotez leurs transitions d'état.
            Cliquez sur un portail pour ouvrir sa fiche descriptive.
          </p>
        </div>
        <div className="header-actions-group">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="add-portal-btn"
          >
            <Plus size={18} />
            <span>Ajouter un portail</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaultPortals}
            className="reset-mocks-btn"
            title="Réinitialiser les données de démonstration"
          >
            <RotateCcw size={16} />
            <span>Réinitialiser les Mocks</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setFilterState("ALL")}>
          <div className="stat-icon-wrapper total">
            <SlidersHorizontal size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Portails</span>
            <span className="stat-value">{countTotal}</span>
          </div>
        </div>

        <div
          className={`stat-card ${filterState === PORTAL_STATES.CLOSED ? "active-filter" : ""}`}
          onClick={() => setFilterState(PORTAL_STATES.CLOSED)}
        >
          <div className="stat-icon-wrapper closed">
            <DoorClosed size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Fermés</span>
            <span className="stat-value">{countClosed}</span>
          </div>
        </div>

        <div
          className={`stat-card ${filterState === PORTAL_STATES.HALF_OPEN ? "active-filter" : ""}`}
          onClick={() => setFilterState(PORTAL_STATES.HALF_OPEN)}
        >
          <div className="stat-icon-wrapper half">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">À moitié ouverts</span>
            <span className="stat-value">{countHalf}</span>
          </div>
        </div>

        <div
          className={`stat-card ${filterState === PORTAL_STATES.OPEN ? "active-filter" : ""}`}
          onClick={() => setFilterState(PORTAL_STATES.OPEN)}
        >
          <div className="stat-icon-wrapper open">
            <DoorOpen size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Ouverts</span>
            <span className="stat-value">{countOpen}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="toolbar-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, emplacement ou propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${filterState === "ALL" ? "active" : ""}`}
            onClick={() => setFilterState("ALL")}
          >
            Tous ({countTotal})
          </button>
          <button
            type="button"
            className={`filter-pill ${filterState === PORTAL_STATES.CLOSED ? "active" : ""}`}
            onClick={() => setFilterState(PORTAL_STATES.CLOSED)}
          >
            Fermé ({countClosed})
          </button>
          <button
            type="button"
            className={`filter-pill ${filterState === PORTAL_STATES.HALF_OPEN ? "active" : ""}`}
            onClick={() => setFilterState(PORTAL_STATES.HALF_OPEN)}
          >
            À moitié ouvert ({countHalf})
          </button>
          <button
            type="button"
            className={`filter-pill ${filterState === PORTAL_STATES.OPEN ? "active" : ""}`}
            onClick={() => setFilterState(PORTAL_STATES.OPEN)}
          >
            Ouvert ({countOpen})
          </button>
        </div>
      </div>

      {/* Portals Cards List */}
      {filteredPortals.length === 0 ? (
        <div className="empty-state">
          <p>Aucun portail ne correspond à vos critères de recherche.</p>
          <div className="empty-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSearchTerm("");
                setFilterState("ALL");
              }}
            >
              Réinitialiser les filtres
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus size={16} />
              <span>Créer un nouveau portail</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="portals-grid">
          {filteredPortals.map((portal) => {
            const possibleTransitions = getPossibleTransitions(portal.currentState);
            const isOwner = currentUser && portal.primaryUser === currentUser.username;

            return (
              <div
                key={portal.id}
                className="portal-card clickable"
                onClick={() => handleCardClick(portal.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(portal.id);
                  }
                }}
              >
                <div className="portal-card-header">
                  <div>
                    <h3 className="portal-card-title">{portal.name}</h3>
                    <div className="portal-card-location">
                      <MapPin size={14} />
                      <span>{portal.location}</span>
                    </div>
                  </div>
                  <span className={getStateBadgeClass(portal.currentState)}>
                    {portal.currentState}
                  </span>
                </div>

                {/* Primary User badge */}
                <div className="portal-primary-user-tag">
                  <Crown size={14} className={isOwner ? "text-amber-500" : "text-slate-400"} />
                  <span className="owner-label">
                    Utilisateur principal : <strong>{portal.primaryUser || "Non assigné"}</strong>
                    {isOwner && <span className="owner-you-tag">(Vous)</span>}
                  </span>
                </div>

                {/* Visual miniature representation */}
                <div className="portal-card-preview">
                  <PortalGraphic state={portal.currentState} size="small" />
                </div>

                <div className="portal-card-body">
                  <p className="portal-card-desc">{portal.description}</p>
                  
                  <div className="portal-card-meta-row">
                    <div className="portal-card-time">
                      <Clock size={13} />
                      <span>{portal.lastUpdated}</span>
                    </div>

                    {portal.digicode && (
                      <div className="portal-card-digicode-preview" title="Digicode configuré">
                        <KeyRound size={13} />
                        <span>Code actif</span>
                      </div>
                    )}
                  </div>

                  {/* Transition preview section */}
                  <div className="possible-states-box">
                    <span className="possible-states-label">États accessibles :</span>
                    <div className="target-states-badges">
                      {possibleTransitions.map((state) => (
                        <span key={state} className={`target-badge ${getStateBadgeClass(state)}`}>
                          ➔ {state}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="portal-card-footer">
                  <div className="view-portal-btn">
                    <span>Voir le descriptif et contrôler</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Portal Modal */}
      <AddPortalModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
