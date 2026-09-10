import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AnalyzeJob.css";
import { analyzeJob } from "../services/api";

function AnalyzeJob() {

  const navigate = useNavigate();

  const [inputType, setInputType] = useState("description");
  const [jobText, setJobText] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  const handleAnalyze = async (event) => {

    event.preventDefault();

    if (!jobText.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {

      const data = await analyzeJob({
        inputType: inputType,
        content: jobText,
      });

      setResult(data);

    } catch (error) {

      console.error(error);
      setError(
        "Unable to analyze the job. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  const getRiskClass = () => {

    if (!result) {
      return "";
    }

    if (result.riskLevel === "HIGH RISK") {
      return "risk-high";
    }

    if (result.riskLevel === "SUSPICIOUS") {
      return "risk-suspicious";
    }

    return "risk-low";
  };


  const getRiskIcon = () => {

    if (!result) {
      return "🛡️";
    }

    if (result.riskLevel === "HIGH RISK") {
      return "🚨";
    }

    if (result.riskLevel === "SUSPICIOUS") {
      return "⚠️";
    }

    return "✅";
  };


  const getRecommendation = () => {

    if (!result) {
      return "";
    }

    if (result.riskLevel === "HIGH RISK") {

      return "Avoid this job offer. Do not send money or personal information unless the employer can be independently verified.";

    }

    if (result.riskLevel === "SUSPICIOUS") {

      return "Proceed with caution. Verify the employer, recruiter and job details before sharing information or continuing.";

    }

    return "This posting appears relatively safe based on the detected indicators. Still verify the employer before applying.";

  };


  return (

    <section className="analyze-section">

      <div className="analyze-container">


        {/* Heading */}

        <div className="analyze-heading">

          <span className="section-badge">
            JOB SAFETY CHECK
          </span>

          <h2>
            Is This Job
            <span> Too Good to Be True?</span>
          </h2>

          <p>
            Paste a suspicious job description, message,
            or job URL. JobShield will analyze it for
            potential scam indicators.
          </p>

        </div>


        {/* Analysis Form */}

        <form
          className="analyze-card"
          onSubmit={handleAnalyze}
        >


          {/* Tabs */}

          <div className="input-tabs">

            <button
              type="button"
              className={
                inputType === "description"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => {
                setInputType("description");
                setResult(null);
              }}
            >
              📄 Job Description
            </button>


            <button
              type="button"
              className={
                inputType === "message"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => {
                setInputType("message");
                setResult(null);
              }}
            >
              💬 Message
            </button>


            <button
              type="button"
              className={
                inputType === "url"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => {
                setInputType("url");
                setResult(null);
              }}
            >
              🔗 Job URL
            </button>

          </div>


          {/* Input */}

          <div className="input-area">

            <label htmlFor="job-input">

              {inputType === "url"
                ? "Paste the job URL"
                : inputType === "message"
                  ? "Paste the suspicious message"
                  : "Paste the job description"}

            </label>


            {inputType === "url" ? (

              <input
                id="job-input"
                type="url"
                placeholder="https://example.com/job/..."
                value={jobText}
                onChange={(event) =>
                  setJobText(event.target.value)
                }
              />

            ) : (

              <textarea
                id="job-input"
                rows="9"
                placeholder={
                  inputType === "message"
                    ? "Paste the suspicious WhatsApp, Telegram, SMS, or social media job message here..."
                    : "Paste the complete job description here..."
                }
                value={jobText}
                onChange={(event) =>
                  setJobText(event.target.value)
                }
              />

            )}


            <div className="input-footer">

              <span>
                🔒 Your submitted content is analyzed securely.
              </span>

              <span>
                {jobText.length} characters
              </span>

            </div>

          </div>


          {/* Analyze Button */}

          <button
            type="submit"
            className="analyze-btn"
            disabled={!jobText.trim() || loading}
          >

            {loading
              ? "⏳ Analyzing with AI..."
              : "🔍 Analyze Risk"}

          </button>

        </form>


        {/* Error */}

        {error && (

          <div className="analysis-error">
            ⚠️ {error}
          </div>

        )}


        {/* Result */}

        {result && (

          <div className={`analysis-result ${getRiskClass()}`}>


            {/* Result Header */}

            <div className="result-header">

              <div>

                <span className="result-label">
                  ANALYSIS COMPLETE
                </span>

                <h3>
                  {getRiskIcon()} Job Safety Result
                </h3>

              </div>

              <div className="result-status">
                {result.riskLevel}
              </div>

            </div>


            {/* Score */}

            <div className="risk-overview">


              <div className="score-wrapper">

                <div className="score-circle-large">

                  <strong>
                    {result.riskScore}
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

                <p>
                  Risk Score
                </p>

              </div>


              <div className="risk-description">

                <span>
                  DETECTED RISK LEVEL
                </span>

                <h4>
                  {result.riskLevel}
                </h4>

                <p>
                  {result.message}
                </p>

              </div>

            </div>


            {/* Recommendation */}

            <div className="recommendation">

              <div className="recommendation-icon">
                🛡️
              </div>

              <div>

                <strong>
                  Safety Recommendation
                </strong>

                <p>
                  {getRecommendation()}
                </p>

              </div>

            </div>


            {/* Reasons */}

            {result.reasons &&
              result.reasons.length > 0 && (

                <div className="analysis-reasons">

                  <div className="reasons-heading">

                    <h4>
                      ⚠️ Why is this job suspicious?
                    </h4>

                    <span>
                      {result.reasons.length} indicators detected
                    </span>

                  </div>

                  <ul>

                    {result.reasons.map(
                      (reason, index) => (

                        <li key={index}>

                          <span className="reason-icon">
                            ⚠
                          </span>

                          <span>
                            {reason}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                </div>

              )}


            {/* Safe */}

            {result.reasons &&
              result.reasons.length === 0 && (

                <div className="analysis-safe">

                  <span>
                    ✅
                  </span>

                  <div>

                    <strong>
                      No specific scam indicators detected
                    </strong>

                    <p>
                      JobShield did not identify any major
                      warning signs in this submission.
                    </p>

                  </div>

                </div>

              )}


            {/* Actions */}

            <div className="result-actions">

              <button
                className="result-primary-btn"
                onClick={() => {
                  setResult(null);
                  setJobText("");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }}
              >
                🔄 Analyze Another Job
              </button>


              <button
                className="result-secondary-btn"
                onClick={() => navigate("/history")}
              >
                📜 View History
              </button>

            </div>

          </div>

        )}

      </div>

    </section>

  );

}

export default AnalyzeJob;