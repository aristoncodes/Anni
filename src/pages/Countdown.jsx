import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getTarget() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 2, 24); // March 24
    if (target < now && !(now.getMonth() === 2 && now.getDate() === 24)) {
        target.setFullYear(target.getFullYear() + 1);
    }
    return target;
}

const TARGET = getTarget();

function isAnniversaryToday() {
    const now = new Date();
    return now.getMonth() === 2 && now.getDate() === 24;
}

function getTimeLeft() {
    const diff = TARGET - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

const boxColors = ['var(--pink)', 'var(--lavender)', 'var(--mint)', 'var(--baby-blue)'];
const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];

/* ── Celebration Particles ── */
const EMOJIS = ['❤️', '💖', '💕', '🎈', '🎉', '🥳', '🎊', '💗', '✨', '🌟', '💜', '💝', '🎀', '🫧', '🪩'];
const BALLOON_COLORS = ['#ff6b8a', '#a78bfa', '#67e8f9', '#fbbf24', '#f472b6', '#34d399', '#fb923c', '#c084fc'];

function FloatingEmoji({ emoji, delay, duration, left, size }) {
    return (
        <motion.div
            initial={{ y: '110vh', opacity: 0, rotate: -20, scale: 0.5 }}
            animate={{
                y: '-20vh',
                opacity: [0, 1, 1, 1, 0],
                rotate: [-20, 10, -15, 20, -10],
                scale: [0.5, 1, 1.1, 1, 0.8],
                x: [0, 30, -20, 25, -15],
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: 'linear',
            }}
            style={{
                position: 'fixed',
                left: `${left}%`,
                fontSize: size,
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
            }}
        >
            {emoji}
        </motion.div>
    );
}

function Confetti({ color, delay, left, size }) {
    const shape = Math.random() > 0.5 ? 'circle' : 'square';
    return (
        <motion.div
            initial={{ y: '-10vh', opacity: 1, rotate: 0 }}
            animate={{
                y: '110vh',
                opacity: [1, 1, 1, 0.5, 0],
                rotate: [0, 360, 720, 1080],
                x: [0, 40 * (Math.random() > 0.5 ? 1 : -1), -30 * (Math.random() > 0.5 ? 1 : -1), 20],
            }}
            transition={{
                duration: 4 + Math.random() * 3,
                delay: delay,
                repeat: Infinity,
                ease: 'linear',
            }}
            style={{
                position: 'fixed',
                left: `${left}%`,
                width: size,
                height: shape === 'circle' ? size : size * 1.5,
                borderRadius: shape === 'circle' ? '50%' : '3px',
                background: color,
                zIndex: 1,
                pointerEvents: 'none',
            }}
        />
    );
}

function CelebrationOverlay() {
    const particles = useMemo(() => {
        const items = [];
        // Floating emojis
        for (let i = 0; i < 25; i++) {
            items.push(
                <FloatingEmoji
                    key={`emoji-${i}`}
                    emoji={EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
                    delay={Math.random() * 8}
                    duration={6 + Math.random() * 6}
                    left={Math.random() * 100}
                    size={20 + Math.random() * 28}
                />
            );
        }
        // Confetti pieces
        for (let i = 0; i < 40; i++) {
            items.push(
                <Confetti
                    key={`confetti-${i}`}
                    color={BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]}
                    delay={Math.random() * 6}
                    left={Math.random() * 100}
                    size={6 + Math.random() * 8}
                />
            );
        }
        return items;
    }, []);

    return <>{particles}</>;
}

/* ── Sparkle ring ── */
function SparkleRing() {
    const sparkles = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 360;
        return (
            <motion.span
                key={i}
                animate={{
                    scale: [0.5, 1.3, 0.5],
                    opacity: [0.3, 1, 0.3],
                }}
                transition={{
                    duration: 1.5,
                    delay: i * 0.12,
                    repeat: Infinity,
                }}
                style={{
                    position: 'absolute',
                    fontSize: 18,
                    transform: `rotate(${angle}deg) translateY(-80px)`,
                }}
            >
                ✨
            </motion.span>
        );
    });
    return <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>{sparkles}</div>;
}

export default function Countdown() {
    const [time, setTime] = useState(getTimeLeft());
    const [isCelebration, setIsCelebration] = useState(isAnniversaryToday());

    useEffect(() => {
        const id = setInterval(() => {
            setTime(getTimeLeft());
            setIsCelebration(isAnniversaryToday());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const values = [time.days, time.hours, time.minutes, time.seconds];

    /* ── 🎉 CELEBRATION MODE ── */
    if (isCelebration) {
        return (
            <div className="page-wrapper" style={{ justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
                <CelebrationOverlay />

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}
                >
                    <SparkleRing />

                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ fontSize: 80, display: 'block', marginBottom: 8, marginTop: -60 }}
                    >
                        🎉
                    </motion.div>

                    <motion.h1
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{
                            fontSize: 44,
                            fontWeight: 800,
                            marginBottom: 12,
                            background: 'linear-gradient(90deg, #ff6b8a, #a78bfa, #67e8f9, #ff6b8a)',
                            backgroundSize: '300% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.2,
                        }}
                    >
                        Happy Anniversary! 💕
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ color: 'var(--text-light)', fontSize: 18, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}
                    >
                        Today marks another beautiful year of us together. Every moment with you is a celebration! 🥂
                    </motion.p>

                    <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, type: 'spring' }}
                        style={{
                            maxWidth: 400,
                            margin: '0 auto',
                            padding: '32px 28px',
                            background: 'linear-gradient(135deg, rgba(255,107,138,0.12), rgba(167,139,250,0.12), rgba(103,232,249,0.08))',
                            border: '2px solid rgba(255,107,138,0.25)',
                            boxShadow: '0 0 40px rgba(255,107,138,0.15), 0 0 80px rgba(167,139,250,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                            {['❤️', '🎊', '🥳', '🎈', '💖'].map((e, i) => (
                                <motion.span
                                    key={i}
                                    animate={{
                                        y: [0, -12, 0],
                                        rotate: [0, i % 2 === 0 ? 15 : -15, 0],
                                    }}
                                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                                    style={{ fontSize: 36 }}
                                >
                                    {e}
                                </motion.span>
                            ))}
                        </div>

                        <motion.p
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                color: 'var(--pink-dark)',
                                lineHeight: 1.6,
                            }}
                        >
                            Here's to forever, one beautiful day at a time 💗
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        style={{ marginTop: 32, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        {['🎂', '🍰', '🥂', '🌹', '💐'].map((e, i) => (
                            <motion.span
                                key={i}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                                style={{ fontSize: 28 }}
                            >
                                {e}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    /* ── ⏳ COUNTDOWN MODE ── */
    return (
        <div className="page-wrapper" style={{ justifyContent: 'center', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
            >
                <span style={{ fontSize: 56, display: 'block', marginBottom: 16 }} className="animate-pulse">⏳</span>
                <h1 style={{ fontSize: 36, marginBottom: 8 }}>Our Next Big Day</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: 48, fontSize: 15 }}>
                    Counting every second until we celebrate again 💕
                </p>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {values.map((v, i) => (
                        <motion.div
                            key={labels[i]}
                            className="card"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring' }}
                            style={{
                                width: 120, padding: '28px 16px', textAlign: 'center',
                                background: boxColors[i], borderRadius: 'var(--radius)',
                            }}
                        >
                            <motion.div
                                key={v}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}
                            >
                                {String(v).padStart(2, '0')}
                            </motion.div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                                {labels[i]}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p style={{ color: 'var(--text-light)', marginTop: 32, fontSize: 13 }}>
                    {TARGET.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>
        </div>
    );
}
