import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '5rem 1.5rem 4rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glowing backdrop circle */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)', pointerEvents: 'none', filter: 'blur(50px)' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> AI-POWERED PERSONALIZED CODING PLATFORM
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Write Better Code. <br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Understand Your Performance.
            </span> <br />
            Improve Every Day.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Practice coding problems, analyze your solutions, optimize your code, discover your weak areas, and receive personalized challenges designed around your coding journey.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Sign In to Account <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Create New Account
            </Link>
            <Link to="/problems" className="btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.03)' }}>
              Browse Problems
            </Link>
          </div>
        </div>

        {/* Hero Demo Mockup / Workflow Pill */}
        <div style={{ maxWidth: '1000px', margin: '3.5rem auto 0 auto' }} className="glass-card">
          <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem 1.2rem', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Solve → Verify → Analyze → Improve → Learn → Track → Recommend
            </div>
            <div style={{ width: '40px' }} />
          </div>

          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} /> Your Submission: Passed (4/4)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Time: O(n²) | Space: O(1)
              </div>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} /> AI Code Analysis & Tradeoff
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Potential Improvement: <br />
                <span style={{ color: '#f87171', textDecoration: 'line-through' }}>O(n²)</span> → <span style={{ color: '#34d399', fontWeight: 700 }}>O(n)</span> via HashMap lookup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Sections */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 4rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Why CodePulse is Different
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            A correct solution is only the first step. CodePulse guides you towards optimal algorithms and deeper algorithmic intuition.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          
          {/* Feature 1: Practice */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--accent-blue)' }}>
              <Terminal size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Practice</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Solve real programming problems using an integrated Monaco Editor supporting Java, Python, C++, and JavaScript with instant sandboxed evaluation.
            </p>
          </div>

          {/* Feature 2: Analyze */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--accent-purple)' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Analyze</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Understand your exact time complexity, space complexity, data structure choice, and redundant loop patterns after every single execution.
            </p>
          </div>

          {/* Feature 3: Improve */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Improve</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Find ways to make correct solutions faster, cleaner, and more efficient. If your code is already optimal, CodePulse clearly confirms it.
            </p>
          </div>

          {/* Feature 4: Track */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--accent-emerald)' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. Track</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Monitor your coding progress over time with comprehensive radar charts, topic mastery percentages, accuracy trends, and streaks.
            </p>
          </div>

          {/* Feature 5: Personalize */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--accent-amber)' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>5. Personalize</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Receive daily coding challenges and tailored problem recommendations designed specifically around your individual performance and weak areas.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action CTA */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', padding: '0 1.5rem', width: '100%' }}>
        <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(88, 28, 135, 0.3) 100%)', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Level Up Your Coding Skills?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Join thousands of developers and students using CodePulse to transform correct solutions into optimal ones.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem' }}>
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
