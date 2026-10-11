import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Code2, 
  LayoutDashboard, 
  BookOpen, 
  Flame, 
  BarChart3, 
  Brain, 
  History, 
  Map, 
  Trophy, 
  User, 
  ShieldCheck, 
  LogOut, 
  Moon, 
  Sun,
  Sparkles,
  Swords,
  Menu,
  X
} from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
    { name: 'Problems', path: '/problems', icon: BookOpen, requiresAuth: false },
    { name: 'Visualizer', path: '/visualizer', icon: Sparkles, requiresAuth: false },
    { name: '1v1 Arena', path: '/arena', icon: Swords, requiresAuth: true },
    { name: 'Daily Challenge', path: '/challenge', icon: Flame, requiresAuth: true },
    { name: 'My Skills', path: '/skills', icon: Brain, requiresAuth: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, requiresAuth: true },
    { name: 'Roadmap', path: '/roadmap', icon: Map, requiresAuth: true },
    { name: 'Submissions', path: '/submissions', icon: History, requiresAuth: true },
    { name: 'Achievements', path: '/achievements', icon: Trophy, requiresAuth: true },
  ];

  if (user && user.role === 'ROLE_ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck, requiresAuth: true });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Code2 size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #f3f4f6, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CodePulse
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.5px', marginTop: '-4px' }}>
              AI OPTIMIZATION PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }} className="desktop-links">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  background: active ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                  border: active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={active ? '#3b82f6' : 'currentColor'} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                Start Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
