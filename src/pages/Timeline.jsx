import { motion } from 'framer-motion';

const C = {
    bg: '#1a1b2e',
    card: 'rgba(30, 32, 58, 0.9)',
    text: '#e0dce8',
    muted: '#8b87a0',
    lavender: '#c9a0dc',
    pink: '#f4a7b9',
    mint: '#b5ead7',
    border: 'rgba(201,160,220,0.12)',
};

const MILESTONES = [
    { date: 'Day 0', title: 'The First Chat 💬', desc: 'Two strangers, one conversation that changed everything.' },
    { date: 'Week 1', title: 'Talking Every Day 📱', desc: "Couldn't stop texting. Every notification was exciting." },
    { date: 'Month 1', title: 'First Date ☕', desc: 'Nervous butterflies, but it felt like coming home.' },
    { date: 'Month 3', title: 'Official 💕', desc: 'Made it official. Best decision ever.' },
    { date: 'Month 6', title: 'First Trip Together ✈️', desc: 'Adventures together hit different.' },
    { date: 'Year 1', title: 'Anniversary 🎉', desc: 'One year of love, laughter, and growing together.' },
];

export default function Timeline() {
    return (
        <div className="timeline-page" style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #252347 50%, #2d1f3d 100%)`,
            fontFamily: '"JetBrains Mono", monospace',
            padding: '48px 24px',
        }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 32, color: C.lavender, textAlign: 'center', marginBottom: 48,
                    }}
                >
                    Our Timeline 💕
                </motion.h1>
                <div style={{ position: 'relative', paddingLeft: 32 }}>
                    <div style={{
                        position: 'absolute', left: 7, top: 0, bottom: 0, width: 2,
                        background: `linear-gradient(to bottom, ${C.lavender}40, ${C.pink}40)`,
                    }} />
                    {MILESTONES.map((m, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            style={{ marginBottom: 32, position: 'relative' }}
                        >
                            <div style={{
                                position: 'absolute', left: -29, top: 6,
                                width: 12, height: 12, borderRadius: '50%',
                                background: i % 2 === 0 ? C.lavender : C.pink,
                                border: `2px solid ${C.bg}`,
                                boxShadow: `0 0 10px ${i % 2 === 0 ? C.lavender : C.pink}40`,
                            }} />
                            <div style={{
                                background: C.card, borderRadius: 12,
                                border: `1px solid ${C.border}`, padding: '16px 20px',
                            }}>
                                <div style={{ fontSize: 10, color: C.mint, fontWeight: 600, marginBottom: 4 }}>{m.date}</div>
                                <div style={{ fontSize: 15, color: C.text, fontWeight: 600, marginBottom: 6 }}>{m.title}</div>
                                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{m.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .timeline-page { padding: 32px 14px !important; }
                    .timeline-page h1 { font-size: 24px !important; }
                }
            `}</style>
        </div>
    );
}
