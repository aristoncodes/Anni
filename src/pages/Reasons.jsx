import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const reasons = [
    'Your laugh is the best sound in the entire universe 😂',
    'You make the ordinary feel extraordinary ✨',
    'The way your eyes light up when you talk about what you love 🌟',
    "You're my safe place in a chaotic world 🏠",
    'Your hugs have actual healing powers 🤗',
    "You believe in me even when I don't believe in myself 💪",
    'Every song sounds better because it reminds me of you 🎵',
    'The way you scrunch your nose when you laugh 😊',
    'Your voice is my favorite notification sound 📱',
    'You turn my worst days into bearable ones just by existing 🌈',
    "I'd choose you in every timeline, every universe ♾️",
    'You still give me butterflies after all this time 🦋',
    'The way you care about the little things 💕',
    "Waking up knowing you're mine is the best feeling 🌅",
    "You're my best friend and my greatest love 💖",
    'Your smile can literally fix my entire mood 😍',
    'The way you hold my hand like it matters 🤝',
    'You make silence feel comfortable and warm 🤍',
    'Your random texts make my whole day better 💬',
    'The way you remember the smallest details about us 🧠',
    'You make me want to be a better person every day 🌱',
    'Dancing with you in the kitchen at midnight 💃',
    'The way you say my name hits different 🥰',
    'You are the plot twist I never saw coming 📖',
    'Your patience with me is honestly superhuman 🦸',
    'Late night conversations that last forever 🌙',
    'The way you look at me when you think I don\'t notice 👀',
    'You feel like home no matter where we are 🏡',
    'Your existence alone makes the world more beautiful 🌍',
    'I love you more than words on any screen could say 💗',
];

/* Enhanced flower types with multi-stop gradients (#2) */
const FT = [
    { n: 'rose', p: 7, w: 18, h: 26, r: '50%', c: ['#8b0000', '#ff1744', '#ff6b9d', '#ffcdd2'], ctr: '#ffeb3b', g: 'rgba(255,107,157,0.5)' },
    { n: 'daisy', p: 10, w: 8, h: 22, r: '50%', c: ['#e8e8e8', '#ffffff', '#fff8e1'], ctr: '#ffd700', g: 'rgba(255,215,0,0.5)' },
    { n: 'tulip', p: 5, w: 16, h: 28, r: '60% 60% 0 0', c: ['#4a148c', '#7b1fa2', '#ce93d8', '#e1bee7'], ctr: '#fff59d', g: 'rgba(206,147,216,0.5)' },
    { n: 'sakura', p: 5, w: 20, h: 22, r: '50% 0 50% 0', c: ['#c2185b', '#e91e63', '#f48fb1', '#fce4ec'], ctr: '#fff176', g: 'rgba(248,187,208,0.5)' },
    { n: 'lotus', p: 8, w: 14, h: 24, r: '50% 50% 0 50%', c: ['#1a237e', '#3949ab', '#7986cb', '#c5cae9'], ctr: '#e1bee7', g: 'rgba(121,134,203,0.5)' },
];

const FP = [ // flower positions {x%, y%, scale} — 30 flowers in 6 rows
    // Far back row (smallest)
    { x: 8, y: 35, s: .45 }, { x: 25, y: 37, s: .4 }, { x: 42, y: 34, s: .5 }, { x: 60, y: 36, s: .45 }, { x: 78, y: 35, s: .4 },
    // Back row
    { x: 5, y: 44, s: .55 }, { x: 20, y: 47, s: .5 }, { x: 38, y: 43, s: .6 }, { x: 55, y: 46, s: .55 }, { x: 72, y: 44, s: .5 }, { x: 90, y: 45, s: .55 },
    // Mid-back row
    { x: 10, y: 55, s: .7 }, { x: 28, y: 58, s: .65 }, { x: 48, y: 53, s: .75 }, { x: 65, y: 56, s: .7 }, { x: 85, y: 54, s: .65 },
    // Mid-front row
    { x: 3, y: 64, s: .8 }, { x: 18, y: 67, s: .85 }, { x: 35, y: 63, s: .9 }, { x: 52, y: 66, s: .85 }, { x: 70, y: 64, s: .8 }, { x: 92, y: 65, s: .85 },
    // Front row (biggest)
    { x: 6, y: 76, s: 1 }, { x: 22, y: 79, s: 1.05 }, { x: 38, y: 74, s: 1.1 }, { x: 55, y: 77, s: 1 }, { x: 72, y: 75, s: 1.05 },
    // Closest row
    { x: 14, y: 84, s: 1.1 }, { x: 45, y: 82, s: 1.15 }, { x: 80, y: 83, s: 1.1 },
];

const MP = [6, 15, 28, 45, 55, 68, 78, 88, 95]; // mushroom x positions

/* ── Stars (#8 parallax-aware) ── */
function Stars({ mx, my }) {
    const x = useTransform(mx, v => v * -12);
    const y = useTransform(my, v => v * -12);
    const stars = useMemo(() => Array.from({ length: 80 }, () => ({
        x: Math.random() * 100, y: Math.random() * 50, sz: Math.random() * 2.5 + 1,
        dl: Math.random() * 5, dr: 2 + Math.random() * 3,
    })), []);
    return (
        <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, x, y }}>
            {stars.map((s, i) => (
                <motion.div key={i}
                    animate={{ opacity: [.2, .9, .2], scale: [.8, 1.2, .8] }}
                    transition={{ duration: s.dr, repeat: Infinity, delay: s.dl, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.sz, height: s.sz,
                        borderRadius: '50%', background: '#fff',
                        boxShadow: `0 0 ${s.sz * 2}px ${s.sz}px rgba(255,255,255,0.3)`
                    }}
                />
            ))}
        </motion.div>
    );
}

/* ── Moon (#8 parallax) ── */
function Moon({ mx, my }) {
    const x = useTransform(mx, v => v * -20);
    const y = useTransform(my, v => v * -20);
    return (
        <motion.div style={{
            position: 'absolute', top: '6%', right: '10%', width: 70, height: 70, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fce4b8, #f5deb3, #e8d5a3)',
            boxShadow: '0 0 40px 15px rgba(252,228,184,0.3), 0 0 100px 40px rgba(252,228,184,0.15)',
            zIndex: 2, pointerEvents: 'none', x, y
        }}>
            <div style={{ position: 'absolute', top: '20%', left: '25%', width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,0.05)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '55%', width: 7, height: 7, borderRadius: '50%', background: 'rgba(0,0,0,0.04)' }} />
        </motion.div>
    );
}

/* ── #1 Aurora Borealis ── */
function Aurora() {
    return (
        <div style={{ position: 'absolute', top: '5%', left: '-10%', right: '-10%', height: '45%', pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }}>
            <motion.div
                animate={{ x: [-50, 50, -30, 50, -50], scaleX: [1, 1.3, .9, 1.1, 1], opacity: [.5, .8, .6, .9, .5] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(100,255,218,0.06) 20%, rgba(168,130,255,0.07) 40%, rgba(255,107,157,0.05) 60%, rgba(100,255,218,0.06) 80%, transparent 100%)',
                    filter: 'blur(50px)'
                }}
            />
            <motion.div
                animate={{ x: [40, -40, 30, -50, 40], opacity: [.3, .6, .4, .7, .3] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                style={{
                    position: 'absolute', top: '20%', width: '100%', height: '60%',
                    background: 'linear-gradient(90deg, transparent, rgba(76,175,80,0.04) 30%, rgba(255,215,0,0.03) 50%, rgba(186,104,200,0.05) 70%, transparent)',
                    filter: 'blur(60px)'
                }}
            />
        </div>
    );
}

/* ── Firefly (#8 parallax) ── */
function Firefly({ startX, startY, delay, mx, my }) {
    const x = useTransform(mx, v => v * (-15 - Math.random() * 10));
    const y = useTransform(my, v => v * (-15 - Math.random() * 10));
    return (
        <motion.div style={{ position: 'absolute', left: `${startX}%`, top: `${startY}%`, pointerEvents: 'none', zIndex: 15, x, y }}>
            <motion.div
                animate={{ opacity: [0, .8, 1, .6, 0], x: [0, 30, -20, 40, 0], y: [0, -40, -20, -60, 0], scale: [.5, 1, .8, 1.2, .5] }}
                transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay, ease: 'easeInOut' }}
                style={{
                    width: 4, height: 4, borderRadius: '50%', background: '#ffe082',
                    boxShadow: '0 0 8px 4px rgba(255,224,130,0.6), 0 0 20px 8px rgba(255,224,130,0.3)'
                }}
            />
        </motion.div>
    );
}

/* ── #4 Falling Cherry Blossom Petals ── */
function FallingPetals() {
    const petals = useMemo(() => Array.from({ length: 18 }, () => ({
        x: Math.random() * 100, dur: 12 + Math.random() * 10, dl: Math.random() * 15,
        sz: 6 + Math.random() * 8, drift: (Math.random() - .5) * 30,
        clr: ['#ffb7c5', '#ff8fab', '#fce4ec', '#f8bbd0', '#ffcdd2'][Math.floor(Math.random() * 5)],
    })), []);
    return (
        <>
            {petals.map((p, i) => (
                <motion.div key={i}
                    initial={{ y: -20, x: `${p.x}vw`, rotate: 0, opacity: 0 }}
                    animate={{ y: '105vh', x: `${p.x + p.drift}vw`, rotate: [0, 180, 360], opacity: [0, .6, .6, 0] }}
                    transition={{ duration: p.dur, delay: p.dl, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute', width: p.sz, height: p.sz * .7, background: `linear-gradient(135deg, ${p.clr}, rgba(255,255,255,0.5))`,
                        borderRadius: '50% 0 50% 0', pointerEvents: 'none', zIndex: 12, filter: 'blur(0.5px)'
                    }}
                />
            ))}
        </>
    );
}

/* ── #3 Glowing Mushrooms ── */
function Mushroom({ x, delay, light }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + delay, duration: .8, type: 'spring' }}
            style={{ position: 'absolute', left: `${x}%`, bottom: '19vh', zIndex: 11, pointerEvents: 'none' }}>
            <motion.div
                animate={{
                    boxShadow: ['0 0 6px rgba(0,210,210,0.3)', '0 0 14px rgba(0,210,210,0.6)', '0 0 6px rgba(0,210,210,0.3)'],
                    filter: [`brightness(${1 + light * 0.3})`, `brightness(${1.2 + light * 0.3})`, `brightness(${1 + light * 0.3})`]
                }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: 12, height: 8, borderRadius: '50% 50% 0 0',
                    background: 'linear-gradient(to bottom, rgba(64,224,208,0.7), rgba(0,150,136,0.5))',
                    boxShadow: '0 0 8px rgba(0,210,210,0.4)'
                }} />
            <div style={{ width: 3, height: 7, margin: '0 auto', background: 'rgba(200,230,220,0.3)', borderRadius: '0 0 2px 2px' }} />
        </motion.div>
    );
}

/* ── Butterfly ── */
function Butterfly({ x, y, delay }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: .5 }}
            style={{ position: 'absolute', left: x, top: y, zIndex: 18, pointerEvents: 'none' }}>
            <motion.div animate={{ x: [0, 30, -20, 15, 0], y: [0, -20, -40, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
                <motion.span animate={{ rotateY: [0, 70, 0] }}
                    transition={{ duration: .4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ display: 'inline-block', fontSize: 16, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))', transformOrigin: 'right center' }}>
                    🦋
                </motion.span>
            </motion.div>
        </motion.div>
    );
}

/* ── Bloom Burst Particles ── */
function BloomBurst({ x, y, color }) {
    const ps = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        a: (Math.PI * 2 * i) / 20, v: 30 + Math.random() * 50, sz: 3 + Math.random() * 5, sp: i % 3 === 0,
    })), []);
    return (
        <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 50 }}>
            {ps.map((p, i) => (
                <motion.div key={i}
                    initial={{ x: 0, y: 0, scale: 1.5, opacity: 1 }}
                    animate={{ x: Math.cos(p.a) * p.v, y: Math.sin(p.a) * p.v - 20, scale: 0, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: i * .02 }}
                    style={{
                        position: 'absolute', width: p.sz, height: p.sz, borderRadius: p.sp ? '2px' : '50%',
                        background: p.sp ? '#fff' : color,
                        boxShadow: p.sp ? '0 0 6px 2px rgba(255,255,255,0.8)' : `0 0 4px 1px ${color}`,
                        transform: p.sp ? 'rotate(45deg)' : 'none'
                    }}
                />
            ))}
        </div>
    );
}

/* ── #6 Bloom Shockwave Ripple ── */
function BloomRipple({ x, y, color }) {
    return (
        <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 49 }}>
            {[0, .15, .3].map((dl, i) => (
                <motion.div key={i}
                    initial={{ width: 0, height: 0, opacity: .7 }}
                    animate={{ width: 160 + i * 40, height: 160 + i * 40, opacity: 0 }}
                    transition={{ duration: .9, ease: 'easeOut', delay: dl }}
                    style={{
                        position: 'absolute', borderRadius: '50%',
                        border: `${2 - i * .5}px solid ${color}`, boxShadow: `0 0 15px ${color}`,
                        transform: 'translate(-50%,-50%)'
                    }}
                />
            ))}
        </div>
    );
}

/* ── #5 Hover Glow Ring ── */
function HoverGlow({ color, scale }) {
    const sz = 50 * scale;
    const budCenter = 15 * scale + 7 * scale; // bud bottom + half bud height = center
    return (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: .3 }}
            style={{
                position: 'absolute', bottom: budCenter - sz / 2,
                left: '50%', marginLeft: -sz / 2,
                width: sz, height: sz, zIndex: 5, pointerEvents: 'none'
            }}>
            <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [.3, .6, .3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}, inset 0 0 10px ${color}`
                }} />
            {[0, 1, 2, 3, 4, 5].map(i => (
                <motion.div key={i}
                    animate={{ y: [0, -20 - Math.random() * 15, 0], x: [0, (Math.random() - .5) * 15, 0], opacity: [0, 1, 0], scale: [.3, 1, .3] }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * .25, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', left: `${20 + Math.random() * 60}%`, bottom: '50%', width: 3, height: 3,
                        background: '#fff', borderRadius: '50%', boxShadow: '0 0 4px #fff'
                    }} />
            ))}
        </motion.div>
    );
}

/* ── Flower Component (#2 gradients, #5 hover, #7 sway) ── */
function Flower({ type, isBloomed, onClick, scale, isHovered }) {
    const ft = FT[type % FT.length];
    const gradStr = ft.c.length === 3
        ? `linear-gradient(to top, ${ft.c[0]}, ${ft.c[1]} 50%, ${ft.c[2]})`
        : `linear-gradient(to top, ${ft.c[0]}, ${ft.c[1]} 33%, ${ft.c[2]} 66%, ${ft.c[3]})`;

    return (
        <div onClick={onClick}
            style={{
                position: 'relative', width: 70 * scale, height: 85 * scale,
                cursor: isBloomed ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'
            }}>

            {/* #5 Hover glow */}
            <AnimatePresence>
                {isHovered && !isBloomed && <HoverGlow color={ft.c[1]} scale={scale} />}
            </AnimatePresence>

            {/* Stem */}
            <motion.div initial={{ height: 0 }}
                animate={{ height: isBloomed ? 38 * scale : 20 * scale }}
                transition={{ duration: .8, ease: 'easeOut' }}
                style={{
                    position: 'absolute', bottom: 0, width: 3,
                    background: 'linear-gradient(to top, #1b5e20, #4caf50, #66bb6a)', borderRadius: 2, zIndex: 1
                }} />

            {/* Leaves */}
            {isBloomed && <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: -35 }}
                    transition={{ delay: .3, type: 'spring' }}
                    style={{
                        position: 'absolute', bottom: 12 * scale, left: '50%', marginLeft: -2,
                        width: 14 * scale, height: 7 * scale, background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                        borderRadius: '50% 0 50% 0', transformOrigin: 'right center', zIndex: 1
                    }} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 35 }}
                    transition={{ delay: .4, type: 'spring' }}
                    style={{
                        position: 'absolute', bottom: 20 * scale, right: '50%', marginRight: -2,
                        width: 14 * scale, height: 7 * scale, background: 'linear-gradient(135deg, #388e3c, #81c784)',
                        borderRadius: '0 50% 0 50%', transformOrigin: 'left center', zIndex: 1
                    }} />
            </>}

            {/* #7 Sway wrapper for flower head */}
            <motion.div
                animate={isBloomed ? { rotate: [-2, 2, -2] } : {}}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', bottom: isBloomed ? 32 * scale : 15 * scale, width: 50 * scale, height: 50 * scale,
                    transition: 'bottom 0.8s ease-out', transformOrigin: 'bottom center'
                }}>

                {/* Petals with multi-stop gradients (#2) */}
                {Array.from({ length: ft.p }).map((_, i) => (
                    <motion.div key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isBloomed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ delay: isBloomed ? .1 + i * .06 : 0, duration: .6, type: 'spring', stiffness: 200, damping: 12 }}
                        style={{
                            position: 'absolute', left: '50%', top: '50%',
                            width: ft.w * scale, height: ft.h * scale,
                            marginLeft: -(ft.w * scale) / 2, marginTop: -(ft.h * scale),
                            background: gradStr, borderRadius: ft.r,
                            transform: `rotate(${(360 / ft.p) * i}deg)`, transformOrigin: '50% 100%',
                            boxShadow: `0 0 8px ${ft.g}`, zIndex: 2
                        }} />
                ))}

                {/* Center */}
                <motion.div
                    animate={isBloomed ? { scale: 1, opacity: 1 } : { scale: .3, opacity: .5 }}
                    transition={{ delay: .3, type: 'spring' }}
                    style={{
                        position: 'absolute', left: '50%', top: '50%', width: 12 * scale, height: 12 * scale,
                        marginLeft: -6 * scale, marginTop: -6 * scale, borderRadius: '50%',
                        background: `radial-gradient(circle, ${ft.ctr}, ${ft.c[1]})`,
                        boxShadow: `0 0 10px ${ft.g}, 0 0 20px ${ft.g}`, zIndex: 3
                    }} />
            </motion.div>

            {/* Bud glow (unbloomed) */}
            {!isBloomed && (
                <motion.div
                    animate={{
                        boxShadow: [`0 0 10px 3px ${ft.g}`, `0 0 22px 10px ${ft.g}`, `0 0 10px 3px ${ft.g}`],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', bottom: 15 * scale, left: '50%', marginLeft: -7 * scale,
                        width: 14 * scale, height: 14 * scale,
                        borderRadius: '50%', background: `radial-gradient(circle, ${ft.c[2] || ft.c[1]}, ${ft.c[1]})`, zIndex: 4
                    }} />
            )}
        </div>
    );
}

/* ── #9 Pond with moon reflection ── */
function Pond({ mx, my, light }) {
    const x = useTransform(mx, v => v * -5);
    const y = useTransform(my, v => v * -3);
    return (
        <motion.div style={{
            position: 'absolute', bottom: '3vh', left: '30%', width: '40%', height: '7vh',
            borderRadius: '50%', overflow: 'hidden', zIndex: 9, pointerEvents: 'none', x, y,
            background: `radial-gradient(ellipse, rgba(${30 + light * 40},${50 + light * 40},${90 + light * 30},0.5), rgba(10,20,40,0.35))`,
            boxShadow: `inset 0 2px 20px rgba(0,0,0,0.3), 0 0 30px rgba(100,150,200,${0.05 + light * 0.1})`,
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/* Moon reflection shimmer */}
            <motion.div animate={{ y: [0, 3, 0], scaleX: [1, 1.1, 1], opacity: [.3, .5, .3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '15%', right: '20%', width: 25, height: 25, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(252,228,184,0.4), transparent)', filter: 'blur(4px)'
                }} />
            {/* Ripples */}
            {[0, 1, 2].map(i => (
                <motion.div key={i}
                    animate={{ scaleX: [.8, 1.2, .8], opacity: [.05, .2, .05] }}
                    transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
                    style={{
                        position: 'absolute', top: `${30 + i * 15}%`, left: '15%', width: '70%', height: 1,
                        background: 'rgba(255,255,255,0.15)', borderRadius: '50%'
                    }} />
            ))}
            {/* Starlight reflections */}
            {[0, 1, 2, 3].map(i => (
                <motion.div key={`s${i}`}
                    animate={{ opacity: [0, .4, 0], scale: [.5, 1, .5] }}
                    transition={{ duration: 3 + i, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', left: `${15 + i * 20}%`, top: `${20 + Math.random() * 40}%`,
                        width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.5)'
                    }} />
            ))}
        </motion.div>
    );
}

/* ── #10 Completion Celebration ── */
function Celebration() {
    const cPetals = useMemo(() => Array.from({ length: 50 }, () => ({
        x: Math.random() * 100, dur: 5 + Math.random() * 5, dl: Math.random() * 3,
        sz: 8 + Math.random() * 10, drift: (Math.random() - .5) * 20,
        clr: ['#ffb7c5', '#ff6b9d', '#ffd54f', '#b388ff', '#fff', '#64ffda', '#7986cb'][Math.floor(Math.random() * 7)],
    })), []);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none' }}>
            {/* Golden light flood */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, .35, .2] }}
                transition={{ duration: 3, ease: 'easeOut' }}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.05) 40%, transparent 70%)'
                }} />
            {/* Petal shower */}
            {cPetals.map((p, i) => (
                <motion.div key={i}
                    initial={{ y: -30, x: `${p.x}vw`, rotate: 0, opacity: 0 }}
                    animate={{ y: '110vh', rotate: [0, 360], opacity: [0, .8, .8, 0] }}
                    transition={{ duration: p.dur, delay: p.dl, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute', width: p.sz, height: p.sz * .7,
                        background: `linear-gradient(135deg, ${p.clr}, rgba(255,255,255,0.4))`,
                        borderRadius: '50% 0 50% 0'
                    }} />
            ))}
            {/* Star-written message */}
            <motion.div initial={{ opacity: 0, scale: .7, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.5, type: 'spring' }}
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: 20,
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
                }}>
                <div style={{
                    fontSize: 'clamp(26px,5vw,52px)', fontFamily: "'Playfair Display', serif", color: '#ffd700',
                    textShadow: '0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.25)'
                }}>
                    Every reason bloomed 🌸
                </div>
                <div style={{
                    fontSize: 'clamp(18px,3vw,30px)', fontFamily: "'Caveat', cursive", color: '#f8bbd0',
                    marginTop: 12, textShadow: '0 0 20px rgba(248,187,208,0.4)'
                }}>
                    ...and there are a million more ❤️
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ══ MAIN COMPONENT ══ */
export default function Reasons() {
    const [bloomedSet, setBloomedSet] = useState(new Set());
    const [activeReason, setActiveReason] = useState(null);
    const [bursts, setBursts] = useState([]);
    const [ripples, setRipples] = useState([]);
    const [butterflies, setButterflies] = useState([]);
    const [hoveredFlower, setHoveredFlower] = useState(null);

    // #8 Parallax
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const handleMouseMove = useCallback((e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    }, [mx, my]);

    const bloomCount = bloomedSet.size;
    const gL = Math.min(bloomCount / reasons.length, 1); // garden light 0→1
    const allBloomed = bloomCount === reasons.length;

    const handleBloom = useCallback((index, e) => {
        if (bloomedSet.has(index)) { setActiveReason(index); return; }
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 4;
        const ft = FT[index % FT.length];
        const id = Date.now();
        setBursts(p => [...p, { id, x: cx, y: cy, color: ft.c[1] }]);
        setRipples(p => [...p, { id, x: cx, y: cy, color: ft.g }]);
        setTimeout(() => { setBursts(p => p.filter(b => b.id !== id)); setRipples(p => p.filter(r => r.id !== id)); }, 1500);
        setButterflies(p => [...p, { id, x: cx + (Math.random() - .5) * 60, y: cy - 30 - Math.random() * 30, delay: .5 + Math.random() * .5 }]);
        setBloomedSet(p => new Set([...p, index]));
        setActiveReason(index);
    }, [bloomedSet]);

    const fireflies = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
        id: i, startX: Math.random() * 100, startY: 20 + Math.random() * 60, delay: Math.random() * 6,
    })), []);

    return (
        <div onMouseMove={handleMouseMove}
            style={{
                minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif',
                background: `linear-gradient(180deg,
          hsl(${240 + gL * 10}, ${30 + gL * 10}%, ${4 + gL * 6}%) 0%,
          hsl(${260 + gL * 5}, ${25 + gL * 15}%, ${6 + gL * 8}%) 30%,
          hsl(${200 + gL * 20}, ${20 + gL * 15}%, ${5 + gL * 7}%) 55%,
          hsl(${140 + gL * 10}, ${20 + gL * 20}%, ${8 + gL * 10}%) 75%,
          hsl(120, ${25 + gL * 15}%, ${5 + gL * 8}%) 100%)`,
                transition: 'background 1.5s ease'
            }}>

            <Stars mx={mx} my={my} />
            <Moon mx={mx} my={my} />
            <Aurora />
            <FallingPetals />
            {fireflies.map(f => <Firefly key={f.id} startX={f.startX} startY={f.startY} delay={f.delay} mx={mx} my={my} />)}
            {MP.map((x, i) => <Mushroom key={i} x={x} delay={i * .3} light={gL} />)}

            {/* Fog */}
            <motion.div animate={{ x: [-20, 20, -20], opacity: [.06, .12, .06] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '25%', left: '-10%', right: '-10%', height: '35%',
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none', zIndex: 3, filter: 'blur(30px)'
                }} />

            {/* Header */}
            <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', pointerEvents: 'none', padding: '8vh 20px 0' }}>
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                        fontSize: 'clamp(32px,7vw,72px)', color: '#e8d5b7',
                        fontFamily: "'Playfair Display', serif", lineHeight: 1.15,
                        textShadow: '0 0 30px rgba(232,213,183,0.4), 0 2px 10px rgba(0,0,0,0.5)', margin: 0, fontWeight: 700
                    }}>
                    I don't need any reasons
                </motion.h1>
                <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: .4, ease: 'easeOut' }}
                    style={{
                        fontSize: 'clamp(24px,5vw,50px)', color: '#f8bbd0',
                        fontFamily: "'Caveat', cursive", marginTop: 8,
                        textShadow: '0 0 20px rgba(248,187,208,0.4), 0 2px 8px rgba(0,0,0,0.3)', fontWeight: 500
                    }}>
                    I love you unconditionally ❤️
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1.5 }}
                    style={{ color: 'rgba(255,255,255,0.5)', marginTop: 24, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }}>
                    Tap the glowing buds to bloom
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
                    style={{ marginTop: 16, color: 'rgba(255,224,130,0.7)', fontFamily: "'Caveat', cursive", fontSize: 20 }}>
                    {bloomCount} / {reasons.length} flowers bloomed 🌷
                </motion.div>
            </div>

            {/* Flowers */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                {reasons.map((_, i) => {
                    const pos = FP[i];
                    return (
                        <div key={i}
                            onMouseEnter={() => setHoveredFlower(i)} onMouseLeave={() => setHoveredFlower(null)}
                            style={{
                                position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                                transform: 'translate(-50%,-100%)', pointerEvents: 'auto', zIndex: Math.round(pos.y)
                            }}>
                            <Flower type={i} isBloomed={bloomedSet.has(i)} onClick={(e) => handleBloom(i, e)}
                                scale={pos.s} isHovered={hoveredFlower === i} />
                        </div>
                    );
                })}
            </div>

            {bursts.map(b => <BloomBurst key={b.id} x={b.x} y={b.y} color={b.color} />)}
            {ripples.map(r => <BloomRipple key={r.id} x={r.x} y={r.y} color={r.color} />)}
            {butterflies.map(bf => <Butterfly key={bf.id} x={bf.x} y={bf.y} delay={bf.delay} />)}

            <Pond mx={mx} my={my} light={gL} />

            {/* Ground layers */}
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22vh', width: '100%', zIndex: 8, pointerEvents: 'none' }}>
                <path fill={`hsl(30, 30%, ${6 + gL * 5}%)`}
                    d="M0,160L60,154.7C120,149,240,139,360,144C480,149,600,171,720,176C840,181,960,171,1080,160C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
                <path fill={`hsl(120, ${30 + gL * 20}%, ${8 + gL * 8}%)`}
                    d="M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>

            {/* Grass blades */}
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none"
                style={{
                    position: 'absolute', bottom: '18vh', left: 0, right: 0, height: '8vh', width: '100%',
                    zIndex: 9, pointerEvents: 'none', opacity: .6 + gL * .4, transition: 'opacity 1s'
                }}>
                {Array.from({ length: 40 }).map((_, i) => {
                    const x = (i / 40) * 1440 + Math.random() * 30, h = 30 + Math.random() * 50, lean = (Math.random() - .5) * 15;
                    return <path key={i} d={`M${x},100 Q${x + lean},${100 - h / 2} ${x + lean * 1.5},${100 - h}`}
                        stroke={`hsl(${120 + Math.random() * 20}, ${40 + Math.random() * 20}%, ${15 + gL * 10}%)`}
                        strokeWidth={2 + Math.random() * 2} fill="none" strokeLinecap="round" />;
                })}
            </svg>

            {/* Garden glow */}
            <motion.div animate={{ opacity: gL * .25 }} transition={{ duration: 1.5 }}
                style={{
                    position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '60%',
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(255,224,130,0.2) 0%, transparent 60%)',
                    pointerEvents: 'none', zIndex: 7
                }} />

            {/* #10 Completion */}
            {allBloomed && <Celebration />}

            {/* Reason modal */}
            <AnimatePresence>
                {activeReason !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setActiveReason(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,5,20,0.6)',
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'pointer'
                        }}>
                        <motion.div
                            initial={{ scale: .7, y: 50, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                            exit={{ scale: .8, opacity: 0, y: -30 }}
                            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'relative', borderRadius: 28, padding: '48px 36px 40px', maxWidth: 420, width: '100%',
                                textAlign: 'center', overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(30,20,50,0.95), rgba(20,30,20,0.9))',
                                border: '1px solid rgba(255,224,130,0.2)',
                                boxShadow: `0 0 40px ${FT[activeReason % FT.length].g}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
                            }}>
                            <motion.div animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute', top: -60, right: -60, width: 120, height: 120, borderRadius: '50%',
                                    background: `radial-gradient(circle, ${FT[activeReason % FT.length].g}, transparent)`, opacity: .3
                                }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ delay: .2, type: 'spring', stiffness: 300 }}
                                    style={{ fontSize: 48, marginBottom: 16 }}>🌸</motion.div>
                                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }}
                                    transition={{ delay: .3, duration: .6 }}
                                    style={{
                                        height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,224,130,0.5), transparent)',
                                        margin: '0 auto 20px'
                                    }} />
                                <h2 style={{
                                    color: '#f0e6d3', fontSize: 'clamp(18px,4vw,24px)',
                                    fontFamily: "'Playfair Display', serif", lineHeight: 1.6, marginBottom: 32, fontWeight: 500, letterSpacing: .3
                                }}>
                                    {reasons[activeReason]}
                                </h2>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: .5, y: 0 }}
                                    transition={{ delay: .5 }}
                                    style={{
                                        fontSize: 12, color: 'rgba(255,224,130,0.6)', letterSpacing: 2,
                                        textTransform: 'uppercase', marginBottom: 24
                                    }}>
                                    Reason #{activeReason + 1}
                                </motion.div>
                                <button onClick={() => setActiveReason(null)}
                                    style={{
                                        padding: '12px 36px', borderRadius: 24, border: '1px solid rgba(255,224,130,0.2)',
                                        background: 'rgba(255,224,130,0.08)', color: '#ffe082', fontWeight: 500, cursor: 'pointer',
                                        fontFamily: "'Caveat', cursive", fontSize: 20, transition: 'all 0.3s', letterSpacing: 1
                                    }}
                                    onMouseEnter={(e) => { e.target.style.background = 'rgba(255,224,130,0.15)'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 20px rgba(255,224,130,0.15)'; }}
                                    onMouseLeave={(e) => { e.target.style.background = 'rgba(255,224,130,0.08)'; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}>
                                    Back to Garden 🌿
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
