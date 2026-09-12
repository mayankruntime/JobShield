
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      /*
       * Save authenticated user information
       */
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userId", data.userId);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      /*
       * IMPORTANT:
       * Notify Navbar immediately after login.
       * This makes Dashboard, History, Profile
       * and Logout appear without refreshing.
       */
      window.dispatchEvent(new Event("authChange"));

      /*
       * Go to Analyze page after successful login
       */
      navigate("/analyze");

    } catch (err) {

      setError(
        err.message || "Login failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="login-page">

      <div className="grid-background"></div>

      <div className="floating-orb orb-one"></div>
      <div className="floating-orb orb-two"></div>
      <div className="floating-orb orb-three"></div>


      {/* ================= LEFT HERO ================= */}

      <div className="login-hero">

        <div className="hero-top">

          <div className="brand-logo">

            <div className="shield-logo">
              <span>J</span>
            </div>

            <div>
              <h2>
                Job<span>Shield</span>
              </h2>

              <small>
                SMART JOB PROTECTION
              </small>
            </div>

          </div>


          <div className="brand-nav">

            <span>SECURE</span>
            <i>•</i>
            <span>AI POWERED</span>

          </div>

        </div>


        <div className="hero-main">

          <div className="hero-badge">

            <span className="pulse-dot"></span>

            AI-POWERED JOB SAFETY

          </div>


          <h1>
            Stay Safe.
            <br />
            Get Hired.
            <br />
            <span>With Confidence.</span>
          </h1>


          <p className="hero-description">

            JobShield helps you identify suspicious job
            opportunities and protect yourself from online
            recruitment scams before it's too late.

          </p>


          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon blue">
                ◉
              </div>

              <div>

                <h4>
                  AI Scam Detection
                </h4>

                <p>
                  Analyze suspicious job opportunities
                  using intelligent detection.
                </p>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon green">
                ✓
              </div>

              <div>

                <h4>
                  Risk Analysis
                </h4>

                <p>
                  Get a clear and easy-to-understand
                  risk score.
                </p>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon purple">
                ◈
              </div>

              <div>

                <h4>
                  Analysis History
                </h4>

                <p>
                  Keep track of your previous job
                  safety checks.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Security Visual */}

        <div className="security-visual">

          <div className="scan-ring ring-one"></div>
          <div className="scan-ring ring-two"></div>


          <div className="main-shield">

            <div className="shield-inner">
              J
            </div>

          </div>


          <div className="risk-card risk-one">

            <div className="risk-icon">
              ✓
            </div>

            <div>

              <small>
                JOB STATUS
              </small>

              <strong>
                Safe Opportunity
              </strong>

            </div>

          </div>


          <div className="risk-card risk-two">

            <div className="risk-icon danger">
              !
            </div>

            <div>

              <small>
                THREAT DETECTED
              </small>

              <strong>
                Suspicious Job
              </strong>

            </div>

          </div>


          <div className="risk-card risk-three">

            <small>
              RISK SCORE
            </small>

            <strong>
              12 / 100
            </strong>

          </div>

        </div>


        <div className="hero-footer">

          <span></span>

          YOUR SAFETY COMES FIRST

        </div>

      </div>


      {/* ================= LOGIN SECTION ================= */}

      <div className="login-section">

        <div className="login-card">


          {/* Login Brand */}

          <div className="login-brand">

            <div className="shield-logo small">

              <span>
                J
              </span>

            </div>

            <div>

              <h2>
                Job<span>Shield</span>
              </h2>

              <small>
                SMART JOB PROTECTION
              </small>

            </div>

          </div>


          {/* Heading */}

          <div className="login-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Continue protecting yourself from job scams.
            </p>

          </div>


          {/* Login Form */}

          <form onSubmit={handleLogin}>


            {/* Email */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-box">

                <span className="input-symbol">
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="input-group">

              <div className="password-heading">

                <label>
                  Password
                </label>


                {/* Forgot Password */}

                <span
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                >
                  Forgot password?
                </span>

              </div>


              <div className="input-box">

                <span className="input-symbol">
                  🔒
                </span>


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />


                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  {showPassword
                    ? "🙈"
                    : "👁"
                  }

                </button>

              </div>

            </div>


            {/* Error */}

            {error && (

              <div className="login-error">

                <span>
                  !
                </span>

                {error}

              </div>

            )}


            {/* Remember Me */}

            <div className="remember-row">

              <label className="remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span className="custom-checkbox">
                  ✓
                </span>

                Remember me

              </label>

            </div>


            {/* Sign In */}

            <button
              type="submit"
              className="signin-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="button-spinner"></span>
                  Signing in...
                </>

              ) : (

                <>
                  Sign In

                  <span className="arrow">
                    →
                  </span>

                </>

              )}

            </button>

          </form>


          {/* Secure Divider */}

          <div className="secure-divider">

            <span></span>

            SECURE CONNECTION

            <span></span>

          </div>


          {/* Secure Box */}

          <div className="secure-box">

            <div className="secure-icon">
              🔐
            </div>

            <div>

              <strong>
                Secure Login
              </strong>

              <p>
                Your credentials are protected with
                secure authentication.
              </p>

            </div>

          </div>


          {/* Register */}

          <div className="register-link">

            Don't have an account?

            <span
              onClick={() =>
                navigate("/register")
              }
            >
              Create Account
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;


