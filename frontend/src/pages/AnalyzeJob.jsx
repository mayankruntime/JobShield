import { useState } from "react";
import "./AnalyzeJob.css";
import { analyzeJob } from "../services/api";

function AnalyzeJob() {
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
      setError("Unable to analyze the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="analyze-section" id="analyze">

      <div className="analyze-container">

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

        <form
          className="analyze-card"
          onSubmit={handleAnalyze}
        >

          <div className="input-tabs">

            <button
              type="button"
              className={
                inputType === "description"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => setInputType("description")}
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
              onClick={() => setInputType("message")}
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
              onClick={() => setInputType("url")}
            >
              🔗 Job URL
            </button>

          </div>

          <div className="input-area">

            <label htmlFor="job-input">
              {inputType === "url"
                ? "Paste the job URL"
                : "Paste the suspicious job offer"}
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

          <button
            type="submit"
            className="analyze-btn"
            disabled={!jobText.trim() || loading}
          >
            {loading ? "⏳ Analyzing..." : "🔍 Analyze Risk"}
          </button>

        </form>

        {/* Error Message */}

        {error && (
          <div className="analysis-error">
            ⚠️ {error}
          </div>
        )}

        {/* Analysis Result */}

        {result && (
          <div className="analysis-result">

            <h3>🛡️ Job Analysis Result</h3>

            <div className="result-item">
              <strong>Risk Score:</strong>
              <span>{result.riskScore}</span>
            </div>

            <div className="result-item">
              <strong>Risk Level:</strong>
              <span>{result.riskLevel}</span>
            </div>

            <p>
              {result.message}
            </p>

          </div>
        )}

      </div>

    </section>
  );
}

export default AnalyzeJob;