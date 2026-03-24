import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

/* ── Theme ── */
const C = {
    bg: '#1a1b2e', card: 'rgba(30,32,58,0.9)', surface: 'rgba(255,255,255,0.04)',
    text: '#e0dce8', muted: '#8b87a0', lavender: '#c9a0dc', pink: '#f4a7b9',
    mint: '#b5ead7', blue: '#a9def9', gold: '#f5d89a', border: 'rgba(201,160,220,0.12)',
};

/* ── Word Pool ── */
const WORDS = ['JIMJAM', 'HEARTS', 'KISSES', 'CUDDLE', 'LOVERS', 'HUGGER', 'DREAMY'];
const HINTS = {
    JIMJAM: ['A name for a very special duo 💕', 'Starts with J... think about US 💓', 'Two names combined into one 🥰'],
    HEARTS: ['The organ of love ❤️', 'They beat faster when you see someone special', 'Draw them everywhere 💕'],
    KISSES: ['Something sweet you give to someone you love 💋', 'X marks the spot', 'Mwah! 😘'],
    CUDDLE: ['The best thing on a cold night 🤗', 'Wrap your arms around someone', 'Cozy and warm together'],
    LOVERS: ['Two people deeply in love 💑', 'Jim and Jam are these', 'Rhymes with covers ❤️'],
    HUGGER: ['Someone who loves giving hugs 🤗', 'Warm and tight', 'Arms wrapped around 💕'],
    ADORBS: ['Short for adorable 🥰', 'Really really cute', 'What Jim calls Jam'],
    WARMTH: ['The feeling of being loved 🌅', 'Like a cozy blanket', 'Not cold, but...'],
    DREAMY: ['Lost in happy thoughts 💭', 'Gazing at someone you love', 'Like a beautiful dream 🌙'],
    CHERUB: ['A cute little angel 👼', 'Associated with Valentine\'s Day', 'Cupid is one'],
};

const WIN_MESSAGES = ['You know me so well 💖', 'Soulmate energy! ✨', 'Our hearts think alike 💕', 'You\'re a genius in love 🧠❤️', 'We\'re so connected 🔗💖'];

const KEYS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

function checkGuess(guess, answer) {
    const result = Array(answer.length).fill('absent');
    const ansArr = answer.split('');
    const guessArr = guess.split('');
    guessArr.forEach((l, i) => { if (l === ansArr[i]) { result[i] = 'correct'; ansArr[i] = null; } });
    guessArr.forEach((l, i) => {
        if (result[i] !== 'correct') {
            const idx = ansArr.indexOf(l);
            if (idx !== -1) { result[i] = 'present'; ansArr[idx] = null; }
        }
    });
    return result;
}

const stateColors = {
    correct: { bg: C.mint, border: C.mint, glow: `0 0 16px ${C.mint}40` },
    present: { bg: C.lavender, border: C.lavender, glow: `0 0 16px ${C.lavender}40` },
    absent: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)', glow: 'none' },
    empty: { bg: 'transparent', border: 'rgba(255,255,255,0.1)', glow: 'none' },
    tbd: { bg: 'transparent', border: 'rgba(201,160,220,0.3)', glow: 'none' },
};

/* ── Hearts confetti ── */
function Confetti() {
    const p = Array.from({ length: 20 }, (_, i) => ({
        id: i, x: Math.random() * 100, d: Math.random() * 0.5, s: 12 + Math.random() * 16,
        e: ['💕', '❤️', '✨', '💖', '🎉', '⭐'][Math.floor(Math.random() * 6)],
    }));
    return <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
        {p.map(h => <motion.div key={h.id}
            initial={{ y: '110vh', x: `${h.x}vw`, opacity: 1, scale: 0 }}
            animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.5] }}
            transition={{ duration: 2.5, delay: h.d, ease: 'easeOut' }}
            style={{ position: 'absolute', fontSize: h.s }}
        >{h.e}</motion.div>)}
    </div>;
}

/* ── Stats Modal ── */
function StatsModal({ stats, onClose }) {
    const maxDist = Math.max(...Object.values(stats.dist), 1);
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
        <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            style={{
                background: C.card, backdropFilter: 'blur(16px)', borderRadius: 16,
                border: `1px solid ${C.border}`, padding: 28, maxWidth: 360, width: '100%',
            }}>
            <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 20px', textAlign: 'center' }}>Your Stats 📊</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
                {[
                    { v: stats.played, l: 'Played' },
                    { v: stats.played ? Math.round((stats.won / stats.played) * 100) : 0, l: 'Win %' },
                    { v: stats.streak, l: 'Streak 🔥' },
                    { v: stats.maxStreak, l: 'Best' },
                ].map(s => <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{s.l}</div>
                </div>)}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Guess Distribution</div>
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: C.muted, fontSize: 11, width: 12 }}>{n}</span>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max((stats.dist[n] || 0) / maxDist * 100, 8)}%` }}
                    transition={{ delay: n * 0.1 }}
                    style={{ height: 18, background: `${C.lavender}30`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                    <span style={{ fontSize: 10, color: C.text, fontWeight: 600 }}>{stats.dist[n] || 0}</span>
                </motion.div>
            </div>)}
            <button onClick={onClose} style={{
                marginTop: 20, width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
                background: `${C.lavender}20`, color: C.lavender, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
            }}>Close</button>
        </motion.div>
    </motion.div>;
}

export function WordleGame() {
    const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guesses, setGuesses] = useState([]);
    const [current, setCurrent] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [shake, setShake] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hintIdx, setHintIdx] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [winMsg, setWinMsg] = useState('');

    const [stats, setStats] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wordle-stats')) || { played: 0, won: 0, streak: 0, maxStreak: 0, dist: {} }; }
        catch { return { played: 0, won: 0, streak: 0, maxStreak: 0, dist: {} }; }
    });

    useEffect(() => { localStorage.setItem('wordle-stats', JSON.stringify(stats)); }, [stats]);

    const letterStates = {};
    guesses.forEach(g => {
        const result = checkGuess(g, word);
        g.split('').forEach((l, i) => {
            if (result[i] === 'correct') letterStates[l] = 'correct';
            else if (result[i] === 'present' && letterStates[l] !== 'correct') letterStates[l] = 'present';
            else if (!letterStates[l]) letterStates[l] = 'absent';
        });
    });

    // Keyboard listener
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === 'Enter') handleKey('ENTER');
            else if (e.key === 'Backspace') handleKey('⌫');
            else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    const handleKey = useCallback((key) => {
        if (gameOver) return;
        if (key === '⌫') { setCurrent(c => c.slice(0, -1)); return; }
        if (key === 'ENTER') {
            if (current.length !== word.length) { setShake(true); setTimeout(() => setShake(false), 500); return; }
            const newGuesses = [...guesses, current];
            setGuesses(newGuesses);
            if (current === word) {
                setWon(true); setGameOver(true); setShowConfetti(true);
                setWinMsg(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
                setTimeout(() => setShowConfetti(false), 3000);
                setStats(s => {
                    const ns = { ...s, played: s.played + 1, won: s.won + 1, streak: s.streak + 1, maxStreak: Math.max(s.maxStreak, s.streak + 1), dist: { ...s.dist, [newGuesses.length]: (s.dist[newGuesses.length] || 0) + 1 } };
                    return ns;
                });
            } else if (newGuesses.length >= 6) {
                setGameOver(true);
                setStats(s => ({ ...s, played: s.played + 1, streak: 0 }));
            }
            setCurrent('');
            return;
        }
        if (current.length < word.length) setCurrent(c => c + key);
    }, [current, guesses, gameOver, word]);

    const handleHint = () => {
        const hints = HINTS[word] || ['Think about love 💕'];
        setShowHint(true);
        setHintIdx(i => Math.min(i + 1, hints.length));
    };

    const newGame = () => {
        setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setGuesses([]); setCurrent(''); setGameOver(false); setWon(false);
        setHintIdx(0); setShowHint(false);
    };

    const grid = [];
    for (let r = 0; r < 6; r++) {
        const row = [];
        for (let c = 0; c < word.length; c++) {
            if (r < guesses.length) {
                const result = checkGuess(guesses[r], word);
                row.push({ letter: guesses[r][c], state: result[c] });
            } else if (r === guesses.length) {
                row.push({ letter: current[c] || '', state: current[c] ? 'tbd' : 'empty' });
            } else {
                row.push({ letter: '', state: 'empty' });
            }
        }
        grid.push(row);
    }

    const cardBase = { background: C.card, backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 4px 30px rgba(0,0,0,0.2)' };

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '30px 16px',
        }}>
            {showConfetti && <Confetti />}
            <AnimatePresence>{showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}</AnimatePresence>

            <div style={{ maxWidth: 500, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 10px' }}>
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 24, color: C.lavender, fontFamily: "'Playfair Display', serif", margin: 0 }}>
                    Love Wordle 💕
                </motion.h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleHint} style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
                        background: C.surface, color: C.gold, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                    }}>💡 Hint</button>
                    <button onClick={() => setShowStats(true)} style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
                        background: C.surface, color: C.muted, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                    }}>📊 Stats</button>
                </div>
            </div>

            {/* Streak */}
            {stats.streak > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontSize: 11, color: C.gold, marginBottom: 16 }}>
                    🔥 {stats.streak} win streak
                </motion.div>
            )}

            {/* Hint */}
            <AnimatePresence>
                {showHint && hintIdx > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            marginBottom: 16, padding: '8px 18px', borderRadius: 10,
                            background: `${C.gold}10`, border: `1px solid ${C.gold}20`,
                            fontSize: 12, color: C.gold, maxWidth: 400, textAlign: 'center',
                        }}>
                        {(HINTS[word] || ['Think about love 💕'])[hintIdx - 1]}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <motion.div animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
                style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                    {grid.map((row, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 6 }}>
                            {row.map((cell, ci) => {
                                const s = stateColors[cell.state];
                                const isRevealed = ri < guesses.length;
                                return (
                                    <motion.div key={ci}
                                        initial={isRevealed ? { rotateX: 90, scale: 0.8 } : { scale: cell.letter ? 1.1 : 1 }}
                                        animate={won && isRevealed ? { rotateX: 0, scale: 1, y: [0, -8, 0] } : { rotateX: 0, scale: 1 }}
                                        transition={won && isRevealed ? { delay: ci * 0.1, duration: 0.5, y: { delay: 0.5 + ci * 0.08, duration: 0.4 } } : { delay: isRevealed ? ci * 0.15 : 0, duration: 0.4 }}
                                        style={{
                                            width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: s.bg, border: `2px solid ${s.border}`,
                                            borderRadius: 10, fontSize: 22, fontWeight: 700, color: C.text,
                                            boxShadow: s.glow,
                                        }} className="wordle-cell"
                                    >
                                        {cell.letter}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Game over */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', marginBottom: 20 }}>
                        {won ? (
                            <div>
                                <p style={{ fontSize: 20, fontWeight: 600, color: C.mint }}>{winMsg}</p>
                                <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>The word was <span style={{ color: C.pink, fontWeight: 700 }}>{word}</span></p>
                            </div>
                        ) : (
                            <p style={{ fontSize: 16, color: C.text }}>The word was <b style={{ color: C.pink }}>{word}</b> 💕</p>
                        )}
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={newGame}
                            style={{
                                marginTop: 14, padding: '10px 28px', borderRadius: 10, border: 'none',
                                background: `linear-gradient(135deg, ${C.mint}25, ${C.lavender}20)`,
                                color: C.mint, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                            New Word 🔄
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                {KEYS.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', gap: 5 }}>
                        {row.map(k => {
                            let bg = C.surface;
                            let border = C.border;
                            let glow = 'none';
                            if (letterStates[k] === 'correct') { bg = `${C.mint}25`; border = `${C.mint}40`; glow = `0 0 10px ${C.mint}20`; }
                            else if (letterStates[k] === 'present') { bg = `${C.lavender}20`; border = `${C.lavender}30`; glow = `0 0 10px ${C.lavender}15`; }
                            else if (letterStates[k] === 'absent') { bg = 'rgba(255,255,255,0.02)'; border = 'rgba(255,255,255,0.04)'; }
                            const isWide = k === 'ENTER' || k === '⌫';
                            return (
                                <motion.button key={k} whileTap={{ scale: 0.9 }}
                                    onClick={() => handleKey(k)}
                                    style={{
                                        width: isWide ? 64 : 38, height: 48, borderRadius: 8,
                                        border: `1px solid ${border}`, background: bg,
                                        fontSize: isWide ? 11 : 14, fontWeight: 600, cursor: 'pointer',
                                        fontFamily: 'inherit', color: letterStates[k] === 'absent' ? C.muted : C.text,
                                        boxShadow: glow, transition: 'all 0.2s',
                                    }} className={isWide ? 'wordle-key-wide' : 'wordle-key'}>
                                    {k}
                                </motion.button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .wordle-cell { width: 42px !important; height: 42px !important; font-size: 18px !important; border-radius: 8px !important; }
                    .wordle-key { width: 30px !important; height: 42px !important; font-size: 12px !important; }
                    .wordle-key-wide { width: 48px !important; height: 42px !important; font-size: 10px !important; }
                }
            `}</style>
        </div>
    );
}

export default function WordleHub() {
    const navigate = useNavigate();
    const location = useLocation();

    const games = [
        { id: '', name: 'Love Wordle 💕', path: '/custom-wordle-l1k2j3' },
        { id: 'slots', name: 'Slot Machine 🎰', path: '/custom-wordle-l1k2j3/slots' },
        { id: 'flappy', name: 'Flappy Heart 🐦', path: '/custom-wordle-l1k2j3/flappy' },
        { id: 'truth-dare', name: 'Truth/Dare 🎡', path: '/custom-wordle-l1k2j3/truth-dare' },
    ];

    const currentPath = location.pathname;

    return (
        <div style={{ minHeight: '100vh', background: C.bg }}>
            {/* Minimal top nav for games */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(26,27,46,0.8)', backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${C.border}`,
                padding: '12px 16px', display: 'flex', justifyContent: 'center',
            }}>
                <div style={{
                    display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4,
                    maxWidth: 700, width: '100%',
                    WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
                }}>
                    {games.map(g => (
                        <button
                            key={g.id}
                            onClick={() => navigate(g.path)}
                            style={{
                                padding: '8px 16px', borderRadius: 20,
                                background: currentPath === g.path ? C.lavender + '20' : 'transparent',
                                border: `1px solid ${currentPath === g.path ? C.border : 'transparent'}`,
                                color: currentPath === g.path ? C.lavender : C.muted,
                                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace',
                                whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                            }}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render the current game */}
            <div style={{ paddingTop: 60 }}>
                <Outlet />
            </div>
        </div>
    );
}
