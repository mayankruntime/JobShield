import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed.");
      }

      alert("Account created successfully! Please login.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-grid"></div>

      <div className="register-orb orb-one"></div>
      <div className="register-orb orb-two"></div>
      <div className="register-orb orb-three"></div>

      {/* LEFT HERO */}

      <section className="register-hero">

        <div className="register-brand">

          <div className="shield-logo">
            <span>J</span>
          </div>

          <div>
            <h2>
              Job<span>Shield</span>
            </h2>

            <small>
              Safe Jobs. Bright Future.
            </small>
          </div>

        </div>

        <div className="register-hero-content">

          <div className="register-badge">
            <span></span>
            JOIN THE SAFE JOB COMMUNITY
          </div>

          <h1>
            Your Career.
            <br />
            <span>Your Safety.</span>
            <br />
            Our Mission.
          </h1>

          <p>
            Create your JobShield account and take
            the first step towards safer and smarter
            job searching.
          </p>

          <div className="register-features">

            <div>
              <span>✓</span>
              <div>
                <strong>AI-Powered Detection</strong>
                <small>Identify suspicious job patterns</small>
              </div>
            </div>

            <div>
              <span>✓</span>
              <div>
                <strong>Smart Risk Analysis</strong>
                <small>Understand every warning sign</small>
              </div>
            </div>

            <div>
              <span>✓</span>
              <div>
                <strong>Personal Analysis History</strong>
                <small>Keep track of checked job offers</small>
              </div>
            </div>

          </div>

        </div>

        {/* SHIELD VISUAL */}

        <div className="register-visual">

          <div className="visual-ring ring-one"></div>
          <div className="visual-ring ring-two"></div>

          <div className="register-shield">
            <div className="register-shield-inner">
              J
            </div>
          </div>

          <div className="register-risk-card risk-card-one">
            <span>✓</span>
            Safe Job
          </div>

          <div className="register-risk-card risk-card-two">
            <span>AI</span>
            Protected
          </div>

          <div className="register-risk-card risk-card-three">
            <span>🛡</span>
            JobShield
          </div>

        </div>

        <div className="register-footer">
          <span></span>
          Your Safety. Our Priority.
        </div>

      </section>


      {/* RIGHT REGISTER SECTION */}

      <section className="register-section">

        <div className="register-card">

          <div className="register-card-brand">

            <div className="shield-logo small">
              <span>J</span>
            </div>

            <div>
              <h2>
                Job<span>Shield</span>
              </h2>

              <small>
                Safe Jobs. Bright Future.
              </small>
            </div>

          </div>


          <div className="register-heading">

            <span>GET STARTED</span>

            <h2>
              Create your account
            </h2>

            <p>
              Join JobShield and make your job
              search safer and smarter.
            </p>

          </div>


          {error && (
            <div className="register-error">
              <span>!</span>
              {error}
            </div>
          )}


          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="register-input-group">

              <label>Full Name</label>

              <div className="register-input-box">

                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-input-group">

              <label>Email Address</label>

              <div className="register-input-box">

                <span>✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="register-input-group">

              <label>Password</label>

              <div className="register-input-box">

                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="register-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">

              <label>Confirm Password</label>

              <div className="register-input-box">

                <span>🔐</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* TERMS */}

            <label className="terms-row">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the JobShield terms and
                privacy policy.
              </span>

            </label>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="register-secure">

            <span>🔐</span>

            <div>
              <strong>Your data stays protected</strong>

              <p>
                Your account credentials are securely
                protected by JobShield.
              </p>
            </div>

          </div>


          <div className="login-redirect">

            Already have an account?

            <span onClick={() => navigate("/login")}>
              Sign in →
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;