import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {

    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLogin);
    window.addEventListener("authChange", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authChange", checkLogin);
    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  const goToHowItWorks = () => {

    if (location.pathname === "/") {

      document
        .getElementById("how-it-works")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    } else {

      navigate("/");

      setTimeout(() => {
        document
          .getElementById("how-it-works")
          ?.scrollIntoView({
            behavior: "smooth"
          });
      }, 300);

    }
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <div
          className="navbar-logo"
          onClick={() => navigate("/")}
        >
          <span className="logo-icon">🛡️</span>
          <span>JobShield</span>
        </div>


        {/* Navigation Links */}
        <div className="navbar-links">

          <button
            className="nav-link"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/analyze")}
          >
            Analyze
          </button>

          {isLoggedIn && (
            <>
              <button
                className="nav-link"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/history")}
              >
                History
              </button>
            </>
          )}

          <button
            className="nav-link"
            onClick={goToHowItWorks}
          >
            How It Works
          </button>

        </div>


        {/* Right Side */}
        <div className="navbar-actions">

          {!isLoggedIn ? (
            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="signup-btn"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;