import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Timeline from './pages/Timeline';
import Reasons from './pages/Reasons';
import CpProblem from './pages/CpProblem';
import TerminalQuiz from './pages/TerminalQuiz';
import MessageBottle from './pages/MessageBottle';
import Countdown from './pages/Countdown';
import Notes from './pages/Notes';
import WordleHub, { WordleGame } from './pages/Wordle';
import SlotMachine from './pages/SlotMachine';
import FlappyHeart from './pages/FlappyHeart';
import TruthOrDare from './pages/TruthOrDare';
import Memories from './pages/Memories';
import FakeError from './pages/FakeError';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/timeline-8f92a1b3" element={<Timeline />} />
                <Route path="/reasons-c7d4e5f6" element={<Reasons />} />
                <Route path="/problem-a-optimal-match-x9y8z7" element={<CpProblem />} />
                <Route path="/terminal-override-q1w2e3" element={<TerminalQuiz />} />
                <Route path="/message-bottle-m4n5b6" element={<MessageBottle />} />
                <Route path="/next-big-day-t9r8e7" element={<Countdown />} />
                <Route path="/our-notes-p0o9i8" element={<Notes />} />
                <Route path="/custom-wordle-l1k2j3" element={<WordleHub />}>
                    <Route index element={<WordleGame />} />
                    <Route path="slots" element={<SlotMachine />} />
                    <Route path="flappy" element={<FlappyHeart />} />
                    <Route path="truth-dare" element={<TruthOrDare />} />
                </Route>
                <Route path="/our-memories-v8b7n6" element={<Memories />} />
                <Route path="*" element={<FakeError />} />
            </Routes>
        </BrowserRouter>
    );
}
