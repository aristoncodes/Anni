import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Quiz questions (expanded) ── */
const QUIZ_QUESTIONS = [
    { q: "What's our anniversary date?", options: ['March 24', 'Feb 14', 'Jan 1', 'Dec 25'], correct: 0, cat: 'Our Story' },
    { q: "What's my favorite thing about you?", options: ['Your eyes', 'Your smile', 'Everything!', 'Your laugh'], correct: 2, cat: 'Feelings' },
    { q: "What you love doing?", options: ['Sleeping', 'Eating', 'Beating Me', 'Sleeping'], correct: 3, cat: 'Our Story' },
    { q: "How much do I love you?", options: ['A lot', 'More than food', 'To infinity', 'All of the above 💖'], correct: 3, cat: 'Feelings' },
    { q: "What do we call each other?", options: ['Honey & Darling', 'Jim & Jam', 'Sugar & Spice', 'Babe & Baby'], correct: 1, cat: 'Inside Jokes' },
    { q: "What's her birth month?", options: ['April', 'June', 'August', 'October'], correct: 2, cat: 'Our Story' },
    { q: "What's his birth month?", options: ['March', 'April', 'May', 'June'], correct: 1, cat: 'Our Story' },
    { q: "Our monthly anniversary is on the?", options: ['1st', '14th', '24th', '30th'], correct: 2, cat: 'Our Story' },
    { q: "If love had a flavor, ours would be?", options: ['Sweet', 'Spicy', 'A whole dessert buffet 🎂', 'Umm... cheesy? 🧀'], correct: 2, cat: 'Fun' },
    { q: "Our relationship in one emoji?", options: ['🔥', '💕', '🥺', '♾️'], correct: 3, cat: 'Feelings' },
];

/* ── Compliments ── */
const COMPLIMENTS = [
    "You're the most beautiful human inside and out 🌸",
    "Your laugh is my favorite sound in the universe 🎵",
    "I'm so lucky the universe aligned to bring us together 🌌",
    "You make ordinary moments feel like magic ✨",
    "Your heart is pure gold and I treasure it 💛",
    "Just thinking about you makes my whole day better ☀️",
    "You're not just my partner, you're my best friend 🤝",
    "The way your eyes light up gives me butterflies 🦋",
    "You're stronger than you know, and I'm so proud of you 💪",
    "My favorite place in the world is wherever you are 🏠",
    "If love were a sport, we'd be world champions 🏆",
    "You're the plot twist I never saw coming but always needed 📖",
];

/* ── 8-Ball responses ── */
const MAGIC_8BALL = [
    "💖 Absolutely, my love", "✨ The stars say YES", "🌙 Without a doubt, always",
    "💕 Signs point to forever", "🔮 Concentrate and ask again...", "💓 My heart says definitely",
    "🦋 As certain as my love for you", "🌸 It is decidedly so", "💫 Yes, a thousand times yes",
    "🥰 Reply hazy, but my love is crystal clear", "💝 Most likely, just like our love",
    "🌈 Outlook: Beautiful, like us",
];

/* ── Secret love letters ── */
const SECRETS = [
    "I knew you were special the very first time we talked. Something just clicked. You weren't just another person — you were THE person. And every day since has proven me right. 💌",
    "Sometimes I catch myself smiling for no reason, and then I realize... I was thinking about you. You've become my favorite thought. 💭",
    "If I could go back in time, I wouldn't change a single thing. Every fight, every late-night call, every silly moment — they all led us here. And here is exactly where I want to be. 🕰️",
    "You don't just make me happy. You make me want to be better. For you, for us, for our future. Thank you for believing in me even when I didn't. 🌟",
    "This isn't just a relationship to me. You're my home. You're my safe place. You're my forever. 🏠💕",
];

/* ── Compatibility Lab questions ── */
const COMPAT_QS = [
    { q: "Pick your ideal date night:", options: ["🎬 Movie marathon", "🍕 Cooking together", "🌙 Stargazing", "🎮 Gaming night"] },
    { q: "Love language?", options: ["💬 Words", "🤗 Touch", "🎁 Gifts", "⏰ Quality time"] },
    { q: "Your vibe in the morning?", options: ["☀️ Sunshine", "😴 Zombie", "☕ Coffee first", "🎵 Dancing"] },
    { q: "Pick a superpower for love:", options: ["🔮 Mind reading", "⏰ Time travel", "🦸 Flying together", "💫 Teleportation"] },
    { q: "Your love anthem genre?", options: ["🎸 Rock ballad", "🎹 R&B", "🎻 Classical", "🎤 Pop banger"] },
];

/* ── Theme colors ── */
const T = {
    bg: '#1a1b2e',
    card: 'rgba(30, 32, 58, 0.85)',
    text: '#e0dce8',
    textMuted: '#8b87a0',
    lavender: '#c9a0dc',
    pink: '#f4a7b9',
    mint: '#b5ead7',
    blue: '#a9def9',
    error: '#f5a5a5',
    gold: '#f5d89a',
    border: 'rgba(201, 160, 220, 0.12)',
    glow: 'rgba(201, 160, 220, 0.06)',
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function TerminalQuiz() {
    const [lines, setLines] = useState([
        { text: '' },
        { text: '  $ love-os --init', color: T.blue },
        { text: '  ⏳ Booting secure terminal...', color: T.textMuted },
        { text: '  ⏳ Scanning for love frequencies... ████████ 100%', color: T.textMuted },
        { text: '  ✓ Ready', color: T.mint },
        { text: '' },
        { text: '  🔐 Enter Secret Passcode:', color: T.gold },
    ]);
    const [input, setInput] = useState('');
    const [unlocked, setUnlocked] = useState(false);
    const [mode, setMode] = useState('terminal');
    const [quizQs, setQuizQs] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(null);
    const [compatQ, setCompatQ] = useState(0);
    const [compatAnswers, setCompatAnswers] = useState([]);
    const [compatDone, setCompatDone] = useState(false);

    const inputRef = useRef(null);
    const termRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, [unlocked, mode]);
    useEffect(() => {
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
    }, [lines]);

    const addLines = useCallback((...newLines) => {
        setLines(prev => [...prev, ...newLines.map(l =>
            typeof l === 'string' ? { text: l } : l
        )]);
    }, []);

    /* ── Passcode ── */
    const handlePasscode = (val) => {
        if (val === 'jimjam' || val === 'jim jam') {
            addLines(
                { text: `  > ${val}`, color: T.textMuted },
                { text: '' },
                { text: '  ✓ Access Granted — Welcome back, love 💕', color: T.mint },
                { text: '  ⏳ Loading LOVE-OS modules...', color: T.textMuted },
                { text: '  ✓ All systems online', color: T.mint },
                { text: '' },
                { text: '  💻 Terminal ready — type /help for commands', color: T.lavender },
                { text: '' },
            );
            setTimeout(() => setUnlocked(true), 800);
        } else {
            addLines(
                { text: `  > ${val}`, color: T.textMuted },
                { text: '  ✗ Access Denied — Hint: What are we called? 💕', color: T.error },
                { text: '' },
                { text: '  🔐 Enter Secret Passcode:', color: T.gold },
            );
        }
    };

    /* ── Command handler ── */
    const handleCommand = (val) => {
        const cmd = val.toLowerCase().trim();
        addLines({ text: `  $ ${val}`, color: T.blue });

        if (cmd === '/help' || cmd === 'help') {
            addLines(
                { text: '' },
                { text: '  ┌─────────────────────────────────┐', color: T.lavender },
                { text: '  │   Available Commands             │', color: T.lavender },
                { text: '  ├─────────────────────────────────┤', color: T.lavender },
                { text: '  │  /quiz        Love Quiz 💝      │', color: T.text },
                { text: '  │  /test        Compat Lab 🧪     │', color: T.text },
                { text: '  │  /compliment  Sweet words 💌     │', color: T.text },
                { text: '  │  /love-status Our stats 📊      │', color: T.text },
                { text: '  │  /secret      Love letter 💕     │', color: T.text },
                { text: '  │  /8ball       Magic 8 Ball 🔮   │', color: T.text },
                { text: '  │  /clear       Clear screen 🧹   │', color: T.text },
                { text: '  └─────────────────────────────────┘', color: T.lavender },
                { text: '' },
            );
        } else if (cmd === '/quiz') {
            const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 7);
            setQuizQs(shuffled);
            setCurrentQ(0); setScore(0); setQuizDone(false); setAnswered(false); setSelected(null);
            addLines({ text: '  ⏳ Loading Love Quiz...', color: T.lavender });
            setTimeout(() => setMode('quiz'), 600);
        } else if (cmd === '/test') {
            setCompatQ(0); setCompatAnswers([]); setCompatDone(false);
            addLines({ text: '  ⏳ Initializing Love Compatibility Lab...', color: T.lavender });
            setTimeout(() => setMode('test'), 600);
        } else if (cmd === '/compliment' || cmd === '/c') {
            const c = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
            addLines({ text: '' }, { text: `  💌 ${c}`, color: T.pink }, { text: '' });
        } else if (cmd === '/love-status' || cmd === '/status') {
            const start = new Date('2021-03-24');
            const now = new Date();
            const days = Math.floor((now - start) / 86400000);
            const hours = days * 24;
            const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
            addLines(
                { text: '' },
                { text: '  ┌─── 💕 Love Status Report ───┐', color: T.pink },
                { text: `  │  Status     Madly in love ❤️‍🔥`, color: T.mint },
                { text: `  │  Days       ${days.toLocaleString()} days`, color: T.text },
                { text: `  │  Hours      ${hours.toLocaleString()} hours`, color: T.text },
                { text: `  │  Months     ${months} months`, color: T.text },
                { text: `  │  Love       ∞ (overflow!) 💖`, color: T.pink },
                { text: `  │  Chemistry  Off the charts 🧪`, color: T.gold },
                { text: '  └──────────────────────────────┘', color: T.pink },
                { text: '' },
            );
        } else if (cmd === '/secret' || cmd === '/s') {
            const s = SECRETS[Math.floor(Math.random() * SECRETS.length)];
            addLines(
                { text: '' },
                { text: '  ┌─── 💌 Secret Love Letter ───┐', color: T.gold },
                { text: '' },
                { text: `    ${s}`, color: '#ddd5c4' },
                { text: '' },
                { text: '  └──────────────────────────────┘', color: T.gold },
                { text: '' },
            );
        } else if (cmd === '/8ball' || cmd.startsWith('/8ball ')) {
            const r = MAGIC_8BALL[Math.floor(Math.random() * MAGIC_8BALL.length)];
            addLines({ text: '' }, { text: `  🔮 ${r}`, color: T.lavender }, { text: '' });
        } else if (cmd === '/clear') {
            setLines([{ text: '  💻 Terminal cleared — type /help for commands', color: T.lavender }, { text: '' }]);
            return;
        } else if (cmd === 'i love you' || cmd === 'ily') {
            addLines({ text: '' }, { text: '  💕 I love you more! Always and forever 💕', color: T.pink }, { text: '' });
        } else if (cmd === 'sudo love' || cmd === 'sudo rm -rf loneliness') {
            addLines({ text: '' }, { text: '  ✓ loneliness removed — Installing: unlimited-cuddles... done 💕', color: T.mint }, { text: '' });
        } else {
            addLines(
                { text: `  ✗ command '${val}' not found`, color: T.error },
                { text: '    Type /help for available commands', color: T.textMuted },
                { text: `    PS: love.exe is always running in the background 💖`, color: T.pink },
                { text: '' },
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = input.trim();
        if (!val) return;
        setInput('');
        if (!unlocked) handlePasscode(val.toLowerCase());
        else handleCommand(val);
    };

    const handleQuizAnswer = (idx) => {
        if (answered) return;
        setSelected(idx); setAnswered(true);
        if (idx === quizQs[currentQ].correct) setScore(s => s + 1);
        setTimeout(() => {
            if (currentQ < quizQs.length - 1) {
                setCurrentQ(q => q + 1); setAnswered(false); setSelected(null);
            } else { setQuizDone(true); }
        }, 1200);
    };

    const handleCompatAnswer = (idx) => {
        const newAnswers = [...compatAnswers, idx];
        setCompatAnswers(newAnswers);
        if (compatQ < COMPAT_QS.length - 1) setCompatQ(q => q + 1);
        else setCompatDone(true);
    };

    const backToTerminal = () => { setMode('terminal'); inputRef.current?.focus(); };

    /* ── Shared card style ── */
    const cardStyle = {
        background: T.card,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 80px ${T.glow}`,
    };

    const btnStyle = (accent) => ({
        padding: '10px 22px', borderRadius: 10,
        border: `1px solid ${accent}25`,
        background: `${accent}12`,
        color: accent, cursor: 'pointer',
        fontSize: 13, fontWeight: 500,
        fontFamily: '"JetBrains Mono", monospace',
        transition: 'all 0.2s',
    });

    /* ══════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════ */
    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${T.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Animated gradient orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <motion.div
                    animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.9, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '10%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,160,220,0.08), transparent 70%)' }}
                />
                <motion.div
                    animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.9, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', bottom: '15%', left: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,167,185,0.06), transparent 70%)' }}
                />
                <motion.div
                    animate={{ x: [0, 15, -15, 0], y: [0, -15, 15, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(169,222,249,0.05), transparent 70%)' }}
                />
            </div>

            {/* Subtle scan lines */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10,
                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)',
            }} />

            {/* ── TERMINAL MODE ── */}
            {mode === 'terminal' && (
                <div style={{
                    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 24, position: 'relative', zIndex: 1,
                }}>
                    <div style={{ maxWidth: 680, width: '100%', ...cardStyle }}>
                        {/* macOS title bar */}
                        <div style={{
                            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 8,
                            borderBottom: `1px solid ${T.border}`,
                        }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
                            <span style={{
                                flex: 1, textAlign: 'center', fontSize: 12, color: T.textMuted,
                                letterSpacing: 1, fontWeight: 500,
                            }}>
                                💕 LOVE-OS v4.0 — Jim & Jam
                            </span>
                        </div>

                        {/* Terminal content */}
                        <div ref={termRef} onClick={() => inputRef.current?.focus()}
                            style={{
                                padding: '16px 4px', maxHeight: 420, overflowY: 'auto', cursor: 'text',
                                fontSize: 13, lineHeight: 1.9,
                            }}>
                            {lines.map((l, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: Math.min(i * 0.015, 0.3) }}
                                    style={{ color: l.color || T.text, whiteSpace: 'pre' }}
                                >
                                    {l.text || '\u00A0'}
                                </motion.div>
                            ))}
                        </div>

                        {/* Input area */}
                        <form onSubmit={handleSubmit}
                            style={{
                                display: 'flex', alignItems: 'center', padding: '12px 18px',
                                borderTop: `1px solid ${T.border}`,
                            }}>
                            <span style={{ color: unlocked ? T.lavender : T.mint, marginRight: 10, fontSize: 14 }}>
                                {unlocked ? '💕 ~' : '>'}
                            </span>
                            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                                placeholder={unlocked ? 'Type a command...' : ''}
                                style={{
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: T.text, fontFamily: 'inherit', fontSize: 13, flex: 1,
                                    caretColor: T.lavender,
                                }}
                                autoFocus
                            />
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                style={{ color: T.lavender, fontSize: 14 }}
                            >▎</motion.span>
                        </form>
                    </div>
                </div>
            )}

            {/* ── QUIZ MODE ── */}
            {mode === 'quiz' && (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
                    <AnimatePresence mode="wait">
                        {!quizDone ? (
                            <motion.div key={currentQ}
                                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                                style={{ maxWidth: 520, width: '100%', padding: 32, ...cardStyle }} className="tq-quiz-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <span style={{ background: `${T.mint}18`, color: T.mint, padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>
                                        Q{currentQ + 1}/{quizQs.length}
                                    </span>
                                    <span style={{ background: `${T.lavender}15`, color: T.lavender, padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                                        {quizQs[currentQ]?.cat}
                                    </span>
                                    <span style={{ background: `${T.gold}18`, color: T.gold, padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                                        Score: {score}
                                    </span>
                                </div>
                                <div style={{ height: 2, background: `${T.text}08`, borderRadius: 2, margin: '14px 0 26px', overflow: 'hidden' }}>
                                    <motion.div animate={{ width: `${((currentQ + 1) / quizQs.length) * 100}%` }}
                                        style={{ height: '100%', background: `linear-gradient(90deg, ${T.lavender}, ${T.pink})`, borderRadius: 2 }} />
                                </div>
                                <h2 style={{ fontSize: 19, marginBottom: 22, color: T.text, fontFamily: "'Playfair Display', serif", lineHeight: 1.5 }}>
                                    {quizQs[currentQ]?.q}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {quizQs[currentQ]?.options.map((opt, idx) => {
                                        let bg = `${T.text}06`;
                                        let border = `1px solid ${T.text}10`;
                                        if (answered) {
                                            if (idx === quizQs[currentQ].correct) { bg = `${T.mint}18`; border = `1px solid ${T.mint}40`; }
                                            else if (idx === selected) { bg = `${T.error}15`; border = `1px solid ${T.error}35`; }
                                        }
                                        return (
                                            <motion.button key={idx} onClick={() => handleQuizAnswer(idx)}
                                                whileHover={!answered ? { scale: 1.01, backgroundColor: `${T.lavender}10` } : {}}
                                                whileTap={!answered ? { scale: 0.99 } : {}}
                                                style={{
                                                    padding: '14px 20px', borderRadius: 12, background: bg, border,
                                                    cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                                                    fontSize: 13, color: T.text, fontFamily: '"JetBrains Mono", monospace',
                                                    transition: 'all 0.2s',
                                                }}>
                                                {opt}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="result"
                                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                                style={{ maxWidth: 420, width: '100%', padding: 40, textAlign: 'center', ...cardStyle }}>
                                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>
                                    {score === quizQs.length ? '🏆' : score >= 5 ? '💖' : '💕'}
                                </motion.span>
                                <h2 style={{ fontSize: 24, marginBottom: 8, color: T.pink, fontFamily: "'Playfair Display', serif" }}>
                                    {score === quizQs.length ? 'Perfect Score!' : score >= 5 ? 'Amazing!' : 'Not bad!'}
                                </h2>
                                <p style={{ color: T.textMuted, fontSize: 16, marginBottom: 6 }}>{score}/{quizQs.length} correct</p>
                                <p style={{ color: T.mint, fontSize: 12 }}>
                                    {score === quizQs.length ? 'You know our love story by heart! 💕' : 'Every answer leads back to love 💖'}
                                </p>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28 }}>
                                    <button onClick={() => { const s = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 7); setQuizQs(s); setCurrentQ(0); setScore(0); setQuizDone(false); setAnswered(false); setSelected(null); }}
                                        style={btnStyle(T.mint)}>Play Again 🔄</button>
                                    <button onClick={backToTerminal} style={btnStyle(T.lavender)}>← Terminal</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* ── COMPATIBILITY LAB MODE ── */}
            {mode === 'test' && (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
                    <AnimatePresence mode="wait">
                        {!compatDone ? (
                            <motion.div key={`compat-${compatQ}`}
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                                style={{ maxWidth: 500, width: '100%', padding: 32, ...cardStyle }} className="tq-compat-card">
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <span style={{ fontSize: 36 }}>🧪</span>
                                    <h2 style={{ fontSize: 17, color: T.lavender, marginTop: 8, fontFamily: "'Playfair Display', serif" }}>
                                        Love Compatibility Lab
                                    </h2>
                                    <p style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>
                                        Test {compatQ + 1} of {COMPAT_QS.length}
                                    </p>
                                    {/* Test tubes */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '18px 0' }}>
                                        {COMPAT_QS.map((_, i) => (
                                            <div key={i} style={{
                                                width: 18, height: 44, borderRadius: '0 0 9px 9px',
                                                border: `1px solid ${T.border}`,
                                                borderTop: `2px solid ${T.lavender}30`,
                                                position: 'relative', overflow: 'hidden', background: `${T.text}05`,
                                            }}>
                                                <motion.div
                                                    animate={{ height: i < compatQ ? '100%' : i === compatQ ? '25%' : '0%' }}
                                                    transition={{ type: 'spring', damping: 15 }}
                                                    style={{
                                                        position: 'absolute', bottom: 0, width: '100%',
                                                        background: [T.pink, T.mint, T.blue, T.gold, T.lavender][i],
                                                        borderRadius: '0 0 8px 8px',
                                                        opacity: 0.7,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: 16, marginBottom: 18, color: T.text, textAlign: 'center', fontWeight: 400, lineHeight: 1.5 }}>
                                    {COMPAT_QS[compatQ].q}
                                </h3>
                                <div className="tq-compat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {COMPAT_QS[compatQ].options.map((opt, idx) => (
                                        <motion.button key={idx} onClick={() => handleCompatAnswer(idx)}
                                            whileHover={{ scale: 1.02, borderColor: `${T.lavender}40` }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '14px 12px', borderRadius: 12,
                                                background: `${T.lavender}08`,
                                                border: `1px solid ${T.border}`,
                                                cursor: 'pointer', fontSize: 13, color: T.text,
                                                fontFamily: '"JetBrains Mono"', transition: 'all 0.2s',
                                            }}>
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="compat-result"
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                style={{ maxWidth: 420, width: '100%', padding: 40, textAlign: 'center', ...cardStyle }}>
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                    style={{ fontSize: 52, marginBottom: 12, display: 'inline-block' }}>
                                    🧪
                                </motion.div>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
                                    <div style={{
                                        fontSize: 48, fontWeight: 800,
                                        background: `linear-gradient(135deg, ${T.pink}, ${T.lavender}, ${T.mint})`,
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        marginBottom: 8,
                                    }}>100%</div>
                                </motion.div>
                                <h2 style={{ fontSize: 20, color: T.pink, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                                    PERFECT MATCH! 💕
                                </h2>
                                <div style={{ color: T.textMuted, fontSize: 11, lineHeight: 2.2, margin: '18px 0' }}>
                                    <div>Chemistry Level: <span style={{ color: T.mint }}>Off the charts 🧪</span></div>
                                    <div>Love Frequency: <span style={{ color: T.pink }}>∞ Hz 💕</span></div>
                                    <div>Compatibility: <span style={{ color: T.gold }}>Soulmates 🔥</span></div>
                                    <div>Conclusion: <span style={{ color: T.blue }}>Meant to be 💫</span></div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                                    <button onClick={() => { setCompatQ(0); setCompatAnswers([]); setCompatDone(false); }}
                                        style={btnStyle(T.lavender)}>Test Again 🔄</button>
                                    <button onClick={backToTerminal} style={btnStyle(T.pink)}>← Terminal</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            <style>{`
                @media (max-width: 600px) {
                    .tq-quiz-card { padding: 20px 16px !important; }
                    .tq-quiz-card h2 { font-size: 16px !important; }
                    .tq-compat-card { padding: 20px 16px !important; }
                    .tq-compat-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
