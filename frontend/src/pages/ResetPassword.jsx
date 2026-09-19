import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/auth/reset-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        token: token,
                        newPassword: newPassword
                    })
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data);
            }

            if (data === "Password reset successfully") {

                setMessage(
                    "Password reset successfully. You can now login."
                );

                setNewPassword("");
                setConfirmPassword("");

            } else {

                setError(data);
            }

        } catch (err) {

            setError(
                err.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="forgot-page">

            <div className="forgot-card">

                <div className="forgot-icon">
                    🔐
                </div>

                <h1>
                    Reset Password
                </h1>

                <p>
                    Create a new secure password for your
                    JobShield account.
                </p>


                <form onSubmit={handleSubmit}>

                    <label>
                        New Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                    />


                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"
                        }
                    </button>

                </form>


                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <button
                    className="back-login"
                    onClick={() => navigate("/login")}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
}

export default ResetPassword;