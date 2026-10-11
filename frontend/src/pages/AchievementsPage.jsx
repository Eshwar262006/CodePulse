import React from 'react';
import { Trophy, Award, Flame, Zap, Sparkles, CheckCircle2, Lock } from 'lucide-react';

const AchievementsPage = () => {
  const achievements = [
    { title: 'First Problem', desc: 'Solved your first coding problem on CodePulse', earned: true, date: '12 Oct 2025', icon: Zap, color: '#06b6d4' },
    { title: '10 Problems Solved', desc: 'Completed 10 programming challenges', earned: true, date: '28 Nov 2025', icon: Award, color: '#3b82f6' },
    { title: '50 Problems Solved', desc: 'Reached half a century of coding mastery', earned: true, date: '15 Jan 2026', icon: Trophy, color: '#8b5cf6' },
    { title: '100 Problems Solved', desc: 'Achieved 100 solved problems milestone', earned: true, date: '04 Mar 2026', icon: Trophy, color: '#ec4899' },
    { title: '7 Day Streak', desc: 'Maintained an active streak for 7 consecutive days', earned: true, date: '20 Feb 2026', icon: Flame, color: '#f59e0b' },
    { title: '30 Day Streak', desc: 'Unstoppable! Solved problems for 30 consecutive days', earned: false, progress: '12/30 Days', icon: Flame, color: '#ef4444' },
    { title: 'Optimization Master', desc: 'Reduced O(n²) solution down to O(n) or O(1) space/time', earned: true, date: '18 Sep 2026', icon: Sparkles, color: '#10b981' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Achievements & Badges
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Celebrate your personal growth, consistency milestones, and algorithmic optimization feats.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {achievements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1.25rem',
                opacity: item.earned ? 1 : 0.65,
                background: item.earned ? 'var(--bg-card)' : 'rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '12px', 
                background: item.earned ? `rgba(${item.color === '#06b6d4' ? '6,182,212' : item.color === '#f59e0b' ? '245,158,11' : '59,130,246'}, 0.15)` : 'rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: item.earned ? item.color : 'var(--text-muted)'
              }}>
                <Icon size={26} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h3>
                  {item.earned ? (
                    <CheckCircle2 size={18} color="#34d399" />
                  ) : (
                    <Lock size={16} color="var(--text-muted)" />
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {item.desc}
                </p>

                {item.earned ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Earned on {item.date}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Progress: {item.progress}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AchievementsPage;
