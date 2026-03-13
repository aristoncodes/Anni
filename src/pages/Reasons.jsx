import { motion } from 'framer-motion';

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

const colors = ['var(--pink)', 'var(--lavender)', 'var(--mint)', 'var(--baby-blue)'];

export default function Reasons() {
    return (
        <div className="page-wrapper" style={{ padding: '60px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 48 }}
            >
                <span style={{ fontSize: 48 }} className="animate-pulse">💌</span>
                <h1 style={{ fontSize: 40, marginTop: 12 }}>Reasons I Love You</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>An incomplete list, because I could never finish it.</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20, maxWidth: 1000, width: '100%',
            }}>
                {reasons.map((r, i) => (
                    <motion.div
                        key={i}
                        className="card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -8, boxShadow: '0 12px 35px rgba(255,192,203,0.35)' }}
                        style={{
                            padding: 24,
                            borderLeft: `4px solid ${colors[i % colors.length]}`,
                            cursor: 'default',
                        }}
                    >
                        <span style={{
                            display: 'inline-block', width: 28, height: 28, borderRadius: '50%',
                            background: colors[i % colors.length], textAlign: 'center', lineHeight: '28px',
                            fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text)',
                        }}>
                            {i + 1}
                        </span>
                        <p style={{ fontSize: 15, lineHeight: 1.7 }}>{r}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
