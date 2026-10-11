package com.codepulse.service.ai;

import com.codepulse.dto.AiAssistantDTOs.ChatRequest;
import com.codepulse.dto.AiAssistantDTOs.ChatResponse;
import com.codepulse.model.Problem;
import com.codepulse.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AiAssistantService {

    @Autowired
    private ProblemRepository problemRepository;

    public ChatResponse processChat(ChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String msgLower = msg.toLowerCase();

        // Detect programming language from prompt or request
        String language = detectLanguage(msgLower, request.getLanguage());
        String userCode = request.getCode() != null ? request.getCode() : "";

        // Context info if attached
        Optional<Problem> problemOpt = request.getProblemId() != null
                ? problemRepository.findById(request.getProblemId()) : Optional.empty();
        String problemTitle = request.getProblemTitle() != null
                ? request.getProblemTitle() : problemOpt.map(Problem::getTitle).orElse(null);

        ChatResponse response = new ChatResponse();
        response.setTopic(problemOpt.map(Problem::getTopic).orElse("General AI Coding"));

        if (msg.isEmpty()) {
            response.setReply(
                "Hello! 👋 I am **CodePulse AI**, your personal coding mentor.\n\n" +
                "I can help you with:\n" +
                "• **Code generation** in Java, Python, C++, JavaScript, TypeScript, Go, Rust, Kotlin, C#, Swift, PHP, Ruby, C, SQL\n" +
                "• **Debugging** — paste your error or code and I'll diagnose it\n" +
                "• **Algorithm explanations** — Two Sum, Binary Search, Dynamic Programming, Graph BFS/DFS, etc.\n" +
                "• **Time & Space complexity analysis** — understand Big-O notation\n" +
                "• **Data structures** — Arrays, LinkedList, HashMap, Stack, Queue, Trees, Graphs, Heap\n" +
                "• **Design patterns** — Singleton, Factory, Observer, Strategy, Builder, Decorator\n" +
                "• **Web development** — React, Spring Boot, REST API, SQL queries\n" +
                "• **Computer science concepts** — recursion, memoization, backtracking, etc.\n\n" +
                "Just type any coding question and I'll answer it!"
            );
            return response;
        }

        // Check if user requests code without specifying a programming language
        boolean requestingCode = wantsCode(msgLower);
        boolean hasLangInMsg = hasExplicitLanguage(msgLower);
        boolean hasLangInReq = request.getLanguage() != null && !request.getLanguage().trim().isEmpty() && !request.getLanguage().equalsIgnoreCase("none") && !request.getLanguage().equalsIgnoreCase("ask");

        if (requestingCode && !hasLangInMsg && !hasLangInReq) {
            ChatResponse langChoice = new ChatResponse();
            langChoice.setTopic("Choose Language");
            langChoice.setReply(
                "Which programming language would you like the code in?\n\n" +
                "Please select your preferred language:\n" +
                "• **Java** ☕\n" +
                "• **Python** 🐍\n" +
                "• **C++** ⚡\n" +
                "• **JavaScript** 🌐\n" +
                "• **TypeScript** 🔷\n" +
                "• **Go** 🐹\n" +
                "• **Rust** 🦀\n" +
                "• **C#** 🎯"
            );
            return langChoice;
        }

        // 1. Time / Space Complexity Queries
        if (msgLower.contains("complexity") || msgLower.contains("big o") ||
                msgLower.contains("time complexity") || msgLower.contains("space complexity") ||
                msgLower.contains("o(n)") || msgLower.contains("o(log")) {
            return generateComplexityResponse(msg, problemTitle, userCode, language, problemOpt);
        }

        // 2. Debugging & Error Fix Requests
        if (msgLower.contains("debug") || msgLower.contains("fix") || msgLower.contains("error") ||
                msgLower.contains("exception") || msgLower.contains("issue") || msgLower.contains("failing") ||
                msgLower.contains("crash") || msgLower.contains("bug") || msgLower.contains("not working") ||
                msgLower.contains("wrong output") || msgLower.contains("segfault") ||
                (request.getExecutionStatus() != null && !request.getExecutionStatus().equals("ACCEPTED"))) {
            return generateDebuggingResponse(msg, problemTitle, userCode, language, request.getErrorLog());
        }

        // 3. Database / SQL Queries
        if (msgLower.contains("sql") || msgLower.contains("database") || msgLower.contains("select ") ||
                msgLower.contains(" query") || msgLower.contains("join") || msgLower.contains("mysql") ||
                msgLower.contains("postgresql") || msgLower.contains("group by") || msgLower.contains("where clause")) {
            return generateSqlResponse(msg);
        }

        // 4. Web Dev & Frameworks (React, Spring Boot, Node, REST API, HTML/CSS)
        if (msgLower.contains("react") || msgLower.contains("spring boot") || msgLower.contains("spring") ||
                msgLower.contains(" api") || msgLower.contains("rest") || msgLower.contains("html") ||
                msgLower.contains("css") || msgLower.contains("axios") || msgLower.contains("fetch") ||
                msgLower.contains("endpoint") || msgLower.contains("controller") || msgLower.contains("component")) {
            return generateFrameworkResponse(msg, language);
        }

        // 5. Data Structures
        if (msgLower.contains("linked list") || msgLower.contains("binary tree") || msgLower.contains("graph") ||
                msgLower.contains("stack") || msgLower.contains("queue") || msgLower.contains("heap") ||
                msgLower.contains("trie") || msgLower.contains("segment tree") || msgLower.contains("hashmap") ||
                msgLower.contains("hash table") || msgLower.contains("data structure")) {
            return generateDataStructureResponse(msg, language);
        }

        // 6. Sorting & Searching Algorithms
        if (msgLower.contains("sort") || msgLower.contains("search") || msgLower.contains("binary search") ||
                msgLower.contains("quicksort") || msgLower.contains("merge sort") || msgLower.contains("bubble sort") ||
                msgLower.contains("insertion sort") || msgLower.contains("selection sort")) {
            return generateSortingSearchingResponse(msg, language);
        }

        // 7. Dynamic Programming & Recursion
        if (msgLower.contains("dynamic programming") || msgLower.contains(" dp ") || msgLower.contains("memoization") ||
                msgLower.contains("tabulation") || msgLower.contains("recursion") || msgLower.contains("backtracking") ||
                msgLower.contains("fibonacci") || msgLower.contains("knapsack") || msgLower.contains("coin change") ||
                msgLower.contains("longest common") || msgLower.contains("longest increasing")) {
            return generateDpRecursionResponse(msg, language);
        }

        // 8. Design Patterns
        if (msgLower.contains("design pattern") || msgLower.contains("singleton") || msgLower.contains("factory") ||
                msgLower.contains("observer") || msgLower.contains("strategy") || msgLower.contains("builder") ||
                msgLower.contains("decorator") || msgLower.contains("solid principle")) {
            return generateDesignPatternResponse(msg, language);
        }

        // 9. General Code Implementation / Generation Requests
        if (msgLower.contains("write") || msgLower.contains("create") || msgLower.contains("implement") ||
                msgLower.contains("code") || msgLower.contains("how to") || msgLower.contains("generate") ||
                msgLower.contains("build") || msgLower.contains("function") || msgLower.contains("program") ||
                msgLower.contains("example") || msgLower.contains("show me")) {
            return generateCodeImplementationResponse(msg, language, userCode, problemTitle);
        }

        // 10. Concept & Computer Science Explanations
        if (msgLower.contains("explain") || msgLower.contains("what is") || msgLower.contains("difference") ||
                msgLower.contains("how does") || msgLower.contains("why") || msgLower.contains("concept") ||
                msgLower.contains("define") || msgLower.contains("tell me about")) {
            return generateConceptExplanationResponse(msg, language);
        }

        // 11. Refactoring & Code Optimization
        if (msgLower.contains("refactor") || msgLower.contains("optimize") || msgLower.contains("clean") ||
                msgLower.contains("improve") || msgLower.contains("better") || msgLower.contains("efficient")) {
            return generateRefactorResponse(userCode, language, problemTitle, msg);
        }

        // 12. General AI Assistant — catch-all for any coding question
        return generateGeneralCodingResponse(msg, language, problemTitle);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Intent Detector — does the user want code or just an explanation?
    // ─────────────────────────────────────────────────────────────────────────

    private boolean wantsCode(String msgLower) {
        return msgLower.contains("write") || msgLower.contains("code") ||
               msgLower.contains("implement") || msgLower.contains("create") ||
               msgLower.contains("generate") || msgLower.contains("build") ||
               msgLower.contains("program") || msgLower.contains("function") ||
               msgLower.contains("show me") || msgLower.contains("example") ||
               msgLower.contains("snippet") || msgLower.contains("syntax") ||
               msgLower.contains("sample") || msgLower.contains("give me code") ||
               msgLower.contains("in java") || msgLower.contains("in python") ||
               msgLower.contains("in c++") || msgLower.contains("in javascript") ||
               msgLower.contains("in kotlin") || msgLower.contains("in go") ||
               msgLower.contains("how to code") || msgLower.contains("how to implement");
    }

    private boolean hasExplicitLanguage(String msgLower) {
        if (msgLower == null) return false;
        return msgLower.contains("python") || msgLower.contains("typescript") ||
               msgLower.contains("javascript") || msgLower.contains(" js ") || msgLower.endsWith(" js") || msgLower.contains("node.js") ||
               msgLower.contains("kotlin") || msgLower.contains("swift") ||
               msgLower.contains("golang") || msgLower.contains(" go ") || msgLower.endsWith(" go") || msgLower.contains("go lang") ||
               msgLower.contains("rust") || msgLower.contains("c#") || msgLower.contains("csharp") || msgLower.contains(".net") ||
               msgLower.contains("c++") || msgLower.contains("cpp") ||
               msgLower.contains("php") || msgLower.contains("ruby") || msgLower.contains("rails") ||
               msgLower.contains(" sql") || msgLower.contains("mysql") || msgLower.contains("postgresql") ||
               (msgLower.contains("java") && !msgLower.contains("javascript"));
    }

    private String detectLanguage(String msgLower, String fallbackLang) {
        if (msgLower != null) {
            if (msgLower.contains("python")) return "Python";
            if (msgLower.contains("typescript")) return "TypeScript";
            if (msgLower.contains("javascript") || msgLower.contains(" js ") || msgLower.endsWith(" js") || msgLower.contains("node.js")) return "JavaScript";
            if (msgLower.contains("kotlin")) return "Kotlin";
            if (msgLower.contains("swift")) return "Swift";
            if (msgLower.contains("golang") || msgLower.contains(" go ") || msgLower.endsWith(" go") || msgLower.contains("go lang")) return "Go";
            if (msgLower.contains("rust")) return "Rust";
            if (msgLower.contains("c#") || msgLower.contains("csharp") || msgLower.contains(".net")) return "C#";
            if (msgLower.contains("c++") || msgLower.contains("cpp")) return "C++";
            if (msgLower.contains("php")) return "PHP";
            if (msgLower.contains("ruby") || msgLower.contains("rails")) return "Ruby";
            if (msgLower.contains(" sql") || msgLower.contains("mysql") || msgLower.contains("postgresql")) return "SQL";
            if (msgLower.contains("java") && !msgLower.contains("javascript")) return "Java";
        }
        return fallbackLang != null && !fallbackLang.trim().isEmpty() ? fallbackLang.trim() : "Java";
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Response Generators
    // ─────────────────────────────────────────────────────────────────────────

    private ChatResponse generateComplexityResponse(String msg, String problemTitle, String userCode, String language, Optional<Problem> problemOpt) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Time & Space Complexity");

        boolean hasNestedLoop = detectNestedLoop(userCode);
        String targetTime = problemOpt.map(Problem::getOptimalTimeComplexity).orElse("O(n)");
        String targetSpace = problemOpt.map(Problem::getOptimalSpaceComplexity).orElse("O(1)");
        String titleText = problemTitle != null ? " for **" + problemTitle + "**" : "";

        if (hasNestedLoop && !targetTime.contains("n²")) {
            res.setReply(
                "### ⏱️ Time & Space Complexity Analysis" + titleText + "\n\n" +
                "• **Current Time Complexity**: **O(n²)** — Quadratic due to nested loops.\n" +
                "• **Current Space Complexity**: **O(1)** — Constant auxiliary memory.\n" +
                "• **Optimal Target**: **" + targetTime + " Time | " + targetSpace + " Space**.\n\n" +
                "**How to Optimize**:\n" +
                "Replace the inner loop with a **HashMap/HashSet** for O(1) lookups, reducing overall time to O(n).\n\n" +
                "**Complexity Cheat Sheet**:\n" +
                "| Notation | Name | Example |\n" +
                "|----------|------|---------|\n" +
                "| O(1) | Constant | Array index lookup |\n" +
                "| O(log n) | Logarithmic | Binary Search |\n" +
                "| O(n) | Linear | Single loop |\n" +
                "| O(n log n) | Linearithmic | Merge Sort |\n" +
                "| O(n²) | Quadratic | Nested loops |\n" +
                "| O(2ⁿ) | Exponential | Naive recursion |"
            );
            res.setHint("Use a HashMap to eliminate the inner loop and achieve O(n) time complexity.");
        } else {
            res.setReply(
                "### ⏱️ Time & Space Complexity Analysis" + titleText + "\n\n" +
                "• **Time Complexity**: **" + targetTime + "** — Optimal for this problem.\n" +
                "• **Space Complexity**: **" + targetSpace + "** — Efficient memory usage.\n\n" +
                "**Big-O Complexity Cheat Sheet**:\n" +
                "| Notation | Name | Example |\n" +
                "|----------|------|---------|\n" +
                "| O(1) | Constant | HashMap lookup |\n" +
                "| O(log n) | Logarithmic | Binary Search |\n" +
                "| O(n) | Linear | Single for-loop |\n" +
                "| O(n log n) | Linearithmic | QuickSort / MergeSort |\n" +
                "| O(n²) | Quadratic | Nested loops |\n" +
                "| O(2ⁿ) | Exponential | Naive recursive subsets |\n\n" +
                "**Your solution has optimal scaling!** ✅"
            );
        }
        return res;
    }

    private ChatResponse generateDebuggingResponse(String msg, String problemTitle, String userCode, String language, String errorLog) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Code Debugger");

        String errDetail = (errorLog != null && !errorLog.isEmpty()) ? errorLog : "No error log provided. Analyzing based on code patterns.";
        boolean showCode = wantsCode(msg.toLowerCase()) || (userCode != null && userCode.trim().length() > 15);

        StringBuilder reply = new StringBuilder();
        reply.append("### 🐛 AI Code Debugger (").append(language).append(")\n\n");
        reply.append("**Error / Issue Details**:\n```text\n").append(errDetail).append("\n```\n\n");
        reply.append("**Common Root Causes & Fixes**:\n\n");
        reply.append("1. **NullPointerException / Null Reference** — Always initialize variables before use\n");
        reply.append("2. **Array Index Out of Bounds** — Use `i < arr.length` (not `i <= arr.length`)\n");
        reply.append("3. **Off-by-One Errors** — Trace with small test cases: `[1]`, `[]`, `[1,2]`\n");
        reply.append("4. **Integer Overflow** — Use `long` for large calculations\n");
        reply.append("5. **Wrong Return Type** — Ensure all code branches return a value\n\n");

        if (showCode) {
            String debugCode = getDebugExample(language);
            reply.append("**Example Fix (").append(language).append(")**:\n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(debugCode).append("\n```\n\n");
            res.setCodeSnippet(debugCode);
        }

        reply.append("**Debug Strategy**:\n");
        reply.append("• Add print statements at each step to trace values\n");
        reply.append("• Test with edge cases: empty input, single element, all-same values\n");
        reply.append("• Comment out half the code to isolate the problem");

        res.setReply(reply.toString());
        res.setHint("Start debugging by testing with the smallest possible input first.");
        return res;
    }

    private ChatResponse generateSqlResponse(String msg) {
        ChatResponse res = new ChatResponse();
        res.setTopic("SQL & Database Engineering");

        boolean showCode = wantsCode(msg.toLowerCase());

        StringBuilder reply = new StringBuilder();
        reply.append("### 🗄️ SQL & Database Guide\n\n");
        reply.append("**Your question**: \"").append(msg).append("\"\n\n");
        reply.append("**Key SQL Concepts**:\n");
        reply.append("| Keyword | Purpose |\n");
        reply.append("|---------|----------|\n");
        reply.append("| `SELECT` | Retrieve columns |\n");
        reply.append("| `WHERE` | Filter rows |\n");
        reply.append("| `JOIN` | Combine tables |\n");
        reply.append("| `GROUP BY` | Aggregate rows |\n");
        reply.append("| `HAVING` | Filter groups |\n");
        reply.append("| `ORDER BY` | Sort results |\n");
        reply.append("| `LIMIT` | Restrict row count |\n");
        reply.append("| `DISTINCT` | Remove duplicates |\n\n");

        if (showCode) {
            String sqlCode =
                "-- SELECT with JOIN\n" +
                "SELECT e.id, e.name, e.salary, d.department_name\n" +
                "FROM employees e\n" +
                "INNER JOIN departments d ON e.department_id = d.id\n" +
                "WHERE e.salary > 50000\n" +
                "ORDER BY e.salary DESC;\n\n" +
                "-- Find Second Highest Salary\n" +
                "SELECT MAX(salary) AS second_highest\n" +
                "FROM employees\n" +
                "WHERE salary < (SELECT MAX(salary) FROM employees);";
            reply.append("**Example Queries**:\n");
            reply.append("```sql\n").append(sqlCode).append("\n```\n\n");
            res.setCodeSnippet(sqlCode);
        }

        reply.append("**Performance Tips**:\n");
        reply.append("• Index foreign key columns used in JOINs\n");
        reply.append("• Use `EXPLAIN` to analyze query execution plans\n");
        reply.append("• Avoid `SELECT *` in production — specify only needed columns");

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateFrameworkResponse(String msg, String language) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Web Development & Frameworks");

        String msgLower = msg.toLowerCase();
        String code;
        String explanation;

        if (msgLower.contains("react") || msgLower.contains("component") || msgLower.contains("hook")) {
            code =
                "// React Hook & Component Example\n" +
                "import React, { useState, useEffect } from 'react';\n" +
                "import axios from 'axios';\n\n" +
                "const DataList = () => {\n" +
                "  const [data, setData] = useState([]);\n" +
                "  const [loading, setLoading] = useState(true);\n\n" +
                "  useEffect(() => {\n" +
                "    axios.get('http://localhost:8080/api/items')\n" +
                "      .then(res => setData(res.data))\n" +
                "      .catch(err => console.error(err))\n" +
                "      .finally(() => setLoading(false));\n" +
                "  }, []);\n\n" +
                "  if (loading) return <div>Loading...</div>;\n\n" +
                "  return (\n" +
                "    <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>\n" +
                "  );\n" +
                "};";
            explanation = "**React Best Practices**: Use `useState` for local state, `useEffect` for side effects (API calls), and `key` props in lists.";
        } else if (msgLower.contains("spring") || msgLower.contains("controller") || msgLower.contains("endpoint")) {
            code =
                "// Spring Boot REST Controller\n" +
                "@RestController\n" +
                "@RequestMapping(\"/api/items\")\n" +
                "public class ItemController {\n\n" +
                "    @Autowired private ItemService itemService;\n\n" +
                "    @GetMapping\n" +
                "    public ResponseEntity<List<Item>> getAll() {\n" +
                "        return ResponseEntity.ok(itemService.findAll());\n" +
                "    }\n\n" +
                "    @PostMapping\n" +
                "    public ResponseEntity<Item> create(@RequestBody @Valid Item item) {\n" +
                "        return ResponseEntity.status(201).body(itemService.save(item));\n" +
                "    }\n\n" +
                "    @GetMapping(\"/{id}\")\n" +
                "    public ResponseEntity<Item> getById(@PathVariable Long id) {\n" +
                "        return itemService.findById(id)\n" +
                "            .map(ResponseEntity::ok)\n" +
                "            .orElse(ResponseEntity.notFound().build());\n" +
                "    }\n" +
                "}";
            explanation = "**Spring Boot Best Practices**: Use `@RestController`, `@RequestBody`, `ResponseEntity` for proper HTTP status codes, and `@Valid` for input validation.";
        } else {
            code =
                "// Axios API Service (React/JavaScript)\n" +
                "import axios from 'axios';\n\n" +
                "const API = axios.create({ baseURL: 'http://localhost:8080/api' });\n\n" +
                "API.interceptors.request.use(config => {\n" +
                "  const token = localStorage.getItem('token');\n" +
                "  if (token) config.headers.Authorization = `Bearer ${token}`;\n" +
                "  return config;\n" +
                "});\n\n" +
                "export const getItems = () => API.get('/items');\n" +
                "export const createItem = (data) => API.post('/items', data);\n" +
                "export const updateItem = (id, data) => API.put(`/items/${id}`, data);\n" +
                "export const deleteItem = (id) => API.delete(`/items/${id}`);";
            explanation = "**REST API Integration**: Centralize your API with an Axios instance and attach JWT tokens via interceptors.";
        }

        boolean showCode = wantsCode(msgLower);

        StringBuilder reply = new StringBuilder();
        reply.append("### 🌐 Web Development & Framework Guide\n\n");
        reply.append("**Your question**: \"").append(msg).append("\"\n\n");
        reply.append(explanation).append("\n");

        if (showCode) {
            reply.append("\n**Example**:\n```javascript\n").append(code).append("\n```");
            res.setCodeSnippet(code);
        } else {
            reply.append("\nWant to see a code example? Ask me to **show me an example** or **implement it**!");
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateDataStructureResponse(String msg, String language) {
        ChatResponse res = new ChatResponse();
        String topic = extractTopicFromPrompt(msg);
        res.setTopic("Data Structure: " + topic);

        boolean showCode = wantsCode(msg.toLowerCase());

        StringBuilder reply = new StringBuilder();
        reply.append("### 🏗️ Data Structure Guide: ").append(topic).append("\n\n");
        reply.append("**Your question**: \"").append(msg).append("\"\n\n");
        reply.append("**Data Structure Complexity Reference**:\n");
        reply.append("| Structure | Access | Search | Insert | Delete |\n");
        reply.append("|-----------|--------|--------|--------|--------|\n");
        reply.append("| Array | O(1) | O(n) | O(n) | O(n) |\n");
        reply.append("| HashMap | O(1) | O(1) | O(1) | O(1) |\n");
        reply.append("| LinkedList | O(n) | O(n) | O(1) | O(1) |\n");
        reply.append("| Binary Tree | O(log n) | O(log n) | O(log n) | O(log n) |\n");
        reply.append("| Stack/Queue | O(n) | O(n) | O(1) | O(1) |\n");
        reply.append("| Heap | O(1) | O(n) | O(log n) | O(log n) |\n\n");
        reply.append(getConceptDescription(msg.toLowerCase()));

        if (showCode) {
            String code = getDataStructureCode(msg.toLowerCase(), language);
            reply.append("\n\n**Implementation in ").append(language).append("**:\n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(code).append("\n```");
            res.setCodeSnippet(code);
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateSortingSearchingResponse(String msg, String language) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Sorting & Searching Algorithms");

        String msgLower = msg.toLowerCase();
        boolean showCode = wantsCode(msgLower);
        String algName;

        if (msgLower.contains("binary search")) algName = "Binary Search";
        else if (msgLower.contains("merge sort")) algName = "Merge Sort";
        else if (msgLower.contains("quick") || msgLower.contains("quicksort")) algName = "QuickSort";
        else algName = "Sorting & Searching";

        StringBuilder reply = new StringBuilder();
        reply.append("### 🔍 ").append(algName).append(" (" ).append(language).append(")\n\n");
        reply.append("**Algorithm Complexity Reference**:\n");
        reply.append("| Algorithm | Best | Average | Worst | Space |\n");
        reply.append("|-----------|------|---------|-------|-------|\n");
        reply.append("| Binary Search | O(log n) | O(log n) | O(log n) | O(1) |\n");
        reply.append("| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n");
        reply.append("| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n");
        reply.append("| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n");
        reply.append("| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |\n\n");
        reply.append(getConceptDescription(msgLower));

        if (showCode) {
            String code;
            if (msgLower.contains("binary search")) code = getBinarySearchCode(language);
            else if (msgLower.contains("merge sort")) code = getMergeSortCode(language);
            else if (msgLower.contains("quick") || msgLower.contains("quicksort")) code = getQuickSortCode(language);
            else code = getGenericSortCode(language);
            reply.append("\n\n**Implementation**:\n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(code).append("\n```");
            res.setCodeSnippet(code);
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateDpRecursionResponse(String msg, String language) {
        ChatResponse res = new ChatResponse();
        String topic = extractTopicFromPrompt(msg);
        res.setTopic("Dynamic Programming & Recursion");

        boolean showCode = wantsCode(msg.toLowerCase());

        StringBuilder reply = new StringBuilder();
        reply.append("### 🧠 Dynamic Programming / Recursion: ").append(topic).append("\n\n");
        reply.append("**Your question**: \"").append(msg).append("\"\n\n");
        reply.append("**How to Approach DP**:\n");
        reply.append("1. **Identify overlapping subproblems** — Can the problem be broken into smaller repeated subproblems?\n");
        reply.append("2. **Define the state** — What does `dp[i]` represent?\n");
        reply.append("3. **Recurrence relation** — How does `dp[i]` relate to previous states?\n");
        reply.append("4. **Base cases** — Define `dp[0]`, `dp[1]`\n");
        reply.append("5. **Top-down (Memoization) or Bottom-up (Tabulation)**\n\n");
        reply.append("**Common DP Patterns**:\n");
        reply.append("• **Fibonacci / Climbing Stairs** — Linear DP\n");
        reply.append("• **0/1 Knapsack** — 2D DP `dp[i][w]`\n");
        reply.append("• **Coin Change** — Unbounded knapsack\n");
        reply.append("• **LCS / Edit Distance** — String DP\n");
        reply.append("• **LIS** — Patience sorting or DP\n");

        if (showCode) {
            String code = getDpCode(msg.toLowerCase(), language);
            reply.append("\n**Implementation in ").append(language).append("**:\n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(code).append("\n```");
            res.setCodeSnippet(code);
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateDesignPatternResponse(String msg, String language) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Design Patterns");

        String msgLower = msg.toLowerCase();
        boolean showCode = wantsCode(msgLower);
        String patternName;
        String patternCode = null;

        if (msgLower.contains("singleton")) {
            patternName = "Singleton Pattern";
            patternCode =
                "// Singleton Pattern (Thread-Safe)\n" +
                "public class DatabaseConnection {\n" +
                "    private static volatile DatabaseConnection instance;\n" +
                "    private DatabaseConnection() {}\n" +
                "    public static DatabaseConnection getInstance() {\n" +
                "        if (instance == null) {\n" +
                "            synchronized (DatabaseConnection.class) {\n" +
                "                if (instance == null) instance = new DatabaseConnection();\n" +
                "            }\n" +
                "        }\n" +
                "        return instance;\n" +
                "    }\n" +
                "}";
        } else if (msgLower.contains("factory")) {
            patternName = "Factory Pattern";
            patternCode =
                "// Factory Pattern\n" +
                "public interface Animal { void speak(); }\n" +
                "class Dog implements Animal { public void speak() { System.out.println(\"Woof!\"); } }\n" +
                "class Cat implements Animal { public void speak() { System.out.println(\"Meow!\"); } }\n" +
                "public class AnimalFactory {\n" +
                "    public static Animal create(String type) {\n" +
                "        return switch (type.toLowerCase()) {\n" +
                "            case \"dog\" -> new Dog();\n" +
                "            case \"cat\" -> new Cat();\n" +
                "            default -> throw new IllegalArgumentException(\"Unknown: \" + type);\n" +
                "        };\n" +
                "    }\n" +
                "}";
        } else {
            patternName = "Observer Pattern";
            patternCode =
                "// Observer Pattern\n" +
                "interface Observer { void update(String event); }\n" +
                "class EventBus {\n" +
                "    private List<Observer> observers = new ArrayList<>();\n" +
                "    public void subscribe(Observer o) { observers.add(o); }\n" +
                "    public void publish(String event) {\n" +
                "        observers.forEach(o -> o.update(event));\n" +
                "    }\n" +
                "}";
        }

        StringBuilder reply = new StringBuilder();
        reply.append("### 🏛️ Design Pattern: ").append(patternName).append("\n\n");
        reply.append("**Your question**: \"").append(msg).append("\"\n\n");
        reply.append("**Common Design Patterns**:\n");
        reply.append("| Pattern | Type | Purpose |\n");
        reply.append("|---------|------|----------|\n");
        reply.append("| Singleton | Creational | One instance only |\n");
        reply.append("| Factory | Creational | Create objects without specifying class |\n");
        reply.append("| Builder | Creational | Build complex objects step-by-step |\n");
        reply.append("| Observer | Behavioral | Event publish/subscribe |\n");
        reply.append("| Strategy | Behavioral | Swap algorithms at runtime |\n");
        reply.append("| Decorator | Structural | Add behavior without subclassing |\n");

        if (showCode && patternCode != null) {
            reply.append("\n**Implementation**:\n");
            reply.append("```java\n").append(patternCode).append("\n```");
            res.setCodeSnippet(patternCode);
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateCodeImplementationResponse(String userMsg, String language, String userCode, String problemTitle) {
        ChatResponse res = new ChatResponse();
        res.setTopic(language + " Implementation");

        String topic = extractTopicFromPrompt(userMsg);
        String code = generateSmartCodeSnippet(topic, language, userMsg);

        res.setReply(
            "### 💻 AI Code Generator (" + language + ")\n\n" +
            "**Your request**: \"" + userMsg + "\"\n\n" +
            "**Implementation for: " + topic + "**\n" +
            "```" + getLangHighlight(language) + "\n" + code + "\n```\n\n" +
            "**Key Points**:\n" +
            "• Includes null safety and boundary checks\n" +
            "• Uses idiomatic " + language + " conventions\n" +
            "• Ask me to explain any part or request a different approach!"
        );
        res.setCodeSnippet(code);
        return res;
    }

    private ChatResponse generateConceptExplanationResponse(String userMsg, String language) {
        ChatResponse res = new ChatResponse();
        String concept = extractTopicFromPrompt(userMsg);
        res.setTopic(concept);

        boolean showCode = wantsCode(userMsg.toLowerCase());

        StringBuilder reply = new StringBuilder();
        reply.append("### 📚 Concept Explanation: ").append(concept).append("\n\n");
        reply.append("**Your question**: \"").append(userMsg).append("\"\n\n");
        reply.append("**What is ").append(concept).append("?**\n");
        reply.append(getConceptDescription(userMsg.toLowerCase())).append("\n\n");
        reply.append("**Key Principles**:\n");
        reply.append("1. **Efficiency** — Minimizes computation and memory overhead\n");
        reply.append("2. **Scalability** — Maintains performance as input size grows\n");
        reply.append("3. **Correctness** — Handles all edge cases (empty, null, single element)\n");

        if (showCode) {
            String code = generateSmartCodeSnippet(concept, language, userMsg);
            reply.append("\n\n**Example Code (").append(language).append(")**: \n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(code).append("\n```");
            res.setCodeSnippet(code);
        } else {
            reply.append("\n\nWant to see a code example? Just ask me to **show the code** or **implement it**!");
        }

        res.setReply(reply.toString());
        return res;
    }

    private ChatResponse generateRefactorResponse(String userCode, String language, String problemTitle, String userMsg) {
        ChatResponse res = new ChatResponse();
        res.setTopic("Code Optimization & Refactoring");

        boolean hasUserCode = userCode != null && userCode.trim().length() > 15;
        String code = hasUserCode ? userCode.trim() : generateSmartCodeSnippet("Optimized Solution", language, userMsg);

        res.setReply(
            "### ⚡ AI Code Refactoring Guide\n\n" +
            "**Your request**: \"" + userMsg + "\"\n\n" +
            (hasUserCode ? "**Your Code (Before)**:\n" : "**Example Optimized Solution**:\n") +
            "```" + getLangHighlight(language) + "\n" + code + "\n```\n\n" +
            "**Refactoring Checklist**:\n" +
            "✅ **Naming** — Use clear, descriptive names (`getUserById` not `getU`)\n" +
            "✅ **Single Responsibility** — Each function does one thing\n" +
            "✅ **Avoid Duplication (DRY)** — Extract repeated logic into helper methods\n" +
            "✅ **Complexity** — Eliminate O(n²) with HashMap/Set for O(n)\n" +
            "✅ **Early Returns** — Reduce nesting with guard clauses\n" +
            "✅ **Magic Numbers** — Replace `7` with `final int DAYS_PER_WEEK = 7`\n" +
            "✅ **Comments** — Explain WHY, not WHAT the code does\n\n" +
            "Paste your specific code and I'll provide a detailed refactor!"
        );
        res.setCodeSnippet(code);
        return res;
    }

    private ChatResponse generateGeneralCodingResponse(String userMsg, String language, String problemTitle) {
        ChatResponse res = new ChatResponse();
        res.setTopic("General AI Coding Assistant");

        String concept = extractTopicFromPrompt(userMsg);
        boolean showCode = wantsCode(userMsg.toLowerCase());

        StringBuilder reply = new StringBuilder();
        reply.append("### 🤖 CodePulse AI\n\n");
        reply.append("**Your question**: \"").append(userMsg).append("\"\n\n");
        reply.append("**Concept Overview**: ").append(getConceptDescription(userMsg.toLowerCase())).append("\n");

        if (showCode) {
            String code = generateSmartCodeSnippet(concept, language, userMsg);
            reply.append("\n**Code Example (").append(language).append(")**: \n");
            reply.append("```").append(getLangHighlight(language)).append("\n").append(code).append("\n```\n\n");
            reply.append("• **Time Complexity**: O(n)\n");
            reply.append("• **Space Complexity**: O(n)\n");
            res.setCodeSnippet(code);
        } else {
            reply.append("\nFeel free to ask follow-up questions! If you'd like a code example, just say **\"show me the code\"** or **\"implement it in " + language + "\"**.");
        }

        res.setReply(reply.toString());
        return res;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private boolean detectNestedLoop(String code) {
        if (code == null) return false;
        int count = 0;
        for (String line : code.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.startsWith("for") || trimmed.startsWith("while")) count++;
        }
        return count >= 2;
    }

    private String extractTopicFromPrompt(String msg) {
        if (msg == null || msg.isEmpty()) return "Coding Solution";
        String lower = msg.toLowerCase();
        if (lower.contains("two sum")) return "Two Sum Problem";
        if (lower.contains("three sum")) return "Three Sum Problem";
        if (lower.contains("binary search")) return "Binary Search";
        if (lower.contains("merge sort")) return "Merge Sort";
        if (lower.contains("quick sort") || lower.contains("quicksort")) return "QuickSort";
        if (lower.contains("hashmap") || lower.contains("hash table") || lower.contains("hash map")) return "HashMap / Hash Table";
        if (lower.contains("linked list")) return "Linked List";
        if (lower.contains("binary tree") || lower.contains("bst")) return "Binary Search Tree";
        if (lower.contains("tree")) return "Tree Traversal";
        if (lower.contains("graph") || lower.contains("bfs") || lower.contains("dfs")) return "Graph BFS/DFS";
        if (lower.contains("dynamic programming") || lower.contains(" dp ")) return "Dynamic Programming";
        if (lower.contains("fibonacci")) return "Fibonacci Sequence";
        if (lower.contains("knapsack")) return "0/1 Knapsack Problem";
        if (lower.contains("coin change")) return "Coin Change Problem";
        if (lower.contains("recursion")) return "Recursion";
        if (lower.contains("palindrome")) return "Palindrome Check";
        if (lower.contains("reverse")) return "Reverse Array / String";
        if (lower.contains("sort")) return "Sorting Algorithm";
        if (lower.contains("stack")) return "Stack Data Structure";
        if (lower.contains("queue")) return "Queue Data Structure";
        if (lower.contains("heap") || lower.contains("priority queue")) return "Heap / Priority Queue";
        if (lower.contains("string")) return "String Manipulation";
        if (lower.contains("array")) return "Array Operations";
        if (lower.contains("factorial")) return "Factorial";
        if (lower.contains("prime")) return "Prime Numbers";
        if (lower.contains("anagram")) return "Anagram Detection";
        if (lower.contains("maximum") || lower.contains("minimum")) return "Max/Min Finding";
        return "General Coding Solution";
    }

    private String getConceptDescription(String msgLower) {
        if (msgLower.contains("recursion")) return "Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Every recursive function needs a **base case** (stop condition) and a **recursive case**.";
        if (msgLower.contains("dynamic programming") || msgLower.contains(" dp ")) return "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and storing results (**memoization** or **tabulation**) to avoid redundant computation.";
        if (msgLower.contains("hashmap") || msgLower.contains("hash table")) return "A HashMap stores key-value pairs with O(1) average time for insert, delete, and lookup operations using a hash function to compute storage indices.";
        if (msgLower.contains("binary search")) return "Binary Search finds a target in a **sorted array** by repeatedly halving the search space. Requires a sorted input and runs in O(log n) time.";
        if (msgLower.contains("graph") || msgLower.contains("bfs") || msgLower.contains("dfs")) return "Graphs model relationships between nodes (vertices) connected by edges. **BFS** (Breadth-First Search) explores layer by layer; **DFS** (Depth-First Search) explores as far as possible before backtracking.";
        if (msgLower.contains("linked list")) return "A Linked List is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, insertion/deletion is O(1) but random access is O(n).";
        if (msgLower.contains("tree") || msgLower.contains("bst")) return "A Binary Search Tree (BST) stores values such that for any node: left subtree < node < right subtree. Enables O(log n) search, insert, and delete on balanced trees.";
        if (msgLower.contains("stack")) return "A Stack is a LIFO (Last In, First Out) data structure. Main operations: `push` (add to top), `pop` (remove from top), `peek` (view top). Used for function call stacks, undo operations, and expression evaluation.";
        if (msgLower.contains("queue")) return "A Queue is a FIFO (First In, First Out) data structure. Used in BFS, task scheduling, and message processing.";
        return "This is a fundamental concept in computer science and software engineering that helps solve computational problems efficiently and elegantly.";
    }

    private String getLangHighlight(String lang) {
        if (lang == null) return "java";
        String l = lang.toLowerCase();
        if (l.contains("python")) return "python";
        if (l.contains("typescript")) return "typescript";
        if (l.contains("javascript") || l.contains("js")) return "javascript";
        if (l.contains("cpp") || l.contains("c++")) return "cpp";
        if (l.contains("c#") || l.contains("csharp")) return "csharp";
        if (l.contains("go") && !l.contains("django")) return "go";
        if (l.contains("rust")) return "rust";
        if (l.contains("kotlin")) return "kotlin";
        if (l.contains("swift")) return "swift";
        if (l.contains("php")) return "php";
        if (l.contains("ruby")) return "ruby";
        if (l.contains("sql")) return "sql";
        if (l.contains(" c") || l.equals("c")) return "c";
        return "java";
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Code Snippet Generators  (All 14 Languages)
    // ─────────────────────────────────────────────────────────────────────────

    private String generateSmartCodeSnippet(String topic, String language, String userMsg) {
        String l = language.toLowerCase();
        String msgLower = userMsg != null ? userMsg.toLowerCase() : "";

        // Pick snippet by topic
        if (msgLower.contains("fibonacci") || topic.toLowerCase().contains("fibonacci")) {
            return getFibonacciCode(language);
        }
        if (msgLower.contains("factorial")) {
            return getFactorialCode(language);
        }
        if (msgLower.contains("binary search") || topic.toLowerCase().contains("binary search")) {
            return getBinarySearchCode(language);
        }
        if (msgLower.contains("palindrome")) {
            return getPalindromeCode(language);
        }
        if (msgLower.contains("reverse")) {
            return getReverseCode(language);
        }
        if (msgLower.contains("linked list")) {
            return getLinkedListCode(language);
        }
        if (msgLower.contains("stack")) {
            return getStackCode(language);
        }
        if (msgLower.contains("queue")) {
            return getQueueCode(language);
        }
        if (msgLower.contains("graph") || msgLower.contains("bfs") || msgLower.contains("dfs")) {
            return getGraphCode(language);
        }
        if (msgLower.contains("merge sort")) {
            return getMergeSortCode(language);
        }
        if (msgLower.contains("quick") || msgLower.contains("quicksort")) {
            return getQuickSortCode(language);
        }

        // Default: Two Sum with HashMap (language-specific)
        return getTwoSumCode(language);
    }

    private String getTwoSumCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Two Sum — O(n) Time, O(n) Space\n" +
                   "def two_sum(nums, target):\n" +
                   "    seen = {}  # value -> index\n" +
                   "    for i, num in enumerate(nums):\n" +
                   "        complement = target - num\n" +
                   "        if complement in seen:\n" +
                   "            return [seen[complement], i]\n" +
                   "        seen[num] = i\n" +
                   "    return []\n\n" +
                   "# Test\n" +
                   "print(two_sum([2, 7, 11, 15], 9))  # [0, 1]";
        } else if (l.contains("typescript")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "function twoSum(nums: number[], target: number): number[] {\n" +
                   "  const map = new Map<number, number>();\n" +
                   "  for (let i = 0; i < nums.length; i++) {\n" +
                   "    const diff = target - nums[i];\n" +
                   "    if (map.has(diff)) return [map.get(diff)!, i];\n" +
                   "    map.set(nums[i], i);\n" +
                   "  }\n" +
                   "  return [];\n" +
                   "}\n\n" +
                   "console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]";
        } else if (l.contains("javascript") || l.contains("js")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "function twoSum(nums, target) {\n" +
                   "  const map = new Map();\n" +
                   "  for (let i = 0; i < nums.length; i++) {\n" +
                   "    const diff = target - nums[i];\n" +
                   "    if (map.has(diff)) return [map.get(diff), i];\n" +
                   "    map.set(nums[i], i);\n" +
                   "  }\n" +
                   "  return [];\n" +
                   "}\n\n" +
                   "console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]";
        } else if (l.contains("cpp") || l.contains("c++")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "#include <iostream>\n" +
                   "#include <vector>\n" +
                   "#include <unordered_map>\n" +
                   "using namespace std;\n\n" +
                   "vector<int> twoSum(vector<int>& nums, int target) {\n" +
                   "    unordered_map<int, int> seen;\n" +
                   "    for (int i = 0; i < nums.size(); i++) {\n" +
                   "        int diff = target - nums[i];\n" +
                   "        if (seen.count(diff)) return {seen[diff], i};\n" +
                   "        seen[nums[i]] = i;\n" +
                   "    }\n" +
                   "    return {};\n" +
                   "}";
        } else if (l.contains("go") || l.contains("golang")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "package main\n\n" +
                   "import \"fmt\"\n\n" +
                   "func twoSum(nums []int, target int) []int {\n" +
                   "    seen := make(map[int]int)\n" +
                   "    for i, num := range nums {\n" +
                   "        diff := target - num\n" +
                   "        if j, ok := seen[diff]; ok {\n" +
                   "            return []int{j, i}\n" +
                   "        }\n" +
                   "        seen[num] = i\n" +
                   "    }\n" +
                   "    return nil\n" +
                   "}\n\n" +
                   "func main() {\n" +
                   "    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9)) // [0 1]\n" +
                   "}";
        } else if (l.contains("rust")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "use std::collections::HashMap;\n\n" +
                   "fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n" +
                   "    let mut seen: HashMap<i32, usize> = HashMap::new();\n" +
                   "    for (i, &num) in nums.iter().enumerate() {\n" +
                   "        let diff = target - num;\n" +
                   "        if let Some(&j) = seen.get(&diff) {\n" +
                   "            return vec![j as i32, i as i32];\n" +
                   "        }\n" +
                   "        seen.insert(num, i);\n" +
                   "    }\n" +
                   "    vec![]\n" +
                   "}\n\n" +
                   "fn main() {\n" +
                   "    println!(\"{:?}\", two_sum(vec![2, 7, 11, 15], 9)); // [0, 1]\n" +
                   "}";
        } else if (l.contains("c#") || l.contains("csharp")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "using System;\n" +
                   "using System.Collections.Generic;\n\n" +
                   "public class Solution {\n" +
                   "    public int[] TwoSum(int[] nums, int target) {\n" +
                   "        var seen = new Dictionary<int, int>();\n" +
                   "        for (int i = 0; i < nums.Length; i++) {\n" +
                   "            int diff = target - nums[i];\n" +
                   "            if (seen.ContainsKey(diff)) return new int[] { seen[diff], i };\n" +
                   "            seen[nums[i]] = i;\n" +
                   "        }\n" +
                   "        return new int[0];\n" +
                   "    }\n" +
                   "}";
        } else if (l.contains("kotlin")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "fun twoSum(nums: IntArray, target: Int): IntArray {\n" +
                   "    val seen = HashMap<Int, Int>()\n" +
                   "    for ((i, num) in nums.withIndex()) {\n" +
                   "        val diff = target - num\n" +
                   "        if (seen.containsKey(diff)) return intArrayOf(seen[diff]!!, i)\n" +
                   "        seen[num] = i\n" +
                   "    }\n" +
                   "    return intArrayOf()\n" +
                   "}\n\n" +
                   "fun main() {\n" +
                   "    println(twoSum(intArrayOf(2, 7, 11, 15), 9).toList()) // [0, 1]\n" +
                   "}";
        } else if (l.contains("swift")) {
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n" +
                   "    var seen = [Int: Int]()\n" +
                   "    for (i, num) in nums.enumerated() {\n" +
                   "        let diff = target - num\n" +
                   "        if let j = seen[diff] { return [j, i] }\n" +
                   "        seen[num] = i\n" +
                   "    }\n" +
                   "    return []\n" +
                   "}\n\n" +
                   "print(twoSum([2, 7, 11, 15], 9)) // [0, 1]";
        } else if (l.contains("php")) {
            return "<?php\n" +
                   "// Two Sum — O(n) Time, O(n) Space\n" +
                   "function twoSum(array $nums, int $target): array {\n" +
                   "    $seen = [];\n" +
                   "    foreach ($nums as $i => $num) {\n" +
                   "        $diff = $target - $num;\n" +
                   "        if (array_key_exists($diff, $seen)) {\n" +
                   "            return [$seen[$diff], $i];\n" +
                   "        }\n" +
                   "        $seen[$num] = $i;\n" +
                   "    }\n" +
                   "    return [];\n" +
                   "}\n\n" +
                   "print_r(twoSum([2, 7, 11, 15], 9)); // [0, 1]";
        } else if (l.contains("ruby")) {
            return "# Two Sum — O(n) Time, O(n) Space\n" +
                   "def two_sum(nums, target)\n" +
                   "  seen = {}\n" +
                   "  nums.each_with_index do |num, i|\n" +
                   "    diff = target - num\n" +
                   "    return [seen[diff], i] if seen.key?(diff)\n" +
                   "    seen[num] = i\n" +
                   "  end\n" +
                   "  []\n" +
                   "end\n\n" +
                   "p two_sum([2, 7, 11, 15], 9) # [0, 1]";
        } else if (l.equals("c") || (l.contains(" c") && !l.contains("c++") && !l.contains("c#"))) {
            return "// Two Sum — O(n²) naive in C (no built-in HashMap)\n" +
                   "#include <stdio.h>\n" +
                   "#include <stdlib.h>\n\n" +
                   "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n" +
                   "    int* result = (int*)malloc(2 * sizeof(int));\n" +
                   "    *returnSize = 2;\n" +
                   "    for (int i = 0; i < numsSize; i++) {\n" +
                   "        for (int j = i + 1; j < numsSize; j++) {\n" +
                   "            if (nums[i] + nums[j] == target) {\n" +
                   "                result[0] = i; result[1] = j;\n" +
                   "                return result;\n" +
                   "            }\n" +
                   "        }\n" +
                   "    }\n" +
                   "    return result;\n" +
                   "}";
        } else {
            // Default: Java
            return "// Two Sum — O(n) Time, O(n) Space\n" +
                   "import java.util.HashMap;\n" +
                   "import java.util.Map;\n\n" +
                   "public class Solution {\n" +
                   "    public int[] twoSum(int[] nums, int target) {\n" +
                   "        Map<Integer, Integer> seen = new HashMap<>();\n" +
                   "        for (int i = 0; i < nums.length; i++) {\n" +
                   "            int diff = target - nums[i];\n" +
                   "            if (seen.containsKey(diff)) return new int[]{ seen.get(diff), i };\n" +
                   "            seen.put(nums[i], i);\n" +
                   "        }\n" +
                   "        return new int[0];\n" +
                   "    }\n" +
                   "}";
        }
    }

    private String getFibonacciCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Fibonacci — Memoized O(n)\n" +
                   "def fib(n, memo={}):\n" +
                   "    if n <= 1: return n\n" +
                   "    if n in memo: return memo[n]\n" +
                   "    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n" +
                   "    return memo[n]\n\n" +
                   "print([fib(i) for i in range(10)])  # [0,1,1,2,3,5,8,13,21,34]";
        } else if (l.contains("javascript") || l.contains("typescript")) {
            return "// Fibonacci — Memoized O(n)\n" +
                   "function fib(n, memo = {}) {\n" +
                   "  if (n <= 1) return n;\n" +
                   "  if (memo[n]) return memo[n];\n" +
                   "  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n" +
                   "  return memo[n];\n" +
                   "}\n\n" +
                   "console.log(Array.from({length:10}, (_, i) => fib(i)));";
        } else if (l.contains("go")) {
            return "// Fibonacci — Bottom-up DP O(n)\n" +
                   "package main\nimport \"fmt\"\n\n" +
                   "func fib(n int) int {\n" +
                   "    if n <= 1 { return n }\n" +
                   "    dp := make([]int, n+1)\n" +
                   "    dp[1] = 1\n" +
                   "    for i := 2; i <= n; i++ { dp[i] = dp[i-1] + dp[i-2] }\n" +
                   "    return dp[n]\n" +
                   "}\n\n" +
                   "func main() { fmt.Println(fib(9)) }";
        } else if (l.contains("rust")) {
            return "// Fibonacci — Iterative O(n)\n" +
                   "fn fib(n: u64) -> u64 {\n" +
                   "    if n <= 1 { return n; }\n" +
                   "    let (mut a, mut b) = (0u64, 1u64);\n" +
                   "    for _ in 2..=n { let c = a + b; a = b; b = c; }\n" +
                   "    b\n" +
                   "}\n\n" +
                   "fn main() { println!(\"{}\", fib(10)); }";
        } else {
            return "// Fibonacci — Memoized DP O(n)\n" +
                   "import java.util.HashMap;\n\n" +
                   "public class Fibonacci {\n" +
                   "    private static HashMap<Integer,Long> memo = new HashMap<>();\n\n" +
                   "    public static long fib(int n) {\n" +
                   "        if (n <= 1) return n;\n" +
                   "        if (memo.containsKey(n)) return memo.get(n);\n" +
                   "        long result = fib(n-1) + fib(n-2);\n" +
                   "        memo.put(n, result);\n" +
                   "        return result;\n" +
                   "    }\n\n" +
                   "    public static void main(String[] args) {\n" +
                   "        for (int i = 0; i < 10; i++) System.out.print(fib(i) + \" \");\n" +
                   "    }\n" +
                   "}";
        }
    }

    private String getFactorialCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Factorial (recursive)\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))  # 120";
        } else if (l.contains("javascript") || l.contains("typescript")) {
            return "// Factorial (recursive)\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5)); // 120";
        } else if (l.contains("go")) {
            return "package main\nimport \"fmt\"\n\nfunc factorial(n int) int {\n    if n <= 1 { return 1 }\n    return n * factorial(n-1)\n}\n\nfunc main() { fmt.Println(factorial(5)) }";
        } else if (l.contains("rust")) {
            return "fn factorial(n: u64) -> u64 {\n    if n <= 1 { 1 } else { n * factorial(n - 1) }\n}\n\nfn main() { println!(\"{}\", factorial(5)); }";
        } else {
            return "public class Factorial {\n    public static long factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(factorial(5)); // 120\n    }\n}";
        }
    }

    private String getBinarySearchCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Binary Search — O(log n)\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1\n\nprint(binary_search([1,3,5,7,9], 7))  # 3";
        } else if (l.contains("javascript") || l.contains("typescript")) {
            return "// Binary Search — O(log n)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}";
        } else if (l.contains("go")) {
            return "func binarySearch(arr []int, target int) int {\n    lo, hi := 0, len(arr)-1\n    for lo <= hi {\n        mid := (lo + hi) / 2\n        if arr[mid] == target { return mid }\n        if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }\n    }\n    return -1\n}";
        } else if (l.contains("rust")) {
            return "fn binary_search(arr: &[i32], target: i32) -> Option<usize> {\n    let (mut lo, mut hi) = (0usize, arr.len());\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        match arr[mid].cmp(&target) {\n            std::cmp::Ordering::Equal => return Some(mid),\n            std::cmp::Ordering::Less => lo = mid + 1,\n            std::cmp::Ordering::Greater => hi = mid,\n        }\n    }\n    None\n}";
        } else {
            return "// Binary Search — O(log n)\npublic class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int lo = 0, hi = arr.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (arr[mid] == target) return mid;\n            else if (arr[mid] < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        return -1;\n    }\n}";
        }
    }

    private String getMergeSortCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Merge Sort — O(n log n)\ndef merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    result, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: result.append(l[i]); i += 1\n        else: result.append(r[j]); j += 1\n    return result + l[i:] + r[j:]";
        } else {
            return "// Merge Sort — O(n log n)\npublic class MergeSort {\n    public static void sort(int[] arr, int l, int r) {\n        if (l < r) {\n            int mid = (l + r) / 2;\n            sort(arr, l, mid);\n            sort(arr, mid + 1, r);\n            merge(arr, l, mid, r);\n        }\n    }\n\n    private static void merge(int[] arr, int l, int m, int r) {\n        int n1 = m - l + 1, n2 = r - m;\n        int[] left = new int[n1], right = new int[n2];\n        System.arraycopy(arr, l, left, 0, n1);\n        System.arraycopy(arr, m + 1, right, 0, n2);\n        int i = 0, j = 0, k = l;\n        while (i < n1 && j < n2) arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];\n        while (i < n1) arr[k++] = left[i++];\n        while (j < n2) arr[k++] = right[j++];\n    }\n}";
        }
    }

    private String getQuickSortCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# QuickSort — O(n log n) average\ndef quick_sort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)\n\nprint(quick_sort([3,6,8,10,1,2,1]))";
        } else {
            return "// QuickSort — O(n log n) average\npublic class QuickSort {\n    public static void sort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pivot = partition(arr, low, high);\n            sort(arr, low, pivot - 1);\n            sort(arr, pivot + 1, high);\n        }\n    }\n\n    private static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] <= pivot) {\n                i++;\n                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;\n            }\n        }\n        int tmp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = tmp;\n        return i + 1;\n    }\n}";
        }
    }

    private String getGenericSortCode(String language) {
        return getTwoSumCode(language); // fallback
    }

    private String getPalindromeCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Palindrome Check — O(n)\ndef is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]\n\nprint(is_palindrome('racecar'))  # True";
        } else if (l.contains("javascript") || l.contains("typescript")) {
            return "// Palindrome Check — O(n)\nfunction isPalindrome(s) {\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return s === s.split('').reverse().join('');\n}";
        } else {
            return "// Palindrome Check — O(n)\npublic class Palindrome {\n    public static boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            if (s.charAt(l) != s.charAt(r)) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}";
        }
    }

    private String getReverseCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Reverse Array — O(n)\ndef reverse_array(arr):\n    return arr[::-1]\n\nprint(reverse_array([1, 2, 3, 4, 5]))  # [5, 4, 3, 2, 1]";
        } else {
            return "// Reverse Array — O(n)\npublic class ReverseArray {\n    public static void reverse(int[] arr) {\n        int l = 0, r = arr.length - 1;\n        while (l < r) {\n            int tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;\n            l++; r--;\n        }\n    }\n}";
        }
    }

    private String getLinkedListCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Singly Linked List\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self): self.head = None\n\n    def append(self, val):\n        node = Node(val)\n        if not self.head: self.head = node; return\n        cur = self.head\n        while cur.next: cur = cur.next\n        cur.next = node\n\n    def to_list(self):\n        result, cur = [], self.head\n        while cur: result.append(cur.val); cur = cur.next\n        return result\n\nll = LinkedList()\nll.append(1); ll.append(2); ll.append(3)\nprint(ll.to_list())  # [1, 2, 3]";
        } else {
            return "// Singly Linked List (Java)\npublic class LinkedList<T> {\n    private static class Node<T> {\n        T val; Node<T> next;\n        Node(T val) { this.val = val; }\n    }\n\n    private Node<T> head;\n\n    public void add(T val) {\n        if (head == null) { head = new Node<>(val); return; }\n        Node<T> cur = head;\n        while (cur.next != null) cur = cur.next;\n        cur.next = new Node<>(val);\n    }\n\n    public void print() {\n        Node<T> cur = head;\n        while (cur != null) { System.out.print(cur.val + \" -> \"); cur = cur.next; }\n        System.out.println(\"null\");\n    }\n}";
        }
    }

    private String getStackCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Stack using list\nstack = []\nstack.append(1)  # push\nstack.append(2)\nstack.append(3)\nprint(stack.pop())  # 3 — LIFO\nprint(stack[-1])    # peek: 2";
        } else {
            return "// Stack (Java)\nimport java.util.ArrayDeque;\nimport java.util.Deque;\n\nDeque<Integer> stack = new ArrayDeque<>();\nstack.push(1);\nstack.push(2);\nstack.push(3);\nSystem.out.println(stack.pop());  // 3 — LIFO\nSystem.out.println(stack.peek()); // 2";
        }
    }

    private String getQueueCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Queue using deque (O(1) operations)\nfrom collections import deque\nq = deque()\nq.append(1)   # enqueue\nq.append(2)\nq.append(3)\nprint(q.popleft())  # 1 — FIFO\nprint(q[0])         # peek: 2";
        } else {
            return "// Queue (Java)\nimport java.util.LinkedList;\nimport java.util.Queue;\n\nQueue<Integer> q = new LinkedList<>();\nq.offer(1);  // enqueue\nq.offer(2);\nq.offer(3);\nSystem.out.println(q.poll());  // 1 — FIFO\nSystem.out.println(q.peek()); // 2";
        }
    }

    private String getGraphCode(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Graph BFS — O(V + E)\nfrom collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\ngraph = {0: [1, 2], 1: [3], 2: [4], 3: [], 4: []}\nprint(bfs(graph, 0))  # [0, 1, 2, 3, 4]";
        } else {
            return "// Graph BFS — O(V + E)\nimport java.util.*;\n\npublic class Graph {\n    private Map<Integer, List<Integer>> adj = new HashMap<>();\n\n    public void addEdge(int u, int v) {\n        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);\n    }\n\n    public List<Integer> bfs(int start) {\n        Set<Integer> visited = new HashSet<>();\n        Queue<Integer> queue = new LinkedList<>();\n        List<Integer> order = new ArrayList<>();\n        queue.offer(start); visited.add(start);\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            order.add(node);\n            for (int neighbor : adj.getOrDefault(node, Collections.emptyList())) {\n                if (!visited.contains(neighbor)) {\n                    visited.add(neighbor);\n                    queue.offer(neighbor);\n                }\n            }\n        }\n        return order;\n    }\n}";
        }
    }

    private String getDpCode(String msgLower, String language) {
        if (msgLower.contains("fibonacci")) return getFibonacciCode(language);
        if (msgLower.contains("coin change")) {
            String l = language.toLowerCase();
            if (l.contains("python")) {
                return "# Coin Change — Bottom-up DP O(n * amount)\ndef coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for x in range(coin, amount + 1):\n            dp[x] = min(dp[x], dp[x - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1, 5, 11], 15))  # 3";
            }
            return "// Coin Change — Bottom-up DP O(n * amount)\npublic class CoinChange {\n    public static int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        java.util.Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int coin : coins)\n            for (int x = coin; x <= amount; x++)\n                dp[x] = Math.min(dp[x], dp[x - coin] + 1);\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}";
        }
        return getFibonacciCode(language);
    }

    private String getDataStructureCode(String msgLower, String language) {
        if (msgLower.contains("linked list")) return getLinkedListCode(language);
        if (msgLower.contains("stack")) return getStackCode(language);
        if (msgLower.contains("queue")) return getQueueCode(language);
        if (msgLower.contains("graph")) return getGraphCode(language);
        return getTwoSumCode(language);
    }

    private String getDebugExample(String language) {
        String l = language.toLowerCase();
        if (l.contains("python")) {
            return "# Safe null / index check\ndef safe_get(arr, i):\n    if arr is None or i >= len(arr):\n        return None\n    return arr[i]";
        } else if (l.contains("javascript") || l.contains("typescript")) {
            return "// Safe null / index check\nfunction safeGet(arr, i) {\n  if (!arr || i >= arr.length) return null;\n  return arr[i];\n}";
        } else {
            return "// Null / bounds check (Java)\npublic Object safeGet(Object[] arr, int i) {\n    if (arr == null || i >= arr.length) return null;\n    return arr[i];\n}";
        }
    }
}
