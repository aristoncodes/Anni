import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C = {
    bg: '#1a1b2e', card: 'rgba(30,32,58,0.9)', surface: 'rgba(255,255,255,0.04)',
    text: '#e0dce8', muted: '#8b87a0', lavender: '#c9a0dc', pink: '#f4a7b9',
    mint: '#b5ead7', blue: '#a9def9', gold: '#f5d89a', border: 'rgba(201,160,220,0.12)',
};

const SYMBOLS = ['💖', '🌹', '💍', '✨', '🧸', '🌸', '💋', '❤️', '🥰', '💕'];
const JACKPOT_MESSAGES = [
    'JACKPOT! 🎰 You two are meant to be!',
    'GRAND PRIZE! 💖 Love wins!',
    'TRIPLE MATCH! ✨ Soulmates confirmed!',
];
const MESSAGES = [
    'Jim loves Jam endlessly 💕', 'Every moment is a treasure ✨', 'Distance means nothing 🌎💖',
    'You make my heart skip 💓', 'Together we\'re unstoppable 🔥', 'My favorite hello 👋❤️',
    'Forever starts now 💍', 'You\'re my sunshine 🌅', 'Better together always 💑',
    'My heart chose you 💖', 'Love you to the moon 🌙', 'Dream come true ✨',
];

function Confetti() {
    const items = Array.from({ length: 25 }, (_, i) => ({
        id: i, x: Math.random() * 100, d: Math.random() * 0.5, s: 14 + Math.random() * 18,
        e: ['💕', '❤️', '✨', '💖', '🎰', '⭐', '🌟', '💎'][Math.floor(Math.random() * 8)],
    }));
    return <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
        {items.map(h => <motion.div key={h.id}
            initial={{ y: '110vh', x: `${h.x}vw`, opacity: 1 }}
            animate={{ y: '-10vh', opacity: [0, 1, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 3, delay: h.d }}
            style={{ position: 'absolute', fontSize: h.s }}
        >{h.e}</motion.div>)}
    </div>;
}

export default function SlotMachine() {
    const [reels, setReels] = useState([0, 3, 6]);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [spins, setSpins] = useState(0);
    const [wins, setWins] = useState(0);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);
        setShowConfetti(false);
        setSpins(s => s + 1);

        // Animate through random values
        let frame = 0;
        const iv = setInterval(() => {
            frame++;
            setReels([
                Math.floor(Math.random() * SYMBOLS.length),
                Math.floor(Math.random() * SYMBOLS.length),
                Math.floor(Math.random() * SYMBOLS.length),
            ]);
            if (frame > 20) {
                clearInterval(iv);
                // Final result
                const final = [
                    Math.floor(Math.random() * SYMBOLS.length),
                    Math.floor(Math.random() * SYMBOLS.length),
                    Math.floor(Math.random() * SYMBOLS.length),
                ];
                // ~15% chance of match
                if (Math.random() < 0.15) {
                    const sym = Math.floor(Math.random() * SYMBOLS.length);
                    final[0] = sym; final[1] = sym; final[2] = sym;
                } else if (Math.random() < 0.3) {
                    final[1] = final[0]; // 2 match
                }
                setReels(final);
                setSpinning(false);

                const allMatch = final[0] === final[1] && final[1] === final[2];
                // Only count adjacent matches as a partial win
                const twoMatch = final[0] === final[1] || final[1] === final[2];
                if (allMatch) {
                    setResult({ type: 'jackpot', msg: JACKPOT_MESSAGES[Math.floor(Math.random() * JACKPOT_MESSAGES.length)] });
                    setShowConfetti(true);
                    setWins(w => w + 1);
                    setTimeout(() => setShowConfetti(false), 3500);
                } else if (twoMatch) {
                    setResult({ type: 'partial', msg: MESSAGES[Math.floor(Math.random() * MESSAGES.length)] });
                    setWins(w => w + 1);
                } else {
                    setResult({ type: 'miss', msg: 'Spin again! Love never gives up 💪' });
                }
            }
        }, 80);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24, position: 'relative',
        }}>
            {showConfetti && <Confetti />}

            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 28, color: C.lavender, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
                Love Slot Machine 🎰
            </motion.h1>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 30 }}>Match 3 for a love jackpot! 💖</p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{spins}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>Spins</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.mint }}>{wins}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>Wins 💕</div>
                </div>
            </div>

            {/* Machine */}
            <motion.div
                style={{
                    background: C.card, backdropFilter: 'blur(16px)',
                    borderRadius: 24, border: `1px solid ${C.border}`,
                    padding: '40px 36px', boxShadow: '0 8px 60px rgba(0,0,0,0.3)',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                {/* Glow behind reels */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(circle at 50% 50%, ${C.lavender}08, transparent 70%)`,
                }} />

                {/* Reels */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 30, position: 'relative' }}>
                    {reels.map((r, i) => (
                        <motion.div key={i}
                            animate={spinning ? { y: [0, -10, 10, -5, 5, 0], scale: [1, 0.95, 1.05, 0.97, 1] } : {}}
                            transition={spinning ? { duration: 0.3, repeat: Infinity } : {}}
                            style={{
                                width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(0,0,0,0.2)', borderRadius: 16,
                                border: `2px solid ${result?.type === 'jackpot' ? C.gold + '60' : C.border}`,
                                fontSize: 48, boxShadow: result?.type === 'jackpot' ? `0 0 30px ${C.gold}20` : 'none',
                                transition: 'border 0.3s, box-shadow 0.3s',
                            }}
                        >
                            {SYMBOLS[r]}
                        </motion.div>
                    ))}
                </div>

                {/* Spin button */}
                <motion.button
                    onClick={spin}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                    disabled={spinning}
                    style={{
                        width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                        background: spinning
                            ? C.surface
                            : `linear-gradient(135deg, ${C.pink}30, ${C.lavender}25, ${C.mint}20)`,
                        color: spinning ? C.muted : C.text,
                        fontSize: 16, fontWeight: 700, cursor: spinning ? 'wait' : 'pointer',
                        fontFamily: 'inherit', letterSpacing: 1,
                        boxShadow: spinning ? 'none' : `0 0 30px ${C.lavender}15`,
                    }}
                >
                    {spinning ? '🎰 Spinning...' : '🎰 PULL THE LEVER'}
                </motion.button>
            </motion.div>

            {/* Result message */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            marginTop: 24, padding: '14px 28px', borderRadius: 14,
                            background: result.type === 'jackpot' ? `${C.gold}15` : result.type === 'partial' ? `${C.mint}10` : C.surface,
                            border: `1px solid ${result.type === 'jackpot' ? C.gold + '30' : result.type === 'partial' ? C.mint + '20' : C.border}`,
                            fontSize: 13, textAlign: 'center', maxWidth: 400,
                            color: result.type === 'jackpot' ? C.gold : result.type === 'partial' ? C.mint : C.muted,
                            fontWeight: result.type === 'jackpot' ? 700 : 400,
                        }}
                    >
                        {result.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
