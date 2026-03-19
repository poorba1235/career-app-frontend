import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Email sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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

          {/* Background Image with Text Overlay */}
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
              <h2 className="form-title">Forgot Password</h2>
              <p className="form-subtitle">Enter your email to receive a password reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="social-login">

              <p className="signup-link">
                Remember your password? <a href="/login" className="signup-text">Login now</a>
              </p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default Forgot;