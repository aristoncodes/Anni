import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FakeError() {
    const [revealed, setRevealed] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            background: revealed ? '#FDFCF5' : '#f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'monospace', color: '#333', padding: 24,
            transition: 'background 0.8s ease',
        }}>
            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', maxWidth: 500, cursor: 'pointer' }}
                        onClick={() => setRevealed(true)}
                    >
                        <h1 style={{ fontSize: 72, fontWeight: 700, color: '#ccc', margin: 0 }}>404</h1>
                        <h2 style={{ fontSize: 20, fontWeight: 400, margin: '8px 0 16px' }}>Page Not Found</h2>
                        <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6 }}>
                            The page you are looking for might have been removed, had its name changed,
                            or is temporarily unavailable.
                        </p>
                        <div style={{
                            marginTop: 24, padding: '12px 20px', background: '#fff', border: '1px solid #ddd',
                            borderRadius: 4, fontSize: 13, color: '#666',
                        }}>
                            Error Code: 404 NOT_FOUND<br />
                            Server: nginx/1.24.0<br />
                            Request ID: {Math.random().toString(36).substring(2, 10)}
                        </div>
                        <p style={{ fontSize: 11, color: '#e0e0e0', marginTop: 32 }}>
                            psst... click anywhere 💕
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ textAlign: 'center', maxWidth: 480 }}
                    >
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img
                                src="/us.png"
                                alt="Us 💕"
                                style={{
                                    width: '100%',
                                    maxWidth: 360,
                                    borderRadius: 24,
                                    boxShadow: '0 20px 60px rgba(255, 192, 203, 0.3)',
                                }}
                            />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 28, color: '#5D5D5D', marginTop: 32,
                            }}
                        >
                            You found me 💖
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 15, color: '#999', marginTop: 8,
                            }}
                        >
                            The only error here is that I didn't find you sooner ✨
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
