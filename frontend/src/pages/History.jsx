import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalysisHistory } from "../services/api";
import "./History.css";

function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadHistory = async () => {

      try {

        const data = await getAnalysisHistory();

        setHistory(data);

      } catch (error) {

        console.error(error);
        setError("Unable to load analysis history.");

      } finally {

        setLoading(false);

      }

    };

    loadHistory();

  }, []);


  const getRiskClass = (riskLevel) => {

    if (riskLevel === "HIGH RISK") {
      return "history-high";
    }

    if (riskLevel === "SUSPICIOUS") {
      return "history-suspicious";
    }

    return "history-low";
  };


  const formatDate = (date) => {

    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  };


  if (loading) {

    return (
      <section className="history-section">

        <div className="history-container">

          <div className="history-message">
            ⏳ Loading your analysis history...
          </div>

        </div>

      </section>
    );

  }


  if (error) {

    return (
      <section className="history-section">

        <div className="history-container">

          <div className="history-error">
            ⚠️ {error}
          </div>

        </div>

      </section>
    );

  }


  return (

    <section className="history-section">

      <div className="history-container">


        {/* Header */}

        <div className="history-heading">

          <span className="section-badge">
            JOBSHIELD HISTORY
          </span>

          <h2>
            Your Analysis
            <span> History</span>
          </h2>

          <p>
            Review your previously analyzed job offers
            and their detected risk levels.
          </p>

        </div>


        {/* Action */}

        <div className="history-actions">

          <button
            className="history-analyze-btn"
            onClick={() => navigate("/analyze")}
          >
            🔍 Analyze New Job
          </button>

        </div>


        {/* Empty State */}

        {history.length === 0 ? (

          <div className="history-empty">

            <div className="empty-icon">
              🛡️
            </div>

            <h3>
              No analyses yet
            </h3>

            <p>
              You haven't analyzed any job offers.
              Start by checking a suspicious job posting.
            </p>

            <button
              onClick={() => navigate("/analyze")}
            >
              Analyze Your First Job →
            </button>

          </div>

        ) : (

          <div className="history-list">

            {history.map((item) => (

              <div
                className="history-card"
                key={item.id}
              >

                {/* Top */}

                <div className="history-card-top">

                  <div className="history-type">

                    <span className="history-type-icon">

                      {item.inputType === "url"
                        ? "🔗"
                        : item.inputType === "message"
                          ? "💬"
                          : "📄"}

                    </span>

                    <div>

                      <strong>
                        {item.inputType === "url"
                          ? "Job URL"
                          : item.inputType === "message"
                            ? "Job Message"
                            : "Job Description"}
                      </strong>

                      <span>
                        {formatDate(item.createdAt)}
                      </span>

                    </div>

                  </div>


                  <div
                    className={`history-risk ${getRiskClass(
                      item.riskLevel
                    )}`}
                  >
                    {item.riskLevel}
                  </div>

                </div>


                {/* Content */}

                <div className="history-content">

                  <p>
                    {item.content}
                  </p>

                </div>


                {/* Bottom */}

                <div className="history-card-bottom">

                  <div className="history-score">

                    <span>
                      Risk Score
                    </span>

                    <strong>
                      {item.riskScore}/100
                    </strong>

                  </div>


                  <div className="history-message">

                    {item.message}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  );

}

export default History;
