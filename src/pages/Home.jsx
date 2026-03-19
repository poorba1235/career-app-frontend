import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleBrowseJobs = () => {
    navigate('/job-search');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-container">
          <div className="home-hero-content">
            <div className="home-trusted-badge">
              <span>Trusted by 15,000+ international students</span>
              <span className="material-symbols-outlined">verified</span>
            </div>

            <h1 className="home-hero-title">
              Your pathway to a <br />UK Career
            </h1>

            <p className="home-hero-subtitle">
              The AI-powered career platform designed specifically for international students.
              Find visa-sponsoring employers, perfect your CV, and ace your interviews.
            </p>

            <div className="home-hero-buttons">
              {!localStorage.getItem('token') && (
                <button className="home-primary-btn" onClick={handleGetStarted}>
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}
              <button className="home-secondary-btn" onClick={handleBrowseJobs}>
                Browse Jobs
              </button>
            </div>

            <div className="home-social-proof">
              <div className="home-user-avatars">
                <div className="home-avatar">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMnsL8gPqTPjAD9eQCw0cuI8glXLf5bgwuU21WN8HWW7aQJAOtqL8r7gjrudLW7ct6pSh7ZUMDMumA15YdQTBzpGSOxfN7C2Pre51kz1dyrb6fIYJJ0S0NY-Hsz9oQKPRNgb_Bb9dYS24C8brqHTh0U_v-MRonfwVDrbbIFcH3vR6AaRd_qe79BGSuWh5XT2lEEWiR1w9O9BCpX_7B1ZkrawUKrA3jXBIXkctSWoL2lvaBc9QrwlF1Rpnn3ZfvZP0CxuCTCNat5C0"
                    alt="Student user"
                  />
                </div>
                <div className="home-avatar">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFR2bKPa4b5d8ILFEllTGQelvkEqzFVPIczG1P46RnQeT8rXPMHpVDeWNPiBq0mlrwOsTEK7g1BeQL3BhElJbRyNswxDP5_Xotbib4WkbM8tSnfPYd3JHzEl3ik2P_cqI69WooaVl1nhm-gtSCtrzkXzpTogKJZFuujJJSUsoIR6J__gyLnaWcsGKWOBclDhbnMrqWLrrlcYpNSgm7CVgaXsm1mkKpdLMTu07aX0tia_YNeY23v4AYfX8Yq9B8LA63O8Re6EF3-Cc"
                    alt="Student user"
                  />
                </div>
                <div className="home-avatar">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIdk9CGA-G_VDgOUxAQvFUjOAvvCEK_4NkqG6_N6fAup3x1FcH1DeDnPcKVaptMPoxhBfHS0VZ1vjMI12GNPVQoEd6hG3kbC4SFgUJpaEAz1eJYJ1CvkehywsXssy5VkOLqGt3CR13w_-n7o_zWEYQ-SVhJ7B4ILvUll6Tu_uxiOD7MwFXmJqfEGYsBfBEB9pm5J4w8eJV_SEkDDa-PoYgNmXuMZjoQ84kpdSnkrh6N0vBGBJVyXm0uh28cRhb4-jMBfu3AnggO_k"
                    alt="Student user"
                  />
                </div>
                <div className="home-avatar-more">
                  <span>+</span>
                </div>
              </div>

              <div className="home-rating">
                <div className="home-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined">star</span>
                  ))}
                </div>
                <p className="home-rating-text">4.9/5 from 2,000+ reviews</p>
              </div>
            </div>
          </div>

          <div className="home-hero-image">
            <div className="home-image-container">
              <img
                src="../main.jpeg"
                alt="Professional meeting with smiling woman"
              />
            </div>
            <div className="home-hero-blob"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats-section">
        <div className="home-stats-container">
          <div className="home-stat-item">
            <div className="home-stat-number">15,000+</div>
            <div className="home-stat-label">Students Helped</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">2,500+</div>
            <div className="home-stat-label">Sponsoring Employers</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">89%</div>
            <div className="home-stat-label">Interview Success Rate</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">4.9/5</div>
            <div className="home-stat-label">User Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home-how-it-works">
        <div className="home-section-header">
          <h2 className="home-section-title">How it works</h2>
          <p className="home-section-subtitle">
            Your journey from student to professional in three simple steps.
          </p>
        </div>

        <div className="home-steps-container">
          <div className="home-step">
            <div className="home-step-number">1</div>
            <h3 className="home-step-title">Create Profile</h3>
            <p className="home-step-description">
              Upload your background, interests, and visa status to build your smart professional identity.
            </p>
          </div>

          <div className="home-step">
            <div className="home-step-number">2</div>
            <h3 className="home-step-title">Get AI Feedback</h3>
            <p className="home-step-description">
              Optimize your applications with industry-leading AI tools designed for the UK market.
            </p>
          </div>

          <div className="home-step">
            <div className="home-step-number">3</div>
            <h3 className="home-step-title">Get Hired</h3>
            <p className="home-step-description">
              Apply to verified sponsoring employers and land your dream role in the UK.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Everything you need to succeed</h2>
          <p className="home-section-subtitle">
            Purpose-built tools to help international students navigate the UK job market with confidence.
          </p>
        </div>

        <div className="home-features-container">
          <div className="home-features-grid">
            {/* Smart Job Search */}
            <div className="home-feature-card">
              <h3 className="home-feature-title">Smart Job Search</h3>
              <p className="home-feature-description">
                Find UK roles with visa sponsorship filters, salary insights, and AI-powered matching tailored for international students.
              </p>
              <a href="#" className="home-feature-link">
                Learn more →
              </a>
            </div>

            {/* CV Evaluator */}
            <div className="home-feature-card">
              <h3 className="home-feature-title">CV Evaluator</h3>
              <p className="home-feature-description">
                Get instant AI feedback on UK ATS compatibility, formatting, impact statements, and professional tone.
              </p>
              <a href="#" className="home-feature-link">
                Learn more →
              </a>
            </div>

            {/* Mock Interviews */}
            <div className="home-feature-card">
              <h3 className="home-feature-title">Mock Interviews</h3>
              <p className="home-feature-description">
                Practice with AI-powered interviews designed for UK workplace culture, complete with STAR method coaching.
              </p>
              <a href="#" className="home-feature-link">
                Learn more →
              </a>
            </div>

            {/* Career Analytics */}
            <div className="home-feature-card">
              <h3 className="home-feature-title">Career Analytics</h3>
              <p className="home-feature-description">
                Track your progress with insights on application success rates, skill gaps, and personalised recommendations.
              </p>
              <a href="#" className="home-feature-link">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;