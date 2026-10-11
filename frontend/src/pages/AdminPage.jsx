import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  X, 
  Search, 
  Filter, 
  Terminal, 
  Clock, 
  Activity, 
  Flame, 
  Brain, 
  Eye, 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ExternalLink,
  UserCheck,
  UserX
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems', 'users', 'submissions', 'analytics'
  const [stats, setStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [problemSearch, setProblemSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [inspectingUser, setInspectingUser] = useState(null);
  const [userActivityData, setUserActivityData] = useState(null);
  const [inspectingSubmission, setInspectingSubmission] = useState(null);

  const initialProblemState = {
    title: '',
    description: '',
    difficulty: 'Easy',
    topic: 'Arrays',
    constraints: '1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    optimalTimeComplexity: 'O(n)',
    optimalSpaceComplexity: 'O(1)',
    inputFormat: 'First line contains target. Second line contains space-separated integers.',
    outputFormat: 'Space-separated integers or single integer',
    starterCodeJava: 'public class Solution {\n    public int[] solve(int[] nums) {\n        // Your code here\n        return new int[]{};\n    }\n}',
    starterCodePython: 'def solve(nums):\n    # Your code here\n    return []',
    starterCodeCpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        return {};\n    }\n};',
    starterCodeJs: 'function solve(nums) {\n    // Your code here\n    return [];\n}',
    testCaseInput1: '2 7 11 15',
    testCaseOutput1: '0 1',
    testCaseInput2: '3 2 4',
    testCaseOutput2: '1 2'
  };

  const [problemForm, setProblemForm] = useState(initialProblemState);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, probRes, usersRes, subsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/problems'),
        api.get('/admin/users'),
        api.get('/admin/submissions')
      ]);
      setStats(statsRes.data);
      setProblems(probRes.data);
      setUsers(usersRes.data);
      setSubmissions(subsRes.data);
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProblem(null);
    setProblemForm(initialProblemState);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProblem(p);
    setProblemForm({
      title: p.title || '',
      description: p.description || '',
      difficulty: p.difficulty || 'Easy',
      topic: p.topic || 'Arrays',
      constraints: p.constraints || '',
      optimalTimeComplexity: p.optimalTimeComplexity || 'O(n)',
      optimalSpaceComplexity: p.optimalSpaceComplexity || 'O(1)',
      inputFormat: p.inputFormat || '',
      outputFormat: p.outputFormat || '',
      starterCodeJava: p.starterCodeJava || '',
      starterCodePython: p.starterCodePython || '',
      starterCodeCpp: p.starterCodeCpp || '',
      starterCodeJs: p.starterCodeJs || '',
      testCaseInput1: p.testCases && p.testCases[0] ? p.testCases[0].input : '',
      testCaseOutput1: p.testCases && p.testCases[0] ? p.testCases[0].expectedOutput : '',
      testCaseInput2: p.testCases && p.testCases[1] ? p.testCases[1].input : '',
      testCaseOutput2: p.testCases && p.testCases[1] ? p.testCases[1].expectedOutput : ''
    });
    setShowAddModal(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: problemForm.title,
        description: problemForm.description,
        difficulty: problemForm.difficulty,
        topic: problemForm.topic,
        constraints: problemForm.constraints,
        optimalTimeComplexity: problemForm.optimalTimeComplexity,
        optimalSpaceComplexity: problemForm.optimalSpaceComplexity,
        inputFormat: problemForm.inputFormat,
        outputFormat: problemForm.outputFormat,
        starterCodeJava: problemForm.starterCodeJava,
        starterCodePython: problemForm.starterCodePython,
        starterCodeCpp: problemForm.starterCodeCpp,
        starterCodeJs: problemForm.starterCodeJs,
        testCases: [
          { input: problemForm.testCaseInput1 || '0', expectedOutput: problemForm.testCaseOutput1 || '0', hidden: false },
          { input: problemForm.testCaseInput2 || '1', expectedOutput: problemForm.testCaseOutput2 || '1', hidden: false }
        ]
      };

      if (editingProblem) {
        await api.put(`/admin/problems/${editingProblem.id}`, payload);
      } else {
        await api.post('/admin/problems', payload);
      }

      setShowAddModal(false);
      fetchAdminData();
    } catch (err) {
      console.error("Error saving problem:", err);
      alert("Failed to save problem. Please check input parameters.");
    }
  };

  const handleDeleteProblem = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete problem #${id} "${title}"?`)) return;
    try {
      await api.delete(`/admin/problems/${id}`);
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting problem:", err);
      alert("Failed to delete problem.");
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_STUDENT' : 'ROLE_ADMIN';
    if (!window.confirm(`Change this user role to ${newRole}?`)) return;
    try {
      await api.post(`/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleInspectUser = async (user) => {
    setInspectingUser(user);
    try {
      const res = await api.get(`/admin/users/${user.id}/activity`);
      setUserActivityData(res.data);
    } catch (err) {
      console.error("Failed to load user activity:", err);
    }
  };

  // Filtered lists
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase()) || 
                          p.topic.toLowerCase().includes(problemSearch.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredSubmissions = submissions.filter(s => {
    if (subStatusFilter === 'All') return true;
    return s.status === subStatusFilter;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
            <ShieldCheck size={18} /> ADMIN MASTER CONTROL PANEL
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Full control over problem catalogs, user activity tracking, code submissions, and system diagnostics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleOpenAddModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={18} /> Add New Problem
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Total Registered Users</span>
            <Users size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem' }}>{stats?.totalUsers || users.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>● {stats?.activeUsers || users.length} Active Accounts</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Problem Catalog</span>
            <BookOpen size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--accent-cyan)' }}>{problems.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>14 Data Structure Categories</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Total Code Submissions</span>
            <Activity size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#fbbf24' }}>{stats?.totalSubmissions || submissions.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Across 13 Programming Languages</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Platform Success Rate</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#34d399' }}>{stats?.successRate || 76.5}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stats?.acceptedSubmissions || 184} Accepted Runs</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
        {[
          { id: 'problems', label: 'Problem Catalog', icon: BookOpen, count: problems.length },
          { id: 'users', label: 'User Activities & Profiles', icon: Users, count: users.length },
          { id: 'submissions', label: 'Live Submissions Feed', icon: Terminal, count: submissions.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} /> {tab.label}
              <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.45rem', borderRadius: '12px', background: isActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)', color: isActive ? '#000' : 'var(--text-muted)' }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: PROBLEM CATALOG MANAGEMENT
         ======================================================== */}
      {activeTab === 'problems' && (
        <div>
          {/* Search & Filter Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={problemSearch}
                onChange={e => setProblemSearch(e.target.value)}
                placeholder="Search problems by title, topic, or ID..."
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Problem Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>ID</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Title</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Difficulty</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Topic</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Target Complexity</th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{p.id}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>
                      <Link to={`/problem/${p.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {p.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)' }}>{p.topic}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      {p.optimalTimeComplexity} / {p.optimalSpaceComplexity}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Link to={`/problem/${p.id}`} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} title="Solve & Preview">
                          <ExternalLink size={13} />
                        </Link>
                        <button onClick={() => handleOpenEditModal(p)} style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }} title="Edit Problem">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteProblem(p.id, p.title)} style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }} title="Delete Problem">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: USER ACTIVITIES & PROFILES
         ======================================================== */}
      {activeTab === 'users' && (
        <div>
          {/* User Search */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search registered users by username, name, or email..."
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>User</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Email</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Solved / Attempted</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Streak</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>XP</th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.role === 'ROLE_ADMIN' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.username}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.name || 'User'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.role === 'ROLE_ADMIN' ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'ROLE_ADMIN' ? '#a78bfa' : 'var(--text-muted)',
                        border: u.role === 'ROLE_ADMIN' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-color)'
                      }}>
                        {u.role === 'ROLE_ADMIN' ? '👑 ADMIN' : 'STUDENT'}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)' }}>
                      <strong style={{ color: '#34d399' }}>{u.problemsSolved}</strong> <span style={{ color: 'var(--text-muted)' }}>/ {u.problemsAttempted}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontWeight: 700 }}>
                        <Flame size={14} /> {u.currentStreak}d
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {u.xp || 0} XP
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleInspectUser(u)}
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={13} /> Activity History
                        </button>
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          style={{
                            background: u.role === 'ROLE_ADMIN' ? 'rgba(244,63,94,0.1)' : 'rgba(139,92,246,0.1)',
                            border: u.role === 'ROLE_ADMIN' ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(139,92,246,0.3)',
                            color: u.role === 'ROLE_ADMIN' ? '#f87171' : '#a78bfa',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                          title="Toggle Role"
                        >
                          {u.role === 'ROLE_ADMIN' ? 'Demote' : 'Make Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: LIVE PLATFORM SUBMISSIONS & RESULTS FEED
         ======================================================== */}
      {activeTab === 'submissions' && (
        <div>
          {/* Status Filter */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem', fontWeight: 600 }}>Filter by Verdict:</span>
            {['All', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR'].map(status => (
              <button
                key={status}
                onClick={() => setSubStatusFilter(status)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: subStatusFilter === status ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                  color: subStatusFilter === status ? '#000' : 'var(--text-secondary)'
                }}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Submissions Feed Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Submission ID</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>User</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Problem</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Verdict</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Language</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Runtime</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Test Cases</th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{s.id}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.username}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <Link to={`/problem/${s.problemId}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {s.problemTitle}
                      </Link>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className={`badge badge-${s.status === 'ACCEPTED' ? 'easy' : 'hard'}`}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)' }}>{s.language}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      {s.executionTimeMs} ms
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {s.passedTestCases} / {s.totalTestCases}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setInspectingSubmission(s)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Code2 size={13} /> Inspect Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD / EDIT PROBLEM MODAL
         ======================================================== */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: '#0d121d', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  {editingProblem ? `Edit Problem #${editingProblem.id}: ${editingProblem.title}` : 'Create New DSA Problem'}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure constraints, multiple test cases, starter code signatures, and time bounds.</span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProblem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Problem Title *</label>
                <input
                  type="text"
                  value={problemForm.title}
                  onChange={e => setProblemForm({...problemForm, title: e.target.value})}
                  required
                  placeholder="e.g. Valid Anagram, Subsets II"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Difficulty *</label>
                  <select
                    value={problemForm.difficulty}
                    onChange={e => setProblemForm({...problemForm, difficulty: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Topic Category *</label>
                  <input
                    type="text"
                    value={problemForm.topic}
                    onChange={e => setProblemForm({...problemForm, topic: e.target.value})}
                    required
                    placeholder="e.g. Dynamic Programming, Trees"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Optimal Time Complexity</label>
                  <input
                    type="text"
                    value={problemForm.optimalTimeComplexity}
                    onChange={e => setProblemForm({...problemForm, optimalTimeComplexity: e.target.value})}
                    placeholder="e.g. O(n), O(log n)"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Optimal Space Complexity</label>
                  <input
                    type="text"
                    value={problemForm.optimalSpaceComplexity}
                    onChange={e => setProblemForm({...problemForm, optimalSpaceComplexity: e.target.value})}
                    placeholder="e.g. O(1), O(n)"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Problem Description *</label>
                <textarea
                  rows={4}
                  value={problemForm.description}
                  onChange={e => setProblemForm({...problemForm, description: e.target.value})}
                  required
                  placeholder="Explain the problem statement, parameters, and example..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              {/* Test Cases */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                  Sample Test Cases for Execution Engine
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Test Case 1: Input</label>
                    <input
                      type="text"
                      value={problemForm.testCaseInput1}
                      onChange={e => setProblemForm({...problemForm, testCaseInput1: e.target.value})}
                      placeholder="e.g. 9\n2 7 11 15"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Test Case 1: Expected Output</label>
                    <input
                      type="text"
                      value={problemForm.testCaseOutput1}
                      onChange={e => setProblemForm({...problemForm, testCaseOutput1: e.target.value})}
                      placeholder="e.g. 0 1"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Starter Code Java */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Default Starter Code (Java)</label>
                <textarea
                  rows={4}
                  value={problemForm.starterCodeJava}
                  onChange={e => setProblemForm({...problemForm, starterCodeJava: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#090d16', border: '1px solid var(--border-color)', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={16} /> Save Problem to Catalog
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: USER ACTIVITY HISTORY INSPECTOR
         ======================================================== */}
      {inspectingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', background: '#0d121d', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  User Activity Inspector: {inspectingUser.username}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inspectingUser.email} • Role: {inspectingUser.role}</span>
              </div>
              <button onClick={() => setInspectingUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* User Stats Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problems Solved</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>{userActivityData?.solvedCount || inspectingUser.problemsSolved || 0}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Streak</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>{inspectingUser.currentStreak || 0} days</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Submissions</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{userActivityData?.submissions?.length || 0}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Recent Submissions & Activity Log</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {userActivityData?.submissions && userActivityData.submissions.length > 0 ? (
                userActivityData.submissions.map(sub => (
                  <div key={sub.id} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sub.problem?.title || 'Problem'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {sub.language} • {sub.executionTimeMs}ms • {new Date(sub.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge badge-${sub.status === 'ACCEPTED' ? 'easy' : 'hard'}`}>
                        {sub.status.replace(/_/g, ' ')}
                      </span>
                      <button onClick={() => setInspectingSubmission(sub)} className="btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}>
                        View Code
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No submission records found for this user yet.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: SUBMISSION CODE INSPECTOR
         ======================================================== */}
      {inspectingSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', background: '#090d16', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Submission #{inspectingSubmission.id}: {inspectingSubmission.problemTitle || inspectingSubmission.problem?.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Submitted by <strong>{inspectingSubmission.username || inspectingSubmission.user?.username}</strong> in {inspectingSubmission.language}
                </span>
              </div>
              <button onClick={() => setInspectingSubmission(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <span className={`badge badge-${inspectingSubmission.status === 'ACCEPTED' ? 'easy' : 'hard'}`}>
                {inspectingSubmission.status?.replace(/_/g, ' ')}
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                Runtime: {inspectingSubmission.executionTimeMs} ms
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Passed: {inspectingSubmission.passedTestCases} / {inspectingSubmission.totalTestCases} Test Cases
              </span>
            </div>

            <pre style={{
              background: '#04070d',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#34d399',
              overflowX: 'auto',
              maxHeight: '400px'
            }}>
              {inspectingSubmission.code || '// No code recorded for this submission.'}
            </pre>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
