export const INITIAL_MOCK_USERS = [
  {
    id: "user-1",
    username: "Alexandre",
    email: "alexandre.dev@example.com",
    password: "Password123!",
    createdAt: "2026-09-15",
  },
  {
    id: "user-2",
    username: "Sophie",
    email: "sophie.martin@example.com",
    password: "MonSuperMotDePasse2026",
    createdAt: "2026-10-01",
  }
];

export const PORTAL_STATES = {
  CLOSED: "fermé",
  HALF_OPEN: "à moitié ouvert",
  OPEN: "ouvert",
};

// Règles de transition d'état d'un portail
export const STATE_TRANSITIONS = {
  [PORTAL_STATES.CLOSED]: [
    PORTAL_STATES.HALF_OPEN,
    PORTAL_STATES.OPEN,
  ],
  [PORTAL_STATES.HALF_OPEN]: [
    PORTAL_STATES.CLOSED,
    PORTAL_STATES.OPEN,
  ],
  [PORTAL_STATES.OPEN]: [
    PORTAL_STATES.HALF_OPEN,
    PORTAL_STATES.CLOSED,
  ],
};

export const INITIAL_MOCK_PORTALS = [
  {
    id: "portail-nord",
    name: "Portail Entrée Nord",
    location: "Accès Principal - Bâtiment A",
    currentState: PORTAL_STATES.CLOSED,
    digicode: "1234",
    primaryUser: null, // Sera défini par le premier utilisateur connecté
    description: "Portail motorisé automatique réservé aux véhicules du personnel et livraisons.",
    lastUpdated: "Aujourd'hui à 08:30",
    history: [
      { from: PORTAL_STATES.OPEN, to: PORTAL_STATES.CLOSED, timestamp: "08:30:12" },
      { from: PORTAL_STATES.HALF_OPEN, to: PORTAL_STATES.OPEN, timestamp: "08:25:00" },
    ],
  },
  {
    id: "portail-sud",
    name: "Portail Résidence Sud",
    location: "Voie piétonne & parking Sud",
    currentState: PORTAL_STATES.OPEN,
    digicode: "5678",
    primaryUser: null,
    description: "Accès pour les visiteurs et riverains. Ouverture programmée en journée.",
    lastUpdated: "Aujourd'hui à 07:15",
    history: [
      { from: PORTAL_STATES.CLOSED, to: PORTAL_STATES.OPEN, timestamp: "07:15:00" },
    ],
  },
  {
    id: "portail-entrepot",
    name: "Portail Entrepôt Logistique",
    location: "Quai de chargement n°3",
    currentState: PORTAL_STATES.HALF_OPEN,
    digicode: "9988",
    primaryUser: null,
    description: "Portail coulissant industriel. Position intermédiaire pour ventilation et passage palettes.",
    lastUpdated: "Hier à 18:45",
    history: [
      { from: PORTAL_STATES.OPEN, to: PORTAL_STATES.HALF_OPEN, timestamp: "18:45:22" },
    ],
  },
  {
    id: "portail-jardin",
    name: "Portail Espace Vert & Parc",
    location: "Allée des Marronniers",
    currentState: PORTAL_STATES.CLOSED,
    digicode: "4321",
    primaryUser: null,
    description: "Portail double battant pour engins d'entretien des jardins municipaux.",
    lastUpdated: "Il y a 3 jours",
    history: [
      { from: PORTAL_STATES.OPEN, to: PORTAL_STATES.CLOSED, timestamp: "17:00:00" },
    ],
  },
  {
    id: "portail-vip",
    name: "Portail Accès VIP & Direction",
    location: "Sous-sol niveau -1",
    currentState: PORTAL_STATES.CLOSED,
    digicode: "0000",
    primaryUser: null,
    description: "Portail sécurisé à lecture de badge RFID et reconnaissance de plaque.",
    lastUpdated: "Aujourd'hui à 08:00",
    history: [
      { from: PORTAL_STATES.HALF_OPEN, to: PORTAL_STATES.CLOSED, timestamp: "08:00:00" },
    ],
  },
];
