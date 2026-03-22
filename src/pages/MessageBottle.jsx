import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { ref, push, onValue, update, get } from 'firebase/database';

/* ── Preset messages for beach bottles ── */
const PRESET = [
    'You\'re the reason I believe in magic. ✨',
    'Every love story is beautiful, but ours is my favorite. 💕',
    'I fall in love with you a little more every single day. 🌅',
    'You\'re my today and all of my tomorrows. 💖',
    'In a sea of people, my eyes will always search for you. 🌊',
    'You\'re the best thing I never planned. 🦋',
    'My favorite place in the world is next to you. 🏠',
    'You make my heart smile. 😊',
    'I love you more than yesterday, less than tomorrow. ♾️',
    'You had me at hello, and you still have me now. 💫',
];

/* ── Time-of-day theme ── */
function getTimeTheme() {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return {
        sky: 'linear-gradient(180deg, #FFF5E6 0%, #FFE4C9 30%, #FDCFB0 55%, #d4eef9 85%, #c2e4f5 100%)',
        label: 'morning',
        wave1: '#F4A7B9', wave2: '#FFC0CB', wave3: '#B5EAD7',
    };
    if (h >= 11 && h < 16) return {
        sky: 'linear-gradient(180deg, #FDFCF5 0%, #fdf0e0 35%, #e8f4fd 70%, #d4eef9 100%)',
        label: 'afternoon',
        wave1: '#7DCBF5', wave2: '#A9DEF9', wave3: '#B5EAD7',
    };
    if (h >= 16 && h < 20) return {
        sky: 'linear-gradient(180deg, #FDE8D0 0%, #F4A7B9 30%, #C9A0DC 60%, #8BA7D9 85%, #6B8FCC 100%)',
        label: 'evening',
        wave1: '#C9A0DC', wave2: '#E0BBE4', wave3: '#8BA7D9',
    };
    return {
        sky: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 35%, #0f3460 65%, #1a3a5c 100%)',
        label: 'night',
        wave1: '#1a3a5c', wave2: '#0f3460', wave3: '#16213e',
    };
}

/* ── Wave SVG ── */
function Waves() {
    const theme = getTimeTheme();
    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 0 }}>
            <svg viewBox="0 0 1440 320" style={{ display: 'block', position: 'absolute', bottom: 80, width: '100%', opacity: 0.25 }}>
                <path fill={theme.wave1} d="M0,224L48,213C96,203,192,181,288,187C384,192,480,224,576,235C672,245,768,235,864,213C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z">
                    <animate attributeName="d" dur="8s" repeatCount="indefinite"
                        values="M0,224L48,213C96,203,192,181,288,187C384,192,480,224,576,235C672,245,768,235,864,213C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z;M0,192L48,203C96,213,192,235,288,229C384,224,480,192,576,181C672,171,768,181,864,203C960,224,1056,256,1152,256C1248,256,1344,224,1392,208L1440,192L1440,320L0,320Z;M0,224L48,213C96,203,192,181,288,187C384,192,480,224,576,235C672,245,768,235,864,213C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z" />
                </path>
            </svg>
            <svg viewBox="0 0 1440 320" style={{ display: 'block', position: 'absolute', bottom: 40, width: '100%', opacity: 0.3 }}>
                <path fill={theme.wave2} d="M0,256L48,245C96,235,192,213,288,208C384,203,480,213,576,229C672,245,768,267,864,261C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L0,320Z">
                    <animate attributeName="d" dur="6s" repeatCount="indefinite"
                        values="M0,256L48,245C96,235,192,213,288,208C384,203,480,213,576,229C672,245,768,267,864,261C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L0,320Z;M0,224L48,235C96,245,192,267,288,272C384,277,480,267,576,251C672,235,768,213,864,219C960,224,1056,256,1152,272C1248,288,1344,288,1392,288L1440,288L1440,320L0,320Z;M0,256L48,245C96,235,192,213,288,208C384,203,480,213,576,229C672,245,768,267,864,261C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L0,320Z" />
                </path>
            </svg>
            <svg viewBox="0 0 1440 320" style={{ display: 'block', position: 'absolute', bottom: 0, width: '100%', opacity: 0.35 }}>
                <path fill={theme.wave3} d="M0,288L48,283C96,277,192,267,288,261C384,256,480,256,576,267C672,277,768,299,864,293C960,288,1056,256,1152,240C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z">
                    <animate attributeName="d" dur="10s" repeatCount="indefinite"
                        values="M0,288L48,283C96,277,192,267,288,261C384,256,480,256,576,267C672,277,768,299,864,293C960,288,1056,256,1152,240C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z;M0,256L48,261C96,267,192,277,288,283C384,288,480,288,576,277C672,267,768,245,864,251C960,256,1056,288,1152,304C1248,320,1344,320,1392,320L1440,320L1440,320L0,320Z;M0,288L48,283C96,277,192,267,288,261C384,256,480,256,576,267C672,277,768,299,864,293C960,288,1056,256,1152,240C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z" />
                </path>
            </svg>
        </div>
    );
}

/* ── Night stars ── */
function Stars() {
    const stars = useMemo(() => Array.from({ length: 30 }, () => ({
        left: `${Math.random() * 100}%`, top: `${Math.random() * 50}%`,
        size: 1 + Math.random() * 2, delay: Math.random() * 4, dur: 2 + Math.random() * 3,
    })), []);
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {stars.map((s, i) => (
                <motion.div key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
                    style={{ position: 'absolute', left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: '50%', background: '#fff' }}
                />
            ))}
        </div>
    );
}

/* ── Water sparkles ── */
function Sparkles() {
    const isNight = getTimeTheme().label === 'night';
    const dots = useMemo(() => Array.from({ length: 12 }, () => ({
        left: `${8 + Math.random() * 84}%`, bottom: `${5 + Math.random() * 18}%`,
        delay: Math.random() * 4, dur: 2 + Math.random() * 2, size: 3 + Math.random() * 4,
    })), []);
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            {dots.map((d, i) => (
                <motion.div key={i}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: d.dur, delay: d.delay, repeat: Infinity }}
                    style={{ position: 'absolute', left: d.left, bottom: d.bottom, width: d.size, height: d.size, borderRadius: '50%', background: isNight ? 'rgba(200,220,255,0.6)' : 'rgba(255,255,255,0.8)', boxShadow: `0 0 6px ${isNight ? 'rgba(200,220,255,0.4)' : 'rgba(255,255,255,0.6)'}` }}
                />
            ))}
        </div>
    );
}

/* ── Sound toggle ── */
function SoundToggle() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const a = new Audio('https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3');
        a.loop = true; a.volume = 0.3;
        audioRef.current = a;
        return () => { a.pause(); a.src = ''; };
    }, []);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) { audioRef.current.pause(); }
        else { audioRef.current.play().catch(() => {}); }
        setPlaying(!playing);
    };

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed', top: 20, right: 20, zIndex: 50,
                width: 42, height: 42, borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)', border: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                cursor: 'pointer', fontSize: 18,
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            {playing ? '🔊' : '🔇'}
        </motion.button>
    );
}

/* ── Beach Bottle ── */
function BeachBottle({ index, onOpen, isOpen }) {
    const positions = [
        { left: '8%', bottom: '12%' }, { left: '22%', bottom: '8%' },
        { left: '38%', bottom: '14%' }, { left: '55%', bottom: '9%' },
        { left: '70%', bottom: '13%' }, { left: '85%', bottom: '7%' },
    ];
    const bottles = ['🍾', '🧴', '🫙', '🍶', '🏺', '🧉'];
    return (
        <motion.div
            onClick={() => onOpen(index)}
            animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3 + index * 0.5, repeat: Infinity, delay: index * 0.4 }}
            whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed', ...positions[index % positions.length],
                fontSize: isOpen ? 28 : 24, cursor: 'pointer', zIndex: 2,
                filter: isOpen ? 'grayscale(0.5) opacity(0.5)' : 'none',
            }}
        >{bottles[index]}</motion.div>
    );
}

/* ── Floating bottle (send animation) ── */
function FloatingBottleSend({ show, onDone }) {
    if (!show) return null;
    return (
        <motion.div
            initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            animate={{ opacity: [1, 1, 0], y: [0, -200, -350], x: [0, 80, 120], scale: [1, 0.8, 0.4], rotate: [0, -20, -40] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            onAnimationComplete={onDone}
            style={{ position: 'fixed', bottom: '30%', left: '50%', fontSize: 32, zIndex: 100, pointerEvents: 'none' }}
        >🍾</motion.div>
    );
}

/* ── Parchment Card ── */
function ParchmentCard({ message, sender }) {
    const isNight = getTimeTheme().label === 'night';
    return (
        <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.8, rotateX: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -40 }}
            transition={{ type: 'spring', damping: 14 }}
            style={{
                background: isNight
                    ? 'linear-gradient(145deg, #2a2a3d 0%, #1e1e30 50%, #2a2a3d 100%)'
                    : 'linear-gradient(145deg, #fdf6e3 0%, #f5e6c8 50%, #fdf6e3 100%)',
                borderRadius: 16, padding: '36px 32px 28px',
                maxWidth: 440, width: '100%', position: 'relative',
                boxShadow: isNight
                    ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                    : '0 8px 32px rgba(139,109,63,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
                border: isNight ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(193,154,91,0.2)',
            }}
        >
            <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 28, opacity: 0.4, transform: 'rotate(12deg)' }}>❤️‍🔥</div>
            <div style={{ width: 40, height: 2, background: isNight ? 'rgba(255,255,255,0.15)' : 'rgba(193,154,91,0.3)', borderRadius: 1, margin: '0 auto 20px' }} />
            <p style={{
                fontSize: 19, lineHeight: 1.8, fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic', color: isNight ? '#e0d8c8' : '#5a4621', textAlign: 'center',
            }}>"{message}"</p>
            {sender && (
                <p style={{ textAlign: 'right', marginTop: 16, fontSize: 12, color: isNight ? 'rgba(224,216,200,0.5)' : 'rgba(90,70,33,0.5)', fontFamily: 'Inter' }}>
                    — {sender}
                </p>
            )}
            <div style={{ width: 40, height: 2, background: isNight ? 'rgba(255,255,255,0.15)' : 'rgba(193,154,91,0.3)', borderRadius: 1, margin: '16px auto 0' }} />
        </motion.div>
    );
}

/* ── Stats Bar ── */
function StatsBar({ him, her }) {
    const isNight = getTimeTheme().label === 'night';
    const total = him.length + her.length;
    const all = [...him, ...her].filter(m => m.time);
    const earliest = all.length ? all.sort((a, b) => new Date(a.time) - new Date(b.time))[0] : null;
    const bg = isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.65)';
    const clr = isNight ? '#c8c0b0' : 'var(--text)';
    const sub = isNight ? 'rgba(200,192,176,0.5)' : 'var(--text-light)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{
                display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
                marginBottom: 24, position: 'relative', zIndex: 5,
            }}
        >
            {[
                { emoji: '💌', val: total, label: 'Total Notes' },
                { emoji: '💙', val: him.length, label: 'From Him' },
                { emoji: '💗', val: her.length, label: 'From Her' },
                { emoji: '📅', val: earliest ? new Date(earliest.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—', label: 'First Note' },
            ].map(s => (
                <div key={s.label} style={{
                    background: bg, borderRadius: 12, padding: '10px 18px',
                    textAlign: 'center', backdropFilter: 'blur(4px)',
                    boxShadow: isNight ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                    <span style={{ fontSize: 16 }}>{s.emoji}</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: clr, fontFamily: "'JetBrains Mono', monospace", margin: '2px 0' }}>{s.val}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: sub, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                </div>
            ))}
        </motion.div>
    );
}

/* ── Sender Tabs ── */
function SenderTabs({ active, onSwitch }) {
    const isNight = getTimeTheme().label === 'night';
    return (
        <div style={{
            display: 'flex', gap: 0, borderRadius: 30,
            background: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
            padding: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}>
            {[{ key: 'him', label: 'From Him 💙' }, { key: 'her', label: 'From Her 💗' }].map(tab => (
                <button key={tab.key} onClick={() => onSwitch(tab.key)} style={{
                    padding: '8px 22px', borderRadius: 26, border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
                    background: active === tab.key ? (tab.key === 'him' ? 'var(--baby-blue)' : 'var(--pink)') : 'transparent',
                    color: isNight && active !== tab.key ? 'rgba(255,255,255,0.6)' : 'var(--text)',
                    transition: 'all 0.3s',
                }}>{tab.label}</button>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function MessageBottle() {
    const theme = getTimeTheme();
    const isNight = theme.label === 'night';

    const [currentMsg, setCurrentMsg] = useState('');
    const [currentSender, setCurrentSender] = useState('');
    const [isUncorked, setIsUncorked] = useState(false);
    const [beachOpened, setBeachOpened] = useState({});
    const [tab, setTab] = useState('him');
    const [showWriter, setShowWriter] = useState(false);
    const [writerSender, setWriterSender] = useState('him');
    const [writerText, setWriterText] = useState('');
    const [fbMessages, setFbMessages] = useState({ him: [], her: [] });
    const [fbKeys, setFbKeys] = useState({ him: {}, her: {} });
    const [loading, setLoading] = useState(true);
    const [animKey, setAnimKey] = useState(0);
    const [sendAnim, setSendAnim] = useState(false);

    /* ── Firebase ── */
    useEffect(() => {
        const unsubs = ['him', 'her'].map(who => {
            const r = ref(db, `bottle-messages/${who}`);
            return onValue(r, snap => {
                const data = snap.val();
                if (data) {
                    const entries = Object.entries(data);
                    const msgs = entries.map(([k, v]) => ({ ...v, _key: k })).reverse();
                    const keys = {};
                    entries.forEach(([k, v]) => { keys[k] = v; });
                    setFbMessages(prev => ({ ...prev, [who]: msgs }));
                    setFbKeys(prev => ({ ...prev, [who]: keys }));
                } else {
                    setFbMessages(prev => ({ ...prev, [who]: [] }));
                    setFbKeys(prev => ({ ...prev, [who]: {} }));
                }
                setLoading(false);
            });
        });
        return () => unsubs.forEach(u => u());
    }, []);

    /* ── Uncork ── */
    const handleUncork = () => {
        if (isUncorked) return;
        setIsUncorked(true);
        const msg = PRESET[Math.floor(Math.random() * PRESET.length)];
        setTimeout(() => { setCurrentMsg(msg); setCurrentSender(''); setAnimKey(k => k + 1); }, 400);
        setTimeout(() => setIsUncorked(false), 2000);
    };

    /* ── Beach bottle ── */
    const handleBeachOpen = (idx) => {
        if (beachOpened[idx]) return;
        setBeachOpened(prev => ({ ...prev, [idx]: true }));
        setCurrentMsg(PRESET[idx % PRESET.length]);
        setCurrentSender('');
        setAnimKey(k => k + 1);
    };

    /* ── Show Firebase msg ── */
    const showFbMsg = (msg) => {
        setCurrentMsg(msg.text);
        setCurrentSender(msg.sender);
        setAnimKey(k => k + 1);
    };

    /* ── Surprise me ── */
    const surpriseMe = () => {
        const all = [...fbMessages.him, ...fbMessages.her, ...PRESET.map(t => ({ text: t, sender: '' }))];
        const pick = all[Math.floor(Math.random() * all.length)];
        setCurrentMsg(pick.text || pick);
        setCurrentSender(pick.sender || '');
        setAnimKey(k => k + 1);
    };

    /* ── Pin/unpin ── */
    const togglePin = (who, msgKey, currentPinned) => {
        const r = ref(db, `bottle-messages/${who}/${msgKey}`);
        update(r, { pinned: !currentPinned });
    };

    /* ── Submit ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!writerText.trim()) return;
        setSendAnim(true);
        const senderLabel = writerSender === 'him' ? 'Him 💙' : 'Her 💗';
        setTimeout(() => {
            push(ref(db, `bottle-messages/${writerSender}`), {
                text: writerText.trim(), sender: senderLabel,
                time: new Date().toISOString(), pinned: false,
            });
            setWriterText('');
        }, 800);
    };

    const activeMessages = [...fbMessages[tab]].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
    });

    const textColor = isNight ? '#e0d8c8' : 'var(--text)';
    const subColor = isNight ? 'rgba(224,216,200,0.5)' : 'var(--text-light)';

    return (
        <div className="page-wrapper" style={{
            padding: '50px 24px 160px', minHeight: '100vh', position: 'relative',
            background: theme.sky, overflow: 'hidden',
        }}>
            <Waves />
            <Sparkles />
            {isNight && <Stars />}
            <SoundToggle />
            <FloatingBottleSend show={sendAnim} onDone={() => setSendAnim(false)} />

            {[0, 1, 2, 3, 4, 5].map(i => (
                <BeachBottle key={i} index={i} onOpen={handleBeachOpen} isOpen={!!beachOpened[i]} />
            ))}

            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 8, position: 'relative', zIndex: 5 }}>
                <motion.div
                    onClick={handleUncork}
                    animate={isUncorked ? { rotate: [-10, 30], y: [0, -20] } : { y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                    transition={isUncorked ? { duration: 0.4 } : { duration: 4, repeat: Infinity }}
                    whileHover={!isUncorked ? { scale: 1.1, rotate: 10 } : {}}
                    style={{ fontSize: 72, cursor: isUncorked ? 'default' : 'pointer', display: 'inline-block', position: 'relative', userSelect: 'none' }}
                >
                    🍾
                    {!isUncorked && <motion.span animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: -8, right: -12, fontSize: 16 }}>✨</motion.span>}
                </motion.div>
                <h1 style={{ fontSize: 34, marginTop: 8, color: textColor }}>Message in a Bottle</h1>
                <p style={{ color: subColor, fontSize: 14, marginTop: 4 }}>
                    {isNight ? 'A quiet night on the shore... tap the bottle 🌙' : 'Tap the bottle to uncork a message, or explore the beach 🏖️'}
                </p>
                <div style={{ width: 40, height: 3, margin: '12px auto 0', background: isNight ? 'linear-gradient(90deg, #8BA7D9, #C9A0DC)' : 'linear-gradient(90deg, var(--baby-blue), var(--pink))', borderRadius: 2 }} />
            </motion.div>

            {/* ── Parchment ── */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px', position: 'relative', zIndex: 5 }}>
                <AnimatePresence mode="wait">
                    {currentMsg ? (
                        <ParchmentCard key={animKey} message={currentMsg} sender={currentSender} />
                    ) : (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                            style={{ fontSize: 15, color: subColor, fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                            Click the bottle above to discover a message... 🌊
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Surprise Me ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 5 }}>
                <motion.button
                    onClick={surpriseMe}
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    style={{
                        padding: '10px 24px', borderRadius: 24, border: 'none',
                        background: isNight ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
                        color: textColor, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Inter',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(4px)',
                    }}
                >🎲 Surprise Me</motion.button>
            </div>

            {/* ── Stats ── */}
            <StatsBar him={fbMessages.him} her={fbMessages.her} />

            {/* ── Messages Section ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ maxWidth: 500, width: '100%', margin: '0 auto', position: 'relative', zIndex: 5 }}>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <SenderTabs active={tab} onSwitch={setTab} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: subColor, padding: 20 }}>Loading... 💭</p>
                    ) : activeMessages.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '28px 20px',
                            background: isNight ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                            borderRadius: 16, color: subColor, fontSize: 14,
                        }}>
                            No messages yet from {tab === 'him' ? 'Him' : 'Her'}. Write the first one! 💌
                        </div>
                    ) : activeMessages.map((msg, i) => (
                        <motion.div
                            key={`${msg._key}-${i}`}
                            initial={{ opacity: 0, x: tab === 'him' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => showFbMsg(msg)}
                            style={{
                                background: isNight ? 'linear-gradient(145deg, #2a2a3d, #1e1e30)' : 'linear-gradient(145deg, #fdf6e3, #f8eed4)',
                                borderRadius: 14, padding: '16px 20px',
                                borderLeft: `4px solid ${tab === 'him' ? 'var(--baby-blue)' : 'var(--pink)'}`,
                                cursor: 'pointer', position: 'relative',
                                boxShadow: isNight ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)',
                            }}
                            whileHover={{ y: -2 }}
                        >
                            {msg.pinned && (
                                <span style={{ position: 'absolute', top: 8, right: 36, fontSize: 10, opacity: 0.5 }}>📌 Pinned</span>
                            )}
                            <motion.button
                                onClick={(e) => { e.stopPropagation(); togglePin(tab, msg._key, msg.pinned); }}
                                whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }}
                                style={{
                                    position: 'absolute', top: 8, right: 10, background: 'none',
                                    border: 'none', cursor: 'pointer', fontSize: 16,
                                    opacity: msg.pinned ? 1 : 0.3, transition: 'opacity 0.2s',
                                }}
                            >{msg.pinned ? '❤️' : '🤍'}</motion.button>
                            <p style={{
                                fontSize: 15, lineHeight: 1.6, fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic', color: isNight ? '#e0d8c8' : '#5a4621', paddingRight: 30,
                            }}>"{msg.text}"</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <span style={{ fontSize: 11, color: isNight ? 'rgba(224,216,200,0.4)' : 'rgba(90,70,33,0.4)' }}>
                                    {msg.sender || (tab === 'him' ? 'Him 💙' : 'Her 💗')}
                                </span>
                                <span style={{ fontSize: 11, color: isNight ? 'rgba(224,216,200,0.3)' : 'rgba(90,70,33,0.3)' }}>
                                    {msg.time ? new Date(msg.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Writer ── */}
                {!showWriter ? (
                    <motion.button onClick={() => setShowWriter(true)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        style={{
                            width: '100%', padding: '14px 24px',
                            background: isNight ? 'linear-gradient(135deg, #2a2a3d, #1e1e30)' : 'linear-gradient(135deg, #fdf6e3, #f5e6c8)',
                            border: isNight ? '2px dashed rgba(255,255,255,0.1)' : '2px dashed rgba(193,154,91,0.3)',
                            borderRadius: 14, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                            color: isNight ? '#c8b888' : '#8b6914', fontFamily: 'Inter',
                        }}
                    >✍️ Write a Love Note</motion.button>
                ) : (
                    <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        onSubmit={handleSubmit}
                        style={{
                            background: isNight ? 'linear-gradient(145deg, #2a2a3d, #1e1e30)' : 'linear-gradient(145deg, #fdf6e3, #f8eed4)',
                            borderRadius: 16, padding: 24,
                            boxShadow: isNight ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(139,109,63,0.1)',
                            border: isNight ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(193,154,91,0.15)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: isNight ? '#e0d8c8' : '#5a4621', fontFamily: 'Inter' }}>✍️ New Love Note</span>
                            <button type="button" onClick={() => setShowWriter(false)}
                                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: isNight ? '#c8b888' : '#8b6914', opacity: 0.5 }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                            {[{ key: 'him', label: 'From Him 💙' }, { key: 'her', label: 'From Her 💗' }].map(opt => (
                                <button key={opt.key} type="button" onClick={() => setWriterSender(opt.key)} style={{
                                    flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
                                    background: writerSender === opt.key ? (opt.key === 'him' ? 'var(--baby-blue)' : 'var(--pink)') : (isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)'),
                                    color: isNight && writerSender !== opt.key ? 'rgba(255,255,255,0.5)' : 'var(--text)',
                                }}>{opt.label}</button>
                            ))}
                        </div>
                        <textarea value={writerText} onChange={e => setWriterText(e.target.value)}
                            placeholder="Write your message here..." rows={3}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: 12,
                                border: isNight ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(193,154,91,0.2)',
                                background: isNight ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                                fontSize: 14, fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                                color: isNight ? '#e0d8c8' : '#5a4621', outline: 'none', resize: 'vertical',
                            }}
                            onFocus={e => e.target.style.borderColor = isNight ? '#8BA7D9' : '#c19a5b'}
                            onBlur={e => e.target.style.borderColor = isNight ? 'rgba(255,255,255,0.1)' : 'rgba(193,154,91,0.2)'}
                        />
                        <button type="submit" className="btn" style={{
                            width: '100%', marginTop: 14,
                            background: isNight ? 'linear-gradient(135deg, #4a5586, #6B8FCC)' : 'linear-gradient(135deg, #c19a5b, #dbb978)',
                            color: '#fff', fontSize: 14, fontWeight: 700,
                            boxShadow: isNight ? '0 4px 12px rgba(74,85,134,0.3)' : '0 4px 12px rgba(193,154,91,0.3)',
                        }}>Send to Sea 🌊</button>
                    </motion.form>
                )}
            </motion.div>
            <style>{`
                @media (max-width: 600px) {
                    .page-wrapper h1 { font-size: 26px !important; }
                    .page-wrapper { padding: 40px 14px 140px !important; }
                }
            `}</style>
        </div>
    );
}
