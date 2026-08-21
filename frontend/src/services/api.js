const API_BASE_URL = "http://localhost:8080/api";

export async function analyzeJob(jobData) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
    });

    if (!response.ok) {
        throw new Error("Failed to analyze the job");
    }

    return await response.json();
}