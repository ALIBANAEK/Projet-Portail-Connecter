import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PortalProvider } from "./context/PortalContext";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PortalList } from "./pages/PortalList";
import { PortalDetail } from "./pages/PortalDetail";
import "./App.css";

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">{children}</main>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <PortalProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Portal Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PortalList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/portal/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PortalDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortalProvider>
    </AuthProvider>
  );
}

export default App;
