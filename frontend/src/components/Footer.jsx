import React from 'react';

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', background: 'var(--bg-secondary)', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          CodePulse – AI-Powered Personalized Coding Improvement Platform
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Solve → Verify → Analyze → Improve → Learn → Track → Recommend
        </p>
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          © {new Date().getFullYear()} CodePulse. Built with Spring Boot, React, and AI Code Analysis Engine.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
