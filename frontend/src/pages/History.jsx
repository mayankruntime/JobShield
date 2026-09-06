
import { useEffect, useState } from "react";
import { getAnalysisHistory } from "../services/api";
import "./History.css";

function History() {
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

    return (
        <section className="history-section">
            <div className="history-container">

                <div className="history-heading">
                    <span className="section-badge">
                        ANALYSIS HISTORY
                    </span>

                    <h2>
                        Your Previous
                        <span> Job Analyses</span>
                    </h2>

                    <p>
                        View all the job offers you have
                        previously analyzed with JobShield.
                    </p>
                </div>

                {loading && (
                    <div className="history-message">
                        ⏳ Loading history...
                    </div>
                )}

                {error && (
                    <div className="history-error">
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && history.length === 0 && (
                    <div className="history-message">
                        📭 No analysis history found.
                    </div>
                )}

                {!loading && !error && history.length > 0 && (
                    <div className="history-list">

                        {history.map((item) => (
                            <div
                                className="history-card"
                                key={item.id}
                            >
                                <div className="history-card-top">

                                    <span className="history-type">
                                        {item.inputType}
                                    </span>

                                    <span className="history-date">
                                        {item.createdAt
                                            ? new Date(
                                                item.createdAt
                                            ).toLocaleString()
                                            : "Date unavailable"}
                                    </span>

                                </div>

                                <div className="history-content">
                                    <p>{item.content}</p>
                                </div>

                                <div className="history-result">

                                    <div className="history-result-item">
                                        <strong>Risk Score</strong>
                                        <span>
                                            {item.riskScore}
                                        </span>
                                    </div>

                                    <div className="history-result-item">
                                        <strong>Risk Level</strong>
                                        <span>
                                            {item.riskLevel}
                                        </span>
                                    </div>

                                </div>

                                <p className="history-message-text">
                                    {item.message}
                                </p>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </section>
    );
}

export default History;

