import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import Home from "./pages/Home";
import AnalyzeJob from "./pages/AnalyzeJob";
import Login from "./pages/Login";
import Register from "./pages/Register";

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

        {/* PROTECTED ANALYZE PAGE */}
        <Route
          path="/analyze"
          element={<ProtectedAnalyze />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;