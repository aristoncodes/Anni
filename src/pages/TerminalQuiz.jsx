import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quizQuestions = [
    { q: 'What\'s our anniversary date?', options: ['March 24', 'Feb 14', 'Jan 1', 'Dec 25'], correct: 0 },
    { q: 'What\'s my favorite thing about you?', options: ['Your eyes', 'Your smile', 'Everything!', 'Your laugh'], correct: 2 },
    { q: 'What was our first date?', options: ['Movie night', 'Coffee date', 'Long walk', 'Dinner'], correct: 1 },
    { q: 'How much do I love you?', options: ['A lot', 'More than food', 'To infinity', 'All of the above 💖'], correct: 3 },
    { q: 'What\'s our song?', options: ['Perfect', 'All of Me', 'A Thousand Years', 'You decide! 💜'], correct: 3 },
];

export default function TerminalQuiz() {
    const [lines, setLines] = useState(['$ love-os --init', '> Booting secure terminal...', '> Ready.', '', '🔐 Enter Secret Passcode:']);
    const [input, setInput] = useState('');
    const [unlocked, setUnlocked] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(null);
    const inputRef = useRef(null);
    const termRef = useRef(null);

    useEffect(() => {
        if (!unlocked && inputRef.current) inputRef.current.focus();
    }, [unlocked]);

    useEffect(() => {
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
    }, [lines]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = input.trim().toLowerCase();
        setInput('');
        if (val === 'jimjam') {
            setLines(prev => [...prev, `> ${val}`, '✅ Access Granted. Welcome back, love. 💕', '', '> Initializing Love Quiz...']);
            setTimeout(() => setUnlocked(true), 1500);
        } else {
            setLines(prev => [...prev, `> ${val}`, '❌ Incorrect. Hint: What are we?', ' ', '🔐 Enter Secret Passcode:']);
        }
    };

    const handleAnswer = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === quizQuestions[currentQ].correct) setScore(s => s + 1);
        setTimeout(() => {
            if (currentQ < quizQuestions.length - 1) {
                setCurrentQ(q => q + 1);
                setAnswered(false);
                setSelected(null);
            } else {
                setQuizDone(true);
            }
        }, 1200);
    };

    // Terminal view
    if (!unlocked) {
        return (
            <div
                onClick={() => inputRef.current?.focus()}
                style={{
                    minHeight: '100vh', background: '#0d1117', color: '#39d353', fontFamily: '"JetBrains Mono", monospace',
                    padding: 32, fontSize: 14, cursor: 'text',
                }}
            >
                <div ref={termRef} style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                    {lines.map((l, i) => (
                        <div key={i} style={{
                            lineHeight: 1.8,
                            color: l.startsWith('❌') ? '#f85149' : l.startsWith('✅') ? '#39d353' : l.startsWith('🔐') ? '#ffd54f' : '#c9d1d9',
                        }}>
                            {l || '\u00A0'}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ color: '#39d353', marginRight: 8 }}>{'>'}</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        style={{
                            background: 'transparent', border: 'none', outline: 'none', color: '#c9d1d9',
                            fontFamily: 'inherit', fontSize: 14, flex: 1,
                        }}
                        autoFocus
                    />
                    <span className="animate-blink" style={{ color: '#39d353' }}>█</span>
                </form>
            </div>
        );
    }

    // Quiz view
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-wrapper"
            style={{ justifyContent: 'center', padding: '40px 24px' }}
        >
            <AnimatePresence mode="wait">
                {!quizDone ? (
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="card"
                        style={{ maxWidth: 500, width: '100%', padding: 32 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span className="badge" style={{ background: 'var(--lavender)' }}>Q{currentQ + 1}/{quizQuestions.length}</span>
                            <span className="badge" style={{ background: 'var(--mint)' }}>Score: {score}</span>
                        </div>

                        <div style={{
                            height: 4, background: '#eee', borderRadius: 2, marginBottom: 20, overflow: 'hidden',
                        }}>
                            <motion.div
                                style={{ height: '100%', background: 'linear-gradient(90deg, var(--pink), var(--lavender))', borderRadius: 2 }}
                                animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                            />
                        </div>

                        <h2 style={{ fontSize: 22, marginBottom: 20 }}>{quizQuestions[currentQ].q}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {quizQuestions[currentQ].options.map((opt, idx) => {
                                let bg = 'var(--white)';
                                let border = '2px solid #eee';
                                if (answered) {
                                    if (idx === quizQuestions[currentQ].correct) { bg = '#d4edda'; border = '2px solid var(--mint-dark)'; }
                                    else if (idx === selected) { bg = '#fdd'; border = '2px solid #f5c6cb'; }
                                }
                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        whileHover={!answered ? { scale: 1.02, boxShadow: 'var(--shadow-hover)' } : {}}
                                        whileTap={!answered ? { scale: 0.98 } : {}}
                                        style={{
                                            padding: '14px 20px', borderRadius: 'var(--radius-sm)', background: bg,
                                            border, cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                                            fontSize: 15, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                                        }}
                                    >
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ maxWidth: 420, width: '100%', padding: 40, textAlign: 'center' }}
                    >
                        <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>
                            {score === quizQuestions.length ? '🏆' : score >= 3 ? '💖' : '💕'}
                        </span>
                        <h2 style={{ fontSize: 28, marginBottom: 8 }}>
                            {score === quizQuestions.length ? 'Perfect Score!' : score >= 3 ? 'Amazing!' : 'Not bad!'}
                        </h2>
                        <p style={{ color: 'var(--text-light)', fontSize: 18, marginBottom: 8 }}>
                            {score}/{quizQuestions.length} correct
                        </p>
                        <p style={{ color: 'var(--pink-dark)', fontSize: 14 }}>
                            {score === quizQuestions.length ? 'You know our love story by heart! 💕' : 'Every answer leads back to love 💖'}
                        </p>
                        <button className="btn btn-pink" style={{ marginTop: 24 }} onClick={() => { setCurrentQ(0); setScore(0); setQuizDone(false); setAnswered(false); setSelected(null); }}>
                            Play Again 🔄
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
