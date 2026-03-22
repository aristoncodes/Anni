import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

/* ─── Event configurations — pastel palette matching the app ─── */
const EVENTS = [
    {
        name: 'Our Anniversary',
        emoji: '💍',
        icon2: '💕',
        month: 2, day: 24,
        startYear: 2021,
        cardBg: 'linear-gradient(135deg, #FFC0CB 0%, #F4A7B9 100%)',
        accent: '#d4607a',
        digitBg: 'rgba(255,255,255,0.55)',
        subtitle: 'The day it all began',
        quote: '"Every love story is beautiful, but ours is my favorite" 💗',
    },
    {
        name: 'Her Birthday',
        emoji: '🎂',
        icon2: '👑',
        month: 7, day: 1,
        startYear: 2004,
        cardBg: 'linear-gradient(135deg, #E0BBE4 0%, #C9A0DC 100%)',
        accent: '#8b5ca0',
        digitBg: 'rgba(255,255,255,0.55)',
        subtitle: 'My queen\'s special day',
        quote: '"She was born to stand out" 👑',
    },
    {
        name: 'My Birthday',
        emoji: '🎉',
        icon2: '🎈',
        month: 3, day: 2,
        startYear: 2005,
        cardBg: 'linear-gradient(135deg, #A9DEF9 0%, #7DCBF5 100%)',
        accent: '#3a8fc2',
        digitBg: 'rgba(255,255,255,0.55)',
        subtitle: 'The king arrives',
        quote: '"Another year of being awesome" 🚀',
    },
    {
        name: 'Month Anniversary',
        emoji: '🩷',
        icon2: '🌙',
        month: -1, day: 24,
        cardBg: 'linear-gradient(135deg, #B5EAD7 0%, #8CD4B8 100%)',
        accent: '#4a9e7e',
        digitBg: 'rgba(255,255,255,0.55)',
        subtitle: '24th of every month',
        quote: '"Another month of us, another month of love" 🌙',
    },
];

function getNextDate(event) {
    const now = new Date();
    if (event.month === -1) {
        let target = new Date(now.getFullYear(), now.getMonth(), event.day);
        if (target <= now) target = new Date(now.getFullYear(), now.getMonth() + 1, event.day);
        return target;
    }
    let target = new Date(now.getFullYear(), event.month, event.day);
    if (target <= now) target.setFullYear(target.getFullYear() + 1);
    return target;
}

function getTimeLeft(targetDate) {
    const diff = targetDate - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function isToday(month, day) {
    const now = new Date();
    if (month === -1) return now.getDate() === day;
    return now.getMonth() === month && now.getDate() === day;
}

/* ─── Countdown Card ─── */
function CountdownCard({ event, index, isFeatured }) {
    const [time, setTime] = useState(() => getTimeLeft(getNextDate(event)));
    const target = getNextDate(event);
    const active = isToday(event.month, event.day);

    useEffect(() => {
        const id = setInterval(() => setTime(getTimeLeft(getNextDate(event))), 1000);
        return () => clearInterval(id);
    }, [event]);

    const units = [
        { val: time.days, label: 'Days' },
        { val: time.hours, label: 'Hours' },
        { val: time.minutes, label: 'Mins' },
        { val: time.seconds, label: 'Secs' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.12 }}
            className="card"
            style={{
                borderRadius: 22,
                padding: isFeatured ? '32px 28px' : '24px 20px',
                position: 'relative',
                overflow: 'hidden',
                background: event.cardBg,
                border: 'none',
                boxShadow: '0 6px 28px rgba(0,0,0,0.08)',
                gridColumn: isFeatured ? '1 / -1' : 'auto',
            }}
        >
            {/* Decorative white circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            {isFeatured && <div style={{ position: 'absolute', top: '40%', right: '15%', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isFeatured ? 20 : 14, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.div
                        animate={active ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : { scale: [1, 1.06, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                            fontSize: isFeatured ? 38 : 30,
                            width: isFeatured ? 58 : 48, height: isFeatured ? 58 : 48,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 14,
                            background: 'rgba(255,255,255,0.35)',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        {event.emoji}
                    </motion.div>
                    <div>
                        <h3 style={{
                            fontSize: isFeatured ? 20 : 16, fontWeight: 700, margin: 0,
                            color: event.accent,
                        }}>
                            {event.name}
                        </h3>
                        <p style={{ fontSize: 11.5, color: 'rgba(0,0,0,0.4)', margin: '1px 0 0', fontFamily: 'Inter, sans-serif' }}>
                            {event.subtitle} {event.icon2}
                        </p>
                    </div>
                </div>
                {event.startYear && (
                    <div style={{
                        background: 'rgba(255,255,255,0.4)', borderRadius: 20, padding: '5px 12px',
                        fontSize: 11, color: event.accent, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    }}>
                        {new Date().getFullYear() - event.startYear} yrs
                    </div>
                )}
            </div>

            {/* Countdown digits */}
            {active ? (
                <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        textAlign: 'center', padding: '20px 0',
                        fontSize: 22, fontWeight: 700,
                        color: event.accent,
                    }}
                >
                    🎉 Today's the day! 🎉
                </motion.div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: isFeatured ? 14 : 8,
                    margin: '0 0 14px',
                    position: 'relative', zIndex: 1,
                }}>
                    {units.map((unit) => (
                        <div key={unit.label} style={{
                            textAlign: 'center',
                            background: event.digitBg,
                            backdropFilter: 'blur(6px)',
                            borderRadius: 14,
                            padding: isFeatured ? '18px 6px 14px' : '12px 4px 10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}>
                            <motion.div
                                key={unit.val}
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                style={{
                                    fontSize: isFeatured ? 36 : 26,
                                    fontWeight: 800,
                                    color: event.accent,
                                    lineHeight: 1,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {String(unit.val).padStart(2, '0')}
                            </motion.div>
                            <div style={{
                                fontSize: isFeatured ? 10 : 9,
                                fontWeight: 600,
                                color: 'rgba(0,0,0,0.35)',
                                marginTop: 5,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                fontFamily: 'Inter, sans-serif',
                            }}>
                                {unit.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quote for featured */}
            {isFeatured && event.quote && (
                <p style={{
                    fontSize: 12.5, color: 'rgba(0,0,0,0.35)', fontStyle: 'italic',
                    textAlign: 'center', margin: '6px 0 10px', lineHeight: 1.5,
                    fontFamily: "'Playfair Display', serif",
                }}>
                    {event.quote}
                </p>
            )}

            {/* Footer */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'relative', zIndex: 1,
                borderTop: '1px solid rgba(255,255,255,0.3)',
                paddingTop: 10, marginTop: 2,
            }}>
                <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: 'Inter, sans-serif' }}>
                    📅 {target.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                {!active && time.days <= 30 && (
                    <span style={{
                        background: 'rgba(255,255,255,0.5)', borderRadius: 20,
                        padding: '3px 10px', fontSize: 10, fontWeight: 700,
                        color: event.accent, fontFamily: 'Inter, sans-serif',
                    }}>
                        {time.days === 0 ? '🔥 TOMORROW' : `${time.days}d away`}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

/* ── Celebration particles ── */
const EMOJIS = ['❤️', '💖', '💕', '🎈', '🎉', '🥳', '🎊', '💗', '✨', '🌟', '💜', '💝', '🎀'];
const CONFETTI = ['#FFC0CB', '#E0BBE4', '#B5EAD7', '#A9DEF9', '#F4A7B9', '#C9A0DC', '#fbbf24'];

function CelebrationOverlay() {
    const particles = useMemo(() => {
        const items = [];
        for (let i = 0; i < 20; i++) {
            items.push(
                <motion.div key={`e-${i}`}
                    initial={{ y: '110vh', opacity: 0, rotate: -20, scale: 0.5 }}
                    animate={{ y: '-20vh', opacity: [0, 1, 1, 0], rotate: [-20, 10, -15, 20], scale: [0.5, 1, 1.1, 0.8], x: [0, 30, -20, 25] }}
                    transition={{ duration: 6 + Math.random() * 6, delay: Math.random() * 8, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'fixed', left: `${Math.random() * 100}%`, fontSize: 20 + Math.random() * 24, zIndex: 1, pointerEvents: 'none' }}
                >{EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}</motion.div>
            );
        }
        for (let i = 0; i < 30; i++) {
            const s = 6 + Math.random() * 8;
            items.push(
                <motion.div key={`c-${i}`}
                    initial={{ y: '-10vh', opacity: 1 }}
                    animate={{ y: '110vh', opacity: [1, 1, 0], rotate: [0, 720], x: [0, 40 * (Math.random() > 0.5 ? 1 : -1), -30] }}
                    transition={{ duration: 4 + Math.random() * 3, delay: Math.random() * 6, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'fixed', left: `${Math.random() * 100}%`, width: s, height: s * 1.3, borderRadius: Math.random() > 0.5 ? '50%' : 3, background: CONFETTI[Math.floor(Math.random() * CONFETTI.length)], zIndex: 1, pointerEvents: 'none' }}
                />
            );
        }
        return items;
    }, []);
    return <>{particles}</>;
}

/* ─── Period Cycle Card ─── */
function PeriodCycleCard() {
    const [lastDate, setLastDate] = useState('');
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Read from Firebase on mount
    useEffect(() => {
        const periodRef = ref(db, 'periodCycle/lastDate');
        const unsub = onValue(periodRef, (snapshot) => {
            const val = snapshot.val();
            if (val) setLastDate(val);
        });
        return () => unsub();
    }, []);

    const getNextPeriod = useCallback(() => {
        if (!lastDate) return null;
        const last = new Date(lastDate);
        const next = new Date(last.getFullYear(), last.getMonth() + 1, last.getDate());
        if (next <= new Date()) {
            next.setMonth(next.getMonth() + 1);
        }
        return next;
    }, [lastDate]);

    useEffect(() => {
        const id = setInterval(() => {
            const target = getNextPeriod();
            if (!target) return;
            const diff = target - new Date();
            if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
            setTime({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);
        return () => clearInterval(id);
    }, [getNextPeriod]);

    const handleDateChange = (e) => {
        const val = e.target.value;
        setLastDate(val);
        // Save to Firebase
        set(ref(db, 'periodCycle/lastDate'), val);
    };

    const nextPeriod = getNextPeriod();
    const units = [
        { val: time.days, label: 'Days' },
        { val: time.hours, label: 'Hours' },
        { val: time.minutes, label: 'Mins' },
        { val: time.seconds, label: 'Secs' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card"
            style={{
                borderRadius: 22,
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #FADADD 0%, #F8B4C8 100%)',
                border: 'none',
                boxShadow: '0 6px 28px rgba(0,0,0,0.08)',
                marginTop: 4,
            }}
        >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -25, right: -25, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'absolute', bottom: -15, left: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                            fontSize: 30, width: 48, height: 48,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 14, background: 'rgba(255,255,255,0.35)',
                        }}
                    >🩸</motion.div>
                    <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#b5365a' }}>Period Cycle</h3>
                        <p style={{ fontSize: 11.5, color: 'rgba(0,0,0,0.4)', margin: '1px 0 0', fontFamily: 'Inter, sans-serif' }}>
                            Tracking for her 💝
                        </p>
                    </div>
                </div>
            </div>

            {/* Date input */}
            <div style={{ marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 6, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Last period started on
                </label>
                <input
                    type="date"
                    value={lastDate}
                    onChange={handleDateChange}
                    style={{
                        width: '100%', padding: '10px 14px',
                        borderRadius: 12, border: '2px solid rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.45)',
                        backdropFilter: 'blur(4px)',
                        fontSize: 14, fontFamily: 'Inter, sans-serif',
                        color: '#5D5D5D', outline: 'none',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#b5365a'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                />
            </div>

            {/* Countdown or placeholder */}
            {lastDate && nextPeriod ? (
                <>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 8, margin: '0 0 14px', position: 'relative', zIndex: 1,
                    }}>
                        {units.map((unit) => (
                            <div key={unit.label} style={{
                                textAlign: 'center', background: 'rgba(255,255,255,0.55)',
                                backdropFilter: 'blur(6px)', borderRadius: 14,
                                padding: '12px 4px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}>
                                <motion.div
                                    key={unit.val}
                                    initial={{ y: -5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                    style={{
                                        fontSize: 26, fontWeight: 800, color: '#b5365a',
                                        lineHeight: 1, fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {String(unit.val).padStart(2, '0')}
                                </motion.div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginTop: 5, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Inter, sans-serif' }}>
                                    {unit.label}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        position: 'relative', zIndex: 1,
                        borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 10,
                    }}>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: 'Inter, sans-serif' }}>
                            📅 Expected: {nextPeriod.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        {time.days <= 7 && (
                            <span style={{
                                background: 'rgba(255,255,255,0.5)', borderRadius: 20,
                                padding: '3px 10px', fontSize: 10, fontWeight: 700,
                                color: '#b5365a', fontFamily: 'Inter, sans-serif',
                            }}>
                                {time.days === 0 ? '🔔 TOMORROW' : `${time.days}d away`}
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center', padding: '12px 0', color: 'rgba(0,0,0,0.3)',
                    fontSize: 13, fontFamily: 'Inter, sans-serif',
                }}>
                    Enter a date above to start tracking 📅
                </div>
            )}
        </motion.div>
    );
}

/* ─── Together Stats ─── */
const ANNIVERSARY = new Date(2021, 2, 24); // March 24, 2021

function TogetherStats() {
    const [elapsed, setElapsed] = useState(() => Date.now() - ANNIVERSARY.getTime());

    useEffect(() => {
        const id = setInterval(() => setElapsed(Date.now() - ANNIVERSARY.getTime()), 1000);
        return () => clearInterval(id);
    }, []);

    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);

    const stats = [
        { emoji: '💕', value: days.toLocaleString(), label: 'Days Together' },
        { emoji: '🌅', value: hours.toLocaleString(), label: 'Hours of Love' },
        { emoji: '🗓️', value: months, label: 'Months Strong' },
        { emoji: '💌', value: weeks, label: 'Weeks of Us' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
                display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
                marginBottom: 28, position: 'relative', zIndex: 1,
                maxWidth: 900, width: '100%',
            }}
        >
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    style={{
                        background: 'var(--white)', borderRadius: 14,
                        padding: '12px 18px', textAlign: 'center',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        flex: '1 1 140px', maxWidth: 180,
                    }}
                >
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <div style={{
                        fontSize: 22, fontWeight: 800, color: 'var(--text)',
                        fontFamily: "'JetBrains Mono', monospace",
                        margin: '4px 0 2px',
                    }}>{s.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        {s.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ─── Next Milestone Banner ─── */
function NextMilestone() {
    const days = Math.floor((Date.now() - ANNIVERSARY.getTime()) / (1000 * 60 * 60 * 24));
    // Find next round milestone
    const milestones = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000];
    const nextMilestone = milestones.find(m => m > days) || (Math.ceil(days / 1000) + 1) * 1000;
    const daysUntil = nextMilestone - days;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
                background: 'linear-gradient(135deg, var(--white) 0%, rgba(255,192,203,0.15) 100%)',
                borderRadius: 16, padding: '14px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 12, marginBottom: 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                maxWidth: 900, width: '100%',
                position: 'relative', zIndex: 1, flexWrap: 'wrap',
            }}
        >
            <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 22 }}
            >🎯</motion.span>
            <span style={{ fontSize: 14, color: 'var(--text)' }}>
                <strong style={{ color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{nextMilestone.toLocaleString()}</strong> days together in
            </span>
            <span style={{
                background: 'var(--pink)', borderRadius: 20,
                padding: '4px 14px', fontSize: 13, fontWeight: 700,
                color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
            }}>
                {daysUntil} days
            </span>
            <span style={{ fontSize: 14 }}>🚀</span>
        </motion.div>
    );
}

/* ─── Love Quotes ─── */
const QUOTES = [
    { text: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
    { text: "I have found the one whom my soul loves.", author: "Song of Solomon" },
    { text: "You are my sun, my moon, and all my stars.", author: "E.E. Cummings" },
    { text: "Whatever our souls are made of, yours and mine are the same.", author: "Emily Brontë" },
    { text: "I love you not because of who you are, but because of who I am when I am with you.", author: "Roy Croft" },
];

function LoveQuote() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setIdx(i => (i + 1) % QUOTES.length), 6000);
        return () => clearInterval(id);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{
                textAlign: 'center', marginTop: 28, position: 'relative', zIndex: 1,
                maxWidth: 500, margin: '28px auto 0',
            }}
        >
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'var(--white)', borderRadius: 16,
                    padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
            >
                <p style={{
                    fontSize: 14, fontStyle: 'italic', color: 'var(--text)',
                    lineHeight: 1.6, fontFamily: "'Playfair Display', serif",
                    marginBottom: 8,
                }}>
                    "{QUOTES[idx].text}"
                </p>
                <span style={{ fontSize: 11, color: 'var(--text-light)', fontFamily: 'Inter, sans-serif' }}>
                    — {QUOTES[idx].author}
                </span>
            </motion.div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10 }}>
                {QUOTES.map((_, i) => (
                    <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: i === idx ? 'var(--pink-dark)' : 'var(--pink)',
                        opacity: i === idx ? 1 : 0.4,
                        transition: 'all 0.3s',
                    }} />
                ))}
            </div>
        </motion.div>
    );
}

/* ─── Main Page ─── */
export default function Countdown() {
    const [, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(id); }, []);

    const now = new Date();
    const isCelebration = now.getMonth() === 2 && now.getDate() === 24;

    if (isCelebration) {
        return (
            <div className="page-wrapper" style={{ justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
                <CelebrationOverlay />
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                    style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 80, marginBottom: 8 }}>🎉</motion.div>
                    <motion.h1 animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 4, repeat: Infinity }}
                        style={{ fontSize: 44, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(90deg, #d4607a, #8b5ca0, #3a8fc2, #d4607a)', backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Happy Anniversary! 💕
                    </motion.h1>
                    <p style={{ color: 'var(--text-light)', fontSize: 18, maxWidth: 420, margin: '0 auto' }}>
                        Today marks another beautiful year of us together! 🥂
                    </p>
                </motion.div>
            </div>
        );
    }

    const sortedEvents = [...EVENTS].sort((a, b) => getNextDate(a) - getNextDate(b));

    return (
        <div className="page-wrapper" style={{ padding: '50px 24px', minHeight: '100vh', position: 'relative' }}>
            {/* Subtle decorative pastel blobs */}
            <div style={{ position: 'absolute', top: '5%', right: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,192,203,0.2), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,187,228,0.15), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(181,234,215,0.12), transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 1 }}
            >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ fontSize: 52, display: 'block', marginBottom: 4 }}
                    >⏳</motion.span>
                    <span style={{ position: 'absolute', top: -6, right: -18, fontSize: 16, animation: 'sparkle 2s ease-in-out infinite' }}>✨</span>
                </div>
                <h1 style={{ fontSize: 36, marginTop: 4, color: 'var(--text)' }}>
                    Counting Down To...
                </h1>
                <p style={{ color: 'var(--text-light)', marginTop: 6, fontSize: 14 }}>
                    Every second brings us closer to another celebration 💕
                </p>
                <div style={{ width: 50, height: 3, margin: '14px auto 0', background: 'linear-gradient(90deg, var(--pink), var(--lavender), var(--mint))', borderRadius: 2 }} />
            </motion.div>

            {/* Together Stats */}
            <TogetherStats />

            {/* Next Milestone */}
            <NextMilestone />

            {/* Cards Grid — 2 columns */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                maxWidth: 780,
                margin: '0 auto',
                position: 'relative', zIndex: 1,
            }}>
                {sortedEvents.map((event, i) => (
                    <CountdownCard key={event.name} event={event} index={i} isFeatured={i === 0} />
                ))}
                <PeriodCycleCard />
            </div>

            {/* Love Quotes Carousel */}
            <LoveQuote />

            {/* Bottom emojis */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                style={{ textAlign: 'center', marginTop: 20, position: 'relative', zIndex: 1 }}
            >
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {['💕', '✨', '🌟', '💗', '🫧'].map((e, i) => (
                        <motion.span key={i}
                            animate={{ y: [0, -5, 0], scale: [1, 1.12, 1] }}
                            transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
                            style={{ fontSize: 16, opacity: 0.5 }}
                        >{e}</motion.span>
                    ))}
                </div>
            </motion.div>

            <style>{`
                @keyframes sparkle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(0.7); }
                }
                @media (max-width: 768px) {
                    .page-wrapper > div:nth-child(7) {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 500px) {
                    .page-wrapper > div:nth-child(7) {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
