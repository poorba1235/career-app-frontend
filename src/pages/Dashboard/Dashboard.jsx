import {
  ArrowLeft,
  Bell,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  User,
  Video
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../css/dashboard/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // clear any user data
    navigate('/login');
  };

  const navigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className="dashboard">
      {/* new-sidebar */}
      <aside className="new-sidebar">
        <div className="new-sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', backgroundColor: '#065f46',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '23px', color: '#ffffff' }}>
              work_history
            </span>
          </div>
          <span className="new-sidebar-title">Career Sphere</span>
        </div>

        <nav className="new-sidebar-nav">
          {userRole !== 'admin' && (
            <>
              <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                <span>Overview</span>
              </NavLink>
              <NavLink to="/dashboard/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Bell size={20} />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/dashboard/cv-evaluator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={20} />
                <span>CV Evaluator</span>
              </NavLink>
              <NavLink to="/dashboard/mock-interview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Video size={20} />
                <span>Mock Interview</span>
              </NavLink>
            </>
          )}

          {/* Admin Only Links */}
          {userRole === 'admin' && (
            <>
              <NavLink to="/dashboard/web-scrape" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Globe size={20} />
                <span>Web Scrape</span>
              </NavLink>
              <NavLink to="/dashboard/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={20} />
                <span>User Management</span>
              </NavLink>
            </>
          )}

          {userRole !== 'admin' && (
            <NavLink className="nav-item" to="/dashboard/profile">
              <User size={20} />
              <span>Profile</span>
            </NavLink>
          )}
        </nav>

        <div className="new-sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="dash-back-button" onClick={navigateToHome}>
              <ArrowLeft size={16} />
              <span>Back to Main Website</span>
            </button>
            <div className="user-avatar">
              <img
                alt="User avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGmPkf4Xd5fdmKKF8pROS1rnjRWCdE8k48SNUnmRpYg--ERQIYXeD1yPEszGP_rONQZEnhI8A0nLrsEiNhzAirr4A17pdzvFMNpPjE0uXwEzYCd4-cxi-w-NxJIvNjCNLqNB13WI_dl4q1FQ_szrj0PsmJpjU3K9hVNmtgcFwkdaGc_o731MigOg5BFyiAUw5tvTPG8LsLSjdHeFLL5f16DZraMu1PIwIcTykmObAZrY8L0En6QJ-jnlt4Xk_3HmsPVfoUfFKl-n0"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;