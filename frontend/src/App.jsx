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

function ProtectedAnalyze() {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AnalyzeJob />;
}

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <HowItWorks />
            </>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />

        {/* PROTECTED ANALYZE PAGE */}
        <Route
          path="/analyze"
          element={<ProtectedAnalyze />}
        />
        <Route
          path="/history"
          element={<History />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;