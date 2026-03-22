import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const C = {
    bg: '#1a1b2e', text: '#e0dce8', muted: '#8b87a0', lavender: '#c9a0dc',
    pink: '#f4a7b9', mint: '#b5ead7', gold: '#f5d89a', border: 'rgba(201,160,220,0.12)',
};

const GRAVITY = 0.20;
const JUMP = -3.5;
const PIPE_W = 50;
const GAP = 220; // Increased gap down from 160
const PIPE_SPEED = 1.6; // Slowed down from 2.5
const HEART_SIZE = 30;

export default function FlappyHeart() {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('idle'); // idle, playing, dead
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(() => parseInt(localStorage.getItem('flappy-best') || '0'));
    const gameRef = useRef({ y: 250, vel: 0, pipes: [], score: 0, frame: 0 });

    const resetGame = useCallback(() => {
        gameRef.current = { y: 250, vel: 0, pipes: [], score: 0, frame: 0 };
        setScore(0);
    }, []);

    const jump = useCallback(() => {
        if (gameState === 'idle') { resetGame(); setGameState('playing'); gameRef.current.vel = JUMP; }
        else if (gameState === 'playing') { gameRef.current.vel = JUMP; }
        else if (gameState === 'dead') { resetGame(); setGameState('playing'); gameRef.current.vel = JUMP; }
    }, [gameState, resetGame]);

    useEffect(() => {
        const handler = (e) => { if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); jump(); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [jump]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const g = gameRef.current;

        const loop = () => {
            g.frame++;
            g.vel += GRAVITY;
            g.y += g.vel;

            // Spawn pipes
            if (g.frame % 100 === 0) {
                const top = 60 + Math.random() * (H - GAP - 120);
                g.pipes.push({ x: W, top, scored: false });
            }

            // Move pipes
            g.pipes = g.pipes.filter(p => p.x > -PIPE_W);
            g.pipes.forEach(p => {
                p.x -= PIPE_SPEED;
                if (!p.scored && p.x + PIPE_W < W / 2 - HEART_SIZE / 2) {
                    p.scored = true;
                    g.score++;
                    setScore(g.score);
                }
            });

            // Collision
            const hx = W / 2 - HEART_SIZE / 2, hy = g.y;
            if (hy < 0 || hy + HEART_SIZE > H) { die(); return; }
            for (const p of g.pipes) {
                if (hx + HEART_SIZE > p.x && hx < p.x + PIPE_W) {
                    if (hy < p.top || hy + HEART_SIZE > p.top + GAP) { die(); return; }
                }
            }

            // Draw
            ctx.clearRect(0, 0, W, H);

            // BG gradient
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#252347');
            grad.addColorStop(1, '#1a1b2e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // Stars
            for (let i = 0; i < 30; i++) {
                const sx = (i * 137 + g.frame * 0.2) % W;
                const sy = (i * 97) % H;
                ctx.fillStyle = `rgba(201,160,220,${0.1 + (i % 3) * 0.1})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 1, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pipes (broken hearts)
            g.pipes.forEach(p => {
                // Top pipe
                ctx.fillStyle = 'rgba(244,167,185,0.15)';
                ctx.fillRect(p.x, 0, PIPE_W, p.top);
                ctx.strokeStyle = 'rgba(244,167,185,0.3)';
                ctx.strokeRect(p.x, 0, PIPE_W, p.top);
                // Bottom pipe
                ctx.fillStyle = 'rgba(244,167,185,0.15)';
                ctx.fillRect(p.x, p.top + GAP, PIPE_W, H - p.top - GAP);
                ctx.strokeStyle = 'rgba(244,167,185,0.3)';
                ctx.strokeRect(p.x, p.top + GAP, PIPE_W, H - p.top - GAP);
                // Broken heart on pipe ends
                ctx.font = '20px serif';
                ctx.textAlign = 'center';
                ctx.fillText('💔', p.x + PIPE_W / 2, p.top - 4);
                ctx.fillText('💔', p.x + PIPE_W / 2, p.top + GAP + 20);
            });

            // Heart player
            ctx.save();
            ctx.translate(W / 2, g.y + HEART_SIZE / 2);
            ctx.rotate(Math.min(g.vel * 0.05, 0.5));
            ctx.font = `${HEART_SIZE}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 0, 0);
            ctx.restore();

            // Score on canvas
            ctx.fillStyle = 'rgba(224,220,232,0.8)';
            ctx.font = 'bold 28px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(g.score, W / 2, 40);

            g.animId = requestAnimationFrame(loop);
        };

        g.animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(g.animId);
    }, [gameState]);

    const die = () => {
        setGameState('dead');
        const s = gameRef.current.score;
        if (s > best) { setBest(s); localStorage.setItem('flappy-best', s.toString()); }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ fontSize: 24, color: C.pink, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                Flappy Heart 💕
            </motion.h1>
            <p style={{ color: C.muted, fontSize: 11, marginBottom: 16 }}>Tap or press Space to fly! Avoid the 💔</p>

            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: C.muted }}>Score: <span style={{ color: C.mint, fontWeight: 700 }}>{score}</span></span>
                <span style={{ fontSize: 11, color: C.muted }}>Best: <span style={{ color: C.gold, fontWeight: 700 }}>{best}</span></span>
            </div>

            <div className="flappy-canvas" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}
                onClick={jump}>
                <canvas ref={canvasRef} width={400} height={500}
                    style={{ display: 'block', cursor: 'pointer' }} />

                {/* Overlay for idle/dead */}
                {gameState !== 'playing' && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(26,27,46,0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    }}>
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                            {gameState === 'dead' ? (
                                <>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>💔</div>
                                    <div style={{ fontSize: 16, color: C.text, fontWeight: 600 }}>Game Over!</div>
                                    <div style={{ fontSize: 12, color: C.muted, margin: '8px 0 16px' }}>Score: {score}</div>
                                </>
                            ) : (
                                <>
                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{ fontSize: 50, marginBottom: 10 }}>❤️</motion.div>
                                </>
                            )}
                            <div style={{ fontSize: 12, color: C.lavender }}>
                                {gameState === 'dead' ? 'Tap to try again' : 'Tap or press Space to start'}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .flappy-canvas { max-width: 100vw !important; }
                    .flappy-canvas canvas { width: 100% !important; height: auto !important; }
                }
            `}</style>
        </div>
    );
}
