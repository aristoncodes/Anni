import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Theme ── */
const C = {
    bg: '#1a1b2e',
    card: 'rgba(30, 32, 58, 0.9)',
    surface: 'rgba(255,255,255,0.04)',
    text: '#e0dce8',
    muted: '#8b87a0',
    blue: '#a9def9',
    lavender: '#c9a0dc',
    pink: '#f4a7b9',
    mint: '#b5ead7',
    gold: '#f5d89a',
    error: '#f5a5a5',
    border: 'rgba(201,160,220,0.12)',
    accepted: '#b5ead7',
    wrong: '#f5a5a5',
    tle: '#f5d89a',
};

/* ── Problems ── */
const PROBLEMS = [
    {
        id: 'A', title: 'The Optimal Match', difficulty: 800,
        tags: ['romance', 'greedy', 'soulmates', 'proof'],
        statement: [
            'You are given two people, **Person A** (Jim) and **Person B** (Jam). Each person has an array of qualities *Q* = [*q₁, q₂, ..., qₙ*].',
            'Define the **compatibility score** *C(A, B)* as the sum of all moments where Person A made Person B smile, plus the number of inside jokes shared, minus the total number of fights (which is surprisingly close to 0).',
            'Your task is to prove that among all possible pairings in the universe (population ≈ 8 × 10⁹), the pairing of **A** and **B** yields the **maximum compatibility score**.',
            'Formally, prove that for all pairs *(X, Y)* where *X ≠ A* or *Y ≠ B*:',
        ],
        formula: 'C(A, B) > C(X, Y)',
        limits: { time: '∞ seconds', memory: 'unlimited (heart-based storage)' },
        inputDesc: [
            'The first line contains a single integer *n* (1 ≤ *n* ≤ 10⁹) — the number of qualities.',
            'The second line: Person A\'s qualities: ["caring", "funny", "loyal", "cute", "loves_jam"]',
            'The third line: Person B\'s qualities: ["kind", "beautiful", "strong", "patient", "perfect"]',
        ],
        outputDesc: 'Print "MATCH FOUND" followed by the compatibility score. It can be shown the answer is always ∞.',
        exampleIn: '5\ncaring funny loyal cute loves_jam\nkind beautiful strong patient perfect',
        exampleOut: 'MATCH FOUND\nCompatibility Score: ∞\nVerdict: ❤️ ACCEPTED ❤️',
        note: 'The pairing (Jim, Jam) returns ∞. This is a well-known result in competitive romance theory. The proof is left as an exercise to the heart. 💖\n\n**Complexity:** O(1) — because it was obvious from the start.',
        solution: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string jim[] = {"caring", "funny", "loyal", "cute"};\n    string jam[] = {"kind", "beautiful", "strong", "perfect"};\n    \n    int compatibility = INT_MAX; // ∞\n    \n    // The answer is always Jim + Jam\n    // TODO: Print the verdict below!\n    cout << ________ << endl;\n    cout << ________ << endl;\n    cout << ________ << endl;\n    \n    return 0;\n}`,
    },
    {
        id: 'B', title: 'Longest Common Subsequence of Memories', difficulty: 1200,
        tags: ['dp', 'strings', 'memories', 'love'],
        statement: [
            'You are given two sequences of memories: **M₁** belonging to Jim and **M₂** belonging to Jam.',
            'Find the **Longest Common Subsequence (LCS)** of their shared memories. It is guaranteed that both sequences contain the same beautiful moments because they experienced them **together**.',
            'It can be proven that the LCS of any two people in love equals the **entire sequence** itself, because every moment together is a shared treasure.',
        ],
        formula: 'LCS(M₁, M₂) = len(M₁) = len(M₂) = ∞',
        limits: { time: 'forever', memory: 'one heart, unlimited capacity' },
        inputDesc: [
            'The first line contains *n* — the number of memories (1 ≤ *n* ≤ 10¹⁸).',
            'The second line: Jim\'s memories: ["first_chat", "first_date", "first_fight", "making_up", "falling_deeper"]',
            'The third line: Jam\'s memories: ["first_chat", "first_date", "first_fight", "making_up", "falling_deeper"]',
        ],
        outputDesc: 'Print the length of the LCS. Spoiler: it\'s always *n* because every memory is shared. 💕',
        exampleIn: '5\nfirst_chat first_date first_fight making_up falling_deeper\nfirst_chat first_date first_fight making_up falling_deeper',
        exampleOut: 'LCS Length: 5 (and counting...)\nAll memories matched ✓\nVerdict: 💕 PRECIOUS 💕',
        note: 'In competitive romance, the LCS of soulmates is always equal to the total number of moments. Each memory strengthens the bond by +∞.\n\n**Complexity:** O(love²) — grows exponentially with time together.',
        solution: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    vector<string> jim = {\n        "first_chat", "first_date",\n        "first_fight", "making_up",\n        "falling_deeper"\n    };\n    vector<string> jam = jim; // soulmates\n    \n    int lcs = jim.size(); // always n\n    \n    // TODO: Print the results!\n    cout << ________ << endl;\n    cout << ________ << endl;\n    cout << ________ << endl;\n    \n    return 0;\n}`,
    },
    {
        id: 'C', title: 'Maximum Flow of Love', difficulty: 1800,
        tags: ['graphs', 'max-flow', 'infinite', 'forever'],
        statement: [
            'You are given a directed graph **G** representing the flow of love between Jim and Jam. Each edge *(u, v)* has a capacity representing how much love can flow through it.',
            'The source node **s** is Jim\'s heart. The sink node **t** is Jam\'s heart. Find the **maximum flow** from *s* to *t*.',
            'However, there\'s a twist: every edge in this graph has **infinite capacity**, because love between Jim and Jam knows no bounds.',
            'Additionally, the graph is **bidirectional** — love flows equally in both directions, always.',
        ],
        formula: 'maxFlow(Jim.heart → Jam.heart) = ∞',
        limits: { time: 'a lifetime', memory: 'two hearts combined = ∞' },
        inputDesc: [
            'The first line contains *V* and *E* — vertices (moments) and edges (connections).',
            'Each of the next *E* lines contains *u*, *v*, *cap* — an edge from *u* to *v* with capacity *cap*.',
            'Note: All capacities are ∞ in this problem.',
        ],
        outputDesc: 'Print the maximum flow value. Since all capacities are ∞, the answer is always ∞. Also print the residual love (spoiler: there\'s always more).',
        exampleIn: '4 5\njim_heart caring ∞\ncaring kindness ∞\nkindness jam_heart ∞\njim_heart loyalty ∞\nloyalty jam_heart ∞',
        exampleOut: 'Maximum Flow: ∞ units of love\nResidual Love: still ∞\nBottleneck: NONE\nVerdict: 💖 OVERFLOWING 💖',
        note: 'Unlike traditional max-flow problems, this graph has no bottleneck because Jim and Jam\'s love is **unbounded**. The Ford-Fulkerson algorithm terminates immediately because augmenting paths always exist.\n\n**Complexity:** O(❤️) — constant time, because the answer is always love.',
        solution: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    const int INF = 1e9; // infinite love\n    \n    // Every path from Jim to Jam\n    // has infinite capacity\n    int flow = INF;\n    int residual = INF; // always more\n    \n    // TODO: Print the results!\n    cout << ________ << endl;\n    cout << ________ << endl;\n    cout << ________ << endl;\n    cout << ________ << endl;\n    \n    return 0;\n}`,
    },
];

/* ── Rating graph data ── */
const RATING_POINTS = [
    { month: 'Strangers', rating: 400, emoji: '👋' },
    { month: 'Talking', rating: 800, emoji: '💬' },
    { month: 'Friends', rating: 1200, emoji: '🤝' },
    { month: 'Best Friends', rating: 1700, emoji: '👯' },
    { month: 'Crush', rating: 2100, emoji: '🦋' },
    { month: 'Dating', rating: 2500, emoji: '💑' },
    { month: 'In Love', rating: 2800, emoji: '❤️‍🔥' },
    { month: 'Soulmates', rating: 3200, emoji: '💕' },
];

function getRatingColor(r) {
    if (r >= 2600) return C.pink;
    if (r >= 2200) return C.gold;
    if (r >= 1800) return C.lavender;
    if (r >= 1400) return C.blue;
    if (r >= 1000) return C.mint;
    return C.muted;
}

/* ── Syntax highlighting for C++ ── */
function SyntaxHighlight({ code }) {
    const keywords = ['#include', 'using', 'namespace', 'int', 'string', 'const', 'return', 'void', 'float', 'vector', 'auto', 'main', 'endl', 'cout', 'std'];
    const lines = code.split('\n');

    return (
        <pre style={{ margin: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: 1.8 }}>
            {lines.map((line, i) => (
                <div key={i} style={{ display: 'flex' }}>
                    <span style={{ color: C.muted, opacity: 0.4, width: 30, textAlign: 'right', marginRight: 16, userSelect: 'none', fontSize: 10 }}>
                        {i + 1}
                    </span>
                    <span>{highlightLine(line, keywords)}</span>
                </div>
            ))}
        </pre>
    );
}

function highlightLine(line, keywords) {
    // Comment
    if (line.trim().startsWith('//')) {
        return <span style={{ color: C.muted, fontStyle: 'italic' }}>{line}</span>;
    }
    // Preprocessor
    if (line.trim().startsWith('#')) {
        return <span style={{ color: C.lavender }}>{line}</span>;
    }

    const parts = [];
    // Split by strings first
    const segments = line.split(/("(?:[^"\\]|\\.)*")/g);
    segments.forEach((seg, si) => {
        if (seg.startsWith('"') && seg.endsWith('"')) {
            parts.push(<span key={si} style={{ color: C.pink }}>{seg}</span>);
        } else {
            // Split by words and highlight keywords
            const words = seg.split(/(\b\w+\b|[^a-zA-Z0-9_]+)/g);
            words.forEach((w, wi) => {
                if (keywords.includes(w)) {
                    parts.push(<span key={`${si}-${wi}`} style={{ color: C.lavender, fontWeight: 500 }}>{w}</span>);
                } else if (w === '________') {
                    parts.push(<span key={`${si}-${wi}`} style={{ color: C.gold, background: `${C.gold}12`, borderRadius: 3, padding: '0 4px' }}>{w}</span>);
                } else if (/^\d+$/.test(w)) {
                    parts.push(<span key={`${si}-${wi}`} style={{ color: C.blue }}>{w}</span>);
                } else {
                    parts.push(<span key={`${si}-${wi}`} style={{ color: C.text }}>{w}</span>);
                }
            });
        }
    });
    return <>{parts}</>;
}

/* ── Render formatted text with bold/italic ── */
function Fmt({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return <>{parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <b key={i}>{p.slice(2, -2)}</b>;
        if (p.startsWith('*') && p.endsWith('*')) return <i key={i}>{p.slice(1, -1)}</i>;
        return <span key={i}>{p}</span>;
    })}</>;
}

/* ── Hearts confetti component ── */
function HeartsConfetti() {
    const hearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: 10 + Math.random() * 16,
        emoji: ['💕', '❤️', '✨', '💖', '🎉', '⭐'][Math.floor(Math.random() * 6)],
    }));

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
            {hearts.map(h => (
                <motion.div key={h.id}
                    initial={{ y: '110vh', x: `${h.x}vw`, opacity: 1, scale: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.5], rotate: [0, 180, 360] }}
                    transition={{ duration: 2.5, delay: h.delay, ease: 'easeOut' }}
                    style={{ position: 'absolute', fontSize: h.size }}
                >
                    {h.emoji}
                </motion.div>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function CpProblem() {
    const [activeProblem, setActiveProblem] = useState(0);
    const [activeTab, setActiveTab] = useState('problem');
    const [code, setCode] = useState(PROBLEMS[0].solution);
    const [submitting, setSubmitting] = useState(false);
    const [verdict, setVerdict] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const textareaRef = useRef(null);

    const problem = PROBLEMS[activeProblem];

    const handleProblemChange = (idx) => {
        setActiveProblem(idx);
        setCode(PROBLEMS[idx].solution);
        setVerdict(null);
        setActiveTab('problem');
    };

    const handleSubmit = () => {
        if (submitting) return;
        setSubmitting(true);
        setVerdict(null);
        setShowConfetti(false);

        setTimeout(() => { setVerdict('test1'); }, 600);
        setTimeout(() => { setVerdict('test2'); }, 1300);
        setTimeout(() => { setVerdict('test3'); }, 2000);
        setTimeout(() => {
            setVerdict('accepted');
            setSubmitting(false);
            setShowConfetti(true);
            setSubmissions(prev => [{
                id: prev.length + 1, when: 'Just now', problem: problem.id,
                verdict: 'Accepted', time: '0ms', color: C.accepted, emoji: '✅', note: 'Jim + Jam = ∞'
            }, ...prev]);
            setTimeout(() => setShowConfetti(false), 3000);
        }, 2800);
    };

    const sectionTitle = { fontSize: 14, fontWeight: 700, color: C.lavender, marginBottom: 8, letterSpacing: 0.5 };
    const cardBase = {
        background: C.card, backdropFilter: 'blur(16px)',
        borderRadius: 14, border: `1px solid ${C.border}`,
        boxShadow: `0 4px 30px rgba(0,0,0,0.2)`,
    };

    /* ── Rating graph SVG with emoji milestones ── */
    const RatingGraph = useMemo(() => {
        const w = 640, h = 220, px = 50, py = 28;
        const maxR = 3500, minR = 200;
        const pts = RATING_POINTS.map((p, i) => ({
            x: px + (i / (RATING_POINTS.length - 1)) * (w - px * 2),
            y: py + ((maxR - p.rating) / (maxR - minR)) * (h - py * 2 - 20),
            ...p,
        }));
        const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
        return (
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
                {/* Grid lines */}
                {[800, 1400, 2000, 2600, 3200].map(r => {
                    const y = py + ((maxR - r) / (maxR - minR)) * (h - py * 2 - 20);
                    return <g key={r}>
                        <line x1={px} x2={w - px} y1={y} y2={y} stroke={`${C.text}06`} />
                        <text x={px - 8} y={y + 4} textAnchor="end" fill={C.muted} fontSize={8} fontFamily="JetBrains Mono" opacity={0.5}>{r}</text>
                    </g>;
                })}
                {/* Area fill */}
                <motion.path
                    d={`${pathD} L${pts[pts.length - 1].x},${h - 20} L${pts[0].x},${h - 20} Z`}
                    fill="url(#areaGrad)" opacity={0.15}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 2 }}
                />
                {/* Line */}
                <motion.path
                    d={pathD} fill="none" stroke="url(#ratingGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
                {/* Glow */}
                <motion.path d={pathD} fill="none" stroke={C.pink} strokeWidth={8} strokeLinecap="round" opacity={0.08}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
                {/* Dots + emoji milestones */}
                {pts.map((p, i) => (
                    <g key={i}>
                        <motion.circle cx={p.x} cy={p.y} r={5} fill={getRatingColor(p.rating)}
                            stroke={C.bg} strokeWidth={2.5}
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.2 }}
                        />
                        {/* Emoji milestone above dot */}
                        <motion.text x={p.x} y={p.y - 14} textAnchor="middle" fontSize={14}
                            initial={{ opacity: 0, y: p.y }} animate={{ opacity: 1, y: p.y - 14 }}
                            transition={{ delay: 0.5 + i * 0.2 }}
                        >
                            {p.emoji}
                        </motion.text>
                    </g>
                ))}
                {/* x-axis labels */}
                {pts.map((p, i) => (
                    <text key={`l${i}`} x={p.x} y={h - 4} textAnchor="middle" fill={C.muted} fontSize={7}
                        fontFamily="JetBrains Mono" opacity={0.7}>
                        {p.month}
                    </text>
                ))}
                <defs>
                    <linearGradient id="ratingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={C.muted} />
                        <stop offset="30%" stopColor={C.mint} />
                        <stop offset="60%" stopColor={C.lavender} />
                        <stop offset="100%" stopColor={C.pink} />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={C.lavender} />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }, []);

    /* ── Contest Timer ── */
    const [timerPulse, setTimerPulse] = useState(true);
    useEffect(() => {
        const iv = setInterval(() => setTimerPulse(p => !p), 1500);
        return () => clearInterval(iv);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            padding: '24px 16px',
        }}>
            {/* Confetti */}
            {showConfetti && <HeartsConfetti />}

            {/* ── Header ── */}
            <div className="cp-header" style={{ maxWidth: 860, margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: C.lavender, letterSpacing: -0.5 }}>Loveforces</span>
                    <span style={{ fontSize: 11, color: C.muted, background: C.surface, padding: '3px 10px', borderRadius: 8 }}>Round #240321</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Contest timer */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 8,
                        background: C.surface, border: `1px solid ${C.border}`,
                    }}>
                        <motion.span
                            animate={{ opacity: timerPulse ? 1 : 0.4 }}
                            style={{ width: 6, height: 6, borderRadius: '50%', background: C.mint, display: 'inline-block' }}
                        />
                        <span style={{ fontSize: 10, color: C.muted }}>Time remaining:</span>
                        <span style={{ fontSize: 11, color: C.mint, fontWeight: 700 }}>∞</span>
                    </div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {['problem', 'submissions', 'rating'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t)} style={{
                                padding: '6px 14px', borderRadius: 8, border: `1px solid ${activeTab === t ? C.lavender + '40' : C.border}`,
                                background: activeTab === t ? C.lavender + '15' : 'transparent',
                                color: activeTab === t ? C.lavender : C.muted,
                                cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                                transition: 'all 0.2s',
                            }}>{t === 'rating' ? '📊 Rating' : t === 'submissions' ? `📋 Submissions (${submissions.length})` : '📝 Problems'}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                {/* ── Problem Tab ── */}
                {activeTab === 'problem' && (
                    <>
                        {/* Problem tabs */}
                        <div className="cp-prob-tabs" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: 4 }}>
                            {PROBLEMS.map((p, i) => (
                                <motion.button key={p.id} onClick={() => handleProblemChange(i)}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    style={{
                                        padding: '8px 18px', borderRadius: 10,
                                        border: `1px solid ${activeProblem === i ? C.lavender + '40' : C.border}`,
                                        background: activeProblem === i ? C.lavender + '15' : C.surface,
                                        color: activeProblem === i ? C.lavender : C.muted,
                                        cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
                                        transition: 'all 0.2s',
                                    }}>
                                    {p.id}. {p.title}
                                </motion.button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeProblem}
                                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                                style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}
                            >
                                {/* Problem statement card */}
                                <div className="cp-card" style={{ ...cardBase, padding: '28px 28px 24px' }}>
                                    {/* Title + difficulty */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <h2 style={{ fontSize: 20, color: C.text, fontFamily: "'Playfair Display', serif", margin: 0 }}>
                                            {problem.id}. {problem.title}
                                        </h2>
                                        <span style={{
                                            padding: '3px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                            background: getRatingColor(problem.difficulty) + '18',
                                            color: getRatingColor(problem.difficulty),
                                        }}>★ {problem.difficulty}</span>
                                    </div>

                                    {/* Problem tags */}
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                                        {problem.tags.map(tag => (
                                            <span key={tag} style={{
                                                fontSize: 9, padding: '2px 10px', borderRadius: 6,
                                                background: `${C.blue}10`, color: C.blue,
                                                border: `1px solid ${C.blue}15`,
                                                fontWeight: 500, letterSpacing: 0.3,
                                            }}>#{tag}</span>
                                        ))}
                                    </div>

                                    {/* Limits */}
                                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 20, lineHeight: 1.8 }}>
                                        <div>time limit: <span style={{ color: C.text }}>{problem.limits.time}</span></div>
                                        <div>memory limit: <span style={{ color: C.text }}>{problem.limits.memory}</span></div>
                                    </div>

                                    {/* Statement */}
                                    {problem.statement.map((s, i) => (
                                        <p key={i} style={{ fontSize: 13, lineHeight: 1.9, color: C.text, marginBottom: 10, opacity: 0.9 }}>
                                            <Fmt text={s} />
                                        </p>
                                    ))}
                                    {problem.formula && (
                                        <div style={{
                                            background: C.surface, borderRadius: 8, padding: '8px 16px',
                                            display: 'inline-block', marginTop: 4, marginBottom: 16,
                                            border: `1px solid ${C.border}`, fontSize: 13, color: C.mint,
                                        }}><code>{problem.formula}</code></div>
                                    )}

                                    <h3 style={sectionTitle}>Input</h3>
                                    {problem.inputDesc.map((s, i) => (
                                        <p key={i} style={{ fontSize: 12, lineHeight: 1.8, color: C.text, marginBottom: 6, opacity: 0.85 }}><Fmt text={s} /></p>
                                    ))}

                                    <h3 style={{ ...sectionTitle, marginTop: 18 }}>Output</h3>
                                    <p style={{ fontSize: 12, lineHeight: 1.8, color: C.text, opacity: 0.85 }}><Fmt text={problem.outputDesc} /></p>

                                    <h3 style={{ ...sectionTitle, marginTop: 18 }}>Example</h3>
                                    <div className="cp-example-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                                        {[{ label: 'Input', data: problem.exampleIn }, { label: 'Output', data: problem.exampleOut }].map(ex => (
                                            <div key={ex.label}>
                                                <div style={{ background: C.lavender + '12', padding: '6px 12px', fontSize: 10, fontWeight: 700, borderRadius: '8px 8px 0 0', color: C.lavender }}>{ex.label}</div>
                                                <pre style={{
                                                    background: C.surface, padding: 14, fontSize: 11, borderRadius: '0 0 8px 8px',
                                                    border: `1px solid ${C.border}`, borderTop: 'none', margin: 0,
                                                    color: C.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', overflowX: 'auto',
                                                }}>{ex.data}</pre>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 style={sectionTitle}>Note</h3>
                                    <div style={{
                                        fontSize: 12, lineHeight: 1.8, color: C.muted,
                                        borderLeft: `3px solid ${C.lavender}30`, paddingLeft: 14,
                                        whiteSpace: 'pre-line',
                                    }}><Fmt text={problem.note} /></div>
                                </div>

                                {/* Code editor */}
                                <div style={cardBase}>
                                    <div style={{
                                        padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        borderBottom: `1px solid ${C.border}`,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                                            <span style={{ marginLeft: 8, fontSize: 11, color: C.muted }}>solution.cpp</span>
                                        </div>
                                        <span style={{ fontSize: 10, color: C.muted }}>C++17</span>
                                    </div>

                                    {/* Big editable code editor */}
                                    <textarea
                                        ref={textareaRef}
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        style={{
                                            width: '100%', minHeight: 300, padding: '18px 22px',
                                            background: 'rgba(0,0,0,0.15)', border: 'none', outline: 'none',
                                            color: C.mint, fontSize: 13, fontFamily: '"JetBrains Mono", monospace',
                                            lineHeight: 1.9, resize: 'vertical',
                                            caretColor: C.lavender,
                                        }}
                                        spellCheck={false}
                                    />

                                    {/* Submit bar */}
                                    <div style={{
                                        padding: '12px 18px', borderTop: `1px solid ${C.border}`,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <AnimatePresence mode="wait">
                                            {verdict && (
                                                <motion.div key={verdict}
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                                >
                                                    {verdict.startsWith('test') ? (
                                                        <>
                                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                                {[1, 2, 3].map(t => {
                                                                    const testNum = parseInt(verdict.replace('test', ''));
                                                                    const passed = t < testNum;
                                                                    const current = t === testNum;
                                                                    return (
                                                                        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                                            {passed ? (
                                                                                <span style={{ color: C.mint, fontSize: 12 }}>✅</span>
                                                                            ) : current ? (
                                                                                <motion.span
                                                                                    animate={{ rotate: 360 }}
                                                                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                                                    style={{ display: 'inline-block', fontSize: 12 }}
                                                                                >⏳</motion.span>
                                                                            ) : (
                                                                                <span style={{ color: C.muted, fontSize: 12 }}>○</span>
                                                                            )}
                                                                            <span style={{
                                                                                fontSize: 10,
                                                                                color: passed ? C.mint : current ? C.gold : C.muted,
                                                                            }}>Test {t}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <span style={{ fontSize: 14 }}>✅</span>
                                                            <span style={{
                                                                fontSize: 12, color: C.accepted, fontWeight: 700,
                                                                textShadow: `0 0 10px ${C.accepted}40`,
                                                            }}>Accepted — 0ms, 0KB 💕</span>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <motion.button
                                            onClick={handleSubmit}
                                            whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${C.mint}20` }}
                                            whileTap={{ scale: 0.97 }}
                                            disabled={submitting}
                                            style={{
                                                padding: '8px 24px', borderRadius: 8,
                                                background: submitting ? C.surface : `linear-gradient(135deg, ${C.mint}25, ${C.lavender}20)`,
                                                border: `1px solid ${submitting ? C.border : C.mint + '30'}`,
                                                color: submitting ? C.muted : C.mint,
                                                cursor: submitting ? 'wait' : 'pointer',
                                                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                                                marginLeft: 'auto', transition: 'all 0.2s',
                                            }}>
                                            {submitting ? '⏳ Judging...' : '▶ Submit'}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}

                {/* ── Submissions Tab ── */}
                {activeTab === 'submissions' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        style={{ ...cardBase, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                            <h3 style={{ fontSize: 14, color: C.text, margin: 0 }}>Submission History</h3>
                        </div>
                        {submissions.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: C.muted, fontSize: 12 }}>
                                No submissions yet. Go solve a problem! 💪
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                        {['#', 'When', 'Problem', 'Verdict', 'Time'].map(h => (
                                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: C.muted, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((s, i) => (
                                        <motion.tr key={s.id}
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: `1px solid ${C.border}` }}>
                                            <td style={{ padding: '10px 14px', color: C.muted }}>{s.id}</td>
                                            <td style={{ padding: '10px 14px', color: C.muted }}>{s.when}</td>
                                            <td style={{ padding: '10px 14px', color: C.blue }}>{s.problem}</td>
                                            <td style={{ padding: '10px 14px', color: s.color, fontWeight: 600 }}>{s.emoji} {s.verdict}</td>
                                            <td style={{ padding: '10px 14px', color: C.muted }}>{s.time}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                )}

                {/* ── Rating Tab ── */}
                {activeTab === 'rating' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        style={{ ...cardBase, padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
                            <h3 style={{ fontSize: 16, color: C.text, margin: 0, fontFamily: "'Playfair Display', serif" }}>Love Rating Graph 💕</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, color: C.muted }}>Status:</span>
                                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: 20, fontWeight: 800, color: C.pink }}>∞</motion.span>
                                <span style={{
                                    fontSize: 9, padding: '3px 10px', borderRadius: 6,
                                    background: `${C.pink}15`, color: C.pink, fontWeight: 700,
                                }}>SOULMATES 💕</span>
                            </div>
                        </div>
                        {RatingGraph}
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Strangers', color: C.muted },
                                { label: 'Friends', color: C.mint },
                                { label: 'Best Friends', color: C.blue },
                                { label: 'Crush', color: C.lavender },
                                { label: 'In Love', color: C.gold },
                                { label: 'Soulmates', color: C.pink },
                            ].map(r => (
                                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                                    <span style={{ fontSize: 10, color: C.muted }}>{r.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .cp-header { flex-direction: column; align-items: flex-start !important; }
                    .cp-header > div:last-child { width: 100%; flex-wrap: wrap; }
                    .cp-prob-tabs::-webkit-scrollbar { display: none; }
                    .cp-card { padding: 18px 16px 16px !important; }
                    .cp-card h2 { font-size: 16px !important; }
                    .cp-example-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
