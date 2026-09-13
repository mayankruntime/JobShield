import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";

import Home from "./pages/Home";
import AnalyzeJob from "./pages/AnalyzeJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";


/* =========================================
   PROTECTED ROUTE
========================================= */

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =================================
            PUBLIC HOME
        ================================= */}

        <Route
          path="/"
          element={
            <>
              <Home />
              <HowItWorks />
            </>
          }
        />


        {/* =================================
            PUBLIC AUTH PAGES
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =================================
            PROTECTED ANALYZE
        ================================= */}

        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AnalyzeJob />
            </ProtectedRoute>
          }
        />


        {/* =================================
            PROTECTED DASHBOARD
        ================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =================================
            PROTECTED HISTORY
        ================================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />


        {/* =================================
            PROTECTED PROFILE
        ================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =================================
            UNKNOWN URL
        ================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;