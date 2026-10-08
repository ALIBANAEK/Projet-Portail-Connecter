import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_MOCK_PORTALS, STATE_TRANSITIONS, PORTAL_STATES } from "../mockData";
import { useAuth } from "./AuthContext";

const PortalContext = createContext(null);

const PORTALS_STORAGE_KEY = "portal_app_portals_data";

export function PortalProvider({ children }) {
  const { currentUser } = useAuth();

  const [portals, setPortals] = useState(() => {
    let list = INITIAL_MOCK_PORTALS;
    const saved = localStorage.getItem(PORTALS_STORAGE_KEY);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved portals", e);
      }
    }

    const savedUser = localStorage.getItem("portal_app_current_user");
    let initialUser = "Alexandre";
    if (savedUser) {
      try {
        initialUser = JSON.parse(savedUser)?.username || initialUser;
      } catch {
        // fallback
      }
    }

    return list.map((p) => ({
      ...p,
      primaryUser: p.primaryUser || initialUser,
    }));
  });

  useEffect(() => {
    localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
  }, [portals]);

  const getPortalById = (id) => {
    return portals.find((p) => p.id === id);
  };

  const getPossibleTransitions = (currentState) => {
    return STATE_TRANSITIONS[currentState] || [];
  };

  const updatePortalState = (portalId, targetState) => {
    const timeString = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setPortals((prevPortals) =>
      prevPortals.map((portal) => {
        if (portal.id !== portalId) return portal;

        const currentAllowed = STATE_TRANSITIONS[portal.currentState] || [];
        if (!currentAllowed.includes(targetState)) {
          console.warn(`Transition non autorisée de ${portal.currentState} vers ${targetState}`);
          return portal;
        }

        const newHistory = [
          {
            from: portal.currentState,
            to: targetState,
            timestamp: timeString,
          },
          ...(portal.history || []),
        ];

        return {
          ...portal,
          currentState: targetState,
          lastUpdated: `Modifié à ${timeString}`,
          history: newHistory,
        };
      })
    );
  };

  // Modifier le nom du portail
  const updatePortalName = (portalId, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    setPortals((prevPortals) =>
      prevPortals.map((portal) => {
        if (portal.id !== portalId) return portal;
        return {
          ...portal,
          name: trimmed,
        };
      })
    );
    return true;
  };

  // Ajout d'un nouveau portail avec son nom et son code digicode
  const addPortal = ({ name, digicode, location, description }) => {
    const trimmedName = name.trim();
    const trimmedCode = digicode.trim();

    if (!trimmedName || !trimmedCode) {
      return { success: false, message: "Le nom et le digicode sont obligatoires." };
    }

    const newPortal = {
      id: `portail-${Date.now()}`,
      name: trimmedName,
      digicode: trimmedCode,
      location: location?.trim() || "Zone d'accès par défaut",
      description:
        description?.trim() || "Nouveau portail configuré avec contrôle d'accès digicode.",
      currentState: PORTAL_STATES.CLOSED,
      primaryUser: currentUser?.username || "Administrateur",
      lastUpdated: "Créé à l'instant",
      history: [
        {
          from: "Initialisation",
          to: PORTAL_STATES.CLOSED,
          timestamp: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setPortals((prev) => [newPortal, ...prev]);
    return { success: true, portal: newPortal };
  };

  const resetToDefaultPortals = () => {
    const resetList = INITIAL_MOCK_PORTALS.map((p) => ({
      ...p,
      primaryUser: currentUser?.username || null,
    }));
    setPortals(resetList);
    localStorage.removeItem(PORTALS_STORAGE_KEY);
  };

  return (
    <PortalContext.Provider
      value={{
        portals,
        getPortalById,
        getPossibleTransitions,
        updatePortalState,
        updatePortalName,
        addPortal,
        resetToDefaultPortals,
        PORTAL_STATES,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortals() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortals must be used within a PortalProvider");
  }
  return context;
}
