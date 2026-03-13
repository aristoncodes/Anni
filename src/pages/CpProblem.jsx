export default function CpProblem() {
    return (
        <div style={{
            minHeight: '100vh', background: '#fff', fontFamily: '"Times New Roman", serif',
            color: '#000', padding: '20px 40px', maxWidth: 800, margin: '0 auto',
        }}>
            {/* Codeforces-style header */}
            <div style={{
                borderBottom: '2px solid #1a5cba', paddingBottom: 12, marginBottom: 24,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <span style={{ color: '#1a5cba', fontWeight: 'bold', fontSize: 22 }}>Codeforces</span>
                    <span style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>Round #240321</span>
                </div>
                <span style={{ color: '#888', fontSize: 13 }}>Contest · Aalu Beta Edition</span>
            </div>

            {/* Problem title */}
            <h2 style={{ color: '#1a5cba', fontSize: 26, marginBottom: 16, fontFamily: 'inherit' }}>
                A. The Optimal Match
            </h2>

            {/* Limits */}
            <div style={{ fontSize: 13, color: '#555', marginBottom: 24, lineHeight: 1.8 }}>
                <div>time limit per test: <b>∞ seconds</b></div>
                <div>memory limit per test: <b>unlimited (heart-based storage)</b></div>
                <div>input: <b>standard input</b></div>
                <div>output: <b>standard output</b></div>
            </div>

            {/* Problem Statement */}
            <div style={{ marginBottom: 24, lineHeight: 1.9, fontSize: 15 }}>
                <p style={{ marginBottom: 12 }}>
                    You are given two people, <b>Person A</b> (Aditya) and <b>Person B</b> (Aalu).
                    Each person has an array of qualities <i>Q</i> = [<i>q₁, q₂, ..., qₙ</i>].
                </p>
                <p style={{ marginBottom: 12 }}>
                    Define the <b>compatibility score</b> <i>C(A, B)</i> as the sum of all moments where
                    Person A made Person B smile, plus the number of inside jokes shared, minus
                    the total number of fights (which is surprisingly close to 0).
                </p>
                <p style={{ marginBottom: 12 }}>
                    Your task is to prove that among all possible pairings in the universe
                    (population ≈ 8 × 10⁹), the pairing of <b>A</b> and <b>B</b> yields
                    the <b>maximum compatibility score</b>.
                </p>
                <p>
                    Formally, prove that for all pairs <i>(X, Y)</i> where <i>X ≠ A</i> or <i>Y ≠ B</i>:
                    <br />
                    <span style={{ fontFamily: 'monospace', background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginTop: 6 }}>
                        C(A, B) {'>'} C(X, Y)
                    </span>
                </p>
            </div>

            {/* Input */}
            <h3 style={{ color: '#1a5cba', fontSize: 16, marginBottom: 8 }}>Input</h3>
            <div style={{ marginBottom: 24, fontSize: 15, lineHeight: 1.8 }}>
                <p>The first line contains a single integer <i>n</i> (1 ≤ <i>n</i> ≤ 10⁹) — the number of qualities each person has.</p>
                <p style={{ marginTop: 6 }}>The second line contains Person A's qualities: <span style={{ fontFamily: 'monospace' }}>["caring", "funny", "loyal", "cute", "loves_aalu"]</span></p>
                <p style={{ marginTop: 6 }}>The third line contains Person B's qualities: <span style={{ fontFamily: 'monospace' }}>["kind", "beautiful", "strong", "patient", "perfect"]</span></p>
            </div>

            {/* Output */}
            <h3 style={{ color: '#1a5cba', fontSize: 16, marginBottom: 8 }}>Output</h3>
            <div style={{ marginBottom: 24, fontSize: 15, lineHeight: 1.8 }}>
                <p>Print <b>"MATCH FOUND"</b> on a single line, followed by the compatibility score.</p>
                <p style={{ marginTop: 6 }}>It can be shown that the answer is always <b>∞</b> (Infinity).</p>
            </div>

            {/* Examples */}
            <h3 style={{ color: '#1a5cba', fontSize: 16, marginBottom: 8 }}>Examples</h3>
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24,
            }}>
                <div>
                    <div style={{ background: '#e8f0fc', padding: '8px 12px', fontWeight: 'bold', fontSize: 13, borderRadius: '8px 8px 0 0' }}>Input</div>
                    <pre style={{
                        background: '#f8f8f8', padding: 16, fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 13, borderRadius: '0 0 8px 8px', border: '1px solid #e0e0e0', margin: 0,
                    }}>
                        {`5
caring funny loyal cute loves_aalu
kind beautiful strong patient perfect`}
                    </pre>
                </div>
                <div>
                    <div style={{ background: '#e8f0fc', padding: '8px 12px', fontWeight: 'bold', fontSize: 13, borderRadius: '8px 8px 0 0' }}>Output</div>
                    <pre style={{
                        background: '#f8f8f8', padding: 16, fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 13, borderRadius: '0 0 8px 8px', border: '1px solid #e0e0e0', margin: 0,
                    }}>
                        {`MATCH FOUND
Compatibility Score: ∞
Verdict: ❤️ ACCEPTED ❤️`}
                    </pre>
                </div>
            </div>

            {/* Note */}
            <h3 style={{ color: '#1a5cba', fontSize: 16, marginBottom: 8 }}>Note</h3>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#555', borderLeft: '3px solid #e0e0e0', paddingLeft: 16 }}>
                <p>In the first example, the pairing (Aditya, Aalu) returns a compatibility score of ∞.</p>
                <p style={{ marginTop: 6 }}>This is a well-known result in competitive romance theory. The proof is left as an exercise to the heart. 💖</p>
                <p style={{ marginTop: 6 }}><b>Complexity:</b> O(1) — because it was obvious from the start.</p>
            </div>
        </div>
    );
}
