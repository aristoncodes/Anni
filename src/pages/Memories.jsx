import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import mediaItems from '../assets/memories.json';

/* ─── Hook: detect mobile ─── */
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isMobile;
};

/* ─── Floating Hearts Background ─── */
const FloatingHearts = () => {
    const hearts = ['💕', '✨', '💗', '🤍', '💫', '🩷'];
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {Array.from({ length: 15 }).map((_, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        bottom: `-${Math.random() * 20 + 10}%`,
                        fontSize: `${Math.random() * 16 + 10}px`,
                        opacity: Math.random() * 0.15 + 0.05,
                        animation: `floatUp ${Math.random() * 12 + 14}s linear ${Math.random() * 10}s infinite`,
                    }}
                >
                    {hearts[i % hearts.length]}
                </span>
            ))}
        </div>
    );
};

/* ─── Collage height pattern: creates visual rhythm ─── */
const getCardHeight = (index) => {
    const pattern = [
        280, 220, 320, 240, 200, 300, 260, 340, 220, 280,
        240, 310, 200, 270, 330, 250, 210, 290, 260, 300,
    ];
    return pattern[index % pattern.length];
};

/* ─── Deterministic tilt for polaroid effect ─── */
const getTilt = (index) => {
    const tilts = [-2.2, 1.5, -1.0, 2.0, -1.8, 0.8, -2.5, 1.2, -0.6, 2.4];
    return tilts[index % tilts.length];
};

/* ─── Hero Memory (mobile only) ─── */
const HeroMemory = ({ item, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <motion.div
            className="memories-hero"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={onClick}
            style={{
                position: 'relative',
                width: '100%',
                height: '60vh',
                borderRadius: 18,
                overflow: 'hidden',
                cursor: 'pointer',
                marginBottom: 28,
                boxShadow: '0 8px 40px rgba(216,27,96,0.2), 0 0 60px rgba(206,147,216,0.1)',
            }}
        >
            {/* Ken Burns zoom */}
            <img
                src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w800`}
                alt={item.caption}
                loading="eager"
                onLoad={() => setLoaded(true)}
                className="hero-img"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                }}
                onError={(e) => { e.target.src = `https://drive.google.com/uc?id=${item.id}&export=view`; }}
            />

            {/* Gradient overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
                pointerEvents: 'none',
            }} />

            {/* Caption */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 18px',
                zIndex: 2,
            }}>
                <span style={{
                    color: '#fff', fontSize: 16, fontWeight: 600,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    letterSpacing: '0.3px',
                }}>
                    {item.caption}
                </span>
            </div>

            {/* Badge */}
            <div style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20, padding: '6px 14px',
                color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.15)',
                zIndex: 2,
            }}>
                📸 {mediaItems.length} memories
            </div>

            {/* Video badge */}
            {item.type === 'video' && (
                <div style={{
                    position: 'absolute', top: 14, left: 14,
                    background: 'rgba(0,0,0,0.55)', borderRadius: '50%',
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                }}>
                    <span style={{ fontSize: 16 }}>▶</span>
                </div>
            )}
        </motion.div>
    );
};

/* ─── Memory Card ─── */
const MemoryCard = ({ p, i, onClick, isMobile }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardHeight = p.type === 'video' ? getCardHeight(i) + 40 : getCardHeight(i);
    const tilt = isMobile ? getTilt(i) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.45,
                delay: isMobile ? (i % 4) * 0.08 : 0,
                ease: 'easeOut',
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={isMobile ? 'memory-card-mobile' : ''}
            style={{
                breakInside: 'avoid',
                marginBottom: 14,
                borderRadius: isMobile ? 16 : 14,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                height: cardHeight,
                background: '#1a1a2e',
                transform: `rotate(${tilt}deg) ${isHovered ? 'scale(1.015)' : 'scale(1)'}`,
                boxShadow: isHovered
                    ? '0 16px 40px rgba(0,0,0,0.25)'
                    : isMobile
                        ? '0 4px 20px rgba(0,0,0,0.15)'
                        : '0 4px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                // Polaroid white border on mobile
                border: isMobile
                    ? '3px solid rgba(255,255,255,0.06)'
                    : 'none',
            }}
        >
            {/* Skeleton shimmer */}
            {!isLoaded && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(110deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.8s ease-in-out infinite',
                }} />
            )}

            <img
                src={`https://drive.google.com/thumbnail?id=${p.id}&sz=w600`}
                alt={p.caption}
                loading={i < 30 ? 'eager' : 'lazy'}
                onLoad={() => setIsLoaded(true)}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                }}
                onError={(e) => { e.target.src = `https://drive.google.com/uc?id=${p.id}&export=view`; }}
            />

            {/* Video badge & hover preview */}
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
                    <div style={{
                        position: 'absolute', top: 10, right: 10, pointerEvents: 'none', zIndex: 3,
                        background: 'rgba(0,0,0,0.55)', borderRadius: '50%',
                        width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: 14 }}>▶</span>
                    </div>
                </>
            )}

            {/* Caption overlay */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                padding: '32px 14px 12px',
                pointerEvents: 'none', zIndex: 4,
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
            }}>
                <span style={{
                    color: '#fff', fontSize: 12.5, fontWeight: 500,
                    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                    letterSpacing: '0.2px',
                }}>
                    {p.caption}
                </span>
            </div>
        </motion.div>
    );
};

/* ─── Main Memories Page ─── */
export default function Memories() {
    const [lightbox, setLightbox] = useState(null);
    const [visibleCount, setVisibleCount] = useState(30);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);
    const isMobile = useIsMobile();

    // Infinite scroll
    const loadMore = useCallback(() => {
        if (visibleCount < mediaItems.length) {
            setVisibleCount(prev => Math.min(prev + 30, mediaItems.length));
        }
    }, [visibleCount]);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) loadMore(); },
            { rootMargin: '400px' }
        );
        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
        return () => { if (observerRef.current) observerRef.current.disconnect(); };
    }, [loadMore]);

    // Lightbox keyboard nav
    useEffect(() => {
        const handleKey = (e) => {
            if (lightbox === null) return;
            if (e.key === 'ArrowRight') setLightbox(prev => Math.min(prev + 1, visibleCount - 1));
            if (e.key === 'ArrowLeft') setLightbox(prev => Math.max(prev - 1, 0));
            if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightbox, visibleCount]);

    // Items to render in the grid (skip first on mobile — it's the hero)
    const gridStartIndex = isMobile ? 1 : 0;
    const gridItems = mediaItems.slice(gridStartIndex, visibleCount);

    return (
        <div className="page-wrapper memories-page" style={{ padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
            <FloatingHearts />

            {/* ─── Animated Gradient Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 52, position: 'relative', zIndex: 1 }}
            >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <span style={{ fontSize: 52, display: 'block', marginBottom: 4 }} className="animate-float">📸</span>
                    <span style={{ position: 'absolute', top: -8, right: -16, fontSize: 16, animation: 'sparkle 2s ease-in-out infinite' }}>✨</span>
                    <span style={{ position: 'absolute', bottom: 4, left: -12, fontSize: 12, animation: 'sparkle 2.5s ease-in-out 0.5s infinite' }}>💫</span>
                </div>
                <h1 style={{
                    fontSize: 40, marginTop: 8, fontWeight: 700,
                    background: 'linear-gradient(135deg, #d81b60, #e91e63, #f06292, #ce93d8, #d81b60)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 6s ease infinite',
                }}>
                    Our Memories
                </h1>
                <p style={{ color: 'var(--text-light)', marginTop: 8, fontSize: 15, opacity: 0.7 }}>
                    Moments frozen in time, forever in our hearts 💕
                </p>
                <div style={{
                    width: 50, height: 3, margin: '18px auto 0',
                    background: 'linear-gradient(90deg, transparent, #d81b60, transparent)',
                    borderRadius: 2,
                }} />
            </motion.div>

            {/* ─── Hero Memory (mobile only) ─── */}
            {isMobile && mediaItems.length > 0 && (
                <HeroMemory item={mediaItems[0]} onClick={() => setLightbox(0)} />
            )}

            {/* ─── CSS Columns Masonry Grid ─── */}
            <div className="memories-grid" style={{
                columnCount: 3,
                columnGap: 14,
                maxWidth: 1000,
                width: '100%',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                {gridItems.map((p, i) => {
                    const actualIndex = gridStartIndex + i;
                    return (
                        <MemoryCard
                            key={`${p.id}-${actualIndex}`}
                            p={p}
                            i={i}
                            isMobile={isMobile}
                            onClick={() => setLightbox(actualIndex)}
                        />
                    );
                })}
            </div>

            {/* Infinite scroll sentinel */}
            {visibleCount < mediaItems.length && (
                <div ref={sentinelRef} style={{
                    height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                }}>
                    <div style={{
                        width: 28, height: 28,
                        border: '3px solid rgba(216,27,96,0.2)', borderTopColor: '#d81b60',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    }} />
                </div>
            )}

            {visibleCount >= mediaItems.length && (
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: 48, fontSize: 14, opacity: 0.5, position: 'relative', zIndex: 1 }}
                >
                    You've seen all {mediaItems.length} memories 💕
                </motion.p>
            )}

            {/* ─── Lightbox with Navigation ─── */}
            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
                            backdropFilter: 'blur(16px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: 24, cursor: 'pointer',
                        }}
                    >
                        {/* Left arrow */}
                        {lightbox > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); setLightbox(prev => prev - 1); }}
                                style={{
                                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', zIndex: 1001,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 20,
                                }}
                            >‹</button>
                        )}
                        {/* Right arrow */}
                        {lightbox < visibleCount - 1 && (
                            <button onClick={(e) => { e.stopPropagation(); setLightbox(prev => prev + 1); }}
                                style={{
                                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', zIndex: 1001,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 20,
                                }}
                            >›</button>
                        )}
                        {/* Close */}
                        <button onClick={() => setLightbox(null)}
                            style={{
                                position: 'absolute', top: 16, right: 20,
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', zIndex: 1001,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 18,
                            }}
                        >✕</button>
                        {/* Counter */}
                        <div style={{
                            position: 'absolute', top: 20, left: 20,
                            background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '5px 12px',
                            color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500, zIndex: 1001,
                        }}>
                            {lightbox + 1} / {visibleCount}
                        </div>

                        <motion.div
                            key={lightbox}
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: 820, width: '100%', textAlign: 'center' }}
                        >
                            {mediaItems[lightbox].type === 'video' ? (
                                <iframe
                                    src={`https://drive.google.com/file/d/${mediaItems[lightbox].id}/preview`}
                                    allow="autoplay; fullscreen"
                                    style={{ width: '100%', borderRadius: '10px', height: '70vh', border: 'none', background: '#000' }}
                                />
                            ) : (
                                <img
                                    src={`https://drive.google.com/uc?id=${mediaItems[lightbox].id}&export=view`}
                                    alt={mediaItems[lightbox].caption}
                                    style={{ width: '100%', borderRadius: '10px', maxHeight: '80vh', objectFit: 'contain' }}
                                    onError={(e) => { e.target.src = `https://drive.google.com/thumbnail?id=${mediaItems[lightbox].id}&sz=w1200`; }}
                                />
                            )}
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14, fontSize: 14 }}>
                                {mediaItems[lightbox].caption}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Styles ─── */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(0.7); }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.15; }
                    90% { opacity: 0.08; }
                    100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes kenBurns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.08); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 15px rgba(216,27,96,0.12), 0 0 30px rgba(206,147,216,0.06); }
                    50% { box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 20px rgba(216,27,96,0.2), 0 0 40px rgba(206,147,216,0.12); }
                }

                /* ─── Hero ken-burns ─── */
                .hero-img {
                    animation: kenBurns 12s ease-in-out infinite alternate;
                }

                /* ─── Mobile glassmorphism glow on cards ─── */
                .memory-card-mobile {
                    animation: glowPulse 4s ease-in-out infinite;
                }

                /* ─── Responsive ─── */
                @media (max-width: 768px) {
                    .memories-grid {
                        column-count: 2 !important;
                    }
                }
                @media (max-width: 480px) {
                    .memories-grid {
                        column-count: 1 !important;
                    }
                    .memories-page h1 { font-size: 28px !important; }
                    .memories-page { padding: 40px 12px !important; }
                }
            `}</style>
        </div>
    );
}