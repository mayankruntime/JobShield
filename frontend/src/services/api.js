const API_BASE_URL = "http://localhost:8080/api";

export async function analyzeJob(jobData) {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(jobData)
    });

    console.log("STATUS:", response.status);

    if (!response.ok) {
        throw new Error(`Analyze failed: ${response.status}`);
    }

    return await response.json();
}