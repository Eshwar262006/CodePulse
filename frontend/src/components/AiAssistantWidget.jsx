import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Zap, 
  HelpCircle, 
  Code, 
  Lightbulb,
  Bug,
  ChevronDown,
  Terminal,
  RotateCcw
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { name: 'Java', icon: '☕', color: '#f59e0b' },
  { name: 'Python', icon: '🐍', color: '#3b82f6' },
  { name: 'C++', icon: '⚡', color: '#06b6d4' },
  { name: 'JavaScript', icon: '🌐', color: '#eab308' },
  { name: 'TypeScript', icon: '🔷', color: '#6366f1' },
  { name: 'Go', icon: '🐹', color: '#10b981' },
  { name: 'Rust', icon: '🦀', color: '#f97316' },
  { name: 'C#', icon: '🎯', color: '#a855f7' },
  { name: 'PHP', icon: '🐘', color: '#8b5cf6' },
  { name: 'Ruby', icon: '💎', color: '#ef4444' },
  { name: 'SQL', icon: '🗄️', color: '#14b8a6' }
];

const AiAssistantWidget = ({ context = null }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState(() => context?.language || user?.preferredLanguage || 'Java');
  const [pendingPrompt, setPendingPrompt] = useState(null);

  useEffect(() => {
    if (context?.language) {
      setActiveLang(context.language);
    } else if (user?.preferredLanguage) {
      setActiveLang(user.preferredLanguage);
    }
  }, [context?.language, user?.preferredLanguage]);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your **CodePulse AI Mentor** 🚀\n\nAsk me anything about algorithmic complexity, debugging, data structures, or code solutions in your preferred language (${user?.preferredLanguage || 'Java'})!`,
      hint: null,
      codeSnippet: null,
      topic: 'Welcome'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const wantsCode = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      lower.contains?.('write') || lower.includes('write') ||
      lower.includes('code') || lower.includes('implement') ||
      lower.includes('create') || lower.includes('generate') ||
      lower.includes('build') || lower.includes('function') ||
      lower.includes('show me') || lower.includes('example') ||
      lower.includes('snippet') || lower.includes('syntax') ||
      lower.includes('sample') || lower.includes('solution')
    );
  };

  const hasLanguageInText = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      lower.includes('python') || lower.includes('typescript') ||
      lower.includes('javascript') || lower.includes(' js') ||
      lower.includes('kotlin') || lower.includes('swift') ||
      lower.includes('go ') || lower.includes('golang') ||
      lower.includes('rust') || lower.includes('c#') || lower.includes('csharp') ||
      lower.includes('c++') || lower.includes('cpp') ||
      lower.includes('php') || lower.includes('ruby') ||
      lower.includes('sql') || (lower.includes('java') && !lower.includes('javascript'))
    );
  };

  const isLanguageChoiceInput = (text) => {
    if (!text) return null;
    const lower = text.trim().toLowerCase();
    const match = SUPPORTED_LANGUAGES.find(
      lang => lang.name.toLowerCase() === lower || 
              (lang.name === 'C++' && (lower === 'cpp' || lower === 'c plus plus')) ||
              (lang.name === 'JavaScript' && lower === 'js') ||
              (lang.name === 'TypeScript' && lower === 'ts') ||
              (lang.name === 'C#' && (lower === 'csharp' || lower === 'c sharp'))
    );
    return match ? match.name : null;
  };

  const handleSend = async (customText = null, explicitLanguage = null) => {
    const rawText = customText || inputMsg;
    if (!rawText.trim() || loading) return;

    let textToSend = rawText.trim();
    let languageToSend = explicitLanguage || activeLang || 'Java';

    // Check if the user typed just a language name in response to a pending prompt
    const detectedLangChoice = isLanguageChoiceInput(textToSend);
    if (detectedLangChoice) {
      languageToSend = detectedLangChoice;
      setActiveLang(detectedLangChoice);
      if (pendingPrompt) {
        textToSend = `${pendingPrompt} in ${detectedLangChoice}`;
        setPendingPrompt(null);
      }
    }

    const userMessage = { 
      sender: 'user', 
      text: explicitLanguage ? `${explicitLanguage} (for: "${rawText}")` : rawText 
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputMsg('');
    setLoading(true);

    try {
      const payload = {
        message: textToSend,
        problemId: context?.problemId || null,
        problemTitle: context?.problemTitle || null,
        language: languageToSend,
        code: context?.code || null,
        executionStatus: context?.executionStatus || null,
        errorLog: context?.errorLog || null
      };

      const res = await api.post('/ai/chat', payload);
      const data = res.data;

      const aiMessage = {
        sender: 'ai',
        text: data.reply,
        hint: data.hint,
        codeSnippet: data.codeSnippet,
        topic: data.topic,
        isLanguagePrompt: data.topic === 'Choose Language' || data.reply?.includes('Which programming language would you like')
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'ai', 
          text: "Sorry, I ran into an issue connecting to the AI Assistant service. Please try again.",
          topic: 'Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLanguage = (langName) => {
    setActiveLang(langName);
    const prompt = pendingPrompt || context?.problemTitle || "Solution code";
    setPendingPrompt(null);
    handleSend(prompt, langName);
  };

  const handleQuickPrompt = (promptText) => {
    handleSend(promptText);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            right: '1.75rem',
            zIndex: 999,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.85rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
            transition: 'all 0.25s ease'
          }}
          className="animate-pulse-glow"
        >
          <Sparkles size={20} />
          <span>AI Mentor</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '450px',
            maxWidth: 'calc(100vw - 3rem)',
            height: '620px',
            maxHeight: 'calc(100vh - 3.5rem)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#0c1019',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            borderRadius: '16px'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  CodePulse AI Mentor
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.3)', color: '#67e8f9', border: '1px solid rgba(6, 182, 212, 0.5)', fontWeight: 700 }}>
                    ⚡ {activeLang}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
                  {context?.problemTitle ? `Problem: ${context.problemTitle}` : `Auto-configured to ${activeLang}`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '6px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div style={{ padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.4rem', overflowX: 'auto', fontSize: '0.75rem' }}>
            <button
              onClick={() => handleQuickPrompt("Explain the time complexity for my current solution.")}
              style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa', padding: '0.3rem 0.65rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Lightbulb size={12} /> Complexity
            </button>

            <button
              onClick={() => handleQuickPrompt("Can you give me a hint for this problem without spoiling the answer?")}
              style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#22d3ee', padding: '0.3rem 0.65rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Sparkles size={12} /> Give Hint
            </button>

            <button
              onClick={() => handleQuickPrompt("Help me debug why my test cases failed.")}
              style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', padding: '0.3rem 0.65rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Bug size={12} /> Debug Error
            </button>

            <button
              onClick={() => handleQuickPrompt("Write an optimal solution")}
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.3rem 0.65rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Code size={12} /> Write Code
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, idx) => {
              const isLangPrompt = m.isLanguagePrompt || m.topic === 'Choose Language' || m.text?.includes('Which programming language would you like');

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.35rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      gap: '0.5rem',
                      width: '100%'
                    }}
                  >
                    {m.sender === 'ai' && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: m.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
                        border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {m.text}

                      {m.hint && (
                        <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.8rem', color: '#67e8f9' }}>
                          💡 <strong>Hint:</strong> {m.hint}
                        </div>
                      )}

                      {m.codeSnippet && (
                        <pre style={{ marginTop: '0.6rem', padding: '0.6rem', background: '#070a10', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#34d399', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                          {m.codeSnippet}
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* Interactive Language Selector Pills when AI asks for preferred language */}
                  {isLangPrompt && m.sender === 'ai' && (
                    <div 
                      style={{ 
                        marginLeft: '2.2rem', 
                        marginTop: '0.2rem', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.4rem', 
                        maxWidth: '85%',
                        background: 'rgba(139, 92, 246, 0.08)',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        border: '1px dashed rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <div style={{ width: '100%', fontSize: '0.72rem', color: '#c4b5fd', fontWeight: 600, marginBottom: '0.2rem' }}>
                        👉 Select language for this code:
                      </div>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.name}
                          onClick={() => handleSelectLanguage(lang.name)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: `1px solid ${lang.color}55`,
                            color: '#fff',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${lang.color}25`;
                            e.currentTarget.style.borderColor = lang.color;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.borderColor = `${lang.color}55`;
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <span>{lang.icon}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                <Bot size={16} color="#8b5cf6" className="animate-spin" />
                <span>CodePulse AI is formulating your answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Prompt Indicator if active */}
          {pendingPrompt && (
            <div style={{ padding: '0.35rem 1rem', background: 'rgba(139, 92, 246, 0.15)', borderTop: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#c4b5fd' }}>
              <span>Awaiting language choice for: <em>"{pendingPrompt.length > 25 ? pendingPrompt.slice(0, 25) + '...' : pendingPrompt}"</em></span>
              <button 
                onClick={() => setPendingPrompt(null)}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={pendingPrompt ? "Type language (e.g. Python, Java, C++)..." : "Ask AI Mentor a coding question..."}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: pendingPrompt ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (!inputMsg.trim() || loading) ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AiAssistantWidget;
