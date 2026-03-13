import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop', caption: 'Our first sunset together 🌅' },
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=350&fit=crop', caption: 'Adventures with you 🏔️' },
    { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=450&fit=crop', caption: 'That perfect evening ✨' },
    { url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&h=380&fit=crop', caption: 'Coffee & us ☕' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=420&fit=crop', caption: 'Dancing in the rain 🌧️' },
    { url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=360&fit=crop', caption: 'Stargazing nights 🌙' },
    { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=440&fit=crop', caption: 'Road trip vibes 🚗' },
    { url: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=380&fit=crop', caption: 'Simply us 💕' },
];

export default function Memories() {
    const [lightbox, setLightbox] = useState(null);

    return (
        <div className="page-wrapper" style={{ padding: '60px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 48 }}
            >
                <span style={{ fontSize: 48 }} className="animate-float">📸</span>
                <h1 style={{ fontSize: 36, marginTop: 12 }}>Our Memories</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Moments frozen in time, forever in our hearts.</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 16, maxWidth: 1000, width: '100%',
            }}>
                {photos.map((p, i) => (
                    <motion.div
                        key={i}
                        className="photo-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -10, boxShadow: '0 16px 40px rgba(255,192,203,0.35)' }}
                        onClick={() => setLightbox(i)}
                        style={{
                            borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer',
                            position: 'relative', background: 'var(--white)', boxShadow: 'var(--shadow-soft)',
                        }}
                    >
                        <img
                            src={p.url}
                            alt={p.caption}
                            style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                        />
                        <div className="photo-overlay" style={{
                            position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5))',
                            display: 'flex', alignItems: 'flex-end', padding: 16,
                        }}>
                            <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{p.caption}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: 24, cursor: 'pointer',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}
                        >
                            <img
                                src={photos[lightbox].url}
                                alt={photos[lightbox].caption}
                                style={{ width: '100%', borderRadius: 'var(--radius)', maxHeight: '70vh', objectFit: 'cover' }}
                            />
                            <p style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>{photos[lightbox].caption}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
