import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, User, Mail, Lock, Code, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = await register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (res.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Code2 size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Start improving your coding & algorithmic problem solving
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. alexj"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>



          <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </div>

        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
