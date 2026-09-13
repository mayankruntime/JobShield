const API_BASE_URL = "http://localhost:8080/api";


function handleAuthError(response) {

    if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("rememberMe");

        window.dispatchEvent(new Event("authChange"));

        window.location.href = "/login";

        return true;
    }

    return false;
}


// =========================
// ANALYZE JOB
// =========================

export async function analyzeJob(jobData) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/analyze`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(jobData)
        }
    );

    if (handleAuthError(response)) {
        throw new Error("Authentication required.");
    }

    if (!response.ok) {
        throw new Error(`Analyze failed: ${response.status}`);
    }

    return await response.json();
}


// =========================
// ANALYSIS HISTORY
// =========================

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

    if (handleAuthError(response)) {
        throw new Error("Authentication required.");
    }

    if (!response.ok) {
        throw new Error(`History failed: ${response.status}`);
    }

    return await response.json();
}


// =========================
// DASHBOARD
// =========================

export async function getDashboard() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/dashboard`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (handleAuthError(response)) {
        throw new Error("Authentication required.");
    }

    if (!response.ok) {

        const errorText = await response.text();

        console.error(
            "Dashboard API Error:",
            response.status,
            errorText
        );

        throw new Error(
            `Dashboard failed: ${response.status}`
        );
    }

    return await response.json();
}


// =========================
// PROFILE
// =========================

export async function getProfile() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/profile`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (handleAuthError(response)) {
        throw new Error("Authentication required.");
    }

    if (!response.ok) {
        throw new Error(`Profile failed: ${response.status}`);
    }

    return await response.json();
}