import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Floating hearts for reveal ── */
function FloatingHearts() {
    const items = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        dur: 3 + Math.random() * 3,
        size: 12 + Math.random() * 20,
        emoji: ['💕', '❤️', '✨', '💖', '🌸', '💗', '⭐', '🤍'][Math.floor(Math.random() * 8)],
    }));
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
            {items.map(h => (
                <motion.div key={h.id}
                    initial={{ y: '110vh', x: `${h.x}vw`, opacity: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 1, 0.5, 0], rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: h.dur, delay: h.delay, ease: 'easeOut', repeat: Infinity, repeatDelay: Math.random() * 5 }}
                    style={{ position: 'absolute', fontSize: h.size }}
                >{h.emoji}</motion.div>
            ))}
        </div>
    );
}

/* ── Shatter fragments for 404 ── */
function ShatterFragments({ trigger }) {
    const fragments = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        r: (Math.random() - 0.5) * 720,
        size: 4 + Math.random() * 18,
        emoji: ['4', '0', ':', '(', '█', '▓', '▒', '░', '💔', '❌'][Math.floor(Math.random() * 10)],
        delay: Math.random() * 0.2,
    }));
    if (!trigger) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {fragments.map(f => (
                <motion.span key={f.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: f.x, y: f.y, opacity: 0, scale: 0, rotate: f.r }}
                    transition={{ duration: 0.8, delay: f.delay, ease: 'easeOut' }}
                    style={{
                        position: 'absolute', fontSize: f.size, fontWeight: 900,
                        color: f.emoji === '💔' || f.emoji === '❌' ? undefined : '#fff',
                        fontFamily: '"Segoe UI", monospace',
                    }}
                >{f.emoji}</motion.span>
            ))}
        </div>
    );
}

/* ── Glitch text effect ── */
function GlitchText({ text, style }) {
    const [glitched, setGlitched] = useState(text);
    useEffect(() => {
        const chars = '█▓▒░@#$%&!?<>{}[]01';
        let frame = 0;
        const iv = setInterval(() => {
            frame++;
            if (frame > 20) { setGlitched(text); clearInterval(iv); return; }
            setGlitched(text.split('').map((c) =>
                Math.random() < 0.3 ? chars[Math.floor(Math.random() * chars.length)] : c
            ).join(''));
        }, 60);
        return () => clearInterval(iv);
    }, [text]);
    return <span style={style}>{glitched}</span>;
}

/* ── BSOD fake stack trace ── */
const STACK_TRACE = [
    '',
    'A problem has been detected and your heart has been',
    'shut down to prevent damage to your feelings.',
    '',
    'LOVE_OVERFLOW_ERROR',
    '',
    'If this is the first time you\'ve seen this error screen,',
    'it\'s because someone loves you too much.',
    '',
    'Technical information:',
    '',
    '*** STOP: 0x000000FE (0x00000008, 0x00000006, 0x00000000)',
    '',
    '*** heart.sys — Address FFFFFFFF Base at JimJam.love',
    '',
    'Stack Trace:',
    '  at Feelings.process (emotions.js:∞)',
    '  at Heart.overflow (love-engine.js:24)',
    '  at jimjam.connect (soulmate.js:1)',
    '  at Universe.align (destiny.js:0)',
    '',
    'Caused by: Too much love in buffer',
    'Buffer size: ∞  |  Current love: ∞ + 1',
    '',
];

const DECRYPT_LINES = [
    '> Intercepting signal...',
    '> Source: Jim\'s heart 💓',
    '> Destination: Jam\'s heart 💓',
    '> Decrypting love.dat ████████████ 100%',
    '> Payload found: 1 hidden message',
    '> Bypassing firewall... ACCESS GRANTED',
    '> Rendering surprise...',
];

export default function FakeError() {
    const [stage, setStage] = useState(0); // 0=BSOD, 1=shatter, 2=glitch, 3=decrypt, 4=reveal
    const [progressBar, setProgressBar] = useState(0);
    const [decryptLine, setDecryptLine] = useState(0);
    const [shakeScreen, setShakeScreen] = useState(false);
    const [shattering, setShattering] = useState(false);

    /* Progress bar for BSOD */
    useEffect(() => {
        if (stage !== 0) return;
        const iv = setInterval(() => {
            setProgressBar(p => {
                if (p >= 100) { clearInterval(iv); return 100; }
                return p + Math.random() * 3;
            });
        }, 150);
        return () => clearInterval(iv);
    }, [stage]);

    /* Decrypt lines reveal */
    useEffect(() => {
        if (stage !== 3) return;
        if (decryptLine >= DECRYPT_LINES.length) {
            setTimeout(() => setStage(4), 800);
            return;
        }
        const t = setTimeout(() => setDecryptLine(l => l + 1), 500);
        return () => clearTimeout(t);
    }, [stage, decryptLine]);

    const handleClick = () => {
        if (stage === 0) {
            // Stage 1: Shatter the 404 / sad face
            setShattering(true);
            setShakeScreen(true);
            setTimeout(() => { setShakeScreen(false); }, 500);
            setTimeout(() => { setStage(2); setShattering(false); }, 1000);
            setTimeout(() => { setStage(3); }, 2200);
        }
    };

    return (
        <motion.div
            animate={shakeScreen ? { x: [0, -10, 12, -8, 6, -4, 0], y: [0, 6, -8, 5, -4, 2, 0] } : {}}
            transition={{ duration: 0.5 }}
            style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}
        >
            {/* Shatter fragments overlay */}
            <ShatterFragments trigger={shattering} />

            <AnimatePresence mode="wait">
                {/* ── STAGE 0: BSOD ── */}
                {stage === 0 && (
                    <motion.div key="bsod"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'brightness(5)', scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        onClick={handleClick}
                        className="bsod-stage"
                        style={{
                            minHeight: '100vh', background: '#0078d7',
                            color: '#fff', fontFamily: '"Segoe UI", "JetBrains Mono", monospace',
                            padding: '40px 60px', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}
                    >
                        <div style={{ maxWidth: 700 }}>
                            {/* Sad face + 404 */}
                            <motion.div
                                animate={{ rotate: [0, -3, 3, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                style={{ marginBottom: 20 }}
                            >
                                <span className="bsod-face" style={{ fontSize: 90, fontWeight: 200, display: 'block', lineHeight: 1 }}>:(</span>
                            </motion.div>

                            {/* Stack trace lines */}
                            {STACK_TRACE.map((line, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.06 }}
                                    style={{
                                        fontSize: line === 'LOVE_OVERFLOW_ERROR' ? 15 : 12,
                                        fontWeight: line === 'LOVE_OVERFLOW_ERROR' ? 700 : 400,
                                        lineHeight: 1.5,
                                        fontFamily: line.startsWith('  at') ? '"JetBrains Mono", monospace' : 'inherit',
                                        opacity: line.startsWith('  at') || line.startsWith('Caused') || line.startsWith('Buffer') ? 0.8 : 1,
                                        color: line === 'LOVE_OVERFLOW_ERROR' ? '#ffd54f' : '#fff',
                                    }}
                                >{line || '\u00A0'}</motion.div>
                            ))}

                            {/* Progress bar */}
                            <motion.div style={{ marginTop: 20 }}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                                <div style={{ fontSize: 11, marginBottom: 6, opacity: 0.8 }}>
                                    Collecting love data... {Math.min(Math.floor(progressBar), 100)}% complete
                                </div>
                                <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, width: 280 }}>
                                    <motion.div style={{
                                        height: '100%', background: '#fff', borderRadius: 2,
                                        width: `${Math.min(progressBar, 100)}%`,
                                    }} />
                                </div>
                            </motion.div>

                            {/* Hint */}
                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.35, 0.15, 0.35] }}
                                transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
                                style={{ fontSize: 11, marginTop: 32, opacity: 0.3 }}
                            >
                                psst... click anywhere to fix this 💕
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {/* ── STAGE 2: GLITCH ── */}
                {stage === 2 && (
                    <motion.div key="glitch"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            minHeight: '100vh', background: '#000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: 20,
                        }}
                    >
                        {/* Scan bar effect */}
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                position: 'absolute', left: 0, right: 0, height: 2,
                                background: 'rgba(57,211,83,0.4)', zIndex: 5,
                            }}
                        />
                        <GlitchText text="SYSTEM OVERRIDE" style={{
                            fontSize: 40, fontWeight: 900, fontFamily: '"JetBrains Mono", monospace',
                            color: '#39d353', display: 'block',
                            textShadow: '2px 2px 0 #f0a, -2px -2px 0 #58a6ff, 0 0 20px rgba(57,211,83,0.5)',
                        }} />
                        <motion.div
                            animate={{ opacity: [1, 0, 1, 0, 1] }}
                            transition={{ duration: 0.4, repeat: 3 }}
                            style={{ fontSize: 14, color: '#f0a', fontFamily: '"JetBrains Mono"' }}
                        >
                            Rerouting love signals...
                        </motion.div>
                        <motion.div
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            style={{ height: 2, background: 'linear-gradient(90deg, #39d353, #f0a)', maxWidth: 300, borderRadius: 2 }}
                        />
                    </motion.div>
                )}

                {/* ── STAGE 3: DECRYPT ── */}
                {stage === 3 && (
                    <motion.div key="decrypt"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="decrypt-stage"
                        style={{
                            minHeight: '100vh', background: '#0d1117',
                            fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
                            padding: '60px 80px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}
                    >
                        <div style={{ maxWidth: 500 }}>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ fontSize: 10, color: '#8b949e', marginBottom: 20, letterSpacing: 2 }}
                            >── LOVE-OS DECRYPTION PROTOCOL ──</motion.div>

                            {DECRYPT_LINES.slice(0, decryptLine).map((line, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        color: line.includes('ACCESS GRANTED') ? '#39d353'
                                            : line.includes('💓') ? '#f4a7b9'
                                                : line.includes('100%') ? '#ffd54f'
                                                    : '#8b949e',
                                        lineHeight: 2.4,
                                    }}
                                >{line}</motion.div>
                            ))}
                            {decryptLine < DECRYPT_LINES.length && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    style={{ color: '#39d353' }}
                                >█</motion.span>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── STAGE 4: EPIC REVEAL ── */}
                {stage === 4 && (
                    <motion.div key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        style={{
                            minHeight: '100vh',
                            background: 'linear-gradient(135deg, #1a1b2e 0%, #2d1f3d 50%, #3a1f3d 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 24, position: 'relative',
                        }}
                    >
                        <FloatingHearts />

                        {/* Ambient glow orbs */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            style={{
                                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(244,167,185,0.12), transparent 70%)',
                                top: '20%', left: '30%',
                            }}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            style={{
                                position: 'absolute', width: 350, height: 350, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(201,160,220,0.1), transparent 70%)',
                                bottom: '20%', right: '25%',
                            }}
                        />

                        <div className="reveal-content" style={{ textAlign: 'center', maxWidth: 480, position: 'relative', zIndex: 10 }}>
                            {/* Photo with spotlight */}
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.7, rotateY: 90 }}
                                animate={{ y: 0, opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <img src="/us.png" alt="Us 💕"
                                        style={{
                                            width: '100%', maxWidth: 420, borderRadius: 20,
                                            boxShadow: '0 25px 80px rgba(244,167,185,0.3), 0 0 60px rgba(201,160,220,0.15), 0 0 120px rgba(244,167,185,0.08)',
                                            border: '2px solid rgba(255,255,255,0.08)',
                                        }}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Title with typewriter-ish entrance */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 34, color: '#f4a7b9', marginTop: 28, fontWeight: 600,
                                    textShadow: '0 0 40px rgba(244,167,185,0.25)',
                                }}
                            >
                                You found me 💖
                            </motion.h1>

                            {/* Romantic message */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 15, color: 'rgba(224,220,232,0.7)', marginTop: 10, lineHeight: 1.7,
                                }}
                            >
                                The only error here is that You are far away from me ✨
                            </motion.p>

                            {/* Error resolved badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0, rotateZ: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                                transition={{ delay: 2.2, type: 'spring', damping: 8, stiffness: 100 }}
                                style={{
                                    marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '10px 22px', borderRadius: 30,
                                    background: 'rgba(181,234,215,0.08)',
                                    border: '1px solid rgba(181,234,215,0.15)',
                                    boxShadow: '0 0 30px rgba(181,234,215,0.05)',
                                }}
                            >
                                <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: 14 }}
                                >✅</motion.span>
                                <span style={{ color: '#b5ead7', fontSize: 11, fontFamily: '"JetBrains Mono"', fontWeight: 500 }}>
                                    LOVE_OVERFLOW — resolved by: being together 💕
                                </span>
                            </motion.div>

                            {/* Subtle footer */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                transition={{ delay: 3 }}
                                style={{ fontSize: 10, color: '#8b87a0', marginTop: 32, fontFamily: '"JetBrains Mono"' }}
                            >
                                // this was never really a 404 — you were always meant to find this 💌
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                @media (max-width: 600px) {
                    .bsod-stage { padding: 24px 20px !important; }
                    .bsod-face { font-size: 60px !important; }
                    .decrypt-stage { padding: 30px 20px !important; font-size: 11px !important; }
                    .reveal-content { padding: 0 12px; }
                    .reveal-content img { max-width: 300px !important; }
                    .reveal-content h1 { font-size: 26px !important; }
                }
            `}</style>
        </motion.div>
    );
}
