import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Target, 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Flame, 
  Zap,
  TrendingUp,
  Layers
} from 'lucide-react';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestionFilter, setSuggestionFilter] = useState('ALL');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/detailed');
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Zap size={32} className="animate-pulse-glow" style={{ color: 'var(--accent-cyan)', margin: '0 auto 1rem' }} />
        <p>Loading your performance analytics & personalized study suggestions...</p>
      </div>
    );
  }

  const solvedTrendData = analytics?.solvedTrend || [];
  const accuracyData = analytics?.accuracyBreakdown || [];
  const difficultyData = analytics?.difficultyBreakdown || [];
  const improvement = analytics?.skillImprovement || {};
  const currentScore = analytics?.skillScore ?? 0;
  const focusSuggestions = analytics?.focusSuggestions || [];

  const hasData = solvedTrendData.some(d => d.solved > 0) || accuracyData.length > 0;

  const filteredSuggestions = focusSuggestions.filter(s => {
    if (suggestionFilter === 'HIGH') return s.priority === 'HIGH';
    if (suggestionFilter === 'MEDIUM') return s.priority === 'MEDIUM';
    if (suggestionFilter === 'LOW') return s.priority === 'LOW';
    return true;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return {
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.35)',
          color: '#fb7185',
          glow: '0 0 15px rgba(244, 63, 94, 0.15)'
        };
      case 'MEDIUM':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
          color: '#fbbf24',
          glow: '0 0 15px rgba(245, 158, 11, 0.15)'
        };
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          glow: '0 0 15px rgba(16, 185, 129, 0.15)'
        };
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Performance Analytics & Topic Focus
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Real-time performance metrics, error diagnosis, and AI-driven study recommendations to level up your DSA skills.
        </p>
      </div>

      {/* Overall Progression Banner */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} color="var(--accent-cyan)" /> OVERALL PROGRESSION
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {hasData
              ? `Previous Skill Score: ${improvement.previousScore ?? 0} → Current Skill Score: ${currentScore}`
              : `Current Skill Score: ${currentScore} — start solving to track progress`}
          </div>
        </div>
        {improvement.improvement > 0 && (
          <div style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} /> +{improvement.improvement} Score Improvement ({improvement.improvementPct}%)
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* AI TOPIC FOCUS & STRATEGIC STUDY SUGGESTIONS (NEW USER-REQUESTED SECTION) */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                Targeted Topic Focus & Study Suggestions
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', marginLeft: '2.8rem' }}>
              AI analysis of your strengths, error frequency, and weak points with actionable study roadmaps.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'ALL', label: 'All Topics' },
              { id: 'HIGH', label: '🔴 Urgent Focus' },
              { id: 'MEDIUM', label: '🟡 Practice Needed' },
              { id: 'LOW', label: '🟢 Mastered' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSuggestionFilter(tab.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '7px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: suggestionFilter === tab.id ? 'var(--accent-blue)' : 'transparent',
                  color: suggestionFilter === tab.id ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Cards Grid */}
        {filteredSuggestions.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No suggestions found for this category.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {filteredSuggestions.map((item, idx) => {
              const pStyle = getPriorityStyle(item.priority);
              return (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.75rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: `1px solid ${pStyle.border}`,
                    boxShadow: pStyle.glow,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '6px', 
                          background: pStyle.bg, 
                          color: pStyle.color,
                          border: `1px solid ${pStyle.border}`,
                          display: 'inline-block',
                          marginBottom: '0.4rem'
                        }}>
                          {item.priorityLabel}
                        </span>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{item.topic}</h3>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {item.skillScore} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                          {item.problemsSolved}/{item.problemsAttempted} Solved ({item.accuracy}%)
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic Explanation */}
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                      {item.diagnosis}
                    </p>

                    {/* Action Item Box */}
                    <div style={{ 
                      padding: '0.85rem 1rem', 
                      borderRadius: '8px', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--border-color)', 
                      marginBottom: '1.25rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem'
                    }}>
                      <Brain size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Study Action Plan:</strong>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.actionItem}</span>
                      </div>
                    </div>

                    {/* Key Concepts to Master */}
                    {item.keyConcepts && item.keyConcepts.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Layers size={13} /> Key Patterns to Focus On:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {item.keyConcepts.map((concept, cIdx) => (
                            <span 
                              key={cIdx} 
                              style={{ 
                                fontSize: '0.75rem', 
                                padding: '0.2rem 0.55rem', 
                                borderRadius: '4px', 
                                background: 'rgba(255, 255, 255, 0.05)', 
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommended Practice Problems */}
                  {item.recommendedProblems && item.recommendedProblems.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <BookOpen size={13} /> Recommended Practice:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {item.recommendedProblems.map((prob) => (
                          <div 
                            key={prob.id}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: '6px', 
                              background: 'rgba(0, 0, 0, 0.25)', 
                              border: '1px solid rgba(255,255,255,0.04)',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                              <span className={`badge badge-${prob.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                                {prob.difficulty}
                              </span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {prob.title}
                              </span>
                            </div>
                            <Link 
                              to={`/problem/${prob.id}`} 
                              className="btn-secondary" 
                              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              Solve <ArrowRight size={12} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PERFORMANCE CHARTS & BREAKDOWNS */}
      {/* ========================================================================= */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
        Detailed Historical Performance
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        {/* Weekly Solved Trend */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Problems Solved This Week</h3>
          {solvedTrendData.every(d => d.solved === 0) ? (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No accepted submissions this week yet.
            </div>
          ) : (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={solvedTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#121824', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="solved" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Submission Accuracy Breakdown */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Submission Accuracy Breakdown</h3>
          {accuracyData.length === 0 ? (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No submissions yet.
            </div>
          ) : (
            <>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={accuracyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                      {accuracyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#121824', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {accuracyData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <span>{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Difficulty Breakdown */}
      {difficultyData.length > 0 && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Solved by Difficulty</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="difficulty" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#121824', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalyticsPage;
