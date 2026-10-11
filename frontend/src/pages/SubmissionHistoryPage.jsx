import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, CheckCircle2, XCircle, Sparkles, Code, Eye, X } from 'lucide-react';

const SubmissionHistoryPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error loading submissions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Submission History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Review your past code submissions, execution speed, memory metrics, and AI optimization reports.
        </p>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading submission logs...
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No submissions recorded yet. Head over to the Problem Library to get started!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Problem</th>
                <th style={{ padding: '1rem 1.5rem' }}>Language</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem' }}>Execution</th>
                <th style={{ padding: '1rem 1.5rem' }}>Memory</th>
                <th style={{ padding: '1rem 1.5rem' }}>Submitted At</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>AI Analysis</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                    {s.problem?.title || 'Coding Problem'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                      {s.language}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      color: s.status === 'ACCEPTED' ? '#34d399' : '#f87171',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.85rem'
                    }}>
                      {s.status === 'ACCEPTED' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {s.executionTimeMs} ms
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {s.memoryUsedMb} MB
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(s.submittedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedSubmission(s)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }}
                    >
                      Inspect AI Report <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Submission AI Analysis Modal */}
      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: '#0d121d', border: '1px solid var(--accent-purple)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Submission #{selectedSubmission.id} Analysis</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Problem: {selectedSubmission.problem?.title} | Language: {selectedSubmission.language}
                </p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted Source Code</h4>
              <pre style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                {selectedSubmission.code}
              </pre>
            </div>

            {selectedSubmission.analysis && (
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} /> AI Optimization Feedback
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedSubmission.analysis.explanation}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default SubmissionHistoryPage;
