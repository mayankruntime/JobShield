import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

import jobshieldLogo from "../assets/jobshield-navbar-logo.png";

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

        checkLogin();

        window.addEventListener("storage", checkLogin);
        window.addEventListener("authChange", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
            window.removeEventListener("authChange", checkLogin);
        };

    }, [location.pathname]);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("rememberMe");

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


    const isActive = (path) => {
        return location.pathname === path;
    };


    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* BRAND */}

                <div
                    className="navbar-brand"
                    onClick={() => navigate("/")}
                >

                    <img
                        src={jobshieldLogo}
                        alt="JobShield"
                        className="navbar-logo-image"
                    />

                </div>


                {/* NAVIGATION */}

                <div className="navbar-links">

                    <button
                        className={`nav-link ${
                            isActive("/") ? "active" : ""
                        }`}
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>


                    <button
                        className={`nav-link ${
                            isActive("/analyze") ? "active" : ""
                        }`}
                        onClick={() => navigate("/analyze")}
                    >
                        Analyze
                    </button>


                    {isLoggedIn && (
                        <>

                            <button
                                className={`nav-link ${
                                    isActive("/dashboard")
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Dashboard
                            </button>


                            <button
                                className={`nav-link ${
                                    isActive("/history")
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigate("/history")
                                }
                            >
                                History
                            </button>


                            <button
                                className={`nav-link ${
                                    isActive("/profile")
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigate("/profile")
                                }
                            >
                                Profile
                            </button>

                        </>
                    )}


                    <button
                        className="nav-link how-link"
                        onClick={goToHowItWorks}
                    >
                        How It Works
                    </button>

                </div>


                {/* ACTIONS */}

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
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Get Started
                                <span>→</span>
                            </button>

                        </>
                    ) : (

                        <button
                            className="logout-btn"
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
