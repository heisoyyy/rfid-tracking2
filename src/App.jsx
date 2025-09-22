import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QRScanner from "./pages/QRScanner";
import TrackingData from "./pages/TrackingData";
import History from "./pages/History"; // ⬅ import halaman History
import { TrackingProvider } from "./context/TrackingContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
      />

      {isLoggedIn ? (
        <Route
          element={
            <TrackingProvider>
              <Layout onLogout={() => setIsLoggedIn(false)} />
            </TrackingProvider>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<QRScanner />} />
          <Route path="/tracking" element={<TrackingData />} />
          <Route path="/history" element={<History />} /> {/* ⬅ tambahkan route History */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
