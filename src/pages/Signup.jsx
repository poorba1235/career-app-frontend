import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions');
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login: Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Account created! Proceeding to setup.');
        setTimeout(() => navigate('/signup/step-1'), 1500);
      } else {
        setErrorMessage(data.error || 'Signup failed');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred. Please try again.');
      setShowErrorPopup(true);
    }
  };

  return (
    <div className="login-page">
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
              <h2 className="form-title">Create an Account</h2>
              <p className="form-subtitle">Start your journey to a better career today.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    required
                    minLength="6"
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
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="terms"
                    className="remember-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="remember-label">
                    By signing up, I agree to the <a href="#" className="terms-link">Terms & Conditions</a> and <a href="#" className="terms-link">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Get Started
              </button>
            </form>

            <div className="social-login">
              <div className="divider">
                <span className="divider-text">Or continue with</span>
              </div>

              <div className="social-buttons">
                {/* Social buttons placeholder */}
                <button type="button" className="social-btn google-btn">
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
                <button type="button" className="social-btn facebook-btn">
                  <svg className="social-icon facebook-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <p className="signup-link">
                Already have an account? <a href="/login" className="signup-text">Sign In now</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Toaster position="top-right" reverseOrder={false} />

      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="material-symbols-outlined popup-icon">error</span>
            <h3 className="popup-title">Signup Failed</h3>
            <p className="popup-message">{errorMessage}</p>
            <button
              className="popup-button"
              onClick={() => setShowErrorPopup(false)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;