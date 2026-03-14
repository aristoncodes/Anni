import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import balloonPink from '../assets/balloon_pink.png';
import balloonLavender from '../assets/balloon_lavender.png';
import balloonMint from '../assets/balloon_mint.png';

const balloonImages = [balloonPink, balloonLavender, balloonMint];

const reasons = [
    'Your laugh is the best sound in the entire universe 😂',
    'You make the ordinary feel extraordinary ✨',
    'The way your eyes light up when you talk about what you love 🌟',
    'You\'re my safe place in a chaotic world 🏠',
    'Your hugs have actual healing powers 🤗',
    'You believe in me even when I don\'t believe in myself 💪',
    'Every song sounds better because it reminds me of you 🎵',
    'The way you scrunch your nose when you laugh 😊',
    'Your voice is my favorite notification sound 📱',
    'You turn my worst days into bearable ones just by existing 🌈',
    'I\'d choose you in every timeline, every universe ♾️',
    'You still give me butterflies after all this time 🦋',
    'The way you care about the little things 💕',
    'Waking up knowing you\'re mine is the best feeling 🌅',
    'You\'re my best friend and my greatest love 💖',
];

const colors = ['#f4a7b9', '#c9a0dc', '#b5ead7', '#a9def9', '#f5d89a'];

function Confetti({ x, y, onComplete }) {
    // Basic particle explosion
    const particles = Array.from({ length: 15 });
    return (
        <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 100 }}>
            {particles.map((_, i) => {
                const angle = (Math.PI * 2 * i) / particles.length;
                const velocity = 50 + Math.random() * 50;
                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                            x: Math.cos(angle) * velocity,
                            y: Math.sin(angle) * velocity + 50,
                            scale: 0, opacity: 0
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        onAnimationComplete={i === 0 ? onComplete : undefined}
                        style={{
                            position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                            background: colors[Math.floor(Math.random() * colors.length)],
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function Reasons() {
    const [activeBalloons, setActiveBalloons] = useState([]);
    const [reasonIndex, setReasonIndex] = useState(0);
    const [poppedReason, setPoppedReason] = useState(null);
    const [confetti, setConfetti] = useState([]);

    const spawnBalloon = () => {
        const id = Date.now();
        const reasonText = reasons[reasonIndex % reasons.length];
        const color = colors[reasonIndex % colors.length];
        const balloonImgSrc = balloonImages[reasonIndex % balloonImages.length];

        setActiveBalloons(current => [...current, {
            id,
            text: reasonText,
            color,
            imgSrc: balloonImgSrc,
            xOffset: (Math.random() - 0.25) * 60, // random sway spread between -30vw and +30vw
            duration: 6 + Math.random() * 4, // Faster float speed
        }]);

        setReasonIndex(prev => prev + 1);

        // Remove balloon after it floats away
        setTimeout(() => {
            setActiveBalloons(curr => curr.filter(b => b.id !== id));
        }, 22000);
    };

    const popBalloon = (b, e) => {
        // Get absolute position of the click
        setConfetti(c => [...c, { id: Date.now(), x: e.clientX, y: e.clientY }]);
        setActiveBalloons(curr => curr.filter(x => x.id !== b.id)); // Remove balloon
        setPoppedReason(b); // Show modal
    };

    return (
        <div style={{
            minHeight: '100vh',
            // Soft morning sky gradient
            background: 'linear-gradient(180deg, #A2C2E1 0%, #D4E6F1 40%, #F8FAFC 70%, #FDC3A6 100%)',
            position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            
            {/* Morning Sun Rays and Dust */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.8, pointerEvents: 'none', overflow: 'hidden' }}>
                {/* Diagonal Sun Rays */}
                <div style={{ position: 'absolute', top: '-20%', left: '-20%', right: '-20%', bottom: '-20%', background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.2) 60%, transparent 100%)', transform: 'rotate(15deg)' }} />
                
                {/* Floating Dust Motes */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div key={i}
                        animate={{ 
                            y: [0, -30, 0], 
                            x: [0, 20, 0],
                            opacity: [0.1, 0.4, 0.1] 
                        }}
                        transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                            background: '#ffffff',
                            borderRadius: '50%',
                            filter: 'blur(1px)'
                        }}
                    />
                ))}
            </div>

            {/* Giant Text Header - Sleek Daytime Look */}
            <div style={{ position: 'relative', zIndex: 10, marginTop: '10vh', textAlign: 'center', pointerEvents: 'none', padding: '0 20px' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        fontSize: 'clamp(40px, 8vw, 85px)',
                        color: '#2C3E50', // Sleek Slate Gray
                        fontFamily: "'Playfair Display', serif",
                        lineHeight: 1.1,
                        textShadow: '0 4px 15px rgba(255,255,255,0.8)',
                        margin: 0
                    }}>
                    I don't need any reason
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    style={{
                        fontSize: 'clamp(30px, 6vw, 65px)',
                        color: '#E07A5F', // Warm Rose Gold/Terracotta
                        fontFamily: "'Caveat', cursive",
                        marginTop: 5,
                        textShadow: '0 2px 10px rgba(255,255,255,0.6)',
                        fontWeight: 500
                    }}
                >
                    to love you ❤️
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 2 }}
                    style={{ color: '#5D6D7E', marginTop: 30, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}
                >
                    (But tap the cottage anyway)
                </motion.p>
            </div>

            {/* Confetti */}
            {confetti.map(c => <Confetti key={c.id} x={c.x} y={c.y} onComplete={() => setConfetti(lst => lst.filter(x => x.id !== c.id))} />)}

            {/* Balloons Container */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                <AnimatePresence>
                    {activeBalloons.map(b => (
                        <motion.div
                            key={b.id}
                            initial={{ y: '80vh', x: '50vw', scale: 0.2, opacity: 0 }}
                            animate={{
                                y: '-20vh',
                                x: `calc(50vw + ${b.xOffset}vw)`,
                                scale: 1,
                                opacity: 1
                            }}
                            transition={{
                                y: { duration: b.duration, ease: "easeOut" },
                                x: { duration: b.duration, ease: "linear" },
                                scale: { duration: 1, ease: "backOut" },
                                opacity: { duration: 0.5 }
                            }}
                            style={{
                                position: 'absolute', left: 0, top: 0,
                                transformOrigin: 'bottom center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                pointerEvents: 'auto', cursor: 'pointer' // make them clickable
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                popBalloon(b, e);
                            }}
                            whileHover={{ scale: 1.1 }}
                        >
                            {/* Realistic Balloon Image */}
                            <div style={{ position: 'relative', width: 85, height: 110 }}>
                                <img 
                                    src={b.imgSrc} 
                                    alt="Balloon" 
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'contain',
                                        // Slight drop shadow to pop against sky
                                        filter: `drop-shadow(0 10px 15px rgba(0,0,0,0.15))`
                                    }} 
                                />
                                
                                {/* Delicate Question Mark Overlay */}
                                <div style={{ 
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 20, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                                }}>
                                    <span style={{ 
                                        color: '#ffffff', fontSize: 32, fontWeight: '700', 
                                        opacity: 0.8, fontFamily: "'Caveat', cursive",
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>?</span>
                                </div>
                            </div>
                            
                            {/* Balloon string tying to the bottom */}
                            <svg width="2" height="60" viewBox="0 0 2 60" style={{ marginTop: -10, zIndex: -1 }}>
                                <path d="M1 0 L1 60" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="2 4" />
                            </svg>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Popped Reason Modal - Daytime Glassmorphism */}
            <AnimatePresence>
                {poppedReason && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setPoppedReason(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                border: '1px solid rgba(255, 255, 255, 1)',
                                borderRadius: 32, padding: '50px 40px', maxWidth: 450, width: '100%',
                                textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* Color Accent Blob */}
                            <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: poppedReason.color, filter: 'blur(40px)', opacity: 0.4, zIndex: 0 }} />
                            
                            <div style={{ fontSize: 50, marginBottom: 20, position: 'relative', zIndex: 1 }}>💌</div>
                            <h2 style={{ color: '#2C3E50', fontSize: 26, fontFamily: "'Playfair Display', serif", lineHeight: 1.5, marginBottom: 40, position: 'relative', zIndex: 1 }}>
                                {poppedReason.text}
                            </h2>
                            <button
                                onClick={() => setPoppedReason(null)}
                                style={{
                                    padding: '12px 36px', borderRadius: 30, border: 'none', background: '#F8FAFC',
                                    color: '#2C3E50', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.05)', transition: 'all 0.2s',
                                    position: 'relative', zIndex: 1
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'none';
                                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.05)';
                                }}
                            >
                                Aww 💕
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clickable Realistic Cottage Image */}
            <motion.div
                onClick={spawnBalloon}
                whileHover={{ filter: 'brightness(1.1)' }}
                style={{
                    position: 'absolute', bottom: '-20px', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 20, cursor: 'pointer',
                    width: 380, height: 'auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
            >
                {/* House Warm Glow */}
                <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(255,230,150,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }} />

                <img
                    src={new URL('../assets/cottage.png', import.meta.url).href}
                    alt="Storybook Cottage"
                    style={{
                        width: '100%', height: 'auto',
                        // Warm morning sun relighting filter
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2)) brightness(1.1) saturate(1.2) sepia(0.2)',
                        pointerEvents: 'none' // Let the motion div handle clicks
                    }}
                />

                {/* Balloon Sparkle Emitter */}
                <div style={{ position: 'absolute', top: 50, right: 100, width: 40, height: 30, zIndex: 5 }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], y: [-5, -20], scale: [0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        style={{ position: 'absolute', top: 0, left: 15, fontSize: 16 }}
                    >
                        ✨
                    </motion.div>
                </div>
            </motion.div>

            {/* Rolling Green Hills Background */}
            <svg 
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25vh', width: '100%', zIndex: 10, pointerEvents: 'none' }}
            >
                <path fill="#C8E6C9" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                <path fill="#A5D6A7" fillOpacity="0.8" d="M0,96L60,112C120,128,240,160,360,170.7C480,181,600,171,720,154.7C840,139,960,117,1080,122.7C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
        </div>
    );
}
