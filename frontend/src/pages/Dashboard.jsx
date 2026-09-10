import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getAnalysisHistory } from "../services/api";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadDashboard = async () => {

    try {

        const dashboardData = await getDashboard();
        const historyData = await getAnalysisHistory();

        setData(dashboardData);

        setRecentAnalyses(
            historyData.slice(0, 5)
        );

    } catch (error) {

        console.error(error);
        setError("Unable to load dashboard.");

    } finally {

        setLoading(false);

    }

};

    loadDashboard();

  }, []);


  if (loading) {

    return (
      <section className="dashboard-section">

        <div className="dashboard-container">

          <div className="dashboard-message">
            ⏳ Loading your safety dashboard...
          </div>

        </div>

      </section>
    );

  }


  if (error) {

    return (
      <section className="dashboard-section">

        <div className="dashboard-container">

          <div className="dashboard-error">
            ⚠️ {error}
          </div>

        </div>

      </section>
    );

  }


  const total = data.totalAnalyses;

  const highPercentage =
    total > 0
      ? Math.round((data.highRisk / total) * 100)
      : 0;

  const suspiciousPercentage =
    total > 0
      ? Math.round((data.suspicious / total) * 100)
      : 0;

  const lowPercentage =
    total > 0
      ? Math.round((data.lowRisk / total) * 100)
      : 0;


  return (

    <section className="dashboard-section">

      <div className="dashboard-container">


        {/* Header */}

        <div className="dashboard-heading">

          <span className="section-badge">
            JOBSHIELD DASHBOARD
          </span>

          <h2>
            Your Safety
            <span> Overview</span>
          </h2>

          <p>
            Monitor your job analysis activity and
            stay protected from potential job scams.
          </p>

        </div>


        {/* Quick Actions */}

        <div className="dashboard-actions">

          <button
            className="dashboard-primary-btn"
            onClick={() => navigate("/analyze")}
          >
            🔍 Analyze New Job
          </button>

          <button
            className="dashboard-secondary-btn"
            onClick={() => navigate("/history")}
          >
            📜 View Analysis History
          </button>

        </div>


        {/* Statistics */}

        <div className="dashboard-stats">


          <div className="stat-card total">

            <div className="stat-icon">
              📊
            </div>

            <div>

              <h3>
                {data.totalAnalyses}
              </h3>

              <p>
                Total Analyses
              </p>

            </div>

          </div>


          <div className="stat-card high">

            <div className="stat-icon">
              🔴
            </div>

            <div>

              <h3>
                {data.highRisk}
              </h3>

              <p>
                High Risk
              </p>

            </div>

          </div>


          <div className="stat-card suspicious">

            <div className="stat-icon">
              🟠
            </div>

            <div>

              <h3>
                {data.suspicious}
              </h3>

              <p>
                Suspicious
              </p>

            </div>

          </div>


          <div className="stat-card low">

            <div className="stat-icon">
              🟢
            </div>

            <div>

              <h3>
                {data.lowRisk}
              </h3>

              <p>
                Low Risk
              </p>

            </div>

          </div>

        </div>


        {/* Risk Distribution */}

        <div className="dashboard-grid">


          <div className="dashboard-card">

            <div className="card-header">

              <div>
                <h3>Risk Distribution</h3>

                <p>
                  Breakdown of your analyzed jobs
                </p>
              </div>

              <span className="card-icon">
                📈
              </span>

            </div>


            <div className="risk-bars">


              <div className="risk-bar-item">

                <div className="risk-bar-label">

                  <span>
                    🔴 High Risk
                  </span>

                  <strong>
                    {highPercentage}%
                  </strong>

                </div>

                <div className="risk-bar">

                  <div
                    className="risk-fill high-fill"
                    style={{
                      width: `${highPercentage}%`
                    }}
                  ></div>

                </div>

              </div>


              <div className="risk-bar-item">

                <div className="risk-bar-label">

                  <span>
                    🟠 Suspicious
                  </span>

                  <strong>
                    {suspiciousPercentage}%
                  </strong>

                </div>

                <div className="risk-bar">

                  <div
                    className="risk-fill suspicious-fill"
                    style={{
                      width: `${suspiciousPercentage}%`
                    }}
                  ></div>

                </div>

              </div>


              <div className="risk-bar-item">

                <div className="risk-bar-label">

                  <span>
                    🟢 Low Risk
                  </span>

                  <strong>
                    {lowPercentage}%
                  </strong>

                </div>

                <div className="risk-bar">

                  <div
                    className="risk-fill low-fill"
                    style={{
                      width: `${lowPercentage}%`
                    }}
                  ></div>

                </div>

              </div>


            </div>

          </div>


          {/* Safety Card */}

          <div className="dashboard-card safety-card">

            <div className="safety-icon">
              🛡️
            </div>

            <h3>
              Stay Safe From Job Scams
            </h3>

            <p>
              Always verify employers before sharing
              personal information or making payments.
            </p>

            <button
              onClick={() => navigate("/analyze")}
            >
              Check a Job →
            </button>

          </div>


        </div>

        {/* Recent Analyses */}

<div className="recent-analyses">

    <div className="recent-header">

        <div>
            <span className="summary-label">
                RECENT ACTIVITY
            </span>

            <h3>
                Recent Analyses
            </h3>

            <p>
                Your latest job safety checks.
            </p>
        </div>

        <button
            className="view-history-btn"
            onClick={() => navigate("/history")}
        >
            View All →
        </button>

    </div>


    {recentAnalyses.length === 0 ? (

        <div className="recent-empty">

            <div>
                🛡️
            </div>

            <p>
                No job analyses yet.
            </p>

            <button
                onClick={() => navigate("/analyze")}
            >
                Analyze Your First Job
            </button>

        </div>

    ) : (

        <div className="recent-list">

            {recentAnalyses.map((item) => (

                <div
                    className="recent-item"
                    key={item.id}
                >

                    <div className="recent-item-icon">

                        {item.inputType === "url"
                            ? "🔗"
                            : item.inputType === "message"
                                ? "💬"
                                : "📄"}

                    </div>


                    <div className="recent-item-content">

                        <strong>
                            {item.inputType === "url"
                                ? "Job URL"
                                : item.inputType === "message"
                                    ? "Job Message"
                                    : "Job Description"}
                        </strong>

                        <p>
                            {item.content}
                        </p>

                    </div>


                    <div className="recent-item-risk">

                        <strong>
                            {item.riskScore}/100
                        </strong>

                        <span
                            className={
                                item.riskLevel === "HIGH RISK"
                                    ? "recent-risk-high"
                                    : item.riskLevel === "SUSPICIOUS"
                                        ? "recent-risk-suspicious"
                                        : "recent-risk-low"
                            }
                        >
                            {item.riskLevel}
                        </span>

                    </div>

                </div>

            ))}

        </div>

    )}

</div>


        {/* Activity Summary */}

        <div className="dashboard-summary">

          <div>

            <span className="summary-label">
              YOUR JOB SAFETY ACTIVITY
            </span>

            <h3>
              Keep checking before you apply.
            </h3>

            <p>
              You have analyzed{" "}
              <strong>{data.totalAnalyses}</strong>{" "}
              job posting
              {data.totalAnalyses !== 1 ? "s" : ""} so far.
              JobShield helps you identify suspicious
              patterns before you take the next step.
            </p>

          </div>


          <button
            onClick={() => navigate("/history")}
          >
            View Full History →
          </button>

        </div>


      </div>

    </section>

  );

}

export default Dashboard;