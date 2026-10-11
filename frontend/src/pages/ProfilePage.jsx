import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Flame, Award, CheckCircle, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'Java');
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, profileRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/users/profile')
        ]);
        setStats(dashRes.data);
        if (profileRes.data) {
          if (profileRes.data.name) setName(profileRes.data.name);
          if (profileRes.data.preferredLanguage) setPreferredLanguage(profileRes.data.preferredLanguage);
          updateUserProfile(profileRes.data);
        }
      } catch (err) {
        console.error("Error loading profile stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', { name, preferredLanguage });
      updateUserProfile(res.data);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(88, 28, 135, 0.2) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)' }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>@{user?.username} • {user?.email}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Flame size={16} /> {stats?.currentStreak ?? user?.currentStreak ?? 0} Day Streak
            </span>
            <span style={{ color: '#60a5fa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={16} /> XP: {stats?.xp ?? user?.xp ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Account Preferences
          </h2>

          {msg && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} /> {msg}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Preferred Programming Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="C#">C# (.NET)</option>
                <option value="C">C</option>
                <option value="PHP">PHP</option>
                <option value="Ruby">Ruby</option>
                <option value="Swift">Swift</option>
                <option value="Kotlin">Kotlin</option>
                <option value="SQL">SQL</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Lifetime Performance Overview
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Problems Solved</span>
              <strong>{stats?.problemsSolved ?? 0} Problems</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Overall Skill Score</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{stats?.skillScore ?? 0} / 100</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Strongest Topics</span>
              <strong style={{ color: '#34d399' }}>
                {stats?.strongAreas?.length > 0 ? stats.strongAreas.join(', ') : 'None yet'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Weakest Topics</span>
              <strong style={{ color: '#f87171' }}>
                {stats?.weakAreas?.length > 0 ? stats.weakAreas.join(', ') : 'None yet'}
              </strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
