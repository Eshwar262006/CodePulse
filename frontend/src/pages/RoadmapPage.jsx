import React from 'react';
import { CheckCircle2, Circle, ArrowDown, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const RoadmapPage = () => {
  const steps = [
    { title: 'Programming Basics', status: 'completed', description: 'Variables, Loops, Functions, Conditional Logic', count: '12 Solved' },
    { title: 'Arrays & Two Pointers', status: 'completed', description: 'Fixed Size Arrays, In-place Swapping, Subarray Sums', count: '28 Solved' },
    { title: 'Strings & Pattern Matching', status: 'completed', description: 'Palindromes, Anagrams, Substrings, Regex Parsing', count: '19 Solved' },
    { title: 'Searching & Binary Search', status: 'completed', description: 'Logarithmic Search, Upper/Lower Bounds, Matrix Search', count: '14 Solved' },
    { title: 'Linked Lists & Hashing', status: 'current', description: 'Pointers, Reversing, Fast/Slow Pointers, Hash Table Lookups', count: '8 Solved (In Progress)' },
    { title: 'Trees & Recursion', status: 'upcoming', description: 'Binary Search Trees, Depth First Search, Traversals', count: '0/15 Solved' },
    { title: 'Graphs & BFS/DFS', status: 'upcoming', description: 'Adjacency Lists, Shortest Path, Topological Sorting', count: '0/12 Solved' },
    { title: 'Dynamic Programming', status: 'upcoming', description: 'Memoization, Tabulation, Knapsack, Coin Change', count: '0/20 Solved' }
  ];

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Personalized Learning Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Structured step-by-step path automatically adjusted based on your performance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={idx} style={{ position: 'relative' }}>
              <div 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderLeft: isCompleted ? '4px solid #10b981' : isCurrent ? '4px solid #06b6d4' : '4px solid var(--border-color)',
                  background: isCurrent ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div>
                    {isCompleted ? (
                      <CheckCircle2 size={26} color="#10b981" />
                    ) : isCurrent ? (
                      <MapPin size={26} color="#06b6d4" className="animate-pulse-glow" />
                    ) : (
                      <Circle size={26} color="var(--text-muted)" />
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      {step.description}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    padding: '0.3rem 0.75rem', 
                    borderRadius: '9999px',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isCurrent ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: isCompleted ? '#34d399' : isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)'
                  }}>
                    {step.count}
                  </span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div style={{ textAlign: 'center', margin: '0.4rem 0', opacity: 0.3 }}>
                  <ArrowDown size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RoadmapPage;
