import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "../css/UserMenu.css";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!token) {
    return (
      <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
        <a href="/login" style={{
          textDecoration: 'none',
          color: '#065f46',
          fontWeight: '600',
          padding: '8px 16px',
          border: '1px solid #065f46',
          borderRadius: '6px'
        }}>Login</a>
        <a href="/signup" style={{
          textDecoration: 'none',
          color: 'white',
          backgroundColor: '#065f46',
          fontWeight: '600',
          padding: '8px 16px',
          borderRadius: '6px'
        }}>Sign Up</a>
      </div>
    );
  }

  return (
    <div className="user-menu" style={{ position: 'relative' }}>
      <button className="user-btn" onClick={() => setOpen(!open)} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: 'none',
        background: 'none',
        cursor: 'pointer'
      }}>
        <UserCircleIcon className="user-icon" style={{ width: '32px', height: '32px', color: '#065f46' }} />
        <span style={{ fontWeight: '500', color: '#1f2937' }}>{user.name || 'User'}</span>
      </button>

      {open && (
        <div className="dropdown" style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '8px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '6px',
          padding: '8px 0',
          minWidth: '150px',
          zIndex: 50
        }}>
          <a href="/dashboard/profile" style={{ display: 'block', padding: '8px 16px', color: '#374151', textDecoration: 'none' }}>Profile</a>
          <a href="/dashboard" style={{ display: 'block', padding: '8px 16px', color: '#374151', textDecoration: 'none' }}>Dashboard</a>
          <a href="/saved-jobs" style={{ display: 'block', padding: '8px 16px', color: '#374151', textDecoration: 'none' }}>Saved Jobs</a>
          <button onClick={handleLogout} style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '8px 16px',
            color: '#ef4444',
            border: 'none',
            background: 'none',
            cursor: 'pointer'
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}
