import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Login.css';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password/${resetToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Password reset successfully!');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.error || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Toaster position="top-right" reverseOrder={false} />

            <main className="login-main">
                <section className="login-hero">
                    <div className="hero-contents">
                        <div className="hero-logo">
                            <span className="material-symbols-outlined">work_history</span>
                            <span className="hero-logo-text">CareerSphere</span>
                        </div>
                    </div>

                    <h1 className="hero-title">Elevate your career trajectory today.</h1>
                    <p className="hero-subtitle">
                        Continue accessing expert tools for resume optimization, AI-driven interview practice, and personalized job matching.
                    </p>

                    <div className="hero-background-section">
                        <div className="background-image-wrapper">
                            <img
                                src="https://i.ibb.co/CszNjQL4/c2faecd3-254a-4fc4-aa7d-763d2bb7d52c.png"
                                alt="Career development"
                                className="background-hero-image"
                            />
                        </div>
                    </div>

                    <div className="hero-footer">
                        <a href="#" className="footer-link">Terms of Service</a>
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Support</a>
                    </div>
                </section>
                <section className="login-form-section">
                    <div className="form-container">
                        <div className="form-header">
                            <h2 className="form-title">Reset Password</h2>
                            <p className="form-subtitle">Enter your new password below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showConfirmPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ResetPassword;
