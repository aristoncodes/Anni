import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const WORD = 'JIMJAM';
const MAX_GUESSES = 6;

const KEYS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

function checkGuess(guess, answer) {
    const result = Array(6).fill('absent');
    const ansArr = answer.split('');
    const guessArr = guess.split('');
    // Correct first
    guessArr.forEach((l, i) => { if (l === ansArr[i]) { result[i] = 'correct'; ansArr[i] = null; } });
    // Present
    guessArr.forEach((l, i) => {
        if (result[i] !== 'correct') {
            const idx = ansArr.indexOf(l);
            if (idx !== -1) { result[i] = 'present'; ansArr[idx] = null; }
        }
    });
    return result;
}

const stateColors = {
    correct: 'var(--mint)',
    present: 'var(--lavender)',
    absent: '#d3d3d3',
    empty: 'var(--white)',
    tbd: 'var(--white)',
};

export default function Wordle() {
    const [guesses, setGuesses] = useState([]);
    const [current, setCurrent] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [shake, setShake] = useState(false);

    const letterStates = {};
    guesses.forEach(g => {
        const result = checkGuess(g, WORD);
        g.split('').forEach((l, i) => {
            if (result[i] === 'correct') letterStates[l] = 'correct';
            else if (result[i] === 'present' && letterStates[l] !== 'correct') letterStates[l] = 'present';
            else if (!letterStates[l]) letterStates[l] = 'absent';
        });
    });

    const handleKey = useCallback((key) => {
        if (gameOver) return;
        if (key === '⌫') { setCurrent(c => c.slice(0, -1)); return; }
        if (key === 'ENTER') {
            if (current.length !== 6) { setShake(true); setTimeout(() => setShake(false), 500); return; }
            const newGuesses = [...guesses, current];
            setGuesses(newGuesses);
            if (current === WORD) { setWon(true); setGameOver(true); }
            else if (newGuesses.length >= MAX_GUESSES) { setGameOver(true); }
            setCurrent('');
            return;
        }
        if (current.length < 6) setCurrent(c => c + key);
    }, [current, guesses, gameOver]);

    const grid = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
        const row = [];
        for (let c = 0; c < 6; c++) {
            if (r < guesses.length) {
                const letter = guesses[r][c];
                const result = checkGuess(guesses[r], WORD);
                row.push({ letter, state: result[c] });
            } else if (r === guesses.length) {
                row.push({ letter: current[c] || '', state: current[c] ? 'tbd' : 'empty' });
            } else {
                row.push({ letter: '', state: 'empty' });
            }
        }
        grid.push(row);
    }

    return (
        <div className="page-wrapper" style={{ justifyContent: 'center', padding: '40px 24px', minHeight: '100vh' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, letterSpacing: 2 }}>Love Wordle</h1>
                <p style={{ color: 'var(--text-light)', fontSize: 14, marginTop: 6 }}>Guess the 6-letter word 💖</p>
            </motion.div>

            {/* Grid */}
            <motion.div animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', marginBottom: 28 }}>
                    {grid.map((row, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 6 }}>
                            {row.map((cell, ci) => (
                                <motion.div
                                    key={ci}
                                    initial={ri < guesses.length ? { rotateX: 90 } : {}}
                                    animate={{ rotateX: 0 }}
                                    transition={{ delay: ri < guesses.length ? ci * 0.15 : 0, duration: 0.4 }}
                                    style={{
                                        width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: stateColors[cell.state], border: cell.state === 'empty' ? '2px solid #ddd' : cell.state === 'tbd' ? '2px solid #bbb' : '2px solid transparent',
                                        borderRadius: 'var(--radius-sm)', fontSize: 22, fontWeight: 700, color: 'var(--text)',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {cell.letter}
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Game over message */}
            {gameOver && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', marginBottom: 20 }}>
                    {won ? (
                        <p style={{ fontSize: 22, fontWeight: 600 }}>You got it! 💖 The word was <span style={{ color: 'var(--pink-dark)' }}>{WORD}</span></p>
                    ) : (
                        <p style={{ fontSize: 18 }}>The word was <b style={{ color: 'var(--pink-dark)' }}>{WORD}</b>. Better luck next time! 💕</p>
                    )}
                    <button className="btn btn-pink" style={{ marginTop: 16 }} onClick={() => { setGuesses([]); setCurrent(''); setGameOver(false); setWon(false); }}>
                        Play Again 🔄
                    </button>
                </motion.div>
            )}

            {/* Keyboard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                {KEYS.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', gap: 5 }}>
                        {row.map(k => {
                            let bg = '#e8e8e8';
                            if (letterStates[k] === 'correct') bg = 'var(--mint)';
                            else if (letterStates[k] === 'present') bg = 'var(--lavender)';
                            else if (letterStates[k] === 'absent') bg = '#c0c0c0';
                            const isWide = k === 'ENTER' || k === '⌫';
                            return (
                                <motion.button
                                    key={k}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => handleKey(k)}
                                    style={{
                                        width: isWide ? 64 : 38, height: 48, borderRadius: 8, border: 'none',
                                        background: bg, fontSize: isWide ? 12 : 15, fontWeight: 600, cursor: 'pointer',
                                        fontFamily: 'Inter, sans-serif', color: 'var(--text)', transition: 'background 0.2s',
                                    }}
                                >
                                    {k}
                                </motion.button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
