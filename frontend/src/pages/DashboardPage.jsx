import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Award, 
  Brain, 
  Zap, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Target
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, challengeRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/challenges/daily')
        ]);
        setDashboardData(dashRes.data);
        setDailyChallenge(challengeRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Zap size={32} className="animate-pulse-glow" style={{ color: 'var(--accent-cyan)' }} />
        <p style={{ marginTop: '1rem' }}>Loading your personalized dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Unable to load dashboard. Please try again later.</p>
      </div>
    );
  }

  const stats = dashboardData;
  const weakAreas = stats.weakAreas || [];
  const recommended = stats.recommendedPractice || [];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Welcome back, {user?.name || 'Developer'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {stats.problemsSolved === 0
              ? 'Start solving problems to build your personalized dashboard.'
              : 'Ready to analyze and optimize your code solutions today?'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Flame size={20} />
            <span>{stats.currentStreak} Day Streak</span>
          </div>

          <div style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Brain size={20} />
            <span>Skill Score: {stats.skillScore}/100</span>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Problems Solved</span>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.problemsSolved}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Out of {stats.problemsAttempted} attempted
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Success Rate</span>
            <TrendingUp size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.successRate}%</div>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', marginTop: '0.5rem' }}>
            <div style={{ width: `${stats.successRate}%`, background: 'var(--accent-cyan)', height: '100%', borderRadius: '3px' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Current Streak</span>
            <Flame size={20} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.currentStreak} <span style={{ fontSize: '1rem', fontWeight: 500 }}>days</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Best streak: {stats.longestStreak} days
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Coding Time</span>
            <Clock size={20} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.codingTimeHours} <span style={{ fontSize: '1rem', fontWeight: 500 }}>hours</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total active practice time
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>XP Earned</span>
            <Award size={20} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.xp}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}> XP</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Earned from accepted submissions
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Challenge & Weak Areas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Today's Challenge */}
        <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              <Flame size={18} /> TODAY'S DAILY CHALLENGE
            </div>
            {dailyChallenge?.problem?.difficulty && (
              <span className={`badge badge-${dailyChallenge.problem.difficulty.toLowerCase()}`}>
                {dailyChallenge.problem.difficulty}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {dailyChallenge?.problem?.title || 'No challenge available'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {dailyChallenge?.reason || 'Complete today\'s challenge to earn bonus XP.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <span>Topic: <strong style={{ color: 'var(--text-primary)' }}>{dailyChallenge?.problem?.topic || '—'}</strong></span>
            <span>XP: <strong style={{ color: '#fbbf24' }}>+{dailyChallenge?.xpReward || 50} XP</strong></span>
          </div>

          <Link
            to={dailyChallenge?.problem?.id ? `/problem/${dailyChallenge.problem.id}` : "/problems"}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
          >
            <Play size={18} /> Start Challenge
          </Link>
        </div>

        {/* Your Weak Areas */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1.25rem' }}>
            <AlertTriangle size={18} /> YOUR WEAK AREAS
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Identified Optimization Focus
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Based on your recent solution submissions and algorithm choices, CodePulse recommends practicing:
          </p>

          {weakAreas.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              No weak areas identified yet. Solve more problems to get personalized insights.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {weakAreas.map((topic, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topic}</span>
                  <span style={{ fontSize: '0.75rem', color: '#f87171', background: 'rgba(244, 63, 94, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    Needs Practice
                  </span>
                </div>
              ))}
            </div>
          )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/analytics" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.85rem' }}>
                <Target size={16} /> View Topic Focus Suggestions
              </Link>
              <Link to="/skills" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.85rem' }}>
                View Skill Matrix <ArrowRight size={16} />
              </Link>
            </div>
          </div>

      </div>

      {/* Recommended Practice Section */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Recommended Practice</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Personalized problem recommendations targeting your weak topics
            </p>
          </div>

          <Link to="/problems" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            View All Problems
          </Link>
        </div>

        {recommended.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {stats.problemsSolved === 0
              ? 'Start with any problem from the library — recommendations will appear as you practice.'
              : 'Great work! You\'ve solved all available problems.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {recommended.map((prob) => (
              <div key={prob.id} style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prob.topic}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{prob.title}</h3>
                </div>

                <Link to={`/problem/${prob.id}`} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.8rem', marginTop: '1rem' }}>
                  Solve Problem
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
