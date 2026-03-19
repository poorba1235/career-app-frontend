import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setLoading(true); // removed loading state usage for now as it was not in my previous replacement
    // setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('token', data.token); // Keep rememberMe logic if desired
        } else {
          localStorage.setItem('token', data.token); // simplified: always store for now, or adhere to rememberMe
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(data.message || 'Login successful!');
        setTimeout(() => {
          if (data.user && data.user.role === 'admin') {
            navigate('/dashboard/web-scrape');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        // toast.error(data.error || 'Login failed');
        setErrorMessage(data.error || 'Login failed');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      // toast.error('An error occurred. Please try again.');
      setErrorMessage('An error occurred. Please try again.');
      setShowErrorPopup(true);
    } finally {
      // setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // Handle Google login
  //   console.log('Google login');
  // };

  // const handleFacebookLogin = () => {
  //   // Handle Facebook login
  //   console.log('Facebook login');
  // };

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
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to continue your career journey</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
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
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    className="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="remember-label">
                    Remember me
                  </label>
                </div>
                <a href="/forgot" className="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn">
                Sign In
              </button>
            </form>

            <div className="social-login">
              <div className="divider">
                <span className="divider-text">Or continue with</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google-btn"
                // onClick={handleGoogleLogin}
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  className="social-btn facebook-btn"
                // onClick={handleFacebookLogin}
                >
                  <svg className="social-icon facebook-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <p className="signup-link">
                Don't have an account? <a href="/signup" className="signup-text">Sign up now</a>
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
            <h3 className="popup-title">Login Failed</h3>
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

export default Login;