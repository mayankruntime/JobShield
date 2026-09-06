
const API_BASE_URL = "http://localhost:8080/api";

export async function analyzeJob(jobData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
    });

    if (!response.ok) {
        throw new Error(`Analyze failed: ${response.status}`);
    }

    return await response.json();
}

export async function getAnalysisHistory() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/analysis/history`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`History failed: ${response.status}`);
    }

    return await response.json();
}

