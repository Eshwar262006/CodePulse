import React, { useState } from 'react';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  GitFork, 
  ArrowRight,
  Zap,
  Box,
  Binary,
  GitGraph,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VisualizerPage = () => {
  const [activePattern, setActivePattern] = useState('TWO_POINTERS');

  const patterns = [
    {
      id: 'TWO_POINTERS',
      title: 'Two Pointers Technique',
      desc: 'Pointers start at opposite ends of a sorted array and converge toward the target sum in O(n) time.',
      time: 'O(n)',
      space: 'O(1)',
      icon: GitFork,
      target: 18,
      array: [2, 5, 8, 10, 13, 17, 24],
      whenToApply: 'Used whenever an array is sorted and you need to search pairs, find partitions, or shrink search boundaries without an expensive nested loop.',
      complexityDetail: 'Optimal Time: O(n) vs brute-force O(n²). Space Complexity remains O(1) auxiliary memory.',
      tag: 'Arrays & Two Pointers'
    },
    {
      id: 'BINARY_SEARCH',
      title: 'Binary Search (Logarithmic)',
      desc: 'Halves the search space at each step by comparing target against the middle element in O(log n).',
      time: 'O(log n)',
      space: 'O(1)',
      icon: Cpu,
      target: 23,
      array: [3, 9, 14, 19, 23, 31, 45, 60],
      whenToApply: 'Used when searching for values, peak elements, or monotonic boundaries in sorted datasets.',
      complexityDetail: 'Optimal Time: O(log n) eliminates half of candidates at each step. Space is O(1) iterative.',
      tag: 'Binary Search'
    },
    {
      id: 'BUBBLE_SORT',
      title: 'Sorting State Transformations',
      desc: 'Continuously steps through the list, compares adjacent elements and swaps them if out of order.',
      time: 'O(n²)',
      space: 'O(1)',
      icon: Layers,
      target: 0,
      array: [28, 12, 45, 8, 19, 34, 15],
      whenToApply: 'Fundamental for visualizing in-place state mutations, inversions, and stability in sorting comparisons.',
      complexityDetail: 'Average/Worst Time: O(n²). Space Complexity is O(1) auxiliary in-place memory.',
      tag: 'Sorting'
    },
    {
      id: 'LINKED_LIST_REVERSAL',
      title: 'Linked List Pointer Reversal',
      desc: 'Re-wires next node pointers in-place to reverse the list direction in a single linear pass.',
      time: 'O(n)',
      space: 'O(1)',
      icon: Zap,
      target: 0,
      array: [10, 20, 30, 40, 50],
      whenToApply: 'Essential for singly linked lists, cycle detection, partition re-wiring, and palindrome linked list problems.',
      complexityDetail: 'Optimal Time: O(n) visiting each node exactly once. Space is O(1) auxiliary with 3 pointers (prev, curr, next).',
      tag: 'Linked Lists'
    },
    {
      id: 'STACK_OPERATIONS',
      title: 'Stack & Valid Parentheses',
      desc: 'LIFO evaluation pushing opening symbols and popping matching pairs to validate bracket syntax.',
      time: 'O(n)',
      space: 'O(n)',
      icon: Box,
      target: 0,
      array: [1, 2, 3, 4],
      whenToApply: 'Ideal for nested expressions, monotonic stacks, bracket validations, backtracking state, and depth evaluations.',
      complexityDetail: 'Optimal Time: O(n) linear scan. Space Complexity is O(n) for stack memory in worst-case nested expressions.',
      tag: 'Stack & Queue'
    },
    {
      id: 'SLIDING_WINDOW',
      title: 'Sliding Window Subarray',
      desc: 'Maintains a dynamic or fixed-size window across continuous sub-elements to calculate rolling aggregates.',
      time: 'O(n)',
      space: 'O(1)',
      icon: Binary,
      target: 3,
      array: [2, 1, 5, 1, 3, 2, 8, 4],
      whenToApply: 'Used for continuous subarray/substring problems: max sum of size k, longest substring without repeats, minimum window substring.',
      complexityDetail: 'Optimal Time: O(n) rolling window avoids recalculating overlapping sums. Space is O(1) auxiliary.',
      tag: 'Sliding Window'
    },
    {
      id: 'TREE_TRAVERSAL',
      title: 'Tree BFS / Level-Order',
      desc: 'Explores binary tree hierarchies layer-by-layer using a FIFO queue structure with visited state tracking.',
      time: 'O(n)',
      space: 'O(w)',
      icon: GitGraph,
      target: 0,
      array: [1, 2, 3, 4, 5, 6, 7],
      whenToApply: 'Applied in shortest-path search in unweighted graphs, level-order tree traversal, and connected component exploration.',
      complexityDetail: 'Optimal Time: O(n) visiting all V vertices & E edges. Space is O(w) where w is max level width (queue capacity).',
      tag: 'Trees & Graphs'
    },
    {
      id: 'DYNAMIC_PROGRAMMING',
      title: 'DP 1D Tabulation',
      desc: 'Breaks problems into overlapping subproblems, building bottom-up memoized arrays to avoid redundant recursion.',
      time: 'O(n)',
      space: 'O(n)',
      icon: Sparkles,
      target: 6,
      array: [0, 1, 1, 2, 3, 5, 8],
      whenToApply: 'Used for optimal substructure & overlapping subproblems: Fibonacci, Climbing Stairs, House Robber, Coin Change.',
      complexityDetail: 'Optimal Time: O(n) bottom-up tabulation transforms exponential O(2ⁿ) recursion into linear O(n). Space: O(n) table.',
      tag: 'Dynamic Programming'
    },
    {
      id: 'GRAPH_GRID_BFS',
      title: '2D Grid & Graph BFS',
      desc: 'Explores matrix grids and connected components (Number of Islands, Flood Fill) layer by layer.',
      time: 'O(M×N)',
      space: 'O(M×N)',
      icon: Layers,
      target: 0,
      array: [1, 1, 0, 0],
      whenToApply: 'Used for matrix flood fills, shortest paths on grids, counting islands, and rotting oranges BFS.',
      complexityDetail: 'Optimal Time: O(M×N) visiting every cell once. Space is O(M×N) for queue and visited matrix.',
      tag: 'Graphs & 2D Grid'
    },
    {
      id: 'GREEDY_INTERVALS',
      title: 'Greedy Interval Reach',
      desc: 'Makes locally optimal decisions at each step to determine maximum boundary reach.',
      time: 'O(n)',
      space: 'O(1)',
      icon: Zap,
      target: 0,
      array: [2, 3, 1, 1, 4],
      whenToApply: 'Used in Jump Game, Gas Station, Task Scheduling, and non-overlapping interval calculations.',
      complexityDetail: 'Optimal Time: O(n) single scan updating max reachable index. Space: O(1) auxiliary.',
      tag: 'Greedy'
    },
    {
      id: 'STRINGS_HASHING',
      title: 'Strings & Hash Frequency',
      desc: 'Dual pointer character matching and hash frequency maps for anagrams and palindrome verification.',
      time: 'O(n)',
      space: 'O(1)',
      icon: GitFork,
      target: 0,
      array: [1, 2, 3, 2, 1],
      whenToApply: 'Used for palindrome validation, anagram grouping, and string pattern searching.',
      complexityDetail: 'Optimal Time: O(n) dual-pointer convergence. Space Complexity is O(1) constant auxiliary.',
      tag: 'Strings & Hashing'
    },
    {
      id: 'BIT_MANIPULATION',
      title: 'Bitwise XOR & Shifts',
      desc: 'Leverages bitwise XOR properties (a ^ a = 0) to isolate unique elements and bit counts in O(1) space.',
      time: 'O(n)',
      space: 'O(1)',
      icon: Binary,
      target: 0,
      array: [4, 1, 2, 1, 2],
      whenToApply: 'Used for Single Number, counting 1-bits, missing number detection, and power of two checks.',
      complexityDetail: 'Optimal Time: O(n) bitwise scan. Space Complexity is O(1) constant memory registers.',
      tag: 'Bit Manipulation'
    }
  ];

  const currentPattern = patterns.find(p => p.id === activePattern) || patterns[0];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            Algorithm Visualizer Studio
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '850px' }}>
          Watch core computer science data structures & algorithmic patterns transform in real-time. Step through two-pointer convergences, sliding windows, stack operations, tree BFS queues, and bottom-up DP tables with live step-by-step commentary.
        </p>
      </div>

      {/* Pattern Switcher Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem', marginBottom: '2.5rem' }}>
        {patterns.map((p) => {
          const Icon = p.icon;
          const isSelected = activePattern === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setActivePattern(p.id)}
              className="glass-card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isSelected ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={isSelected ? '#000' : 'var(--accent-cyan)'} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {p.time}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {p.space}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                  {p.desc}
                </p>
              </div>

              <div style={{ marginTop: '0.85rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.tag}</span>
                {isSelected && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    Active <CheckCircle2 size={12} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Visualizer */}
      <div style={{ marginBottom: '3rem' }}>
        <AlgorithmVisualizer
          key={currentPattern.id}
          initialAlgorithm={currentPattern.id}
          customTarget={currentPattern.target}
          customArray={currentPattern.array}
        />
      </div>

      {/* Educational Explanations & Quick Links */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            🧠 Core Pattern Intuition: {currentPattern.title}
          </h2>
          <Link to={`/problems?topic=${encodeURIComponent(currentPattern.tag)}`} className="btn-secondary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}>
            Practice {currentPattern.tag} Problems <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> When to Apply
            </h4>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              {currentPattern.whenToApply}
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" /> Complexity Analysis
            </h4>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              {currentPattern.complexityDetail}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VisualizerPage;
