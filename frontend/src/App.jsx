import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistantWidget from './components/AiAssistantWidget';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProblemLibraryPage from './pages/ProblemLibraryPage';
import CodeEditorPage from './pages/CodeEditorPage';
import MySkillsPage from './pages/MySkillsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DailyChallengePage from './pages/DailyChallengePage';
import RoadmapPage from './pages/RoadmapPage';
import SubmissionHistoryPage from './pages/SubmissionHistoryPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import VisualizerPage from './pages/VisualizerPage';
import BattleArenaPage from './pages/BattleArenaPage';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('codepulse_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('codepulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/problems" element={<ProblemLibraryPage />} />
              <Route path="/visualizer" element={<VisualizerPage />} />

              {/* Protected Student Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/problem/:id" element={<ProtectedRoute><CodeEditorPage /></ProtectedRoute>} />
              <Route path="/arena" element={<ProtectedRoute><BattleArenaPage /></ProtectedRoute>} />
              <Route path="/skills" element={<ProtectedRoute><MySkillsPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/challenge" element={<ProtectedRoute><DailyChallengePage /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
              <Route path="/submissions" element={<ProtectedRoute><SubmissionHistoryPage /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Protected Admin Route */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <AiAssistantWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
