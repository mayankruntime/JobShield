import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:8080/api/profile",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load profile.");
                }

                const data = await response.json();

                setProfile(data);

            } catch (err) {

                setError(
                    err.message || "Something went wrong."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, [navigate]);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("rememberMe");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-container">

                <div className="profile-header">

                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <span className="profile-badge">
                        ACCOUNT
                    </span>

                </div>

                <div className="profile-card">

                    <div className="profile-top">

                        <div className="profile-avatar">
                            {profile?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-intro">

                            <h1>
                                {profile?.name}
                            </h1>

                            <p>
                                {profile?.email}
                            </p>

                            <span className="verified-badge">
                                ✓ Verified Account
                            </span>

                        </div>

                    </div>

                    <div className="profile-divider"></div>

                    <div className="account-section">

                        <h2>
                            Account Information
                        </h2>

                        <div className="info-grid">

                            <div className="info-item">

                                <span className="info-label">
                                    FULL NAME
                                </span>

                                <strong>
                                    {profile?.name}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span className="info-label">
                                    EMAIL ADDRESS
                                </span>

                                <strong>
                                    {profile?.email}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span className="info-label">
                                    ACCOUNT ID
                                </span>

                                <strong>
                                    #{profile?.id}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span className="info-label">
                                    ACCOUNT STATUS
                                </span>

                                <strong className="status-active">
                                    ● Active
                                </strong>

                            </div>

                        </div>

                    </div>

                    <div className="profile-actions">

                        <button
                            className="password-button"
                            onClick={() =>
                                navigate("/forgot-password")
                            }
                        >
                            🔐 Change Password
                        </button>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;