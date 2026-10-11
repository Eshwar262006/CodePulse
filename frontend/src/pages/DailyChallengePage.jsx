import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Flame, Award, Clock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const res = await api.get('/challenges/daily');
      setChallenge(res.data);
    } catch (err) {
      console.error("Error loading daily challenge", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
          <Flame size={18} /> DAILY CODING CHALLENGE
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Today's Personalized Challenge</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
          Complete your daily challenge to maintain your streak and earn +50 XP
        </p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span className="badge badge-medium" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
            {challenge?.problem?.difficulty || 'Medium'}
          </span>
          <div style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={18} /> Reward: +50 XP
          </div>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          {challenge?.problem?.title || 'Longest Subarray With Sum K'}
        </h2>

        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Why this problem?</div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {challenge?.reason || 'You have recently struggled with prefix-sum problems. Tackling this problem reinforces Hashing and Subarray bounds.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Topic</span>
            <strong>{challenge?.problem?.topic || 'Arrays + Hashing'}</strong>
          </div>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Estimated Time</span>
            <strong>25 minutes</strong>
          </div>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Target Complexity</span>
            <strong>O(n) Time | O(n) Space</strong>
          </div>
        </div>

        <Link
          to={challenge?.problem?.id ? `/problem/${challenge.problem.id}` : "/problems"}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem' }}
        >
          Start Challenge Now <ArrowRight size={20} />
        </Link>

      </div>

    </div>
  );
};

export default DailyChallengePage;
