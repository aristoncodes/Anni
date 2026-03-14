import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import mediaItems from '../assets/memories.json';

const MemoryCard = ({ p, i, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.1, 1.5) }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
            onClick={onClick}
            style={{
                borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                position: 'relative', background: 'var(--bg-secondary)', 
                boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column',
                aspectRatio: '1/1'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Skeleton Loading Background */}
            {!isLoaded && (
                <div style={{
                    position: 'absolute', inset: 0, 
                    backgroundColor: '#e0e0e0',
                    animation: 'pulse 1.5s infinite ease-in-out'
                }} />
            )}

            <img
                src={`https://drive.google.com/thumbnail?id=${p.id}&sz=w600`}
                alt={p.caption}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                style={{ 
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease'
                }}
                onError={(e) => { e.target.src = `https://drive.google.com/uc?id=${p.id}&export=view`; }}
            />

            {p.type === 'video' && (
                <>
                    {isHovered && (
                        <iframe
                            src={`https://drive.google.com/file/d/${p.id}/preview`}
                            allow="autoplay"
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                pointerEvents: 'none', objectFit: 'cover', zIndex: 2, border: 'none'
                            }}
                        />
                    )}
                    <div style={{ position: 'absolute', top: 12, right: 12, pointerEvents: 'none', zIndex: 3 }}>
                        <span style={{ fontSize: 24, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🎥</span>
                    </div>
                </>
            )}

            <div className="photo-overlay" style={{
                position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5))',
                display: 'flex', alignItems: 'flex-end', padding: 16, pointerEvents: 'none', zIndex: 4,
                opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease'
            }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{p.caption}</span>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.2; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </motion.div>
    );
};

export default function Memories() {
    const [lightbox, setLightbox] = useState(null);
    const [visibleCount, setVisibleCount] = useState(15);

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
                margin: '0 auto'
            }}>
                {mediaItems.slice(0, visibleCount).map((p, i) => (
                    <MemoryCard key={i} p={p} i={i} onClick={() => setLightbox(i)} />
                ))}
                
                {visibleCount < mediaItems.length && (
                    <div style={{ textAlign: 'center', marginTop: 40, width: '100%', gridColumn: '1 / -1' }}>
                        <button 
                            onClick={() => setVisibleCount(v => v + 15)}
                            style={{ 
                                padding: '12px 24px', borderRadius: 'var(--radius)', 
                                background: 'var(--primary, #d81b60)', color: '#fff', 
                                border: 'none', cursor: 'pointer', fontSize: 16, 
                                fontWeight: 500, boxShadow: 'var(--shadow-soft)'
                            }}
                        >
                            Load More Memories
                        </button>
                    </div>
                )}
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
                            style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}
                        >
                            {mediaItems[lightbox].type === 'video' ? (
                                <iframe
                                    src={`https://drive.google.com/file/d/${mediaItems[lightbox].id}/preview`}
                                    allow="autoplay; fullscreen"
                                    style={{ width: '100%', borderRadius: '16px', height: '70vh', border: 'none', background: '#000' }}
                                />
                            ) : (
                                <img
                                    src={`https://drive.google.com/uc?id=${mediaItems[lightbox].id}&export=view`}
                                    alt={mediaItems[lightbox].caption}
                                    style={{ width: '100%', borderRadius: '16px', maxHeight: '80vh', objectFit: 'contain', backgroundColor: 'transparent' }}
                                    onError={(e) => { e.target.src = `https://drive.google.com/thumbnail?id=${mediaItems[lightbox].id}&sz=w1200`; }}
                                />
                            )}
                            <p style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>{mediaItems[lightbox].caption}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}