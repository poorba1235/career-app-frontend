import { useState } from 'react';
import UserMenu from './UserMenu';

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/job-search', label: 'Job Search' },
  { href: '/cv-analysis', label: 'CV Evaluator' },
  { href: '/mock-interview', label: 'Mock Interview' },
  { href: '/resources', label: 'Resources' },
  { href: '/blogs', label: 'Blog' },
];

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="login-header">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#065f46',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#ffffff' }}>
              work_history
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#065f46' }}>
            Career Sphere
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="header-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </nav>

        {/* Right side: user menu + hamburger */}
        <div className="navbar-right">
          <UserMenu />
          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)} />
          {/* Drawer */}
          <nav className="mobile-nav-drawer">
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
            </div>
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </>
      )}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="login-footer">
        <div className="footer-left">
          <span className="footer-logo">Career Sphere</span>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
        <p className="footer-copyright">© 2026 Career Sphere. All rights reserved.</p>
      </footer>
    </>
  );
};

export default MainLayout;