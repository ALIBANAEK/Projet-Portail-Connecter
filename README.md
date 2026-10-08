# Projet-Portail-Connecter

Application web React JS de supervision et de contrôle d'accès pour portails connectés avec gestion des utilisateurs et des digicodes.

---

## 🌟 Fonctionnalités principales

1. **Authentification & Gestion de compte (Mocks)** :
   - Inscription (`/register`) avec nom d'utilisateur, email et mot de passe.
   - Connexion (`/login`) avec validation et raccourcis de comptes tests.
   - Icône de profil utilisateur en haut à gauche avec :
     - Informations du profil.
     - Mot de passe masqué par défaut avec affichage/masquage au clic.
     - Option de suppression définitive du compte.
     - Déconnexion.

2. **Supervision des portails (Page d'accueil)** :
   - Liste des portails connectés avec aperçu visuel animé de l'état (ouvert, à moitié ouvert, fermé).
   - Cartes statistiques (Total, Fermés, À moitié ouverts, Ouverts) utilisables comme filtres.
   - Recherche en temps réel (nom, emplacement, propriétaire).
   - Clic sur l'ensemble du bloc portail pour ouvrir la fiche descriptive.
   - Bouton **"Ajouter un portail"** avec nom et code digicode.

3. **Page descriptive de chaque portail (`/portal/:id`)** :
   - Nom modifiable directement en ligne (bouton d'édition).
   - Affichage de l'**utilisateur principal** (propriétaire assigné à la première connexion ou à la création).
   - Contrôle d'accès par **Digicode** : affichage du code (masqué/révélé) et simulateur de saisie pour tester l'ouverture.
   - **États où il peut aller** : boutons d'action permettant de basculer interactivement entre les états autorisés (*fermé*, *ouvert*, *à moitié ouvert*).
   - Graphique animé du portail reflétant en direct la position des battants.
   - Historique chronologique des transitions d'état.

---

## 🚀 Installation et Lancement local

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Lancement en mode développement
```bash
# Installation des dépendances (si ce n'est pas déjà fait)
npm install

# Démarrer le serveur de développement local
npm run dev
```

### Build pour mise en production (Serveur)
```bash
npm run build
```
Les fichiers générés sont disponibles dans le dossier `dist/` et prêts à être déployés sur n'importe quel serveur web (Nginx, Apache, Node, etc.).

---

## 👥 Comptes de test par défaut
- **Alexandre** : `Password123!`
- **Sophie** : `MonSuperMotDePasse2026`
*(Vous pouvez également créer de nouveaux comptes via la page d'inscription)*.
