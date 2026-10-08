import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_MOCK_USERS } from "../mockData";

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = "portal_app_users";
const CURRENT_USER_KEY = "portal_app_current_user";

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved users", e);
      }
    }
    return INITIAL_MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse current user", e);
      }
    }
    // Default to the first mock user for instant ready-to-test experience
    return INITIAL_MOCK_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  // Login handler
  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Identifiants invalides (nom d'utilisateur/email ou mot de passe incorrect).",
      };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  // Register handler
  const register = ({ username, email, password, avatar = null }) => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      return { success: false, message: "Tous les champs sont obligatoires." };
    }

    const existingUser = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() ||
        u.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      return {
        success: false,
        message: "Un compte avec ce nom d'utilisateur ou cet email existe déjà.",
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      avatar: avatar,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  // Update profile photo
  const updateAvatar = (avatarData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatar: avatarData };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
  };

  // Delete account handler
  const deleteAccount = () => {
    if (!currentUser) return false;
    const remainingUsers = users.filter((u) => u.id !== currentUser.id);
    setUsers(remainingUsers);
    setCurrentUser(null);
    return true;
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        updateAvatar,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
