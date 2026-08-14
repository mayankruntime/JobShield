import "./Home.css";

function Home() {
  return (
    <main className="home">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            🛡️ AI-Powered Job Safety
          </div>

          <h1>
            Don't Get Scammed
            <span> By a Fake Job.</span>
          </h1>

          <p className="hero-description">
            JobShield analyzes suspicious job offers using
            AI, NLP, and intelligent risk detection to help
            you identify potential job scams before it's too late.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              🔍 Analyze a Job
            </button>

            <button className="secondary-btn">
              Learn How It Works →
            </button>
          </div>

          <div className="hero-trust">
            <div>
              <strong>AI</strong>
              <span>Powered Analysis</span>
            </div>

            <div>
              <strong>Risk</strong>
              <span>Score Detection</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Safety Awareness</span>
            </div>
          </div>

        </div>


        {/* Hero Visual */}
        <div className="hero-visual">

          <div className="risk-card">

            <div className="risk-card-header">
              <span>Job Risk Analysis</span>
              <span className="status-dot"></span>
            </div>

            <div className="risk-score">
              <div className="score-circle">
                <span>87</span>
                <small>/100</small>
              </div>

              <div className="risk-info">
                <h3>High Risk</h3>
                <p>Suspicious job detected</p>
              </div>
            </div>

            <div className="risk-indicators">

              <div className="indicator danger">
                <span>✕</span>
                <span>Registration fee requested</span>
              </div>

              <div className="indicator danger">
                <span>✕</span>
                <span>WhatsApp-only contact</span>
              </div>

              <div className="indicator warning">
                <span>!</span>
                <span>Unrealistic salary</span>
              </div>

            </div>

            <div className="ai-result">
              <span>AI Prediction</span>
              <strong>91% Scam Probability</strong>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;