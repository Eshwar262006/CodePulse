import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, BookOpen, CheckCircle2, Circle, Sparkles, ArrowUpDown, Eye } from 'lucide-react';

const ProblemLibraryPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const topics = [
    'All', 'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue',
    'Trees', 'Graphs', 'Sorting', 'Searching', 'Hashing', 'Recursion', 'Greedy', 'Dynamic Programming'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty, selectedTopic]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (selectedTopic !== 'All') params.topic = selectedTopic;
      if (search) params.search = search;

      const res = await api.get('/problems', { params });
      setProblems(res.data);
    } catch (err) {
      console.error("Failed to load problems", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Problem Library
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Explore coding challenges, analyze your performance, and master data structures & algorithms.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              fontSize: '0.85rem', 
              color: 'var(--accent-cyan)', 
              background: 'rgba(6, 182, 212, 0.1)', 
              border: '1px solid rgba(6, 182, 212, 0.25)', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '20px', 
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <BookOpen size={14} /> {problems.length} {problems.length === 1 ? 'Problem' : 'Problems'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems by title or topic..."
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.6rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          {/* Difficulty Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
            >
              {difficulties.map(d => <option key={d} value={d}>Difficulty: {d}</option>)}
            </select>
          </div>

          {/* Topic Dropdown */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
            >
              {topics.map(t => <option key={t} value={t}>Topic: {t}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Problems Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading problem catalog...
          </div>
        ) : problems.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No problems found matching your filters.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem', width: '60px' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem' }}>Title</th>
                <th style={{ padding: '1rem 1.5rem' }}>Topic</th>
                <th style={{ padding: '1rem 1.5rem' }}>Difficulty</th>
                <th style={{ padding: '1rem 1.5rem' }}>Target Complexity</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                  
                  {/* Status */}
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                    {idx % 3 === 0 ? <CheckCircle2 size={18} color="var(--accent-emerald)" /> : <Circle size={18} />}
                  </td>

                  {/* Title */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/problem/${p.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {p.id}. {p.title}
                    </Link>
                  </td>

                  {/* Topic */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {p.topic}
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge badge-${p.difficulty.toLowerCase()}`}>
                      {p.difficulty}
                    </span>
                  </td>

                  {/* Optimal Complexity */}
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                    {p.optimalTimeComplexity} / {p.optimalSpaceComplexity}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link 
                        to={`/problem/${p.id}?tab=visualizer`} 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Open Algorithm Visualizer"
                      >
                        <Eye size={13} /> Visualize
                      </Link>
                      <Link 
                        to={`/problem/${p.id}`} 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        Solve <Sparkles size={13} />
                      </Link>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ProblemLibraryPage;
