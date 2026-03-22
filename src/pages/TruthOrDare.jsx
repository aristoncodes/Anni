import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const C = {
    bg: '#1a1b2e', text: '#e0dce8', muted: '#8b87a0', lavender: '#c9a0dc',
    pink: '#f4a7b9', mint: '#b5ead7', gold: '#f5d89a', border: 'rgba(201,160,220,0.12)',
};

const ITEMS = [
    { type: 'truth', text: 'What\'s your favorite memory of us? 💭', color: '#a9def9' },
    { type: 'dare', text: 'Send a voice note saying "I love you" 🎤', color: '#f4a7b9' },
    { type: 'truth', text: 'When did you first realize you liked me? 🦋', color: '#a9def9' },
    { type: 'dare', text: 'Write a 4-line poem about us right now ✍️', color: '#f4a7b9' },
    { type: 'truth', text: 'What\'s one thing about me that always makes you smile? 😊', color: '#a9def9' },
    { type: 'dare', text: 'Send me the ugliest selfie on your phone 📸', color: '#f4a7b9' },
    { type: 'truth', text: 'What\'s your dream date with me? 🌹', color: '#a9def9' },
    { type: 'dare', text: 'Text me "I miss you" in 3 different languages 🌍', color: '#f4a7b9' },
    { type: 'truth', text: 'What song reminds you of us? 🎵', color: '#a9def9' },
    { type: 'dare', text: 'Set my photo as your wallpaper for a day 📱', color: '#f4a7b9' },
    { type: 'truth', text: 'What\'s one thing you want to do together? ✨', color: '#a9def9' },
    { type: 'dare', text: 'Rate our love story out of 10 and explain why 💕', color: '#f4a7b9' },
];

export default function TruthOrDare() {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [selected, setSelected] = useState(null);
    const [history, setHistory] = useState([]);

    const segments = ITEMS.length;
    const segAngle = 360 / segments;

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setSelected(null);

        const extraSpins = 5 + Math.floor(Math.random() * 3);
        const randomAngle = Math.random() * 360;
        const target = rotation + extraSpins * 360 + randomAngle;

        setRotation(target);
        setTimeout(() => {
            setSpinning(false);
            // Calculate which segment the pointer lands on
            const normalizedAngle = (360 - (target % 360) + 90) % 360; // adjust for top pointer
            const idx = Math.floor(normalizedAngle / segAngle) % segments;
            setSelected(ITEMS[idx]);
            setHistory(h => [ITEMS[idx], ...h].slice(0, 10));
        }, 4000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '30px 16px',
        }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 26, color: C.pink, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
                Truth or Dare 🎡
            </motion.h1>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 30 }}>Spin the wheel of love! 💕</p>

            <div style={{ position: 'relative', marginBottom: 30 }}>
                {/* Pointer */}
                <div style={{
                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10, fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}>▼</div>

                {/* Wheel */}
                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
                    style={{ width: 320, height: 320, borderRadius: '50%', position: 'relative', overflow: 'hidden',
                        border: `3px solid ${C.border}`, boxShadow: `0 0 40px ${C.lavender}10, inset 0 0 20px rgba(0,0,0,0.3)`,
                    }} className="tod-wheel"
                >
                    <svg viewBox="0 0 320 320" style={{ width: '100%', height: '100%' }}>
                        {ITEMS.map((item, i) => {
                            const startAngle = (i * segAngle - 90) * (Math.PI / 180);
                            const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
                            const x1 = 160 + 160 * Math.cos(startAngle);
                            const y1 = 160 + 160 * Math.sin(startAngle);
                            const x2 = 160 + 160 * Math.cos(endAngle);
                            const y2 = 160 + 160 * Math.sin(endAngle);
                            const largeArc = segAngle > 180 ? 1 : 0;
                            const midAngle = ((i + 0.5) * segAngle - 90) * (Math.PI / 180);
                            const tx = 160 + 90 * Math.cos(midAngle);
                            const ty = 160 + 90 * Math.sin(midAngle);

                            return (
                                <g key={i}>
                                    <path d={`M160,160 L${x1},${y1} A160,160 0 ${largeArc},1 ${x2},${y2} Z`}
                                        fill={i % 2 === 0 ? 'rgba(169,222,249,0.12)' : 'rgba(244,167,185,0.12)'}
                                        stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                                        fill={item.color} fontSize="11"
                                        transform={`rotate(${(i + 0.5) * segAngle}, ${tx}, ${ty})`}>
                                        {item.type === 'truth' ? '💙' : '💗'}
                                    </text>
                                </g>
                            );
                        })}
                        <circle cx="160" cy="160" r="25" fill={C.bg} stroke={C.border} strokeWidth="2" />
                        <text x="160" y="164" textAnchor="middle" fill={C.text} fontSize="14">💕</text>
                    </svg>
                </motion.div>
            </div>

            {/* Spin button */}
            <motion.button onClick={spin} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                disabled={spinning}
                style={{
                    padding: '12px 36px', borderRadius: 30, border: 'none',
                    background: spinning ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${C.pink}30, ${C.lavender}25)`,
                    color: spinning ? C.muted : C.text, fontSize: 14, fontWeight: 600,
                    cursor: spinning ? 'wait' : 'pointer', fontFamily: 'inherit',
                    boxShadow: spinning ? 'none' : `0 0 20px ${C.pink}15`,
                    marginBottom: 24,
                }}>
                {spinning ? '🎡 Spinning...' : '🎡 SPIN!'}
            </motion.button>

            {/* Result */}
            {selected && !spinning && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                        maxWidth: 420, width: '100%', padding: '20px 24px', borderRadius: 16,
                        background: 'rgba(30,32,58,0.9)', backdropFilter: 'blur(16px)',
                        border: `1px solid ${selected.type === 'truth' ? '#a9def920' : '#f4a7b920'}`,
                        textAlign: 'center',
                    }}>
                    <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10,
                        color: selected.type === 'truth' ? '#a9def9' : C.pink,
                        textTransform: 'uppercase',
                    }}>
                        {selected.type === 'truth' ? '💙 TRUTH' : '💗 DARE'}
                    </div>
                    <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7 }}>{selected.text}</div>
                </motion.div>
            )}

            {/* History */}
            {history.length > 1 && (
                <div style={{ marginTop: 24, maxWidth: 420, width: '100%' }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Previous spins:</div>
                    {history.slice(1, 5).map((item, i) => (
                        <div key={i} style={{
                            padding: '6px 12px', borderRadius: 8, marginBottom: 4,
                            background: 'rgba(255,255,255,0.02)', fontSize: 11, color: C.muted,
                        }}>
                            <span style={{ color: item.type === 'truth' ? '#a9def9' : C.pink }}>
                                {item.type === 'truth' ? '💙' : '💗'}
                            </span> {item.text}
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                @media (max-width: 600px) {
                    .tod-wheel { width: 260px !important; height: 260px !important; }
                }
            `}</style>
        </div>
    );
}
