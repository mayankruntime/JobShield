const API_BASE_URL = "http://localhost:8080/api";


// =========================
// AUTH ERROR HANDLER
// =========================

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
// API ERROR MESSAGE
// =========================

async function getErrorMessage(response, defaultMessage) {

    try {

        const data = await response.json();

        /*
         * Validation response example:
         * {
         *   "email": "Please enter a valid email address"
         * }
         */

        if (data && typeof data === "object") {

            const messages = Object.values(data)
                .filter(message => typeof message === "string");

            if (messages.length > 0) {
                return messages.join(". ");
            }
        }

    } catch (error) {

        // Response was not JSON
        try {

            const text = await response.text();

            if (text && text.trim()) {
                return text;
            }

        } catch (textError) {
            // Ignore parsing error
        }
    }

    // Friendly status-based messages

    if (response.status === 400) {
        return "Please check your input and try again.";
    }

    if (response.status === 404) {
        return "Requested resource was not found.";
    }

    if (response.status >= 500) {
        return "Server error. Please try again later.";
    }

    return defaultMessage;
}


// =========================
// NETWORK ERROR HANDLER
// =========================

function handleNetworkError(error) {

    console.error("API Error:", error);

    if (error instanceof TypeError) {

        return new Error(
            "Unable to connect to JobShield server. Please make sure the backend is running."
        );
    }

    return error;
}


// =========================
// ANALYZE JOB
// =========================

export async function analyzeJob(jobData) {

    const token = localStorage.getItem("token");

    try {

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

            const message = await getErrorMessage(
                response,
                "Unable to analyze this job."
            );

            throw new Error(message);
        }

        return await response.json();

    } catch (error) {

        throw handleNetworkError(error);
    }
}


// =========================
// ANALYSIS HISTORY
// =========================

export async function getAnalysisHistory() {

    const token = localStorage.getItem("token");

    try {

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

            const message = await getErrorMessage(
                response,
                "Unable to load analysis history."
            );

            throw new Error(message);
        }

        return await response.json();

    } catch (error) {

        throw handleNetworkError(error);
    }
}


// =========================
// DASHBOARD
// =========================

export async function getDashboard() {

    const token = localStorage.getItem("token");

    try {

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

            const message = await getErrorMessage(
                response,
                "Unable to load dashboard."
            );

            console.error(
                "Dashboard API Error:",
                response.status
            );

            throw new Error(message);
        }

        return await response.json();

    } catch (error) {

        throw handleNetworkError(error);
    }
}


// =========================
// PROFILE
// =========================

export async function getProfile() {

    const token = localStorage.getItem("token");

    try {

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

            const message = await getErrorMessage(
                response,
                "Unable to load profile."
            );

            throw new Error(message);
        }

        return await response.json();

    } catch (error) {

        throw handleNetworkError(error);
    }
}