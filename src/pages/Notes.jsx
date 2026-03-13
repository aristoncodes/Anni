import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, push, onValue, set } from 'firebase/database';

const NOTES_REF = 'love-notes';

const defaultNotes = [
    { name: 'Aditya', msg: 'You\'re the best thing that ever happened to me 💖', time: 'Mar 24, 2021', color: 'var(--pink)' },
    { name: 'Aalu', msg: 'Stop being so cute, I can\'t handle it 🥺', time: 'Mar 24, 2021', color: 'var(--lavender)' },
    { name: 'Aditya', msg: 'Remember our first date? Still gives me butterflies 🦋', time: 'Mar 25, 2021', color: 'var(--mint)' },
    { name: 'Aalu', msg: 'You always know how to make me smile 😊', time: 'Mar 26, 2021', color: 'var(--baby-blue)' },
    { name: 'Aditya', msg: 'I love you more than all the stars combined ⭐', time: 'Mar 27, 2021', color: 'var(--pink)' },
];

function formatTimestamp() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} · ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export default function Notes() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listen for real-time updates from Firebase
    useEffect(() => {
        const notesRef = ref(db, NOTES_REF);
        const unsubscribe = onValue(notesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert Firebase object to array, newest first
                const notesList = Object.values(data).reverse();
                setNotes(notesList);
            } else {
                // Seed default notes if database is empty
                defaultNotes.forEach((note) => {
                    push(ref(db, NOTES_REF), note);
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;
        const colors = ['var(--pink)', 'var(--lavender)', 'var(--mint)', 'var(--baby-blue)'];
        const newNote = {
            name: name.trim(),
            msg: message.trim(),
            time: formatTimestamp(),
            color: colors[Math.floor(Math.random() * colors.length)],
        };
        push(ref(db, NOTES_REF), newNote);
        setName('');
        setMessage('');
    };

    const inputStyle = {
        width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-sm)',
        border: '2px solid #eee', fontSize: 15, fontFamily: 'Inter, sans-serif',
        outline: 'none', transition: 'border-color 0.3s',
        background: 'var(--white)',
    };

    return (
        <div className="page-wrapper" style={{ padding: '60px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 40 }}
            >
                <span style={{ fontSize: 48 }}>📝</span>
                <h1 style={{ fontSize: 36, marginTop: 12 }}>Our Notes</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Leave a little love note for us 💕</p>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ maxWidth: 480, width: '100%', padding: 28, marginBottom: 40 }}
            >
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name..."
                    style={{ ...inputStyle, marginBottom: 12 }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                    onBlur={e => e.target.style.borderColor = '#eee'}
                />
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write your note..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', marginBottom: 16 }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                    onBlur={e => e.target.style.borderColor = '#eee'}
                />
                <button type="submit" className="btn btn-pink" style={{ width: '100%' }}>
                    Leave a Note 💌
                </button>
            </motion.form>

            {/* Notes feed */}
            <div style={{ maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}
                    >
                        Loading notes... 💭
                    </motion.div>
                ) : notes.map((note, i) => (
                    <motion.div
                        key={`${note.time}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card"
                        style={{
                            padding: '20px 24px',
                            borderLeft: `4px solid ${note.color}`,
                            position: 'relative',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{note.name}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{note.time}</span>
                        </div>
                        <p style={{ fontSize: 15, lineHeight: 1.6 }}>{note.msg}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
