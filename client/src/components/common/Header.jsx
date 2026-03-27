// client/src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, Settings } from 'lucide-react';
import LanguageSwitcher from '../../pages/LanguageSwitcher';
import NotificationBell from '../notifications/NotificationBell';

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)'
    }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text)' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>Sahil App</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Split bills, not friendship</div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LanguageSwitcher />
        <NotificationBell />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
              {user.country} • {user.subscription?.plan || 'Basic'}
            </div>
            <button onClick={() => alert('Profile settings coming soon')} className="btn btn-outline btn-sm" title="Profile Settings">
              <Settings size={16} />
            </button>
            <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
              <LogOut size={16} /> <span style={{ marginLeft: 6 }}>Logout</span>
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn btn-primary">Sign in</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
