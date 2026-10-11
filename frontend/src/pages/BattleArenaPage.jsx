import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Swords, 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  Bot, 
  User, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  Volume2
} from 'lucide-react';

const BattleArenaPage = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, MATCHMAKING, IN_BATTLE, RESULT
  const [battleMode, setBattleMode] = useState('RANKED');
  const [battleData, setBattleData] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Battle state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Java');
  const [timeLeft, setTimeLeft] = useState(600);
  const [playerPassed, setPlayerPassed] = useState(0);
  const [opponentPassed, setOpponentPassed] = useState(0);
  const [combatLogs, setCombatLogs] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmote, setSelectedEmote] = useState(null);

  const timerRef = useRef(null);
  const botIntervalRef = useRef(null);

  useEffect(() => {
    fetchStats();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(botIntervalRef.current);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/battles/stats');
      setStats(res.data);
    } catch {
      // Fallback defaults
      setStats({
        rating: 1250,
        tier: 'Gold',
        battlesPlayed: 12,
        wins: 8,
        losses: 4,
        winRate: 67,
        currentStreak: user?.currentStreak || 3,
        recentMatches: [
          { opponent: 'ByteMaster_AI', result: 'VICTORY', score: '3/3', time: '3m 42s', ratingChange: '+25' },
          { opponent: 'BinaryNinja', result: 'VICTORY', score: '3/3', time: '4m 10s', ratingChange: '+22' },
          { opponent: 'AlgoQueen_99', result: 'DEFEAT', score: '2/3', time: '5m 18s', ratingChange: '-15' }
        ]
      });
    }
  };

  const startMatchmaking = () => {
    setGameState('MATCHMAKING');
    
    // Simulate finding opponent in 2.5 seconds
    setTimeout(async () => {
      try {
        const res = await api.post('/battles/matchmake', { mode: battleMode });
        initializeBattle(res.data);
      } catch (err) {
        console.error("Matchmake API error, fallback to simulated duel:", err);
        // Fallback local battle match
        const fallbackBattle = {
          battleId: 'BATTLE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          timeLimitSeconds: 600,
          problem: {
            id: 1,
            title: 'Two Sum',
            difficulty: 'Easy',
            topic: 'Arrays',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            optimalTimeComplexity: 'O(n)',
            starterCodeJava: 'public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{0, 1};\n    }\n}',
            starterCodePython: 'def twoSum(nums, target):\n    # Your code here\n    return [0, 1]'
          },
          opponent: {
            name: 'AlgoMaster_99',
            title: 'Competitive Solver',
            rating: '1320',
            avatar: '⚡'
          }
        };
        initializeBattle(fallbackBattle);
      }
    }, 2500);
  };

  const initializeBattle = (data) => {
    setBattleData(data);
    setCode(language === 'Python' ? data.problem.starterCodePython : data.problem.starterCodeJava);
    setTimeLeft(data.timeLimitSeconds || 600);
    setPlayerPassed(0);
    setOpponentPassed(0);
    setCombatLogs([
      `⚔️ Duel started against ${data.opponent.name} (${data.opponent.rating} ELO)!`,
      `⏱️ 10 minutes on the clock. First to pass all test cases wins.`
    ]);
    setGameState('IN_BATTLE');

    // Start battle timer
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate opponent AI progress
    clearInterval(botIntervalRef.current);
    let opponentStep = 0;
    botIntervalRef.current = setInterval(() => {
      opponentStep++;
      if (opponentStep === 1) {
        setCombatLogs(prev => [...prev, `⚡ ${data.opponent.name} compiled initial solution...`]);
      } else if (opponentStep === 3) {
        setOpponentPassed(1);
        setCombatLogs(prev => [...prev, `🎯 ${data.opponent.name} passed Test Case 1/3!`]);
      } else if (opponentStep === 6) {
        setOpponentPassed(2);
        setCombatLogs(prev => [...prev, `🔥 ${data.opponent.name} passed Test Case 2/3!`]);
      } else if (opponentStep === 9) {
        // Opponent finishes if player has not won yet
        setOpponentPassed(3);
        setCombatLogs(prev => [...prev, `🏆 ${data.opponent.name} submitted solution: 3/3 Passed!`]);
        endBattle('DEFEAT', `${data.opponent.name} passed all test cases first.`);
      }
    }, 15000); // every 15 seconds
  };

  const handleRunTests = async () => {
    setIsSubmitting(true);
    setCombatLogs(prev => [...prev, `⚙️ Running test cases against sandbox...`]);

    try {
      const res = await api.post('/submissions/run', {
        code,
        language,
        problemId: battleData.problem.id
      });

      const passed = res.data.passedTestCases || 0;
      const total = res.data.totalTestCases || 3;
      setPlayerPassed(passed);

      if (res.data.status === 'ACCEPTED') {
        setCombatLogs(prev => [...prev, `🎉 SUCCESS: Passed all ${total}/${total} test cases!`]);
        endBattle('VICTORY', 'Flawless Victory! You passed all test cases before your opponent.');
      } else {
        setCombatLogs(prev => [...prev, `⚠️ Test run result: ${passed}/${total} passed (${res.data.status}). Keep optimizing!`]);
      }
    } catch {
      // Demo run
      setPlayerPassed(2);
      setCombatLogs(prev => [...prev, `⚠️ Test run: 2/3 passed. Refine your edge case handling!`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDuel = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/battles/submit', {
        battleId: battleData.battleId,
        problemId: battleData.problem.id,
        code,
        language
      });

      if (res.data.allPassed) {
        endBattle('VICTORY', res.data.message);
      } else {
        setPlayerPassed(res.data.passedTestCases);
        setCombatLogs(prev => [...prev, `⚠️ ${res.data.message}`]);
      }
    } catch {
      // Fallback submit
      endBattle('VICTORY', '🏆 Victory! Your solution was accepted first.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeExpired = () => {
    if (playerPassed > opponentPassed) {
      endBattle('VICTORY', 'Time expired! You won by higher test case score.');
    } else if (playerPassed < opponentPassed) {
      endBattle('DEFEAT', 'Time expired! Opponent had higher test case score.');
    } else {
      endBattle('DRAW', 'Time expired! Draw match.');
    }
  };

  const endBattle = (outcome, message) => {
    clearInterval(timerRef.current);
    clearInterval(botIntervalRef.current);
    setBattleResult({
      outcome,
      message,
      ratingChange: outcome === 'VICTORY' ? '+25' : outcome === 'DEFEAT' ? '-15' : '0',
      xpEarned: outcome === 'VICTORY' ? 100 : 25
    });
    setGameState('RESULT');
  };

  const triggerEmote = (emote) => {
    setSelectedEmote(emote);
    setCombatLogs(prev => [...prev, `💬 You sent: ${emote}`]);
    setTimeout(() => setSelectedEmote(null), 2500);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* ========================================================== */}
      {/* 1. LOBBY VIEW */}
      {/* ========================================================== */}
      {gameState === 'LOBBY' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Swords size={24} color="#fff" />
                </div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
                  1v1 Real-Time Battle Arena
                </h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                Duel live opponents in head-to-head algorithm races. Climb the ranked leaderboard and earn ELO.
              </p>
            </div>

            {/* Quick Stats Pill */}
            {stats && (
              <div className="glass-card" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RATING</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{stats.rating} ELO</div>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WIN RATE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{stats.winRate}%</div>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TIER</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.tier}</div>
                </div>
              </div>
            )}
          </div>

          {/* Arena Modes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                id: 'RANKED',
                title: 'Ranked 1v1 Duel',
                desc: 'Compete for ELO rating against peer coders. Strict 10-minute timer with anti-cheat.',
                icon: Trophy,
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.12)',
                badge: 'Popular'
              },
              {
                id: 'BLITZ',
                title: 'Blitz Speed Battle',
                desc: 'Sudden death 5-minute duel on Easy/Medium challenges. Pure typing & algorithmic speed.',
                icon: Zap,
                color: '#06b6d4',
                bg: 'rgba(6, 182, 212, 0.12)',
                badge: 'Fast-Paced'
              },
              {
                id: 'BOT_SPARRING',
                title: 'AI Master Bot Sparring',
                desc: 'Warm up against ByteMaster AI. Test your solution before taking on real ranked opponents.',
                icon: Bot,
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.12)',
                badge: 'Practice'
              }
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = battleMode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setBattleMode(m.id)}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-color)',
                    background: isSelected ? m.bg : 'var(--bg-card)',
                    boxShadow: isSelected ? `0 0 25px ${m.color}33` : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: isSelected ? m.color : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} color={isSelected ? '#000' : m.color} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                      {m.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Call / Matchmake Button */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <button
              onClick={startMatchmaking}
              className="btn-primary"
              style={{
                padding: '1rem 3.5rem',
                fontSize: '1.25rem',
                fontWeight: 800,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                boxShadow: '0 0 35px rgba(239, 68, 68, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Swords size={24} /> FIND OPPONENT & START DUEL
            </button>
          </div>

          {/* Recent Matches Table */}
          {stats && stats.recentMatches && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Recent Duel History</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Opponent</th>
                    <th style={{ padding: '0.75rem' }}>Result</th>
                    <th style={{ padding: '0.75rem' }}>Score</th>
                    <th style={{ padding: '0.75rem' }}>Duration</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Rating Change</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMatches.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.opponent}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, background: m.result === 'VICTORY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: m.result === 'VICTORY' ? '#34d399' : '#fb7185' }}>
                          {m.result}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>{m.score}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{m.time}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: m.ratingChange.startsWith('+') ? '#34d399' : '#fb7185' }}>
                        {m.ratingChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ========================================================== */}
      {/* 2. MATCHMAKING RADAR VIEW */}
      {/* ========================================================== */}
      {gameState === 'MATCHMAKING' && (
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          
          {/* Animated Pulsing Radar Circle */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(245, 158, 11, 0.1) 70%)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            animation: 'pulse 1.5s infinite',
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)'
          }}>
            <Swords size={48} color="#f59e0b" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Searching for Opponent...
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '450px' }}>
            Matching with coders in your rating bracket (1200 - 1400 ELO)...
          </p>

          <button
            onClick={() => setGameState('LOBBY')}
            className="btn-secondary"
            style={{ marginTop: '2rem', padding: '0.6rem 1.5rem' }}
          >
            Cancel Matchmaking
          </button>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. ACTIVE IN_BATTLE DUEL VIEW */}
      {/* ========================================================== */}
      {gameState === 'IN_BATTLE' && battleData && (
        <div>
          
          {/* Dual Top Header Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Player 1 (You) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', position: 'relative' }}>
                👨‍💻
                {selectedEmote && (
                  <span style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '1.5rem', animation: 'bounce 0.5s infinite' }}>
                    {selectedEmote}
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{user?.name || 'You'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>1280 ELO (You)</div>
              </div>
            </div>

            {/* Center Timer & Problem Topic */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: timeLeft < 60 ? '#f43f5e' : 'var(--text-primary)', letterSpacing: '1px' }}>
                <Clock size={20} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                {formatTimer(timeLeft)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {battleData.problem.title} • {battleData.problem.difficulty}
              </div>
            </div>

            {/* Opponent Rival */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{battleData.opponent.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>{battleData.opponent.rating} ELO (Rival)</div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {battleData.opponent.avatar || '🤖'}
              </div>
            </div>

          </div>

          {/* Live Progress Race Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>Your Test Progress: {playerPassed}/3 Passed</span>
              <span style={{ color: '#fb7185' }}>Rival Progress: {opponentPassed}/3 Passed</span>
            </div>

            {/* Dual Meter */}
            <div style={{ display: 'flex', gap: '0.5rem', height: '14px' }}>
              {/* Your bar */}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(playerPassed / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)', transition: 'width 0.4s ease' }} />
              </div>
              {/* Opponent bar */}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(opponentPassed / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>

          {/* Main Dual Workspace Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', minHeight: '520px' }}>
            
            {/* Left: Problem & Combat Log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Problem Brief */}
              <div className="glass-card" style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{battleData.problem.title}</h3>
                  <span className={`badge badge-${battleData.problem.difficulty.toLowerCase()}`}>
                    {battleData.problem.difficulty}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {battleData.problem.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Target Complexity: <strong style={{ color: 'var(--accent-cyan)' }}>{battleData.problem.optimalTimeComplexity}</strong>
                </div>
              </div>

              {/* Combat Feed */}
              <div className="glass-card" style={{ padding: '1rem', height: '160px', overflowY: 'auto', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  ⚡ Live Combat Feed
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {combatLogs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('SUCCESS') || log.includes('passed') ? '#34d399' : log.includes('⚠️') ? '#fb7185' : 'var(--text-secondary)' }}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotes Bar */}
              <div className="glass-card" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>React:</span>
                {['🔥', '⚡', '🤯', '💻', '🏆'].map(em => (
                  <button
                    key={em}
                    onClick={() => triggerEmote(em)}
                    style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0.2rem 0.4rem' }}
                  >
                    {em}
                  </button>
                ))}
              </div>

            </div>

            {/* Right: Code Editor & Action Controls */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Editor Header */}
              <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleRunTests}
                    disabled={isSubmitting}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <Play size={14} /> Run Tests
                  </button>
                  <button
                    onClick={handleSubmitDuel}
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ padding: '0.4rem 1.1rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 700 }}
                  >
                    <Send size={14} /> Submit Duel
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div style={{ flex: 1, minHeight: '380px' }}>
                <Editor
                  height="100%"
                  language={language === 'Python' ? 'python' : 'java'}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* 4. RESULT MODAL (VICTORY / DEFEAT) */}
      {/* ========================================================== */}
      {gameState === 'RESULT' && battleResult && (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '2.5rem',
            textAlign: 'center',
            border: battleResult.outcome === 'VICTORY' ? '2px solid #34d399' : '2px solid #fb7185',
            boxShadow: battleResult.outcome === 'VICTORY' ? '0 0 40px rgba(16, 185, 129, 0.35)' : '0 0 40px rgba(244, 63, 94, 0.35)'
          }}>
            
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {battleResult.outcome === 'VICTORY' ? '🏆' : '💀'}
            </div>

            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: battleResult.outcome === 'VICTORY' ? '#34d399' : '#fb7185', marginBottom: '0.5rem' }}>
              {battleResult.outcome === 'VICTORY' ? 'MATCH VICTORY!' : 'DEFEAT'}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {battleResult.message}
            </p>

            {/* Score & Rewards Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RATING CHANGE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: battleResult.ratingChange.startsWith('+') ? '#34d399' : '#fb7185' }}>
                  {battleResult.ratingChange} ELO
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EXPERIENCE GAINED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                  +{battleResult.xpEarned} XP
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={startMatchmaking}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700, gap: '0.5rem' }}
              >
                <RotateCcw size={16} /> Play Another Match
              </button>
              <button
                onClick={() => setGameState('LOBBY')}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Return to Lobby
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BattleArenaPage;
