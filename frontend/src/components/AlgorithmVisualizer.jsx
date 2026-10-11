import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Layers, 
  Sparkles, 
  Sliders, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  GitFork, 
  Cpu, 
  Zap, 
  Box, 
  Binary, 
  GitGraph, 
  Grid, 
  TrendingUp, 
  Terminal, 
  Code2, 
  AlertCircle 
} from 'lucide-react';

const AlgorithmVisualizer = ({ 
  problem = null, 
  initialAlgorithm = 'TWO_POINTERS', 
  customTarget = 9, 
  customArray = [2, 7, 11, 15, 18, 22, 29] 
}) => {
  // Determine smart default algorithm based on problem topic / title
  const getSmartAlgorithm = () => {
    if (problem) {
      const topic = (problem.topic || '').toLowerCase();
      const title = (problem.title || '').toLowerCase();

      if (title.includes('island') || title.includes('rotting') || title.includes('grid') || topic.includes('graph')) return 'GRAPH_GRID_BFS';
      if (title.includes('jump') || topic.includes('greedy')) return 'GREEDY_INTERVALS';
      if (title.includes('bit') || title.includes('single number') || title.includes('counting bits')) return 'BIT_MANIPULATION';
      if (topic.includes('string') || topic.includes('hash') || title.includes('anagram') || title.includes('palindrome')) return 'STRINGS_HASHING';
      if (topic.includes('searching') || title.includes('search') || title.includes('peak')) return 'BINARY_SEARCH';
      if (topic.includes('linked') || title.includes('list')) return 'LINKED_LIST_REVERSAL';
      if (topic.includes('sorting') || title.includes('sort') || title.includes('interval')) return 'BUBBLE_SORT';
      if (topic.includes('stack') || topic.includes('queue') || title.includes('parentheses') || title.includes('temperatures')) return 'STACK_OPERATIONS';
      if (title.includes('window') || title.includes('subarray')) return 'SLIDING_WINDOW';
      if (topic.includes('tree')) return 'TREE_TRAVERSAL';
      if (topic.includes('dynamic') || topic.includes('dp') || title.includes('climb') || title.includes('coin') || title.includes('rob')) return 'DYNAMIC_PROGRAMMING';
    }
    return initialAlgorithm;
  };

  const [algorithm, setAlgorithm] = useState(getSmartAlgorithm);
  const [viewMode, setViewMode] = useState('DS_ANIMATION'); // 'DS_ANIMATION' or 'CODE_TRACER'

  // Default custom inputs tailored per algorithm
  const getDefaultInputForAlgo = (algo) => {
    if (algo === 'STRINGS_HASHING') return 'racecar';
    if (algo === 'STACK_OPERATIONS') return '({[]})';
    if (algo === 'GREEDY_INTERVALS') return '2, 3, 1, 1, 4';
    if (algo === 'BIT_MANIPULATION') return '4, 1, 2, 1, 2';
    if (algo === 'DYNAMIC_PROGRAMMING') return '6';
    if (algo === 'SLIDING_WINDOW') return '2, 1, 5, 1, 3, 2, 8, 4';
    if (algo === 'TREE_TRAVERSAL') return '10, 5, 15, 2, 7, 12, 20';
    return customArray.join(', ');
  };

  const getDefaultTargetForAlgo = (algo) => {
    if (algo === 'SLIDING_WINDOW') return 3;
    if (algo === 'DYNAMIC_PROGRAMMING') return 6;
    if (algo === 'BINARY_SEARCH') return 15;
    return customTarget || 18;
  };

  const [arrayInput, setArrayInput] = useState(() => getDefaultInputForAlgo(initialAlgorithm));
  const [targetInput, setTargetInput] = useState(() => getDefaultTargetForAlgo(initialAlgorithm));
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [finalComputedOutput, setFinalComputedOutput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const timerRef = useRef(null);

  // Sync if problem changes
  useEffect(() => {
    const smartAlgo = getSmartAlgorithm();
    setAlgorithm(smartAlgo);
    setArrayInput(getDefaultInputForAlgo(smartAlgo));
    setTargetInput(getDefaultTargetForAlgo(smartAlgo));
  }, [problem]);

  // When switching algorithm pills, auto-fill standard input defaults
  const handleSelectAlgorithm = (algoId) => {
    setAlgorithm(algoId);
    setArrayInput(getDefaultInputForAlgo(algoId));
    setTargetInput(getDefaultTargetForAlgo(algoId));
  };

  // Re-generate steps whenever inputs, algorithm, or view mode change
  useEffect(() => {
    generateAlgorithmSteps();
  }, [algorithm, viewMode, arrayInput, targetInput]);

  const generateAlgorithmSteps = (arrOverride, targetOverride) => {
    const rawInputStr = (arrOverride !== undefined ? arrOverride : arrayInput).trim();
    const tgt = targetOverride !== undefined ? targetOverride : parseInt(targetInput, 10) || 9;

    let rawArr = rawInputStr
      .split(',')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));

    if (rawArr.length === 0) {
      rawArr = [2, 7, 11, 15, 18, 22, 29];
    }

    let generated = [];
    let computedResult = '';

    // ==========================================
    // 1. TWO POINTERS
    // ==========================================
    if (algorithm === 'TWO_POINTERS') {
      const arr = [...rawArr].sort((a, b) => a - b);
      let left = 0;
      let right = arr.length - 1;
      let stepNum = 1;
      let matchFound = false;

      generated.push({
        step: 0,
        array: [...arr],
        left,
        right,
        status: 'INITIAL',
        codeLine: 1,
        vars: { left, right, target: tgt, sum: arr[left] + arr[right] },
        commentary: `Starting Two Pointers on sorted array [${arr.join(', ')}]. Target sum = ${tgt}. Left at idx ${left} (${arr[left]}), Right at idx ${right} (${arr[right]}).`
      });

      while (left < right) {
        const sum = arr[left] + arr[right];
        if (sum === tgt) {
          generated.push({
            step: stepNum++,
            array: [...arr],
            left,
            right,
            status: 'MATCH_FOUND',
            codeLine: 4,
            vars: { left, right, target: tgt, sum, match: true },
            commentary: `🎯 MATCH FOUND! nums[${left}] (${arr[left]}) + nums[${right}] (${arr[right]}) = ${tgt}. Target achieved!`
          });
          computedResult = `[${left}, ${right}] (Values: ${arr[left]} + ${arr[right]} = ${tgt})`;
          matchFound = true;
          break;
        } else if (sum < tgt) {
          generated.push({
            step: stepNum++,
            array: [...arr],
            left,
            right,
            status: 'SUM_TOO_SMALL',
            codeLine: 6,
            vars: { left, right, sum, target: tgt, action: 'left++' },
            commentary: `Sum (${arr[left]} + ${arr[right]} = ${sum}) < target ${tgt}. Incrementing Left pointer (L: ${left} → ${left + 1}) to increase sum.`
          });
          left++;
        } else {
          generated.push({
            step: stepNum++,
            array: [...arr],
            left,
            right,
            status: 'SUM_TOO_LARGE',
            codeLine: 8,
            vars: { left, right, sum, target: tgt, action: 'right--' },
            commentary: `Sum (${arr[left]} + ${arr[right]} = ${sum}) > target ${tgt}. Decrementing Right pointer (R: ${right} → ${right - 1}) to decrease sum.`
          });
          right--;
        }
      }

      if (!matchFound) {
        generated.push({
          step: stepNum,
          array: [...arr],
          left,
          right,
          status: 'NOT_FOUND',
          codeLine: 10,
          vars: { left, right, target: tgt, result: '[-1, -1]' },
          commentary: `Left and Right pointers crossed. No two numbers sum up to target ${tgt}.`
        });
        computedResult = `[-1, -1] (No pair sums to ${tgt})`;
      }
    }

    // ==========================================
    // 2. BINARY SEARCH
    // ==========================================
    else if (algorithm === 'BINARY_SEARCH') {
      const arr = [...rawArr].sort((a, b) => a - b);
      let low = 0;
      let high = arr.length - 1;
      let stepNum = 1;
      let found = false;

      generated.push({
        step: 0,
        array: [...arr],
        low,
        high,
        mid: Math.floor((low + high) / 2),
        status: 'INITIAL',
        codeLine: 1,
        vars: { low, high, mid: Math.floor((low + high) / 2), target: tgt },
        commentary: `Searching for target ${tgt} in sorted array [${arr.join(', ')}] using Logarithmic Binary Search.`
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midVal = arr[mid];

        if (midVal === tgt) {
          generated.push({
            step: stepNum++,
            array: [...arr],
            low,
            high,
            mid,
            status: 'MATCH_FOUND',
            codeLine: 4,
            vars: { low, high, mid, foundIndex: mid },
            commentary: `🎯 Target ${tgt} found at mid index ${mid}! Finished in ${stepNum - 1} steps.`
          });
          computedResult = `Index ${mid} (nums[${mid}] = ${tgt})`;
          found = true;
          break;
        } else if (midVal < tgt) {
          generated.push({
            step: stepNum++,
            array: [...arr],
            low,
            high,
            mid,
            status: 'SEARCH_RIGHT',
            codeLine: 6,
            vars: { low: mid + 1, high, mid, midVal, target: tgt },
            commentary: `arr[mid=${mid}] (${midVal}) < target (${tgt}). Discarding left half. Setting low = mid + 1 (${mid + 1}).`
          });
          low = mid + 1;
        } else {
          generated.push({
            step: stepNum++,
            array: [...arr],
            low,
            high,
            mid,
            status: 'SEARCH_LEFT',
            codeLine: 8,
            vars: { low, high: mid - 1, mid, midVal, target: tgt },
            commentary: `arr[mid=${mid}] (${midVal}) > target (${tgt}). Discarding right half. Setting high = mid - 1 (${mid - 1}).`
          });
          high = mid - 1;
        }
      }

      if (!found) {
        generated.push({
          step: stepNum,
          array: [...arr],
          low,
          high,
          mid: -1,
          status: 'NOT_FOUND',
          codeLine: 10,
          vars: { result: -1 },
          commentary: `Search space exhausted. Target ${tgt} does not exist in array.`
        });
        computedResult = `-1 (Target ${tgt} not found in array)`;
      }
    }

    // ==========================================
    // 3. SORTING (Bubble Sort)
    // ==========================================
    else if (algorithm === 'BUBBLE_SORT') {
      const arr = [...rawArr];
      let stepNum = 1;

      generated.push({
        step: 0,
        array: [...arr],
        comparing: [-1, -1],
        sortedIndices: [],
        status: 'INITIAL',
        codeLine: 1,
        vars: { i: 0, j: 0, length: arr.length },
        commentary: `Starting Bubble Sort on custom elements: [${arr.join(', ')}].`
      });

      const n = arr.length;
      let sortedIdxs = [];
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          const willSwap = arr[j] > arr[j + 1];
          generated.push({
            step: stepNum++,
            array: [...arr],
            comparing: [j, j + 1],
            sortedIndices: [...sortedIdxs],
            status: willSwap ? 'SWAPPING' : 'COMPARING',
            codeLine: willSwap ? 5 : 4,
            vars: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swap: willSwap },
            commentary: willSwap
              ? `Comparing index ${j} (${arr[j]}) & ${j + 1} (${arr[j + 1]}): ${arr[j]} > ${arr[j + 1]} → Swapping.`
              : `Comparing index ${j} (${arr[j]}) & ${j + 1} (${arr[j + 1]}): In correct relative order.`
          });

          if (willSwap) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
        sortedIdxs.push(n - 1 - i);
      }
      sortedIdxs.push(0);

      generated.push({
        step: stepNum,
        array: [...arr],
        comparing: [-1, -1],
        sortedIndices: sortedIdxs,
        status: 'SORTED',
        codeLine: 9,
        vars: { sorted: true, totalElements: n },
        commentary: `✅ Array fully sorted in ascending order!`
      });
      computedResult = `[${arr.join(', ')}] (Fully Sorted)`;
    }

    // ==========================================
    // 4. LINKED LIST REVERSAL
    // ==========================================
    else if (algorithm === 'LINKED_LIST_REVERSAL') {
      const nodes = rawArr.slice(0, 8);
      let stepNum = 1;

      generated.push({
        step: 0,
        nodes: [...nodes],
        prev: -1,
        curr: 0,
        next: 1,
        reversedEdges: [],
        codeLine: 1,
        vars: { prev: 'null', curr: nodes[0], next: nodes[1] || 'null' },
        commentary: `Starting Linked List Pointer Reversal. Head node is (${nodes[0]}). Prev = null, Curr = ${nodes[0]}.`
      });

      let revEdges = [];
      for (let i = 0; i < nodes.length; i++) {
        revEdges.push(i);
        generated.push({
          step: stepNum++,
          nodes: [...nodes],
          prev: i - 1 >= 0 ? i - 1 : -1,
          curr: i,
          next: i + 1 < nodes.length ? i + 1 : -1,
          reversedEdges: [...revEdges],
          codeLine: 4,
          vars: { 
            prev: i - 1 >= 0 ? nodes[i - 1] : 'null', 
            curr: nodes[i], 
            next: i + 1 < nodes.length ? nodes[i + 1] : 'null' 
          },
          commentary: `Reversing pointer: Node (${nodes[i]}).next now points back to ${i - 1 >= 0 ? nodes[i - 1] : 'null'}.`
        });
      }

      generated.push({
        step: stepNum,
        nodes: [...nodes],
        prev: nodes.length - 1,
        curr: -1,
        next: -1,
        reversedEdges: [...revEdges],
        codeLine: 8,
        vars: { newHead: nodes[nodes.length - 1] },
        commentary: `🎉 Reversal complete! New head is ${nodes[nodes.length - 1]}. Reversed order: [${[...nodes].reverse().join(' → ')}].`
      });
      computedResult = `[${[...nodes].reverse().join(' → ')}] (New Head: ${nodes[nodes.length - 1]})`;
    }

    // ==========================================
    // 5. STACK OPERATIONS (Delimiters / Parentheses)
    // ==========================================
    else if (algorithm === 'STACK_OPERATIONS') {
      // Use custom string if provided, otherwise clean tokens
      const str = rawInputStr || '({[]})';
      const tokens = str.split('').filter(c => ['(', ')', '{', '}', '[', ']'].includes(c));
      const validTokens = tokens.length > 0 ? tokens : ['(', '{', '[', ']', '}', ')'];

      let stack = [];
      let stepNum = 1;
      let isValid = true;

      generated.push({
        step: 0,
        tokens: [...validTokens],
        activeTokenIdx: 0,
        stack: [],
        codeLine: 1,
        vars: { input: validTokens.join(''), stackSize: 0 },
        commentary: `Evaluating Valid Parentheses Stack on input: "${validTokens.join('')}".`
      });

      const pairs = { ')': '(', '}': '{', ']': '[' };

      for (let i = 0; i < validTokens.length; i++) {
        const char = validTokens[i];
        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
          generated.push({
            step: stepNum++,
            tokens: [...validTokens],
            activeTokenIdx: i,
            stack: [...stack],
            status: 'PUSH',
            codeLine: 3,
            vars: { char, action: 'PUSH', stack: [...stack] },
            commentary: `Encountered opening delimiter '${char}'. PUSHING onto Stack (Stack size: ${stack.length}).`
          });
        } else {
          const expected = pairs[char];
          const top = stack.pop();
          if (top !== expected) {
            isValid = false;
            generated.push({
              step: stepNum++,
              tokens: [...validTokens],
              activeTokenIdx: i,
              stack: [...stack],
              status: 'INVALID',
              codeLine: 5,
              vars: { char, popped: top || 'empty', expected, match: false },
              commentary: `❌ Mismatch! Closing bracket '${char}' does not match expected opening '${top}'. Invalid string.`
            });
            break;
          } else {
            generated.push({
              step: stepNum++,
              tokens: [...validTokens],
              activeTokenIdx: i,
              stack: [...stack],
              status: 'POP',
              codeLine: 6,
              vars: { char, popped: top, match: true },
              commentary: `Encountered closing delimiter '${char}'. POPPING '${top}' from Stack. Match verified!`
            });
          }
        }
      }

      if (isValid && stack.length === 0) {
        generated.push({
          step: stepNum,
          tokens: [...validTokens],
          activeTokenIdx: validTokens.length,
          stack: [],
          status: 'VALID',
          codeLine: 9,
          vars: { isValid: true, stackEmpty: true },
          commentary: `🎉 Stack is completely empty! The sequence "${validTokens.join('')}" is VALID.`
        });
        computedResult = `true (Valid Delimiters String)`;
      } else if (isValid && stack.length > 0) {
        generated.push({
          step: stepNum,
          tokens: [...validTokens],
          activeTokenIdx: validTokens.length,
          stack: [...stack],
          status: 'INVALID',
          codeLine: 9,
          vars: { isValid: false, unclosedBrackets: stack.length },
          commentary: `❌ Unclosed delimiters remain in stack: [${stack.join(', ')}]. Invalid sequence.`
        });
        computedResult = `false (Unmatched / Unclosed Brackets Remaining)`;
      } else {
        computedResult = `false (Mismatched Delimiters)`;
      }
    }

    // ==========================================
    // 6. SLIDING WINDOW
    // ==========================================
    else if (algorithm === 'SLIDING_WINDOW') {
      const arr = rawArr.slice(0, 10);
      const k = Math.max(1, Math.min(arr.length, parseInt(targetInput, 10) || 3));
      let stepNum = 1;

      generated.push({
        step: 0,
        array: [...arr],
        windowStart: 0,
        windowEnd: k - 1,
        maxVal: Math.max(...arr.slice(0, k)),
        windowHistory: [],
        codeLine: 1,
        vars: { windowSize: k, start: 0, end: k - 1 },
        commentary: `Starting Sliding Window of size K = ${k} on array [${arr.join(', ')}]. Initial window: [${arr.slice(0, k).join(', ')}].`
      });

      let history = [];
      let allMaxes = [];
      for (let i = 0; i <= arr.length - k; i++) {
        const currentSlice = arr.slice(i, i + k);
        const max = Math.max(...currentSlice);
        history.push({ window: `[${currentSlice.join(', ')}]`, max });
        allMaxes.push(max);

        generated.push({
          step: stepNum++,
          array: [...arr],
          windowStart: i,
          windowEnd: i + k - 1,
          maxVal: max,
          windowHistory: [...history],
          codeLine: 4,
          vars: { windowStart: i, windowEnd: i + k - 1, currentMax: max, windowSum: currentSlice.reduce((a, b) => a + b, 0) },
          commentary: `Window at [${i}..${i + k - 1}]: elements {${currentSlice.join(', ')}}. Current Window Maximum = ${max}.`
        });
      }

      generated.push({
        step: stepNum,
        array: [...arr],
        windowStart: arr.length - k,
        windowEnd: arr.length - 1,
        maxVal: history[history.length - 1].max,
        windowHistory: [...history],
        status: 'COMPLETE',
        codeLine: 7,
        vars: { totalWindows: history.length, allMaxes },
        commentary: `✅ Sliding window complete! Window maximums across all ${history.length} slices: [${allMaxes.join(', ')}].`
      });
      computedResult = `[${allMaxes.join(', ')}] (Window Maximums for K=${k})`;
    }

    // ==========================================
    // 7. TREE BFS TRAVERSAL
    // ==========================================
    else if (algorithm === 'TREE_TRAVERSAL') {
      const vals = rawArr.slice(0, 7);
      const treeNodes = vals.map((val, idx) => ({
        id: idx + 1,
        val,
        level: idx === 0 ? 0 : idx <= 2 ? 1 : 2
      }));

      let visited = [];
      let stepNum = 1;

      generated.push({
        step: 0,
        treeNodes,
        activeNode: null,
        visited: [],
        queue: [treeNodes[0].val],
        codeLine: 1,
        vars: { queue: [treeNodes[0].val], visited: [] },
        commentary: `Starting Binary Tree BFS Level-Order Traversal with Root node (${treeNodes[0].val}).`
      });

      for (let i = 0; i < treeNodes.length; i++) {
        visited.push(treeNodes[i].val);
        const remainingQueue = treeNodes.slice(i + 1).map(n => n.val);

        generated.push({
          step: stepNum++,
          treeNodes,
          activeNode: treeNodes[i].id,
          visited: [...visited],
          queue: remainingQueue,
          codeLine: 4,
          vars: { currentNode: treeNodes[i].val, visited: [...visited] },
          commentary: `Visiting Node (${treeNodes[i].val}) at Level ${treeNodes[i].level}. Enqueueing children to FIFO queue. Visited: [${visited.join(', ')}].`
        });
      }

      generated.push({
        step: stepNum,
        treeNodes,
        activeNode: null,
        visited: [...visited],
        queue: [],
        status: 'COMPLETE',
        codeLine: 8,
        vars: { visitedOrder: visited },
        commentary: `🎉 Level-Order Traversal complete! Visited sequence: [${visited.join(' → ')}].`
      });
      computedResult = `[${visited.join(' → ')}] (Level-Order Sequence)`;
    }

    // ==========================================
    // 8. 2D MATRIX & GRAPH FLOOD FILL
    // ==========================================
    else if (algorithm === 'GRAPH_GRID_BFS') {
      const grid = [
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [0, 0, 1, 1],
        [0, 0, 1, 0]
      ];
      let islandCount = 0;
      let stepNum = 1;

      generated.push({
        step: 0,
        grid: grid.map(r => [...r]),
        activeCell: [-1, -1],
        visitedCells: [],
        islandCount: 0,
        codeLine: 1,
        vars: { rows: 4, cols: 4, islandsFound: 0 },
        commentary: `Starting 2D Grid Graph Traversal (Number of Islands / Flood Fill). Grid size: 4x4.`
      });

      let visited = [];
      const islandCoords = [
        [[0,0], [0,1], [1,0], [1,1]], // Island 1
        [[1,3]],                      // Island 2
        [[2,2], [2,3], [3,2]]          // Island 3
      ];

      islandCoords.forEach((island, idx) => {
        islandCount++;
        island.forEach(([r, c]) => {
          visited.push(`${r},${c}`);
          generated.push({
            step: stepNum++,
            grid: grid.map(row => [...row]),
            activeCell: [r, c],
            visitedCells: [...visited],
            islandCount,
            codeLine: 4,
            vars: { currentCell: `(${r}, ${c})`, islandNumber: islandCount, visitedCount: visited.length },
            commentary: `BFS Flood-Fill exploring Island #${islandCount} at cell (${r}, ${c}). Sinking connected land cells.`
          });
        });
      });

      generated.push({
        step: stepNum,
        grid: grid.map(r => [...r]),
        activeCell: [-1, -1],
        visitedCells: [...visited],
        islandCount,
        status: 'COMPLETE',
        codeLine: 8,
        vars: { totalIslands: islandCount },
        commentary: `🎉 Traversal complete! Identified ${islandCount} distinct connected land components in O(M x N) time.`
      });
      computedResult = `${islandCount} Connected Islands`;
    }

    // ==========================================
    // 9. DYNAMIC PROGRAMMING (1D Tabulation)
    // ==========================================
    else if (algorithm === 'DYNAMIC_PROGRAMMING') {
      const n = Math.min(12, Math.max(2, parseInt(targetInput, 10) || parseInt(rawInputStr, 10) || 6));
      let dp = new Array(n + 1).fill(0);
      dp[0] = 1;
      dp[1] = 1;
      let stepNum = 1;

      generated.push({
        step: 0,
        dp: [...dp],
        activeIdx: 1,
        activeDeps: [],
        codeLine: 1,
        vars: { 'dp[0]': 1, 'dp[1]': 1, targetN: n },
        commentary: `Dynamic Programming: Climbing Stairs / Fibonacci for N = ${n}. Base cases: dp[0] = 1, dp[1] = 1.`
      });

      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        generated.push({
          step: stepNum++,
          dp: [...dp],
          activeIdx: i,
          activeDeps: [i - 1, i - 2],
          codeLine: 4,
          vars: { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2], 'dp[i]': dp[i] },
          commentary: `Computing dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}) = ${dp[i]}. Storing in memoization table.`
        });
      }

      generated.push({
        step: stepNum,
        dp: [...dp],
        activeIdx: n,
        activeDeps: [n - 1, n - 2],
        status: 'COMPLETE',
        codeLine: 7,
        vars: { finalAnswer: dp[n], N: n },
        commentary: `🎉 DP Solution Computed! Result for N = ${n} is ${dp[n]} distinct ways, computed in O(n) time & O(n) space.`
      });
      computedResult = `${dp[n]} (Computed value for dp[${n}])`;
    }

    // ==========================================
    // 10. GREEDY ALGORITHMS (Jump Game)
    // ==========================================
    else if (algorithm === 'GREEDY_INTERVALS') {
      const jumps = rawArr.length > 0 ? rawArr.slice(0, 8) : [2, 3, 1, 1, 4];
      let maxReach = 0;
      let stepNum = 1;
      let canReach = true;

      generated.push({
        step: 0,
        jumps: [...jumps],
        currIndex: 0,
        maxReach: 0,
        codeLine: 1,
        vars: { index: 0, jumpValue: jumps[0], maxReach: 0 },
        commentary: `Starting Greedy Jump Game on array [${jumps.join(', ')}]. Target is to reach index ${jumps.length - 1}.`
      });

      for (let i = 0; i < jumps.length; i++) {
        if (i > maxReach) {
          canReach = false;
          generated.push({
            step: stepNum++,
            jumps: [...jumps],
            currIndex: i,
            maxReach,
            status: 'UNREACHABLE',
            codeLine: 3,
            vars: { index: i, maxReach, canReach: false },
            commentary: `Cannot reach index ${i} because maximum reachable boundary is index ${maxReach}. Target is unreachable.`
          });
          break;
        }
        maxReach = Math.max(maxReach, i + jumps[i]);
        generated.push({
          step: stepNum++,
          jumps: [...jumps],
          currIndex: i,
          maxReach,
          codeLine: 5,
          vars: { index: i, jump: jumps[i], updatedMaxReach: maxReach },
          commentary: `At index ${i} with jump power ${jumps[i]}: Max reach updated to index ${maxReach} (${i} + ${jumps[i]}).`
        });

        if (maxReach >= jumps.length - 1) {
          generated.push({
            step: stepNum++,
            jumps: [...jumps],
            currIndex: i,
            maxReach,
            status: 'MATCH_FOUND',
            codeLine: 7,
            vars: { canReachEnd: true, finalReach: maxReach },
            commentary: `🎉 Target reached! Max reach ${maxReach} extends to or past the final index (${jumps.length - 1}). Return true.`
          });
          break;
        }
      }
      computedResult = canReach ? `true (Can Reach Last Index ${jumps.length - 1})` : `false (Stuck at Max Reach ${maxReach})`;
    }

    // ==========================================
    // 11. STRINGS & PALINDROME
    // ==========================================
    else if (algorithm === 'STRINGS_HASHING') {
      const s = (rawInputStr && !rawInputStr.includes(',') ? rawInputStr : 'racecar').toLowerCase().replace(/[^a-z0-9]/g, '');
      const validStr = s.length > 0 ? s : 'racecar';
      let left = 0;
      let right = validStr.length - 1;
      let stepNum = 1;
      let isPalin = true;

      generated.push({
        step: 0,
        str: validStr,
        left,
        right,
        codeLine: 1,
        vars: { left, right, charLeft: validStr[left], charRight: validStr[right] },
        commentary: `Testing Valid Palindrome on string "${validStr}". Converging dual pointers from outer boundaries.`
      });

      while (left < right) {
        if (validStr[left] !== validStr[right]) {
          isPalin = false;
          generated.push({
            step: stepNum++,
            str: validStr,
            left,
            right,
            status: 'MISMATCH',
            codeLine: 4,
            vars: { left, right, leftChar: validStr[left], rightChar: validStr[right], match: false },
            commentary: `❌ Mismatch: str[${left}] ('${validStr[left]}') !== str[${right}] ('${validStr[right]}'). "${validStr}" is NOT a palindrome.`
          });
          break;
        }

        generated.push({
          step: stepNum++,
          str: validStr,
          left,
          right,
          status: 'COMPARING',
          codeLine: 3,
          vars: { left, right, leftChar: validStr[left], rightChar: validStr[right], match: true },
          commentary: `Comparing str[${left}] ('${validStr[left]}') with str[${right}] ('${validStr[right]}'): Match verified! Narrowing pointers.`
        });
        left++;
        right--;
      }

      if (isPalin) {
        generated.push({
          step: stepNum,
          str: validStr,
          left,
          right,
          status: 'MATCH_FOUND',
          codeLine: 6,
          vars: { isPalindrome: true },
          commentary: `🎉 All symmetrical character pairs matched! "${validStr}" is a VALID PALINDROME in O(n) time & O(1) space.`
        });
        computedResult = `true ("${validStr}" is a Valid Palindrome)`;
      } else {
        computedResult = `false ("${validStr}" is Not a Palindrome)`;
      }
    }

    // ==========================================
    // 12. BIT MANIPULATION (Single Number XOR)
    // ==========================================
    else if (algorithm === 'BIT_MANIPULATION') {
      const nums = rawArr.length > 0 ? rawArr : [4, 1, 2, 1, 2];
      let xorVal = 0;
      let stepNum = 1;

      generated.push({
        step: 0,
        nums: [...nums],
        currIndex: -1,
        xorVal: 0,
        binary: '0000',
        codeLine: 1,
        vars: { initialXOR: 0 },
        commentary: `Single Number (XOR Property): a ^ a = 0 and a ^ 0 = a on numbers [${nums.join(', ')}]. Initial accumulator = 0.`
      });

      for (let i = 0; i < nums.length; i++) {
        const prev = xorVal;
        xorVal ^= nums[i];
        generated.push({
          step: stepNum++,
          nums: [...nums],
          currIndex: i,
          xorVal,
          binary: (xorVal >>> 0).toString(2).padStart(4, '0'),
          codeLine: 4,
          vars: { prevXOR: prev, num: nums[i], resultXOR: xorVal },
          commentary: `Step ${i + 1}: Accumulator (${prev}) ^ nums[${i}] (${nums[i]}) = ${xorVal} (Binary: ${(xorVal >>> 0).toString(2).padStart(4, '0')}).`
        });
      }

      generated.push({
        step: stepNum,
        nums: [...nums],
        currIndex: nums.length - 1,
        xorVal,
        binary: (xorVal >>> 0).toString(2).padStart(4, '0'),
        status: 'COMPLETE',
        codeLine: 7,
        vars: { singleNumber: xorVal },
        commentary: `🎉 Duplicate pairs cancelled out! The unique single number is ${xorVal}, computed in O(n) time and O(1) space.`
      });
      computedResult = `${xorVal} (Unique Single Number)`;
    }

    setSteps(generated);
    setFinalComputedOutput(computedResult);
    setCurrentStepIdx(0);
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    generateAlgorithmSteps();
  };

  const curr = steps[currentStepIdx] || {};

  // Algorithm pseudo code definitions for Code Tracer
  const codeTemplates = {
    TWO_POINTERS: [
      "int left = 0, right = nums.length - 1;",
      "while (left < right) {",
      "    int sum = nums[left] + nums[right];",
      "    if (sum == target) return new int[]{left, right};",
      "    else if (sum < target) left++;",
      "    else right--;",
      "}",
      "return new int[]{-1, -1};"
    ],
    BINARY_SEARCH: [
      "int low = 0, high = nums.length - 1;",
      "while (low <= high) {",
      "    int mid = low + (high - low) / 2;",
      "    if (nums[mid] == target) return mid;",
      "    else if (nums[mid] < target) low = mid + 1;",
      "    else high = mid - 1;",
      "}",
      "return -1;"
    ],
    BUBBLE_SORT: [
      "for (int i = 0; i < n - 1; i++) {",
      "    for (int j = 0; j < n - i - 1; j++) {",
      "        if (arr[j] > arr[j + 1]) {",
      "            int temp = arr[j];",
      "            arr[j] = arr[j + 1];",
      "            arr[j + 1] = temp;",
      "        }",
      "    }",
      "}"
    ],
    LINKED_LIST_REVERSAL: [
      "ListNode prev = null, curr = head;",
      "while (curr != null) {",
      "    ListNode next = curr.next;",
      "    curr.next = prev;",
      "    prev = curr;",
      "    curr = next;",
      "}",
      "return prev;"
    ],
    STACK_OPERATIONS: [
      "Stack<Character> stack = new Stack<>();",
      "for (char c : s.toCharArray()) {",
      "    if (c == '(' || c == '{' || c == '[') stack.push(c);",
      "    else if (stack.isEmpty() || !matches(stack.pop(), c)) return false;",
      "}",
      "return stack.isEmpty();"
    ],
    SLIDING_WINDOW: [
      "int maxVal = 0, windowSum = 0;",
      "for (int i = 0; i < nums.length; i++) {",
      "    windowSum += nums[i];",
      "    if (i >= k - 1) {",
      "        maxVal = Math.max(maxVal, windowSum);",
      "        windowSum -= nums[i - k + 1];",
      "    }",
      "}"
    ],
    TREE_TRAVERSAL: [
      "Queue<TreeNode> queue = new LinkedList<>();",
      "queue.offer(root);",
      "while (!queue.isEmpty()) {",
      "    TreeNode curr = queue.poll();",
      "    visit(curr.val);",
      "    if (curr.left != null) queue.offer(curr.left);",
      "    if (curr.right != null) queue.offer(curr.right);",
      "}"
    ],
    GRAPH_GRID_BFS: [
      "int islands = 0;",
      "for (int r = 0; r < rows; r++) {",
      "    for (int c = 0; c < cols; c++) {",
      "        if (grid[r][c] == '1') {",
      "            islands++;",
      "            bfsFloodFill(grid, r, c);",
      "        }",
      "    }",
      "}"
    ],
    DYNAMIC_PROGRAMMING: [
      "int[] dp = new int[n + 1];",
      "dp[0] = 1; dp[1] = 1;",
      "for (int i = 2; i <= n; i++) {",
      "    dp[i] = dp[i - 1] + dp[i - 2];",
      "}",
      "return dp[n];"
    ],
    GREEDY_INTERVALS: [
      "int maxReach = 0;",
      "for (int i = 0; i < nums.length; i++) {",
      "    if (i > maxReach) return false;",
      "    maxReach = Math.max(maxReach, i + nums[i]);",
      "    if (maxReach >= nums.length - 1) return true;",
      "}"
    ],
    STRINGS_HASHING: [
      "int left = 0, right = s.length() - 1;",
      "while (left < right) {",
      "    if (s.charAt(left) != s.charAt(right)) return false;",
      "    left++; right--;",
      "}",
      "return true;"
    ],
    BIT_MANIPULATION: [
      "int xor = 0;",
      "for (int num : nums) {",
      "    xor ^= num;",
      "}",
      "return xor;"
    ]
  };

  const activeCodeLines = codeTemplates[algorithm] || codeTemplates.TWO_POINTERS;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', overflow: 'hidden' }}>
      
      {/* Visualizer Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {problem ? `${problem.title} — Algorithm Visualizer` : 'Universal Algorithm Visualizer'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              12 DSA Engines • Real-Time Custom Input & Output Generator
            </span>
          </div>
        </div>

        {/* View Mode Switcher: DS Animation vs Line-by-Line Code Tracer */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('DS_ANIMATION')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: viewMode === 'DS_ANIMATION' ? 'var(--accent-cyan)' : 'transparent',
              color: viewMode === 'DS_ANIMATION' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <Layers size={14} /> DS Animation
          </button>
          <button
            onClick={() => setViewMode('CODE_TRACER')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: viewMode === 'CODE_TRACER' ? '#8b5cf6' : 'transparent',
              color: viewMode === 'CODE_TRACER' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Code2 size={14} /> Code Tracer
          </button>
        </div>
      </div>

      {/* 12 Algorithm Topic Selector Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {[
          { id: 'TWO_POINTERS', label: 'Two Pointers' },
          { id: 'BINARY_SEARCH', label: 'Binary Search' },
          { id: 'BUBBLE_SORT', label: 'Sorting' },
          { id: 'LINKED_LIST_REVERSAL', label: 'Linked List' },
          { id: 'STACK_OPERATIONS', label: 'Stack / LIFO' },
          { id: 'SLIDING_WINDOW', label: 'Sliding Window' },
          { id: 'TREE_TRAVERSAL', label: 'Trees / BFS' },
          { id: 'GRAPH_GRID_BFS', label: '2D Grid / Islands' },
          { id: 'DYNAMIC_PROGRAMMING', label: 'DP Tabulation' },
          { id: 'GREEDY_INTERVALS', label: 'Greedy Reach' },
          { id: 'STRINGS_HASHING', label: 'Strings & Hash' },
          { id: 'BIT_MANIPULATION', label: 'Bitwise XOR' }
        ].map(algo => (
          <button
            key={algo.id}
            onClick={() => handleSelectAlgorithm(algo.id)}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: algorithm === algo.id ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
              color: algorithm === algo.id ? '#000' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            {algo.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          INTERACTIVE CUSTOM INPUT CONTROLS BAR
         ========================================== */}
      <form onSubmit={handleApplyCustom} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        
        {/* Main Data Input (Array or String) */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {algorithm === 'STRINGS_HASHING' ? 'String Input:' :
             algorithm === 'STACK_OPERATIONS' ? 'Delimiters:' :
             algorithm === 'DYNAMIC_PROGRAMMING' ? 'N steps:' : 'Custom Array / Data:'}
          </span>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder={
              algorithm === 'STRINGS_HASHING' ? 'e.g. racecar, madam, hello' :
              algorithm === 'STACK_OPERATIONS' ? 'e.g. ({[]}), ()[]{}, ([)]' :
              algorithm === 'GREEDY_INTERVALS' ? 'e.g. 2, 3, 1, 1, 4' :
              'e.g. 2, 7, 11, 15, 18, 22'
            }
            style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: '6px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        {/* Secondary Target/Window Input (When applicable) */}
        {['TWO_POINTERS', 'BINARY_SEARCH', 'SLIDING_WINDOW', 'DYNAMIC_PROGRAMMING'].includes(algorithm) && (
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {algorithm === 'SLIDING_WINDOW' ? 'Size K:' :
               algorithm === 'DYNAMIC_PROGRAMMING' ? 'N Steps:' : 'Target:'}
            </span>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={14} /> Apply & Run Custom Data
        </button>
      </form>

      {/* ==========================================
          REAL-TIME COMPUTED OUTPUT BANNER
         ========================================== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="#34d399" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Calculated Algorithm Output:
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
            {finalComputedOutput || 'Executing...'}
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Total Animation Frames: <strong style={{ color: 'var(--accent-cyan)' }}>{steps.length} Steps</strong>
        </div>
      </div>

      {/* ==========================================
          MAIN VISUAL STAGE (Animation vs Code Tracer)
         ========================================== */}
      <div style={{
        minHeight: '280px',
        background: 'radial-gradient(ellipse at top, #111a2e 0%, #080c14 100%)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '1.25rem'
      }}>

        {/* --- VIEW MODE 1: DS GRAPHICAL ANIMATION --- */}
        {viewMode === 'DS_ANIMATION' && (
          <>
            {/* 1. TWO POINTERS */}
            {algorithm === 'TWO_POINTERS' && curr.array && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
                {curr.array.map((val, idx) => {
                  const isLeft = idx === curr.left;
                  const isRight = idx === curr.right;
                  const isMatch = curr.status === 'MATCH_FOUND' && (isLeft || isRight);
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ height: '24px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {isLeft && isRight ? (
                          <span style={{ color: '#ec4899' }}>L & R</span>
                        ) : isLeft ? (
                          <span style={{ color: 'var(--accent-cyan)' }}>L ({idx})</span>
                        ) : isRight ? (
                          <span style={{ color: '#f59e0b' }}>R ({idx})</span>
                        ) : null}
                      </div>

                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        background: isMatch ? 'linear-gradient(135deg, #10b981, #059669)' : isLeft ? 'rgba(6, 182, 212, 0.25)' : isRight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: isMatch ? '2px solid #34d399' : isLeft ? '2px solid var(--accent-cyan)' : isRight ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                        color: '#fff',
                        transform: isLeft || isRight ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.25s ease'
                      }}>
                        {val}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. BINARY SEARCH */}
            {algorithm === 'BINARY_SEARCH' && curr.array && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
                {curr.array.map((val, idx) => {
                  const isMid = idx === curr.mid;
                  const isLow = idx === curr.low;
                  const isHigh = idx === curr.high;
                  const isEliminated = idx < curr.low || idx > curr.high;
                  const isMatch = curr.status === 'MATCH_FOUND' && isMid;

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', opacity: isEliminated ? 0.3 : 1 }}>
                      <div style={{ height: '24px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {isMid ? (
                          <span style={{ color: '#ec4899' }}>MID ({idx})</span>
                        ) : isLow ? (
                          <span style={{ color: 'var(--accent-cyan)' }}>LOW</span>
                        ) : isHigh ? (
                          <span style={{ color: '#f59e0b' }}>HIGH</span>
                        ) : null}
                      </div>

                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        background: isMatch ? 'linear-gradient(135deg, #10b981, #059669)' : isMid ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: isMatch ? '2px solid #34d399' : isMid ? '2px solid #ec4899' : '1px solid var(--border-color)',
                        color: '#fff',
                        transform: isMid ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.25s ease'
                      }}>
                        {val}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. BUBBLE SORT */}
            {algorithm === 'BUBBLE_SORT' && curr.array && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', justifyContent: 'center', height: '140px' }}>
                {curr.array.map((val, idx) => {
                  const isComparing = curr.comparing && (idx === curr.comparing[0] || idx === curr.comparing[1]);
                  const isSorted = curr.sortedIndices && curr.sortedIndices.includes(idx);
                  const maxVal = Math.max(...curr.array, 50);
                  const barHeight = Math.max(35, (val / maxVal) * 110);

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{
                        width: '44px',
                        height: `${barHeight}px`,
                        borderRadius: '6px 6px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        background: isSorted ? 'linear-gradient(180deg, #10b981, #059669)' : isComparing ? 'linear-gradient(180deg, #f59e0b, #d97706)' : 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                        border: isComparing ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        transition: 'all 0.2s ease'
                      }}>
                        {val}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. LINKED LIST */}
            {algorithm === 'LINKED_LIST_REVERSAL' && curr.nodes && (
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {curr.nodes.map((val, idx) => {
                  const isCurr = idx === curr.curr;
                  const isReversed = curr.reversedEdges && curr.reversedEdges.includes(idx);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <div style={{ height: '18px', fontSize: '0.72rem', fontWeight: 700, color: isCurr ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                          {isCurr ? 'curr' : idx === curr.prev ? 'prev' : ''}
                        </div>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          background: isCurr ? 'rgba(6, 182, 212, 0.25)' : isReversed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                          border: isCurr ? '2px solid var(--accent-cyan)' : isReversed ? '2px solid #10b981' : '1px solid var(--border-color)',
                          color: isReversed ? '#34d399' : 'var(--text-primary)'
                        }}>
                          {val}
                        </div>
                      </div>
                      {idx < curr.nodes.length - 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', color: isReversed ? '#34d399' : 'var(--text-muted)', fontSize: '1.2rem' }}>
                          {isReversed ? '←' : '→'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. STACK */}
            {algorithm === 'STACK_OPERATIONS' && curr.tokens && (
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Input Stream:</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {curr.tokens.map((tok, i) => (
                      <div key={i} style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        background: i === curr.activeTokenIdx ? 'rgba(6, 182, 212, 0.25)' : i < curr.activeTokenIdx ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                        border: i === curr.activeTokenIdx ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        color: i < curr.activeTokenIdx ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>
                        {tok}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Stack Memory (LIFO):</div>
                  <div style={{
                    width: '70px',
                    height: '140px',
                    border: '2px solid #8b5cf6',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    padding: '0.3rem',
                    gap: '0.3rem',
                    background: 'rgba(139, 92, 246, 0.05)'
                  }}>
                    {curr.stack && curr.stack.map((item, idx) => (
                      <div key={idx} style={{
                        width: '56px',
                        height: '28px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. SLIDING WINDOW */}
            {algorithm === 'SLIDING_WINDOW' && curr.array && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  Window Boundaries: [{curr.windowStart} .. {curr.windowEnd}] | Current Max: <strong style={{ color: '#34d399', fontSize: '1rem' }}>{curr.maxVal}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                  {curr.array.map((val, idx) => {
                    const inWindow = idx >= curr.windowStart && idx <= curr.windowEnd;
                    return (
                      <div key={idx} style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        background: inWindow ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: inWindow ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        color: inWindow ? '#fff' : 'var(--text-muted)',
                        transform: inWindow ? 'translateY(-4px)' : 'none',
                        transition: 'all 0.25s ease'
                      }}>
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. TREE BFS */}
            {algorithm === 'TREE_TRAVERSAL' && curr.treeNodes && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>FIFO Queue: <strong style={{ color: 'var(--accent-cyan)' }}>[{curr.queue?.join(', ') || 'Empty'}]</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Visited: <strong style={{ color: '#34d399' }}>[{curr.visited?.join(' → ') || 'None'}]</strong></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  {curr.treeNodes[0] && (
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: curr.activeNode === 1 ? '#10b981' : curr.visited?.includes(curr.treeNodes[0].val) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
                      {curr.treeNodes[0].val}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '4rem' }}>
                    {curr.treeNodes.slice(1, 3).map((node, i) => (
                      <div key={node.val} style={{ width: '40px', height: '40px', borderRadius: '50%', background: curr.activeNode === node.id ? '#10b981' : curr.visited?.includes(node.val) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
                        {node.val}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {curr.treeNodes.slice(3, 7).map((node) => (
                      <div key={node.val} style={{ width: '36px', height: '36px', borderRadius: '50%', background: curr.activeNode === node.id ? '#10b981' : curr.visited?.includes(node.val) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
                        {node.val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. 2D GRID FLOOD FILL */}
            {algorithm === 'GRAPH_GRID_BFS' && curr.grid && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  Islands Discovered: <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{curr.islandCount}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 46px)', gap: '0.45rem' }}>
                  {curr.grid.map((row, r) =>
                    row.map((val, c) => {
                      const isActive = curr.activeCell && curr.activeCell[0] === r && curr.activeCell[1] === c;
                      const isVisited = curr.visitedCells && curr.visitedCells.includes(`${r},${c}`);
                      return (
                        <div key={`${r}-${c}`} style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1rem',
                          background: isActive ? '#f59e0b' : isVisited ? 'rgba(16, 185, 129, 0.3)' : val === 1 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.4)',
                          border: isActive ? '2px solid #fbbf24' : isVisited ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                          color: val === 1 ? '#fff' : 'var(--text-muted)'
                        }}>
                          {val === 1 ? '🏝️' : '🌊'}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 9. DYNAMIC PROGRAMMING */}
            {algorithm === 'DYNAMIC_PROGRAMMING' && curr.dp && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Recurrence: <strong style={{ color: 'var(--accent-cyan)' }}>dp[i] = dp[i-1] + dp[i-2]</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {curr.dp.map((val, idx) => {
                    const isActive = idx === curr.activeIdx;
                    const isDep = curr.activeDeps && curr.activeDeps.includes(idx);
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          background: isActive ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : isDep ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                          border: isActive ? '2px solid #a78bfa' : isDep ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                          color: '#fff',
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.25s ease'
                        }}>
                          {val}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>dp[{idx}]</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10. GREEDY JUMP GAME */}
            {algorithm === 'GREEDY_INTERVALS' && curr.jumps && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  Current Index: [{curr.currIndex}] | Maximum Reachable Boundary: <strong style={{ color: '#34d399' }}>Index {curr.maxReach}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {curr.jumps.map((jump, idx) => {
                    const isCurrent = idx === curr.currIndex;
                    const reachable = idx <= curr.maxReach;
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          background: isCurrent ? '#f59e0b' : reachable ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.04)',
                          border: isCurrent ? '2px solid #fbbf24' : reachable ? '2px solid #10b981' : '1px solid var(--border-color)',
                          color: '#fff'
                        }}>
                          {jump}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>idx {idx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 11. STRINGS & PALINDROME */}
            {algorithm === 'STRINGS_HASHING' && curr.str && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {curr.str.split('').map((char, idx) => {
                  const isLeft = idx === curr.left;
                  const isRight = idx === curr.right;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ height: '20px', fontSize: '0.75rem', fontWeight: 700, color: isLeft ? 'var(--accent-cyan)' : isRight ? '#f59e0b' : 'transparent' }}>
                        {isLeft ? 'L' : isRight ? 'R' : ''}
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        background: isLeft || isRight ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: isLeft || isRight ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        color: '#fff'
                      }}>
                        {char}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 12. BIT MANIPULATION */}
            {algorithm === 'BIT_MANIPULATION' && curr.nums && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>XOR Register Value: <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{curr.xorVal}</strong></span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Binary: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{curr.binary}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {curr.nums.map((num, idx) => {
                    const isProcessed = idx <= curr.currIndex;
                    const isCurrent = idx === curr.currIndex;
                    return (
                      <div key={idx} style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        background: isCurrent ? '#f59e0b' : isProcessed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: isCurrent ? '2px solid #fbbf24' : '1px solid var(--border-color)',
                        color: '#fff'
                      }}>
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- VIEW MODE 2: LINE-BY-LINE CODE TRACER --- */}
        {viewMode === 'CODE_TRACER' && (
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(220px, 0.8fr)', gap: '1.25rem' }}>
            {/* Code Line Highlight Window */}
            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                // Code Execution Pointer (Step {currentStepIdx + 1} of {steps.length})
              </div>
              {activeCodeLines.map((line, idx) => {
                const isCurrentLine = curr.codeLine === (idx + 1);
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: isCurrentLine ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                      borderLeft: isCurrentLine ? '3px solid #8b5cf6' : '3px solid transparent',
                      color: isCurrentLine ? '#c4b5fd' : '#94a3b8',
                      whiteSpace: 'pre',
                      lineHeight: '1.5'
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: '0.75rem', userSelect: 'none' }}>{idx + 1}</span>
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Local Variable Scope & Memory State */}
            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Terminal size={14} /> Local Scope Variables
              </div>
              {curr.vars ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {Object.entries(curr.vars).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{k}:</span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No active local variables</div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Live Step Commentary Box */}
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: '8px',
        background: 'rgba(6, 182, 212, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Info size={18} color="var(--accent-cyan)" />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Step {curr.step !== undefined ? curr.step : currentStepIdx + 1} of {steps.length || 1}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {curr.commentary || 'Configuring initial algorithm state...'}
          </div>
        </div>
      </div>

      {/* Playback Controls Deck */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleReset}
            className="btn-secondary"
            title="Reset"
            style={{ padding: '0.5rem', borderRadius: '8px' }}
          >
            <RotateCcw size={16} />
          </button>
          
          <button
            onClick={handleStepBackward}
            disabled={currentStepIdx <= 0}
            className="btn-secondary"
            title="Previous Step"
            style={{ padding: '0.5rem', borderRadius: '8px', opacity: currentStepIdx <= 0 ? 0.4 : 1 }}
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={handlePlayPause}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : currentStepIdx >= steps.length - 1 ? 'Replay' : 'Play'}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIdx >= steps.length - 1}
            className="btn-secondary"
            title="Next Step"
            style={{ padding: '0.5rem', borderRadius: '8px', opacity: currentStepIdx >= steps.length - 1 ? 0.4 : 1 }}
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sliders size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Speed:</span>
          <input
            type="range"
            min="250"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            style={{ width: '100px', accentColor: 'var(--accent-cyan)' }}
          />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            {(speed / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

    </div>
  );
};

export default AlgorithmVisualizer;
