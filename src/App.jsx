import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './pages/Timeline';
import Reasons from './pages/Reasons';
import CpProblem from './pages/CpProblem';
import TerminalQuiz from './pages/TerminalQuiz';
import MessageBottle from './pages/MessageBottle';
import Countdown from './pages/Countdown';
import Notes from './pages/Notes';
import WordleHub, { WordleGame } from './pages/Wordle';
import SlotMachine from './pages/SlotMachine';
import FlappyHeart from './pages/FlappyHeart';
import TruthOrDare from './pages/TruthOrDare';
import Memories from './pages/Memories';
import FakeError from './pages/FakeError';
import Home from './pages/Home';

/* ─── Anniversary Splash (March 24 only) ─── */
const HEARTS = ['💕', '❤️', '💖', '💗', '💝', '💜', '🩷', '🤍', '💐', '🌹', '✨', '🫶'];
const CONFETTI_COLORS = ['#FFC0CB', '#E0BBE4', '#B5EAD7', '#A9DEF9', '#F4A7B9', '#C9A0DC', '#fbbf24', '#ff6b81', '#a29bfe'];

function SplashParticles() {
    const items = useMemo(() => {
        const arr = [];
        /* Floating hearts rising up */
        for (let i = 0; i < 18; i++) {
            arr.push(
                <motion.div
                    key={`h-${i}`}
                    initial={{ y: '110vh', opacity: 0, scale: 0.4, rotate: -30 }}
                    animate={{
                        y: '-15vh',
                        opacity: [0, 1, 1, 0.8, 0],
                        scale: [0.4, 0.9, 1.1, 1, 0.6],
                        rotate: [-30, 15, -10, 20],
                        x: [0, 25 * (Math.random() > 0.5 ? 1 : -1), -20, 15],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        delay: Math.random() * 3,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'fixed',
                        left: `${5 + Math.random() * 90}%`,
                        fontSize: 18 + Math.random() * 28,
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                >
                    {HEARTS[Math.floor(Math.random() * HEARTS.length)]}
                </motion.div>
            );
        }
        /* Confetti falling */
        for (let i = 0; i < 35; i++) {
            const size = 5 + Math.random() * 7;
            arr.push(
                <motion.div
                    key={`c-${i}`}
                    initial={{ y: '-10vh', opacity: 0 }}
                    animate={{
                        y: '110vh',
                        opacity: [0, 1, 1, 0],
                        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                        x: [0, 50 * (Math.random() > 0.5 ? 1 : -1), -30],
                    }}
                    transition={{
                        duration: 3.5 + Math.random() * 2.5,
                        delay: 0.3 + Math.random() * 2,
                        ease: 'linear',
                    }}
                    style={{
                        position: 'fixed',
                        left: `${Math.random() * 100}%`,
                        width: size,
                        height: size * 1.4,
                        borderRadius: Math.random() > 0.5 ? '50%' : 2,
                        background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                />
            );
        }
        /* Sparkle bursts */
        for (let i = 0; i < 8; i++) {
            arr.push(
                <motion.div
                    key={`s-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: 0.5 + i * 0.4,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'fixed',
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        fontSize: 24 + Math.random() * 16,
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                >
                    ✨
                </motion.div>
            );
        }
        return arr;
    }, []);
    return <>{items}</>;
}

function AnniversarySplash({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1127 0%, #2d1b3d 30%, #1e2a4a 70%, #1a1127 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Radial glow behind text */}
            <div style={{
                position: 'absolute',
                width: '60vw', height: '60vw', maxWidth: 600, maxHeight: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,96,122,0.25) 0%, rgba(139,92,160,0.1) 50%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <SplashParticles />

            {/* Main content */}
            <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 80, delay: 0.2 }}
                style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}
            >
                {/* Big emoji */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: 80, marginBottom: 12, filter: 'drop-shadow(0 0 20px rgba(255,182,193,0.5))' }}
                >
                    💕
                </motion.div>

                {/* "Happy Anniversary" */}
                <motion.h1
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                        fontSize: 'clamp(32px, 8vw, 56px)',
                        fontWeight: 900,
                        margin: '0 0 8px',
                        lineHeight: 1.15,
                        background: 'linear-gradient(90deg, #FFC0CB, #E0BBE4, #A9DEF9, #F4A7B9, #FFC0CB)',
                        backgroundSize: '300% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 10px rgba(255,192,203,0.4))',
                        fontFamily: "'Playfair Display', serif",
                    }}
                >
                    Happy Anniversary!
                </motion.h1>

                {/* Year badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, rgba(212,96,122,0.3), rgba(139,92,160,0.3))',
                        border: '1px solid rgba(255,192,203,0.25)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 50,
                        padding: '8px 24px',
                        marginBottom: 16,
                    }}
                >
                    <span style={{
                        fontSize: 16, fontWeight: 700,
                        color: '#FFC0CB',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: 1,
                    }}>
                        ✨ {new Date().getFullYear() - 2021} Years of Us ✨
                    </span>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: 'clamp(14px, 3vw, 18px)',
                        maxWidth: 400,
                        margin: '0 auto',
                        lineHeight: 1.6,
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                    }}
                >
                    "You are my favorite" 🤍
                </motion.p>

                {/* Animated rings */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    style={{
                        display: 'flex', gap: 8,
                        justifyContent: 'center', marginTop: 24,
                    }}
                >
                    {['💍', '💕', '💍'].map((e, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, delay: 2 + i * 0.2, repeat: Infinity }}
                            style={{ fontSize: 28 }}
                        >
                            {e}
                        </motion.span>
                    ))}
                </motion.div>
            </motion.div>

            {/* Progress bar at bottom */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, #FFC0CB, #E0BBE4, #A9DEF9)',
                    borderRadius: '0 2px 0 0',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
            />

            {/* Skip hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
                onClick={onComplete}
                whileHover={{ color: 'rgba(255,255,255,0.5)' }}
            >
                tap to skip →
            </motion.div>
        </motion.div>
    );
}

export default function App() {
    const now = new Date();
    const isAnniversary = now.getMonth() === 2 && now.getDate() === 24;
    const [showSplash, setShowSplash] = useState(isAnniversary);

    return (
        <BrowserRouter>
            <AnimatePresence>
                {showSplash && (
                    <AnniversarySplash onComplete={() => setShowSplash(false)} />
                )}
            </AnimatePresence>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/timeline-8f92a1b3" element={<Timeline />} />
                <Route path="/reasons-c7d4e5f6" element={<Reasons />} />
                <Route path="/problem-a-optimal-match-x9y8z7" element={<CpProblem />} />
                <Route path="/terminal-override-q1w2e3" element={<TerminalQuiz />} />
                <Route path="/message-bottle-m4n5b6" element={<MessageBottle />} />
                <Route path="/next-big-day-t9r8e7" element={<Countdown />} />
                <Route path="/our-notes-p0o9i8" element={<Notes />} />
                <Route path="/custom-wordle-l1k2j3" element={<WordleHub />}>
                    <Route index element={<WordleGame />} />
                    <Route path="slots" element={<SlotMachine />} />
                    <Route path="flappy" element={<FlappyHeart />} />
                    <Route path="truth-dare" element={<TruthOrDare />} />
                </Route>
                <Route path="/our-memories-v8b7n6" element={<Memories />} />
                <Route path="*" element={<FakeError />} />
            </Routes>
        </BrowserRouter>
    );
}
