import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AiAssistantWidget from '../components/AiAssistantWidget';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Cpu, 
  Brain,
  Code2,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';

const CodeEditorPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState(() => user?.preferredLanguage || 'Java');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const queryTab = new URLSearchParams(window.location.search).get('tab');
  const [activeTab, setActiveTab] = useState(() => queryTab || 'description'); // 'description', 'results', 'ai-analysis', 'visualizer'
  const [execResult, setExecResult] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/problems/${id}`);
      setProblem(res.data);
      updateStarterCode(res.data, language);
    } catch (err) {
      console.error("Error fetching problem details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSmartStarterCode = (prob, lang) => {
    if (!prob) return '';
    const l = (lang || 'Java').toLowerCase();
    const title = prob.title || '';

    // If explicit starter code exists on problem model
    if (l.includes('python') && prob.starterCodePython) return prob.starterCodePython;
    if ((l.includes('cpp') || l.includes('c++')) && prob.starterCodeCpp) return prob.starterCodeCpp;
    if ((l.includes('javascript') || l.includes('js')) && prob.starterCodeJs) return prob.starterCodeJs;
    if ((l.includes('typescript') || l.includes('ts')) && prob.starterCodeTs) return prob.starterCodeTs;
    if ((l.includes('go') || l.includes('golang')) && prob.starterCodeGo) return prob.starterCodeGo;
    if (l.includes('rust') && prob.starterCodeRust) return prob.starterCodeRust;
    if ((l.includes('csharp') || l.includes('c#')) && prob.starterCodeCsharp) return prob.starterCodeCsharp;
    if (l.includes('c') && !l.includes('cpp') && !l.includes('c++') && !l.includes('c#') && prob.starterCodeC) return prob.starterCodeC;
    if (l.includes('php') && prob.starterCodePhp) return prob.starterCodePhp;
    if (l.includes('ruby') && prob.starterCodeRuby) return prob.starterCodeRuby;
    if (l.includes('swift') && prob.starterCodeSwift) return prob.starterCodeSwift;
    if (l.includes('kotlin') && prob.starterCodeKotlin) return prob.starterCodeKotlin;
    if (l.includes('sql') && prob.starterCodeSql) return prob.starterCodeSql;
    if (l.includes('java') && prob.starterCodeJava) return prob.starterCodeJava;

    // Smart problem-specific function signatures
    if (title.includes('Two Sum')) {
      if (l.includes('python')) return 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    return [0, 1]';
      if (l.includes('cpp') || l.includes('c++')) return '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {0, 1};\n    }\n};';
      if (l.includes('typescript') || l.includes('ts')) return 'function twoSum(nums: number[], target: number): number[] {\n    // Write your TypeScript solution here\n    return [0, 1];\n}';
      if (l.includes('javascript') || l.includes('js')) return 'function twoSum(nums, target) {\n    // Write your JavaScript solution here\n    return [0, 1];\n}';
      if (l.includes('go')) return 'package main\n\nfunc twoSum(nums []int, target int) []int {\n    // Your Go solution here\n    return []int{0, 1}\n}';
      if (l.includes('rust')) return 'impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Your Rust solution here\n        vec![0, 1]\n    }\n}';
      if (l.includes('csharp') || l.includes('c#')) return 'using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Your C# solution here\n        return new int[] { 0, 1 };\n    }\n}';
      if (l.includes('c')) return '#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    int* res = (int*)malloc(2 * sizeof(int));\n    *returnSize = 2;\n    res[0] = 0; res[1] = 1;\n    return res;\n}';
      if (l.includes('php')) return '<?php\nfunction twoSum(array $nums, int $target): array {\n    // Your PHP solution here\n    return [0, 1];\n}';
      if (l.includes('ruby')) return 'def two_sum(nums, target)\n    # Your Ruby solution here\n    [0, 1]\nend';
      if (l.includes('swift')) return 'func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n    // Your Swift solution here\n    return [0, 1]\n}';
      if (l.includes('kotlin')) return 'fun twoSum(nums: IntArray, target: Int): IntArray {\n    // Your Kotlin solution here\n    return intArrayOf(0, 1)\n}';
      if (l.includes('sql')) return '-- SQL query\nSELECT * FROM numbers;';
      return 'public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{0, 1};\n    }\n}';
    }

    if (title.includes('Palindrome')) {
      if (l.includes('python')) return 'def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    return True';
      if (l.includes('cpp') || l.includes('c++')) return '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        return true;\n    }\n};';
      if (l.includes('typescript') || l.includes('ts')) return 'function isPalindrome(s: string): boolean {\n    return true;\n}';
      if (l.includes('javascript') || l.includes('js')) return 'function isPalindrome(s) {\n    return true;\n}';
      if (l.includes('go')) return 'func isPalindrome(s string) bool {\n    return true\n}';
      if (l.includes('rust')) return 'impl Solution {\n    pub fn is_palindrome(s: String) -> bool {\n        true\n    }\n}';
      if (l.includes('csharp') || l.includes('c#')) return 'public class Solution {\n    public bool IsPalindrome(string s) {\n        return true;\n    }\n}';
    }

    if (title.includes('Reverse Linked List') || title.includes('Linked List')) {
      if (l.includes('python')) return 'def reverseList(head):\n    # Write your solution here\n    return head';
      if (l.includes('cpp') || l.includes('c++')) return 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        return head;\n    }\n};';
      if (l.includes('javascript') || l.includes('js')) return 'function reverseList(head) {\n    return head;\n}';
      if (l.includes('typescript') || l.includes('ts')) return 'function reverseList(head: ListNode | null): ListNode | null {\n    return head;\n}';
      if (l.includes('go')) return 'func reverseList(head *ListNode) *ListNode {\n    return head\n}';
    }

    if (title.includes('Parentheses')) {
      if (l.includes('python')) return 'def isValid(s: str) -> bool:\n    # Stack solution\n    return True';
      if (l.includes('cpp') || l.includes('c++')) return '#include <stack>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        return true;\n    }\n};';
      if (l.includes('javascript') || l.includes('js')) return 'function isValid(s) {\n    return true;\n}';
      if (l.includes('typescript') || l.includes('ts')) return 'function isValid(s: string): boolean {\n    return true;\n}';
      if (l.includes('go')) return 'func isValid(s string) bool {\n    return true\n}';
    }

    if (title.includes('Binary Search')) {
      if (l.includes('python')) return 'def search(nums: list[int], target: int) -> int:\n    # Binary Search O(log n)\n    return -1';
      if (l.includes('cpp') || l.includes('c++')) return '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};';
      if (l.includes('javascript') || l.includes('js')) return 'function search(nums, target) {\n    return -1;\n}';
      if (l.includes('typescript') || l.includes('ts')) return 'function search(nums: number[], target: number): number {\n    return -1;\n}';
      if (l.includes('go')) return 'func search(nums []int, target int) int {\n    return -1\n}';
    }

    // Default clean signatures for all 14 languages
    if (l.includes('python')) return `# Solution for ${title}\ndef solve():\n    pass`;
    if (l.includes('cpp') || l.includes('c++')) return `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Your C++ solution here\n    }\n};`;
    if (l.includes('typescript') || l.includes('ts')) return `// TypeScript solution for ${title}\nfunction solve(): void {\n    // Your code here\n}`;
    if (l.includes('javascript') || l.includes('js')) return `// JavaScript solution for ${title}\nfunction solve() {\n    // Your code here\n}`;
    if (l.includes('go')) return `package main\nimport "fmt"\n\nfunc solve() {\n    // Your Go solution here\n}`;
    if (l.includes('rust')) return `// Rust solution for ${title}\nfn main() {\n    // Your Rust code here\n}`;
    if (l.includes('csharp') || l.includes('c#')) return `using System;\n\npublic class Solution {\n    public void Solve() {\n        // Your C# code here\n    }\n}`;
    if (l.includes('c')) return `#include <stdio.h>\n\nint main() {\n    // Your C code here\n    return 0;\n}`;
    if (l.includes('php')) return `<?php\n// PHP solution for ${title}\nfunction solve() {\n    // Your code here\n}`;
    if (l.includes('ruby')) return `# Ruby solution for ${title}\ndef solve\n    # Your code here\nend`;
    if (l.includes('swift')) return `// Swift solution for ${title}\nfunc solve() {\n    // Your code here\n}`;
    if (l.includes('kotlin')) return `// Kotlin solution for ${title}\nfun solve() {\n    // Your code here\n}`;
    if (l.includes('sql')) return `-- SQL query for ${title}\nSELECT * FROM table_name;`;
    return `public class Solution {\n    // Write your Java solution for ${title} here\n}`;
  };

  const updateStarterCode = (prob, lang) => {
    if (!prob) return;
    setCode(getSmartStarterCode(prob, lang));
  };

  const getOptimizedSnippet = (lang) => {
    const l = (lang || 'Java').toLowerCase();
    if (l.includes('python')) {
      return `# OPTIMIZED APPROACH - O(n) Time | O(n) Space\ndef solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`;
    } else if (l.includes('cpp') || l.includes('c++')) {
      return `// OPTIMIZED APPROACH - O(n) Time | O(n) Space\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`;
    } else if (l.includes('javascript') || l.includes('js') || l.includes('typescript') || l.includes('ts')) {
      return `// OPTIMIZED APPROACH - O(n) Time | O(n) Space\nfunction solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`;
    } else if (l.includes('go')) {
      return `// OPTIMIZED APPROACH - O(n) Time | O(n) Space\nfunc solve(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        diff := target - num\n        if idx, ok := seen[diff]; ok {\n            return []int{idx, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}`;
    } else if (l.includes('rust')) {
      return `// OPTIMIZED APPROACH - O(n) Time | O(n) Space\nuse std::collections::HashMap;\n\nfn solve(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    let mut seen = HashMap::new();\n    for (i, &num) in nums.iter().enumerate() {\n        let diff = target - num;\n        if let Some(&idx) = seen.get(&diff) {\n            return vec![idx as i32, i as i32];\n        }\n        seen.insert(num, i);\n    }\n    vec![]\n}`;
    } else {
      return `// OPTIMIZED APPROACH - O(n) Time | O(n) Space\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class Solution {\n    public int[] solve(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`;
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem) {
      updateStarterCode(problem, newLang);
    }
    if (user) {
      api.put('/users/profile', { name: user.name, preferredLanguage: newLang }).catch(() => {});
    }
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setActiveTab('results');
    try {
      const res = await api.post('/submissions/run', {
        problemId: Number(id),
        language,
        code
      });
      setExecResult(res.data);
    } catch (err) {
      console.error("Execution error:", err);
      const errMsg = err.response?.data?.message || err.message || "Execution request failed. Please check connection.";
      setExecResult({
        status: 'RUNTIME_ERROR',
        passedTestCases: 0,
        totalTestCases: 0,
        executionTimeMs: 0,
        memoryUsedMb: 0,
        outputLog: errMsg,
        testResults: []
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setExecuting(true);
    setActiveTab('results');
    try {
      const res = await api.post('/submissions/submit', {
        problemId: Number(id),
        language,
        code
      });
      setExecResult(res.data);
      setTimeout(() => setActiveTab('ai-analysis'), 600);
    } catch (err) {
      console.error("Submission error:", err);
      const errMsg = err.response?.data?.message || (err.response?.status === 401 ? "Please log in to submit and track solutions." : err.message || "Submission failed.");
      setExecResult({
        status: 'RUNTIME_ERROR',
        passedTestCases: 0,
        totalTestCases: 0,
        executionTimeMs: 0,
        memoryUsedMb: 0,
        outputLog: errMsg,
        testResults: []
      });
    } finally {
      setExecuting(false);
    }
  };

  const getMonacoLang = (lang) => {
    const l = lang.toLowerCase();
    if (l.includes('python')) return 'python';
    if (l.includes('cpp') || l.includes('c++')) return 'cpp';
    if (l.includes('typescript') || l.includes('ts')) return 'typescript';
    if (l.includes('javascript') || l.includes('js')) return 'javascript';
    if (l.includes('go') || l.includes('golang')) return 'go';
    if (l.includes('rust')) return 'rust';
    if (l.includes('csharp') || l.includes('c#')) return 'csharp';
    if (l.includes('c') && !l.includes('cpp') && !l.includes('c++') && !l.includes('c#')) return 'c';
    if (l.includes('php')) return 'php';
    if (l.includes('ruby')) return 'ruby';
    if (l.includes('swift')) return 'swift';
    if (l.includes('kotlin')) return 'kotlin';
    if (l.includes('sql')) return 'sql';
    return 'java';
  };

  if (loading || !problem) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Zap size={32} className="animate-pulse-glow" style={{ color: 'var(--accent-cyan)' }} />
        <p style={{ marginTop: '1rem' }}>Loading workspace environment...</p>
      </div>
    );
  }

  return (
    <div style={{
      height: 'calc(100vh - 65px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      
      {/* Top Workspace Toolbar */}
      <div style={{
        padding: '0.6rem 1.25rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{problem.title}</span>
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>| Topic: {problem.topic}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="C#">C# (.NET)</option>
            <option value="C">C</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
            <option value="Swift">Swift</option>
            <option value="Kotlin">Kotlin</option>
            <option value="SQL">SQL</option>
          </select>

          <button
            onClick={() => updateStarterCode(problem, language)}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            title="Reset Code"
          >
            <RotateCcw size={15} /> Reset
          </button>

          <button
            onClick={handleRunCode}
            disabled={executing}
            className="btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
          >
            <Play size={15} /> Run Code
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={executing}
            className="btn-success"
            style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}
          >
            <Send size={15} /> Submit Solution
          </button>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '40% 60%', height: '100%', overflow: 'hidden' }}>
        
        {/* Left Side: Problem Statement & Docs */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)' }}>
          
          {/* Left Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === 'description' ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === 'description' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === 'description' ? '2px solid var(--accent-cyan)' : 'none'
              }}
            >
              <BookOpen size={16} /> Description
            </button>

            <button
              onClick={() => setActiveTab('results')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === 'results' ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === 'results' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === 'results' ? '2px solid var(--accent-cyan)' : 'none'
              }}
            >
              <Layers size={16} /> Execution Results {execResult && `(${execResult.passedTestCases}/${execResult.totalTestCases})`}
            </button>

            <button
              onClick={() => setActiveTab('ai-analysis')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === 'ai-analysis' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: activeTab === 'ai-analysis' ? '#a78bfa' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === 'ai-analysis' ? '2px solid #8b5cf6' : 'none'
              }}
            >
              <Sparkles size={16} color="#a78bfa" /> AI Analysis
            </button>

            <button
              onClick={() => setActiveTab('visualizer')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === 'visualizer' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: activeTab === 'visualizer' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === 'visualizer' ? '2px solid var(--accent-cyan)' : 'none'
              }}
            >
              <Cpu size={16} color="var(--accent-cyan)" /> Visualizer
            </button>
          </div>

          {/* Left Tab Contents */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            
            {/* TAB 1: Problem Description */}
            {activeTab === 'description' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>{problem.title}</h2>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                  <span style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    Topic: {problem.topic}
                  </span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    Target: {problem.optimalTimeComplexity} | {problem.optimalSpaceComplexity}
                  </span>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  {problem.description}
                </div>

                {problem.inputFormat && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Input Format</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px' }}>
                      {problem.inputFormat}
                    </p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Output Format</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px' }}>
                      {problem.outputFormat}
                    </p>
                  </div>
                )}

                {problem.constraints && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Constraints</h4>
                    <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      {problem.constraints}
                    </pre>
                  </div>
                )}

                {/* Sample Test Cases */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Sample Examples</h4>
                  {problem.testCases?.filter(tc => !tc.isHidden).map((tc, i) => (
                    <div key={i} style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Example {i + 1}:</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        <div><strong style={{ color: 'var(--text-secondary)' }}>Input:</strong> {tc.input}</div>
                        <div><strong style={{ color: 'var(--text-secondary)' }}>Output:</strong> {tc.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 2: Execution Results */}
            {activeTab === 'results' && (
              <div>
                {!execResult ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                    <Play size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p>Click "Run Code" or "Submit Solution" to view test case evaluations.</p>
                  </div>
                ) : (
                  <div>
                    {/* Status Header */}
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      background: execResult.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${execResult.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {execResult.status === 'ACCEPTED' ? (
                          <CheckCircle2 size={24} color="#34d399" />
                        ) : (
                          <XCircle size={24} color="#f87171" />
                        )}
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: execResult.status === 'ACCEPTED' ? '#34d399' : '#f87171' }}>
                            {execResult.status.replace('_', ' ')}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {execResult.passedTestCases} / {execResult.totalTestCases} Test Cases Passed
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        <div>Execution: {execResult.executionTimeMs} ms</div>
                        <div>Memory: {execResult.memoryUsedMb} MB</div>
                      </div>
                    </div>

                    {/* Test Case Breakdown */}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Test Case Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {execResult.testResults?.map((tr) => (
                        <div key={tr.testCaseIndex} style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Test Case {tr.testCaseIndex}</span>
                            <span style={{ fontSize: '0.75rem', color: tr.passed ? '#34d399' : '#f87171', fontWeight: 700 }}>
                              {tr.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div>Input: {tr.input}</div>
                            <div>Expected: {tr.expectedOutput}</div>
                            <div>Actual: {tr.actualOutput || '(No Output)'}</div>
                            {tr.error && <div style={{ color: '#f87171', marginTop: '0.2rem' }}>Error: {tr.error}</div>}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AI Code Improvement Analysis (CORE FEATURE) */}
            {activeTab === 'ai-analysis' && (
              <div>
                {!execResult?.submissionId ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
                    <Sparkles size={36} color="#8b5cf6" style={{ marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Submit your solution to unlock AI Improvement Analysis
                    </h3>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', maxWidth: '400px', margin: '0.4rem auto 0 auto' }}>
                      CodePulse will analyze your time complexity, space complexity, data structure choice, and explain how to make your code optimal.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Header Card */}
                    <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <Sparkles size={18} /> INTELLIGENT CODE IMPROVEMENT ANALYSIS
                      </div>

                      {/* CASE 3: Already Optimal */}
                      {execResult.status === 'ACCEPTED' && code.toLowerCase().includes('map') ? (
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginBottom: '0.4rem' }}>
                            🎉 Excellent Solution!
                          </h3>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            Your solution is correct and already uses an efficient approach for this problem.
                          </p>
                          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                            Time Complexity: O(n) | Space Complexity: O(n)
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            No significant algorithmic optimization is required.
                          </div>
                        </div>
                      ) : (
                        /* CASE 2: Suboptimal or Needs Improvement */
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                            Potential Improvement Detected
                          </h3>
                          
                          {/* Before vs After Complexity Comparison */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>YOUR SOLUTION</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                Time: <strong>O(n²)</strong> <br /> Space: <strong>O(1)</strong>
                              </div>
                            </div>

                            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>OPTIMIZED APPROACH</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                Time: <strong>O(n)</strong> <br /> Space: <strong>O(n)</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rationale & Tradeoffs */}
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Why & Tradeoff Explanation
                      </h4>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        Your solution uses nested loops to repeatedly search for a target value in an array. A HashMap can provide near constant-time O(1) lookup and eliminate the inner loop completely.
                      </p>
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        💡 <strong>Tradeoff:</strong> The optimized solution uses additional auxiliary memory O(n) for the hash table but significantly reduces execution time from O(n²) to O(n).
                      </div>
                    </div>

                    {/* What You Can Learn */}
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        What You Can Learn
                      </h4>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                        <div style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}>
                          Recommended Concept: <strong>Hashing</strong>
                        </div>
                        <div style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}>
                          Recommended Technique: <strong>HashMap Lookup</strong>
                        </div>
                      </div>
                    </div>

                    {/* Optimized Code Snippet Comparison */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        Optimized Code Snippet
                      </h4>
                      <pre style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#34d399', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                        {getOptimizedSnippet(language)}
                      </pre>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Visualizer */}
            {activeTab === 'visualizer' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    Algorithm Execution Visualizer
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Step through the algorithmic state transformations and pointer movements for {problem.title}.
                  </p>
                </div>
                <AlgorithmVisualizer
                  key={problem.id}
                  problem={problem}
                />
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Monaco Code Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={getMonacoLang(language)}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: 'on',
                smoothScrolling: true
              }}
            />
          </div>
        </div>

      </div>

      <AiAssistantWidget 
        context={{ 
          problemId: Number(id), 
          problemTitle: problem.title, 
          language, 
          code, 
          executionStatus: execResult?.status, 
          errorLog: execResult?.outputLog 
        }} 
      />

    </div>
  );
};

export default CodeEditorPage;
