import { motion } from 'framer-motion';

const milestones = [
    { date: 'Mar 24, 2021', title: 'The Day We Met', desc: 'Two souls crossed paths and the universe smiled.', emoji: '💕' },
    { date: 'May 2021', title: 'Our First Date', desc: 'Nervous smiles, butterflies, and a coffee that went cold because we couldn\'t stop talking.', emoji: '☕' },
    { date: 'Aug 2021', title: 'First Trip Together', desc: 'We discovered that adventures are a thousand times better side by side.', emoji: '✈️' },
    { date: 'Feb 14, 2022', title: 'First Valentine\'s Day', desc: 'A celebration of love that was just getting started.', emoji: '🌹' },
    { date: 'Mar 24, 2022', title: 'One Year Anniversary', desc: '365 days of laughter, love, and learning each other by heart.', emoji: '🎉' },
    { date: 'Sep 2022', title: 'Through the Distance', desc: 'Miles between us, but our hearts were never closer.', emoji: '🌙' },
    { date: 'Mar 24, 2023', title: 'Two Years Strong', desc: 'Stronger than ever, deeper than before, more in love than we thought possible.', emoji: '💪' },
    { date: 'Dec 2023', title: 'Our Favorite Memory', desc: 'That one perfect night we\'ll replay in our minds forever.', emoji: '✨' },
    { date: 'Mar 24, 2024', title: 'Three Beautiful Years', desc: 'Every single chapter has been better than the last.', emoji: '🦋' },
    { date: 'Mar 24, 2025', title: 'Four Years of Forever', desc: 'Still falling for you, every single day, all over again.', emoji: '💖' },
];

export default function Timeline() {
    return (
        <div className="page-wrapper" style={{ padding: '60px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: 48 }}
            >
                <span style={{ fontSize: 48 }} className="animate-float" role="img">📖</span>
                <h1 style={{ fontSize: 40, marginTop: 12 }}>Our Timeline</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 8, fontSize: 16 }}>
                    A journey through the moments that made us, us.
                </p>
            </motion.div>

            <div style={{ position: 'relative', maxWidth: 800, width: '100%' }}>
                {/* Center line */}
                <div style={{
                    position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3,
                    background: 'linear-gradient(180deg, var(--pink), var(--lavender), var(--mint), var(--baby-blue))',
                    borderRadius: 2, transform: 'translateX(-50%)',
                }} />

                {milestones.map((m, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            style={{
                                display: 'flex', alignItems: 'center', marginBottom: 40, position: 'relative',
                                flexDirection: isLeft ? 'row' : 'row-reverse',
                            }}
                        >
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                                width: 44, height: 44, borderRadius: '50%', background: 'var(--white)',
                                border: '3px solid var(--pink)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 20, zIndex: 2,
                                boxShadow: '0 2px 12px rgba(255,192,203,0.3)',
                            }}>
                                {m.emoji}
                            </div>

                            {/* Card */}
                            <div className="card" style={{
                                width: 'calc(50% - 40px)', padding: 24,
                                ...(isLeft ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
                            }}>
                                <span className="badge" style={{ background: 'var(--pink)', color: 'var(--text)', marginBottom: 8 }}>
                                    {m.date}
                                </span>
                                <h3 style={{ fontSize: 20, marginTop: 8 }}>{m.title}</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>{m.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
