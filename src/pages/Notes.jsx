import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';

const NOTES_REF = 'love-notes';
const REACTIONS = ['❤️', '😂', '🥺', '😍', '🔥', '💯'];

const SENDER_COLORS = {
    him: { bg: '#E8F4FD', border: 'var(--baby-blue)', accent: 'var(--baby-blue-dark)', tag: '💙' },
    her: { bg: '#FFF0F3', border: 'var(--pink)', accent: 'var(--pink-dark)', tag: '💗' },
    default: { bg: '#F3F0FF', border: 'var(--lavender)', accent: 'var(--lavender-dark)', tag: '💜' },
};

const STICKY_COLORS = [
    { bg: '#FFF5F5', border: '#F4A7B9' },
    { bg: '#F0F4FF', border: '#A9DEF9' },
    { bg: '#F5F0FF', border: '#C9A0DC' },
    { bg: '#F0FFF5', border: '#8CD4B8' },
    { bg: '#FFFBF0', border: '#F5D89A' },
    { bg: '#FFF0F8', border: '#FFC0CB' },
];

function getSenderType(name) {
    if (!name) return 'default';
    const n = name.toLowerCase().trim();
    if (['jim', 'him', 'aditya', 'adi', 'king', 'he', 'boy', 'boyfriend', 'bf'].includes(n)) return 'him';
    if (['jam', 'her', 'she', 'queen', 'girl', 'girlfriend', 'gf', 'baby', 'babe'].includes(n)) return 'her';
    return 'default';
}

function formatTimestamp() {
    const now = new Date();
    return now.toISOString();
}

function formatDate(d) {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(d) {
    const date = new Date(d);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getDateGroup(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return 'Undated';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.floor((today - noteDay) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today 💕';
    if (diff === 1) return 'Yesterday 🌸';
    if (diff < 7) return 'This Week ✨';
    if (diff < 30) return 'This Month 🌙';
    return formatDate(dateStr);
}

/* ── Doodle background ── */
function DoodleBackground() {
    const doodles = useMemo(() => {
        const items = [];
        const emojis = ['♡', '✧', '☆', '◦', '∘', '♪', '❋', '✿', '⋆'];
        for (let i = 0; i < 40; i++) {
            items.push({
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: 10 + Math.random() * 16,
                opacity: 0.04 + Math.random() * 0.04,
                rotate: Math.random() * 360,
            });
        }
        return items;
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {doodles.map((d, i) => (
                <span key={i} style={{
                    position: 'absolute', left: d.left, top: d.top,
                    fontSize: d.size, opacity: d.opacity,
                    transform: `rotate(${d.rotate}deg)`,
                    color: 'var(--pink-dark)', userSelect: 'none',
                }}>{d.emoji}</span>
            ))}
        </div>
    );
}

/* ── Sticky note card ── */
function StickyNote({ note, index, onReact, onReply, showReplies, toggleReplies, replies, onSubmitReply, onDelete, onEdit, onBookmark }) {
    const [replyText, setReplyText] = useState('');
    const [replyName, setReplyName] = useState('Jim');
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(note.msg);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const senderType = getSenderType(note.name);
    const senderTheme = SENDER_COLORS[senderType];
    const chosenColor = note.color ? STICKY_COLORS.find(c => c.bg === note.color) : null;
    const stickyColor = chosenColor || STICKY_COLORS[index % STICKY_COLORS.length];
    const rotation = ((index % 5) - 2) * 1.5;
    const reactions = note.reactions || {};

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !replyName.trim()) return;
        onSubmitReply(note._key, replyName.trim(), replyText.trim());
        setReplyText('');
    };

    const handleEditSave = () => {
        if (!editText.trim()) return;
        onEdit(note._key, editText.trim());
        setEditing(false);
    };

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
        onDelete(note._key);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: rotation * 2 }}
            animate={{ opacity: 1, scale: 1, rotate: rotation }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
            transition={{ delay: Math.min(index * 0.04, 0.5), type: 'spring', damping: 15 }}
            whileHover={{ rotate: 0, scale: 1.03, zIndex: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
            style={{
                background: stickyColor.bg,
                borderRadius: 4,
                padding: '20px 18px 14px',
                position: 'relative',
                boxShadow: '0 3px 12px rgba(0,0,0,0.06), 2px 2px 0 rgba(0,0,0,0.02)',
                borderTop: `4px solid ${senderTheme.border}`,
                cursor: 'default',
                breakInside: 'avoid',
                marginBottom: 14,
            }}
        >
            {/* Pin */}
            <div style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
                width: 12, height: 12, borderRadius: '50%',
                background: senderTheme.accent,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }} />

            {/* Action buttons (top right) */}
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                    onClick={() => onBookmark(note._key, note.bookmarked)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, opacity: note.bookmarked ? 1 : 0.3, transition: 'opacity 0.2s' }}
                >{note.bookmarked ? '⭐' : '☆'}</motion.button>
                <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                    onClick={() => { setEditing(!editing); setEditText(note.msg); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, opacity: 0.3, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.3}
                >✏️</motion.button>
                <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                    onClick={handleDelete}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, opacity: confirmDelete ? 1 : 0.3, color: confirmDelete ? '#e55' : 'inherit', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => { if (!confirmDelete) e.target.style.opacity = 0.3; }}
                >{confirmDelete ? '❌' : '🗑️'}</motion.button>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingRight: 70 }}>
                <span style={{
                    fontWeight: 700, color: senderTheme.accent,
                    fontFamily: "'Caveat', cursive", fontSize: 18,
                }}>
                    {note.name} {senderTheme.tag}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', fontFamily: 'Inter' }}>
                    {formatTime(note.time)}
                </span>
            </div>

            {/* Message or Edit */}
            {editing ? (
                <div style={{ marginBottom: 12 }}>
                    <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2}
                        style={{
                            width: '100%', padding: '8px 10px', borderRadius: 8,
                            border: '2px solid var(--pink)', fontSize: 18,
                            fontFamily: "'Caveat', cursive", outline: 'none',
                            background: 'rgba(255,255,255,0.6)', resize: 'vertical',
                        }} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <button onClick={handleEditSave} style={{
                            padding: '4px 14px', borderRadius: 8, border: 'none',
                            background: 'var(--mint)', cursor: 'pointer', fontSize: 13,
                            fontWeight: 600, fontFamily: 'Inter',
                        }}>Save ✓</button>
                        <button onClick={() => setEditing(false)} style={{
                            padding: '4px 14px', borderRadius: 8, border: 'none',
                            background: 'rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: 13,
                            fontFamily: 'Inter',
                        }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <p style={{
                    fontSize: 20, lineHeight: 1.5,
                    fontFamily: "'Caveat', cursive",
                    color: '#3a3a3a',
                    marginBottom: 12,
                    wordBreak: 'break-word',
                }}>{note.msg}</p>
            )}

            {/* Reactions display */}
            {Object.keys(reactions).length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {Object.entries(reactions).map(([emoji, count]) => count > 0 && (
                        <span key={emoji} style={{
                            background: 'rgba(255,255,255,0.7)', borderRadius: 12,
                            padding: '2px 8px', fontSize: 12,
                            border: '1px solid rgba(0,0,0,0.06)',
                        }}>
                            {emoji} {count}
                        </span>
                    ))}
                </div>
            )}

            {/* Reaction + reply buttons */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                {REACTIONS.map(emoji => (
                    <motion.button key={emoji}
                        whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }}
                        onClick={() => onReact(note._key, emoji)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 14, padding: '2px 4px', opacity: 0.5,
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = 1}
                        onMouseLeave={e => e.target.style.opacity = 0.5}
                    >{emoji}</motion.button>
                ))}
                <span style={{ margin: '0 4px', color: 'rgba(0,0,0,0.15)' }}>|</span>
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => toggleReplies(note._key)}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 11, color: 'rgba(0,0,0,0.4)', fontFamily: 'Inter',
                        fontWeight: 600,
                    }}
                >
                    💬 {replies.length > 0 ? replies.length : 'Reply'}
                </motion.button>
            </div>

            {/* Replies section */}
            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', marginTop: 10 }}
                    >
                        <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: 10 }}>
                            {replies.map((r, ri) => (
                                <div key={ri} style={{
                                    marginBottom: 8, paddingLeft: 10,
                                    borderLeft: `2px solid ${SENDER_COLORS[getSenderType(r.name)].border}`,
                                }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Caveat', cursive", color: SENDER_COLORS[getSenderType(r.name)].accent }}>
                                        {r.name}
                                    </span>
                                    <p style={{ fontSize: 17, fontFamily: "'Caveat', cursive", color: '#4a4a4a', margin: '2px 0' }}>
                                        {r.text}
                                    </p>
                                </div>
                            ))}
                            <form onSubmit={handleReplySubmit} style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: 2 }}>
                                    {['Jim', 'Jam'].map(who => (
                                        <button key={who} type="button" onClick={() => setReplyName(who)}
                                            style={{
                                                padding: '5px 10px', borderRadius: 6, border: 'none',
                                                fontWeight: 600, cursor: 'pointer',
                                                fontFamily: "'Caveat', cursive", fontSize: 14,
                                                background: replyName === who
                                                    ? (who === 'Jim' ? 'var(--baby-blue)' : 'var(--pink)')
                                                    : 'transparent',
                                                color: 'var(--text)', transition: 'all 0.2s',
                                            }}
                                        >{who}</button>
                                    ))}
                                </div>
                                <input value={replyText} onChange={e => setReplyText(e.target.value)}
                                    placeholder="Reply..." style={{
                                        flex: 1, minWidth: 100, padding: '6px 10px', borderRadius: 8,
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        fontFamily: "'Caveat', cursive", fontSize: 15, outline: 'none',
                                        background: 'rgba(255,255,255,0.6)',
                                    }} />
                                <button type="submit" style={{
                                    padding: '6px 12px', borderRadius: 8, border: 'none',
                                    background: 'var(--pink)', cursor: 'pointer', fontSize: 12,
                                    fontWeight: 600, fontFamily: 'Inter',
                                }}>↩</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function Notes() {
    const [name, setName] = useState('Jim');
    const [message, setMessage] = useState('');
    const [noteColor, setNoteColor] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [openReplies, setOpenReplies] = useState({});

    /* ── Firebase listener ── */
    useEffect(() => {
        const notesRef = ref(db, NOTES_REF);
        const unsubscribe = onValue(notesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const notesList = Object.entries(data).map(([k, v]) => ({ ...v, _key: k })).reverse();
                setNotes(notesList);
            } else {
                setNotes([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    /* ── Streak calculation ── */
    const streak = useMemo(() => {
        if (!notes.length) return 0;
        const days = new Set();
        notes.forEach(n => {
            if (n.time) days.add(new Date(n.time).toDateString());
        });
        let count = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            if (days.has(d.toDateString())) { count++; } else { if (i > 0) break; }
        }
        return count;
    }, [notes]);

    /* ── Submit note ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        push(ref(db, NOTES_REF), {
            name: name,
            msg: message.trim(),
            time: formatTimestamp(),
            reactions: {},
            replies: [],
            bookmarked: false,
            color: noteColor || '',
        });
        setMessage('');
    };

    /* ── React to note ── */
    const handleReact = (noteKey, emoji) => {
        const note = notes.find(n => n._key === noteKey);
        if (!note) return;
        const current = note.reactions?.[emoji] || 0;
        update(ref(db, `${NOTES_REF}/${noteKey}/reactions`), { [emoji]: current + 1 });
    };

    /* ── Reply to note ── */
    const handleReply = (noteKey, replyName, replyText) => {
        const note = notes.find(n => n._key === noteKey);
        if (!note) return;
        const currentReplies = note.replies || [];
        update(ref(db, `${NOTES_REF}/${noteKey}`), {
            replies: [...currentReplies, { name: replyName, text: replyText, time: formatTimestamp() }],
        });
    };

    /* ── Delete note ── */
    const handleDelete = (noteKey) => {
        remove(ref(db, `${NOTES_REF}/${noteKey}`));
    };

    /* ── Edit note ── */
    const handleEdit = (noteKey, newMsg) => {
        update(ref(db, `${NOTES_REF}/${noteKey}`), { msg: newMsg });
    };

    /* ── Bookmark note ── */
    const handleBookmark = (noteKey, current) => {
        update(ref(db, `${NOTES_REF}/${noteKey}`), { bookmarked: !current });
    };

    const toggleReplies = (key) => {
        setOpenReplies(prev => ({ ...prev, [key]: !prev[key] }));
    };

    /* ── Filter & sort (bookmarked first) ── */
    const filteredNotes = useMemo(() => {
        let list = notes;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(n =>
                n.name?.toLowerCase().includes(q) || n.msg?.toLowerCase().includes(q)
            );
        }
        return [...list].sort((a, b) => {
            if (a.bookmarked && !b.bookmarked) return -1;
            if (!a.bookmarked && b.bookmarked) return 1;
            return 0;
        });
    }, [notes, search]);

    /* ── Group by date ── */
    const groupedNotes = useMemo(() => {
        const groups = {};
        filteredNotes.forEach(note => {
            const group = getDateGroup(note.time);
            if (!groups[group]) groups[group] = [];
            groups[group].push(note);
        });
        return groups;
    }, [filteredNotes]);

    const inputStyle = {
        width: '100%', padding: '14px 18px', borderRadius: 12,
        border: '2px solid rgba(0,0,0,0.06)', fontSize: 15,
        fontFamily: "'Caveat', cursive", fontSize: 20,
        outline: 'none', transition: 'border-color 0.3s',
        background: 'rgba(255,255,255,0.8)',
    };

    return (
        <div className="page-wrapper" style={{ padding: '50px 24px', minHeight: '100vh', position: 'relative' }}>
            <DoodleBackground />

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}
            >
                <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ fontSize: 48, display: 'block', marginBottom: 4 }}
                >📝</motion.span>
                <h1 style={{ fontSize: 36, marginTop: 4 }}>Our Notes</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 6, fontSize: 14 }}>
                    Leave a little love note for us 💕
                </p>
                <div style={{ width: 50, height: 3, margin: '12px auto 0', background: 'linear-gradient(90deg, var(--pink), var(--lavender), var(--mint))', borderRadius: 2 }} />
            </motion.div>

            {/* ── Stats ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{
                    display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
                    marginBottom: 24, position: 'relative', zIndex: 1,
                }}
            >
                {[
                    { emoji: '📝', val: notes.length, label: 'Notes' },
                    { emoji: '💙', val: notes.filter(n => getSenderType(n.name) === 'him').length, label: 'From Jim' },
                    { emoji: '💗', val: notes.filter(n => getSenderType(n.name) === 'her').length, label: 'From Jam' },
                    { emoji: '❤️', val: notes.reduce((sum, n) => sum + Object.values(n.reactions || {}).reduce((s, v) => s + v, 0), 0), label: 'Reactions' },
                    { emoji: '🔥', val: streak, label: 'Day Streak' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'var(--white)', borderRadius: 12, padding: '8px 16px',
                        textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}>
                        <span style={{ fontSize: 16 }}>{s.emoji}</span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", margin: '2px 0' }}>{s.val}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* ── Form ── */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{
                    maxWidth: 460, width: '100%', padding: 24,
                    marginBottom: 28, position: 'relative', zIndex: 1,
                    background: 'linear-gradient(145deg, #FFF5F5, #FFF0F8)',
                    borderRadius: 6, borderTop: '4px solid var(--pink)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
            >
                {/* Pin */}
                <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: 'var(--pink-dark)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />

                {/* Jim / Jam toggle */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {[{ key: 'Jim', label: 'Jim 💙' }, { key: 'Jam', label: 'Jam 💗' }].map(opt => (
                        <motion.button key={opt.key} type="button"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setName(opt.key)}
                            style={{
                                flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                                fontSize: 20, fontWeight: 600, cursor: 'pointer',
                                fontFamily: "'Caveat', cursive",
                                background: name === opt.key
                                    ? (opt.key === 'Jim' ? 'var(--baby-blue)' : 'var(--pink)')
                                    : 'rgba(255,255,255,0.5)',
                                color: 'var(--text)',
                                transition: 'all 0.2s',
                                boxShadow: name === opt.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >{opt.label}</motion.button>
                    ))}
                </div>
                <textarea
                    value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Write your note... 💌"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.06)'}
                />
                {/* Color picker */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-light)', fontFamily: 'Inter', fontWeight: 600 }}>Color:</span>
                    {STICKY_COLORS.map((c, i) => (
                        <motion.button key={i} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                            onClick={() => setNoteColor(noteColor === c.bg ? '' : c.bg)}
                            style={{
                                width: 22, height: 22, borderRadius: '50%',
                                background: c.bg, border: `2px solid ${noteColor === c.bg ? c.border : 'rgba(0,0,0,0.08)'}`,
                                cursor: 'pointer', transition: 'border-color 0.2s',
                                boxShadow: noteColor === c.bg ? `0 0 0 2px ${c.border}40` : 'none',
                            }}
                        />
                    ))}
                </div>
                <button type="submit" className="btn btn-pink" style={{ width: '100%', fontFamily: "'Caveat', cursive", fontSize: 20 }}>
                    Pin this Note 📌
                </button>
            </motion.form>

            {/* ── Search ── */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ maxWidth: 460, width: '100%', marginBottom: 20, position: 'relative', zIndex: 1 }}
            >
                <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                        onClick={() => setSearchOpen(!searchOpen)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '8px 16px', borderRadius: 20, border: 'none',
                            background: searchOpen ? 'var(--pink)' : 'var(--white)',
                            cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            color: 'var(--text)',
                        }}
                    >🔍 Search</motion.button>
                </div>
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search notes by name or content..."
                                style={{
                                    width: '100%', padding: '10px 16px', borderRadius: 12,
                                    border: '2px solid rgba(0,0,0,0.06)', fontSize: 14,
                                    fontFamily: 'Inter', outline: 'none', marginTop: 10,
                                    background: 'var(--white)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.06)'}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Notes Board (masonry via CSS columns) ── */}
            <div className="notes-board" style={{
                maxWidth: 720, width: '100%', position: 'relative', zIndex: 1,
                columns: '2 280px', columnGap: 14,
            }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40, columnSpan: 'all' }}>
                        Loading notes... 💭
                    </p>
                ) : filteredNotes.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '40px 20px', color: 'var(--text-light)',
                        fontSize: 15, columnSpan: 'all',
                    }}>
                        {search ? 'No notes match your search 🔍' : 'No notes yet! Write the first one above 💌'}
                    </div>
                ) : (
                    Object.entries(groupedNotes).map(([group, groupNotes]) => (
                        <div key={group} style={{ breakInside: 'avoid', marginBottom: 6 }}>
                            {/* Date separator */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                margin: '8px 0 12px', breakInside: 'avoid',
                            }}>
                                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
                                <span style={{
                                    fontSize: 12, fontWeight: 600, color: 'var(--text-light)',
                                    fontFamily: 'Inter', whiteSpace: 'nowrap',
                                }}>{group}</span>
                                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
                            </div>
                            {groupNotes.map((note, i) => (
                                <StickyNote
                                    key={note._key}
                                    note={note}
                                    index={i}
                                    onReact={handleReact}
                                    onReply={handleReply}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onBookmark={handleBookmark}
                                    showReplies={!!openReplies[note._key]}
                                    toggleReplies={toggleReplies}
                                    replies={note.replies || []}
                                    onSubmitReply={handleReply}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .page-wrapper { padding: 40px 12px !important; }
                    .page-wrapper h1 { font-size: 28px !important; }
                    .notes-board { columns: 1 !important; }
                }
            `}</style>
        </div>
    );
}
