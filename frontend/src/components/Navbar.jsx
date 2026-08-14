import "./Navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-logo">
          <span className="logo-icon">🛡️</span>
          <span>JobShield</span>
        </div>

        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#safety">Safety</a>
          <a href="#reports">Reports</a>
        </div>

        <div className="navbar-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;