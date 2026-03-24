import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Config ─── */
const PASSWORD = '2403';

const PAGES = [
    { icon: '💖', title: 'Reasons I Love You', tagline: 'Pop some balloons to find out', path: '/reasons-c7d4e5f6', color: '#FFC0CB' },
    { icon: '💻', title: 'CP Problem', tagline: 'Can you solve us?', path: '/problem-a-optimal-match-x9y8z7', color: '#A9DEF9' },
    { icon: '🖥️', title: 'Terminal Quiz', tagline: 'How well do you know us?', path: '/terminal-override-q1w2e3', color: '#B5EAD7' },
    { icon: '💌', title: 'Message Bottle', tagline: 'A letter just for you', path: '/message-bottle-m4n5b6', color: '#F4A7B9' },
    { icon: '⏳', title: 'Countdown', tagline: 'Until our next moment', path: '/next-big-day-t9r8e7', color: '#C9A0DC' },
    { icon: '📝', title: 'Our Notes', tagline: 'Little notes, big feelings', path: '/our-notes-p0o9i8', color: '#B5EAD7' },
    { icon: '🎮', title: 'Game Hub', tagline: 'Wordle, Slots, Flappy & more', path: '/custom-wordle-l1k2j3', color: '#A9DEF9' },
    { icon: '📸', title: 'Memories', tagline: 'Our favourite moments', path: '/our-memories-v8b7n6', color: '#FFC0CB' },
];

/* ─── Matrix rain background ─── */
function MatrixRain() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const chars = '01♡♥💕LOVE❤️';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(57, 211, 83, 0.15)';
            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ─── Typing effect for lines ─── */
function TypedLine({ text, delay, color = '#8b949e', onDone }) {
    const [shown, setShown] = useState('');
    useEffect(() => {
        let i = 0;
        const timeout = setTimeout(() => {
            const iv = setInterval(() => {
                i++;
                setShown(text.slice(0, i));
                if (i >= text.length) { clearInterval(iv); onDone?.(); }
            }, 25);
            return () => clearInterval(iv);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, delay]);
    return (
        <div style={{ color, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, lineHeight: 2, minHeight: '1.8em' }}>
            {shown}<span className="animate-blink" style={{ color: '#39d353' }}>█</span>
        </div>
    );
}

/* ─── Password Screen ─── */
function PasswordScreen({ onSuccess }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [bootLines, setBootLines] = useState(0);
    const inputRef = useRef(null);

    const BOOT = [
        '> Initializing Love-OS v5.0...',
        '> Loading heart modules ♡♡♡',
        '> Establishing connection...',
        '> System ready.',
    ];

    useEffect(() => {
        if (bootLines < BOOT.length) {
            const t = setTimeout(() => setBootLines(b => b + 1), 600);
            return () => clearTimeout(t);
        }
    }, [bootLines]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === PASSWORD) {
            sessionStorage.setItem('love-os-auth', 'true');
            onSuccess();
        } else {
            setError(true);
            setInput('');
            setTimeout(() => setError(false), 800);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="home-password"
            onClick={() => inputRef.current?.focus()}
            style={{
                minHeight: '100vh',
                background: '#0d1117',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'text',
            }}
        >
            <MatrixRain />

            <motion.div
                animate={error ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="home-password-box"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: 520,
                    padding: '48px 40px',
                    background: 'rgba(13,17,23,0.85)',
                    border: '1px solid rgba(48,54,61,0.8)',
                    borderRadius: 16,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 0 80px rgba(57,211,83,0.06), 0 0 30px rgba(0,0,0,0.4)',
                }}
            >
                {/* Terminal header */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                    <span style={{ marginLeft: 12, fontSize: 11, color: '#484f58', fontFamily: '"JetBrains Mono"' }}>
                        love-os — auth
                    </span>
                </div>

                {/* Boot sequence */}
                {BOOT.slice(0, bootLines).map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            fontSize: 12,
                            fontFamily: '"JetBrains Mono", monospace',
                            color: line.includes('ready') ? '#39d353' : '#8b949e',
                            lineHeight: 2,
                        }}
                    >
                        {line}
                    </motion.div>
                ))}

                {/* Password prompt */}
                {bootLines >= BOOT.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div style={{
                            marginTop: 20,
                            fontSize: 12,
                            color: '#c9d1d9',
                            fontFamily: '"JetBrains Mono", monospace',
                            marginBottom: 12,
                        }}>
                            > Enter access code to continue:
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(22,27,34,0.8)',
                                border: `1px solid ${error ? '#f85149' : 'rgba(48,54,61,0.8)'}`,
                                borderRadius: 8,
                                padding: '10px 14px',
                                transition: 'border-color 0.3s',
                            }}>
                                <span style={{ color: '#39d353', fontFamily: '"JetBrains Mono"', fontSize: 14 }}>❯</span>
                                <input
                                    ref={inputRef}
                                    type="password"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    autoFocus
                                    style={{
                                        flex: 1,
                                        background: 'none',
                                        border: 'none',
                                        outline: 'none',
                                        color: '#c9d1d9',
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: 15,
                                        letterSpacing: 4,
                                    }}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(57,211,83,0.15)',
                                    border: '1px solid rgba(57,211,83,0.3)',
                                    borderRadius: 8,
                                    color: '#39d353',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                ↵
                            </motion.button>
                        </form>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        marginTop: 12,
                                        fontSize: 12,
                                        color: '#f85149',
                                        fontFamily: '"JetBrains Mono", monospace',
                                    }}
                                >
                                    ✗ ACCESS DENIED — invalid code
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 3 }}
                            style={{
                                marginTop: 24,
                                fontSize: 11,
                                color: '#484f58',
                                fontFamily: '"JetBrains Mono", monospace',
                                fontStyle: 'italic',
                            }}
                        >
                            hint: the day that started it all 💕
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

/* ─── Access Granted Transition ─── */
function AccessGranted({ onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2400);
        return () => clearTimeout(t);
    }, [onDone]);

    const lines = [
        '> Verifying code... ████████████ 100%',
        '> Identity confirmed 💓',
        '> Decrypting love.dat...',
        '> ACCESS GRANTED ✓',
        '> Welcome back, love 💕',
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                background: '#0d1117',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <div style={{ maxWidth: 420 }}>
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.35 }}
                        style={{
                            fontSize: 13,
                            fontFamily: '"JetBrains Mono", monospace',
                            lineHeight: 2.4,
                            color: line.includes('GRANTED') ? '#39d353'
                                : line.includes('💓') ? '#f4a7b9'
                                    : line.includes('💕') ? '#f4a7b9'
                                        : '#8b949e',
                            fontWeight: line.includes('GRANTED') ? 700 : 400,
                        }}
                    >
                        {line}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ─── Dashboard ─── */
function Dashboard() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="home-dashboard"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(160deg, #1a1127 0%, #2d1b3d 35%, #1e2a4a 70%, #1a1127 100%)',
                padding: '48px 24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient glow orbs */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
            }}>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{
                        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(244,167,185,0.12), transparent 70%)',
                        top: '-10%', left: '-10%',
                    }}
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    style={{
                        position: 'absolute', width: 450, height: 450, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(169,222,249,0.1), transparent 70%)',
                        bottom: '-15%', right: '-5%',
                    }}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 48 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ fontSize: 48, marginBottom: 8, filter: 'drop-shadow(0 0 15px rgba(255,182,193,0.4))' }}
                    >
                        💕
                    </motion.div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(28px, 6vw, 42px)',
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #FFC0CB, #E0BBE4, #A9DEF9, #F4A7B9)',
                        backgroundSize: '300% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 8,
                    }}>
                        Our Little Universe
                    </h1>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 15,
                    }}>
                        pick a page, any page ✨
                    </p>
                </motion.div>

                {/* Card Grid */}
                <div className="home-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 20,
                }}>
                    {PAGES.map((page, i) => (
                        <motion.div
                            key={page.path}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                            whileHover={{ y: -8, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(page.path)}
                            className="home-card"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 16,
                                padding: '28px 24px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = `${page.color}40`;
                                e.currentTarget.style.boxShadow = `0 8px 40px ${page.color}15, 0 0 60px ${page.color}08`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Gradient accent top bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0,
                                height: 3,
                                background: `linear-gradient(90deg, ${page.color}, transparent)`,
                                borderRadius: '16px 16px 0 0',
                                opacity: 0.6,
                            }} />

                            <div style={{ fontSize: 32, marginBottom: 12 }}>{page.icon}</div>
                            <h3 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#e6e1f0',
                                marginBottom: 6,
                            }}>
                                {page.title}
                            </h3>
                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.35)',
                                lineHeight: 1.5,
                            }}>
                                {page.tagline}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1.5 }}
                    style={{
                        textAlign: 'center',
                        marginTop: 48,
                        fontSize: 11,
                        color: '#8b87a0',
                        fontFamily: '"JetBrains Mono", monospace',
                    }}
                >
                    // built with love, compiled with care 💕
                </motion.div>
            </div>

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .home-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
                    .home-dashboard { padding: 32px 16px !important; }
                }
                @media (max-width: 480px) {
                    .home-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
                    .home-card { padding: 22px 18px !important; }
                }
                @media (max-width: 600px) {
                    .home-password-box { margin: 0 16px; padding: 32px 24px !important; }
                }
            `}</style>
        </motion.div>
    );
}

/* ─── Main Home Component ─── */
export default function Home() {
    const [stage, setStage] = useState(() => {
        return sessionStorage.getItem('love-os-auth') === 'true' ? 'dashboard' : 'password';
    });

    return (
        <AnimatePresence mode="wait">
            {stage === 'password' && (
                <PasswordScreen key="pw" onSuccess={() => setStage('granted')} />
            )}
            {stage === 'granted' && (
                <AccessGranted key="ag" onDone={() => setStage('dashboard')} />
            )}
            {stage === 'dashboard' && (
                <Dashboard key="db" />
            )}
        </AnimatePresence>
    );
}
