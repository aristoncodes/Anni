import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import mediaItems from '../assets/memories.json';
export default function Memories() {
    const [lightbox, setLightbox] = useState(null);
    const [visibleCount, setVisibleCount] = useState(30);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadedImages, setLoadedImages] = useState(0);

    // Preload images before revealing the grid
    useEffect(() => {
        if (visibleCount === 30) {
            setIsLoadingInitial(true);
        } else {
            setIsLoadingMore(true);
        }
        setLoadedImages(0);

        // We only need to preload the *new* batch of images
        const currentBatchStartIndex = visibleCount === 30 ? 0 : visibleCount - 30;
        const currentBatch = mediaItems.slice(currentBatchStartIndex, visibleCount);
        let loadedCount = 0;

        currentBatch.forEach((item) => {
            if (item.type === 'image') {
                const img = new Image();
                img.src = `https://drive.google.com/uc?id=${item.id}&export=view`;
                img.onload = () => {
                    loadedCount++;
                    setLoadedImages(loadedCount);
                    if (loadedCount === currentBatch.filter(i => i.type === 'image').length) {
                        setIsLoadingInitial(false);
                        setIsLoadingMore(false);
                    }
                };
                img.onerror = () => {
                    // Fallback to thumbnail on error to prevent hanging
                    img.src = `https://drive.google.com/thumbnail?id=${item.id}&sz=w600`;
                    loadedCount++;
                    setLoadedImages(loadedCount);
                    if (loadedCount === currentBatch.filter(i => i.type === 'image').length) {
                        setIsLoadingInitial(false);
                        setIsLoadingMore(false);
                    }
                };
            } else {
                // Instantly "load" videos so they don't block the image preloader
                loadedCount++;
                setLoadedImages(loadedCount);
                if (loadedCount === currentBatch.filter(i => i.type === 'image').length) {
                    setIsLoadingInitial(false);
                    setIsLoadingMore(false);
                }
            }
        });
    }, [visibleCount]);

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

            {isLoadingInitial ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '50vh', gap: 16
                }}>
                    <div style={{ 
                        width: 48, height: 48, border: '4px solid rgba(216,27,96,0.2)', 
                        borderTopColor: 'var(--primary)', borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }} />
                    <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>
                        Loading Memories ({loadedImages} / {mediaItems.slice(0, 30).filter(i => i.type === 'image').length})...
                    </p>
                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: 16, maxWidth: 1000, width: '100%',
                        margin: '0 auto'
                    }}>
                        {mediaItems.slice(0, visibleCount).map((p, i) => (
                    <motion.div
                        key={i}
                        className="photo-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                        onClick={() => setLightbox(i)}
                        style={{
                            borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                            position: 'relative', background: 'var(--bg-secondary)', 
                            boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column'
                        }}
                    >
                        {p.type === 'video' ? (
                            <div 
                                style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
                                onMouseEnter={(e) => {
                                    const iframe = e.currentTarget.querySelector('iframe');
                                    if (iframe) iframe.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    const iframe = e.currentTarget.querySelector('iframe');
                                    if (iframe) iframe.style.opacity = '0';
                                }}
                            >
                                <img
                                    src={`https://drive.google.com/uc?id=${p.id}&export=view`}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', backgroundColor: '#f0f0f0' }}
                                    onError={(e) => { e.target.src = `https://drive.google.com/thumbnail?id=${p.id}&sz=w600`; }}
                                />
                                
                                {/* Hidden iframe that appears and auto-plays on hover */}
                                <iframe
                                    src={`https://drive.google.com/file/d/${p.id}/preview?autoplay=1&mute=1&loop=1`}
                                    allow="autoplay"
                                    style={{
                                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                                        border: 'none', opacity: 0, transition: 'opacity 0.3s ease',
                                        pointerEvents: 'none', objectFit: 'cover'
                                    }}
                                />
                                <div style={{ position: 'absolute', top: 12, right: 12, pointerEvents: 'none' }}>
                                    <span style={{ fontSize: 24, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🎥</span>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={`https://drive.google.com/uc?id=${p.id}&export=view`}
                                alt={p.caption}
                                loading="lazy"
                                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block', backgroundColor: '#f0f0f0' }}
                                onError={(e) => { e.target.src = `https://drive.google.com/thumbnail?id=${p.id}&sz=w600`; }}
                            />
                        )}
                        <div className="photo-overlay" style={{
                            position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5))',
                            display: 'flex', alignItems: 'flex-end', padding: 16, pointerEvents: 'none'
                        }}>
                            <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{p.caption}</span>
                        </div>
                    </motion.div>
                ))}
                        {visibleCount < mediaItems.length && (
                            <div style={{ textAlign: 'center', marginTop: 40, width: '100%', gridColumn: '1 / -1' }}>
                                <button 
                                    onClick={() => setVisibleCount(v => v + 30)}
                                    disabled={isLoadingMore}
                                    style={{ 
                                        padding: '12px 24px', borderRadius: 'var(--radius)', 
                                        background: isLoadingMore ? '#ccc' : 'var(--primary, #d81b60)', 
                                        color: '#fff', border: 'none', cursor: isLoadingMore ? 'not-allowed' : 'pointer', 
                                        fontSize: 16, fontWeight: 500, boxShadow: 'var(--shadow-soft)',
                                    }}
                                >
                                    {isLoadingMore ? `Loading more...` : `Load More Memories`}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

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
                                    src={`https://drive.google.com/file/d/${mediaItems[lightbox].id}/preview?autoplay=1&mute=0`}
                                    allow="autoplay"
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