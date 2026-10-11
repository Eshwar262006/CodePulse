import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Brain } from 'lucide-react';

const MySkillsPage = () => {
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkillData(res.data);
    } catch (err) {
      console.error("Error loading skills:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your skill analysis...
      </div>
    );
  }

  const radarData = skillData?.coreSkills
    ? Object.entries(skillData.coreSkills).map(([subject, score]) => ({ subject, score }))
    : [];

  const barData = skillData?.topicScores
    ? Object.entries(skillData.topicScores).map(([topic, score]) => ({ topic, score }))
    : [];

  const hasTopicData = barData.length > 0;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Personal Skill Analysis
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Track your algorithmic strengths, coding speed, consistency, and topic mastery.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <Brain size={20} /> CORE COMPETENCY RADAR
          </div>

          {radarData.length === 0 ? (
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Solve problems to build your competency profile.
            </div>
          ) : (
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
                  <Radar name="Skill Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Competency Breakdown
          </h2>

          {radarData.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No competency data yet. Submit solutions to see your scores.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {radarData.map((item) => (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    <span>{item.subject}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{item.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.score}%`, height: '100%', background: item.score >= 70 ? 'linear-gradient(90deg, #3b82f6, #06b6d4)' : 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Topic-Wise Mastery Level
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Calculated based on problem accuracy, difficulty tier, execution complexity, and time spent.
        </p>

        {!hasTopicData ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No topic scores yet. Each accepted submission updates your mastery levels.
          </div>
        ) : (
          <div style={{ width: '100%', height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="topic" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#121824', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {(skillData?.strongTopics?.length > 0 || skillData?.weakTopics?.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {skillData.strongTopics?.length > 0 && (
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, marginBottom: '0.5rem' }}>STRONG TOPICS</div>
                <div style={{ fontSize: '0.9rem' }}>{skillData.strongTopics.join(', ')}</div>
              </div>
            )}
            {skillData.weakTopics?.length > 0 && (
              <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>WEAK TOPICS</div>
                <div style={{ fontSize: '0.9rem' }}>{skillData.weakTopics.join(', ')}</div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default MySkillsPage;
