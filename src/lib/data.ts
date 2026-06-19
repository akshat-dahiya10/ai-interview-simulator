import type { InterviewResult, Role, RoleId } from "./types";

export const ROLES: Role[] = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    tagline: "React · TypeScript · UI/UX",
    description:
      "Component architecture, state management, performance, and pixel-perfect UI craft.",
    icon: "LayoutTemplate",
    accent: "from-violet-500 to-indigo-500",
    glow: "rgba(124,58,237,0.55)",
    difficulty: "Intermediate",
    duration: "20 min",
    questions: [
      {
        id: "fe-1",
        prompt:
          "Let's start simple. Walk me through what happens, step by step, when you type a URL into the browser and hit enter — from a frontend rendering perspective.",
        acknowledge:
          "Solid breakdown of the critical render path. I like that you called out the DOM and CSSOM construction.",
      },
      {
        id: "fe-2",
        prompt:
          "Tell me about React's reconciliation and the virtual DOM. Why does it matter for performance, and when might it actually hurt you?",
        acknowledge:
          "Great nuance on when re-rendering becomes expensive and how keys help the diffing algorithm.",
      },
      {
        id: "fe-3",
        prompt:
          "Design the state architecture for a real-time collaborative editor like Google Docs. How do you handle conflicts between two simultaneous edits?",
        acknowledge:
          "Nice — covering conflict resolution with operational transforms or CRDTs shows real depth here.",
      },
      {
        id: "fe-4",
        prompt:
          "A user reports your app feels 'janky' on scroll. How do you diagnose and fix the performance issue? Walk me through your toolkit.",
        acknowledge:
          "Excellent systematic approach using the performance profiler and identifying layout thrashing.",
      },
      {
        id: "fe-5",
        prompt:
          "Finally, how would you architect a large design system so it stays consistent across 12 product teams without slowing them down?",
        acknowledge:
          "Strong answer on token-driven theming, composition, and automated visual regression.",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Engineer",
    tagline: "APIs · Databases · Scale",
    description:
      "System design, distributed systems, data modeling, and reliability engineering.",
    icon: "Server",
    accent: "from-sky-500 to-cyan-500",
    glow: "rgba(14,165,233,0.5)",
    difficulty: "Advanced",
    duration: "25 min",
    questions: [
      {
        id: "be-1",
        prompt:
          "Let's begin. Explain the difference between SQL and NoSQL databases, and walk me through a scenario where you'd choose one over the other.",
        acknowledge:
          "Good grounding in consistency trade-offs and how access patterns drive the decision.",
      },
      {
        id: "be-2",
        prompt:
          "Design the URL shortener (like bit.ly) for 100M requests per day. How do you handle redirects, collisions, and analytics?",
        acknowledge:
          "Clever use of base-62 encoding and caching hot keys at the edge — well reasoned.",
      },
      {
        id: "be-3",
        prompt:
          "How do you ensure exactly-once message processing in a distributed queue system? What are the trade-offs?",
        acknowledge:
          "Strong treatment of idempotency keys and the CAP theorem implications.",
      },
      {
        id: "be-4",
        prompt:
          "Your database CPU is pinned at 100% during a traffic spike. Walk me through your debugging and mitigation playbook.",
        acknowledge:
          "Methodical — connection pooling, read replicas, and query analysis in the right order.",
      },
      {
        id: "be-5",
        prompt:
          "How would you design a rate limiter that works across a fleet of 50 servers with consistent global limits?",
        acknowledge:
          "Excellent — token bucket with a shared store like Redis plus the sliding-window trade-offs.",
      },
    ],
  },
  {
    id: "hr",
    title: "HR & Behavioral",
    tagline: "Communication · Leadership · Fit",
    description:
      "STAR stories, conflict resolution, leadership, and culture alignment.",
    icon: "Users",
    accent: "from-fuchsia-500 to-pink-500",
    glow: "rgba(217,70,239,0.5)",
    difficulty: "All levels",
    duration: "15 min",
    questions: [
      {
        id: "hr-1",
        prompt:
          "Thanks for joining. To start, tell me about yourself and what drew you to this role specifically.",
        acknowledge:
          "Clear, structured intro that ties your background directly to the role — well done.",
      },
      {
        id: "hr-2",
        prompt:
          "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
        acknowledge:
          "Great STAR-format story — you took ownership and focused on the outcome.",
      },
      {
        id: "hr-3",
        prompt:
          "Describe a project that failed. What happened, and what did you learn from it?",
        acknowledge:
          "Honest reflection and concrete takeaways — interviewers love self-awareness.",
      },
      {
        id: "hr-4",
        prompt:
          "Tell me about a time you led without formal authority. How did you get people on board?",
        acknowledge:
          "Strong example of influence through data, empathy, and shared goals.",
      },
      {
        id: "hr-5",
        prompt:
          "Where do you see yourself in three years, and why this company?",
        acknowledge:
          "Confident, specific vision with genuine alignment to our mission. Thank you.",
      },
    ],
  },
  {
    id: "aiml",
    title: "AI / ML Engineer",
    tagline: "Models · MLOps · LLMs",
    description:
      "Model lifecycle, evaluation, retrieval systems, and production ML at scale.",
    icon: "BrainCircuit",
    accent: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.5)",
    difficulty: "Advanced",
    duration: "25 min",
    questions: [
      {
        id: "ai-1",
        prompt:
          "Let's dive in. Explain the bias-variance tradeoff and how you'd diagnose whether your model is underfitting or overfitting.",
        acknowledge:
          "Clear understanding of learning curves and regularization as a lever.",
      },
      {
        id: "ai-2",
        prompt:
          "Walk me through how you'd build a production RAG system. How do you handle retrieval quality and hallucinations?",
        acknowledge:
          "Excellent coverage of chunking, embeddings, reranking, and grounding checks.",
      },
      {
        id: "ai-3",
        prompt:
          "Your model has data drift in production and accuracy is dropping. How do you detect and respond to it?",
        acknowledge:
          "Strong answer on monitoring input distributions, shadow deployments, and retraining triggers.",
      },
      {
        id: "ai-4",
        prompt:
          "How do you evaluate an LLM-based application when there's no ground-truth label available?",
        acknowledge:
          "Great use of LLM-as-judge, human eval cohorts, and golden datasets.",
      },
      {
        id: "ai-5",
        prompt:
          "Design an ML serving infra that scales to 10K QPS with sub-100ms latency. What are your key decisions?",
        acknowledge:
          "Impressive — batching, quantization, GPU pools, and caching are all the right calls.",
      },
    ],
  },
];

export function getRole(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export function isValidRole(id: string): id is RoleId {
  return ROLES.some((r) => r.id === id);
}

const RESULT_LIBRARY: Record<RoleId, InterviewResult> = {
  frontend: {
    score: 86,
    verdict: "Strong Hire",
    headline: "You'd clear most senior frontend loops.",
    strengths: [
      "Articulated the critical render path with precision",
      "Strong grasp of reconciliation and reconciliation costs",
      "Thoughtful approach to design system composition",
    ],
    weaknesses: [
      "Didn't mention time-to-interactive metrics on the perf question",
      "Could go deeper on concurrent rendering features",
      "Missed accessibility as a first-class concern",
    ],
    improvedAnswer: {
      question:
        "A user reports your app feels 'janky' on scroll. How do you diagnose it?",
      original:
        "I'd open DevTools and check for slow functions causing the jank, then optimize them.",
      improved:
        "I'd start in the Performance tab and record a scroll trace, looking for long tasks over 50ms and forced synchronous layouts (layout thrash). I'd check whether scroll handlers are running on the main thread — if so, I'd debounce them or move work off-thread with requestIdleCallback. Next I'd verify images are lazy-loaded and GPU-accelerated (will-change), and confirm no large reflows are triggered per frame. The goal is keeping each frame under 16ms for a consistent 60fps.",
    },
    breakdown: [
      { label: "Communication", score: 92, color: "from-violet-500 to-indigo-500" },
      { label: "Technical Depth", score: 88, color: "from-sky-500 to-cyan-500" },
      { label: "Problem Solving", score: 84, color: "from-fuchsia-500 to-pink-500" },
      { label: "Code Craft", score: 80, color: "from-emerald-500 to-teal-500" },
    ],
    trend: [78, 82, 90, 85, 92],
    tips: [
      "Practice explaining trade-offs out loud — interviewers reward thinking, not just answers.",
      "Always tie performance work back to user-visible metrics like TTI and INP.",
    ],
  },
  backend: {
    score: 82,
    verdict: "Hire",
    headline: "Solid systems thinker — tighten your edge cases.",
    strengths: [
      "Excellent system decomposition on the URL shortener",
      "Clear reasoning on CAP theorem trade-offs",
      "Strong instinct for caching and read replicas",
    ],
    weaknesses: [
      "Skipped back-of-the-envelope capacity numbers",
      "Could clarify consistency guarantees more explicitly",
      "Didn't address observability and tracing in production",
    ],
    improvedAnswer: {
      question:
        "Design a rate limiter across 50 servers with a global limit.",
      original:
        "I'd use a token bucket in Redis and check it on every request.",
      improved:
        "I'd implement a sliding-window or token-bucket limiter backed by Redis, since it's globally consistent. For 50 servers, a naive Redis call per request adds latency, so I'd add a local token cache per instance with periodic sync (a 'soft' limit) and use Redis for the hard global limit. I'd pick Lua scripts for atomic check-and-decrement, shard hot keys by user, and degrade gracefully — fail-open for read traffic, fail-close for writes — based on the SLA. Finally, I'd expose limit headers and emit metrics to alert before saturation.",
    },
    breakdown: [
      { label: "System Design", score: 90, color: "from-sky-500 to-cyan-500" },
      { label: "Communication", score: 86, color: "from-violet-500 to-indigo-500" },
      { label: "Problem Solving", score: 80, color: "from-fuchsia-500 to-pink-500" },
      { label: "Reliability Mindset", score: 78, color: "from-emerald-500 to-teal-500" },
    ],
    trend: [72, 80, 85, 82, 88],
    tips: [
      "Always open design questions with clarifying questions and capacity estimates.",
      "Name your failure modes explicitly — observability wins senior loops.",
    ],
  },
  hr: {
    score: 88,
    verdict: "Strong Hire",
    headline: "Warm, structured, and self-aware.",
    strengths: [
      "Every answer used a clear STAR structure",
      "Took genuine ownership without blame",
      "Specific, quantified outcomes in your stories",
    ],
    weaknesses: [
      "Could show more curiosity about the team in reverse questions",
      "One story drifted a little long — tighten the resolution",
      "Lean into enthusiasm a touch more in the closing",
    ],
    improvedAnswer: {
      question: "Tell me about a time you had a conflict with a teammate.",
      original:
        "We disagreed on the design so I set up a meeting and we talked it out and agreed.",
      improved:
        "On a recent project, a teammate and I disagreed on the API contract. Rather than debate over Slack, I scheduled a 1:1, started by acknowledging their valid concerns, and shared the user-research data behind my proposal. We realized we were optimizing for different constraints, so we split the contract into a fast internal path and a stable public path. The outcome: we shipped on time and the relationship actually strengthened. The key learning was to seek the constraint behind the conflict, not just the compromise.",
    },
    breakdown: [
      { label: "Communication", score: 94, color: "from-violet-500 to-indigo-500" },
      { label: "Leadership", score: 88, color: "from-sky-500 to-cyan-500" },
      { label: "Self-Awareness", score: 90, color: "from-fuchsia-500 to-pink-500" },
      { label: "Culture Fit", score: 84, color: "from-emerald-500 to-teal-500" },
    ],
    trend: [85, 90, 87, 89, 92],
    tips: [
      "Have 5–6 polished STAR stories you can flex to many questions.",
      "Prepare 3 thoughtful questions about the team and growth path.",
    ],
  },
  aiml: {
    score: 84,
    verdict: "Hire",
    headline: "Deep model intuition — sharpen production framing.",
    strengths: [
      "Excellent coverage of RAG grounding and retrieval quality",
      "Strong instinct for drift monitoring",
      "Smart take on evaluation without ground-truth labels",
    ],
    weaknesses: [
      "Under-specified the cost economics of serving",
      "Could clarify how you version datasets and prompts",
      "Missed safety / red-teaming as a production concern",
    ],
    improvedAnswer: {
      question:
        "Design ML serving infra for 10K QPS at sub-100ms latency.",
      original:
        "I'd put the model behind a load balancer and scale the GPUs.",
      improved:
        "At 10K QPS under 100ms, I'd separate concerns: a model server (Triton/vLLM) behind a gateway with autoscaled GPU pools, fronted by a semantic cache for repeated queries. I'd apply quantization (INT8/FP8) and dynamic batching to maximize throughput, keep warm pools to avoid cold-starts, and co-locate embeddings with a vector store to cut network hops. I'd add a circuit breaker, a shadow tier for new model versions, and end-to-end tracing so I can pin latency to the embedding, retrieval, or inference step. Cost-wise, I'd right-size the SKU mix (A10G for embed, H100 for generation).",
    },
    breakdown: [
      { label: "Model Depth", score: 92, color: "from-emerald-500 to-teal-500" },
      { label: "MLOps", score: 82, color: "from-sky-500 to-cyan-500" },
      { label: "Communication", score: 86, color: "from-violet-500 to-indigo-500" },
      { label: "Problem Solving", score: 80, color: "from-fuchsia-500 to-pink-500" },
    ],
    trend: [76, 84, 88, 83, 90],
    tips: [
      "Frame ML answers around business impact: latency, cost, and reliability.",
      "Always include an evaluation strategy before proposing a model.",
    ],
  },
};

export function getResult(role: RoleId): InterviewResult {
  return RESULT_LIBRARY[role];
}

export const TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    role: "Senior Engineer @ Stripe",
    quote:
      "I prepped for my staff loop in a weekend. The feedback on edge cases was eerily close to what my real interviewers asked.",
    avatar: "AM",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    name: "Sofia Ramos",
    role: "ML Engineer @ Anthropic",
    quote:
      "The RAG and serving questions are no joke. Felt like talking to a senior who actually knows the trade-offs.",
    avatar: "SR",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    name: "Daniel Okafor",
    role: "Frontend Lead @ Linear",
    quote:
      "Landed offers at two FAANG companies. The performance tracking showed exactly where I was weak.",
    avatar: "DO",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    name: "Yuki Tanaka",
    role: "PM → SWE @ Shopify",
    quote:
      "As a career switcher the behavioral practice was a game changer. I walked into every interview calm and structured.",
    avatar: "YT",
    accent: "from-fuchsia-500 to-pink-500",
  },
];

export const STATS = [
  { value: "120K+", label: "Mock interviews run" },
  { value: "4.9/5", label: "Average candidate rating" },
  { value: "93%", label: "Felt more confident" },
  { value: "38", label: "Interview tracks" },
];
