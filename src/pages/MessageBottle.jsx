import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
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

export default function MessageBottle() {
    const [msg, setMsg] = useState('');
    const [key, setKey] = useState(0);

    const pickRandom = () => {
        const idx = Math.floor(Math.random() * messages.length);
        setMsg(messages[idx]);
        setKey(k => k + 1);
    };

    useEffect(() => { pickRandom(); }, []);

    return (
        <div className="page-wrapper" style={{ justifyContent: 'center', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', maxWidth: 480 }}
            >
                <span style={{ fontSize: 64, display: 'block', marginBottom: 24 }} className="animate-float">🍾</span>
                <h1 style={{ fontSize: 32, marginBottom: 8 }}>Message in a Bottle</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: 32, fontSize: 14 }}>
                    A little note drifted ashore, just for you...
                </p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.5 }}
                        className="card"
                        style={{
                            padding: '40px 32px',
                            background: 'linear-gradient(135deg, #fff 0%, #FFF5F7 100%)',
                            borderLeft: '4px solid var(--pink)',
                            position: 'relative',
                        }}
                    >
                        <span style={{ position: 'absolute', top: 16, right: 20, fontSize: 24, opacity: 0.3 }}>💌</span>
                        <p style={{
                            fontSize: 20, lineHeight: 1.7,
                            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                        }}>
                            "{msg}"
                        </p>
                    </motion.div>
                </AnimatePresence>

                <button
                    className="btn btn-pink"
                    onClick={pickRandom}
                    style={{ marginTop: 28 }}
                >
                    Another Message 💫
                </button>
            </motion.div>
        </div>
    );
}
