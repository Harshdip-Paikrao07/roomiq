"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue, update, get } from "firebase/database";
import { questions as allQuestions } from "@/data/questions";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState("🎮");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [stealWindow, setStealWindow] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [stealMsg, setStealMsg] = useState("");
  const [stealing, setStealing] = useState(false);
  const localAnswered = useRef(false);
  const isHostRef = useRef(false);
  const timerRef = useRef(null);
  const stealTimeoutRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem("playerName") || "";
    const avatar = localStorage.getItem("playerAvatar") || "🎮";
    setPlayerName(name);
    setPlayerAvatar(avatar);
  }, []);

  // Load + shuffle questions ONCE (host saves to Firebase)
  useEffect(() => {
    const setup = async () => {
      const snap = await get(ref(db, `rooms/${id}`));
      if (!snap.exists()) return;
      const data = snap.val();
      const name = localStorage.getItem("playerName") || "";
      isHostRef.current = data.host === name;

      // Already have questions saved — use those
      if (data.questions) {
        setQuizQuestions(data.questions);
        return;
      }

      // Only host generates + saves questions
      if (data.host === name) {
        const cat = data.category || "gk";
        const count = data.questionCount || 15;
        const catQ = allQuestions[cat] || allQuestions.gk;
        const shuffled = shuffleArray(catQ).slice(0, count);
        await update(ref(db, `rooms/${id}`), { questions: shuffled });
        setQuizQuestions(shuffled);
      } else {
        // Non-host waits for questions to appear in Firebase
        const qRef = ref(db, `rooms/${id}/questions`);
        onValue(qRef, (s) => {
          if (s.exists()) setQuizQuestions(s.val());
        });
      }
    };
    setup();
  }, [id]);

  // Room listener
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "";
    const roomRef = ref(db, `rooms/${id}`);
    const unsub = onValue(roomRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      setRoom(data);
      isHostRef.current = data.host === name;

      if (data.currentQ !== undefined && data.currentQ !== currentQ) {
        setCurrentQ(data.currentQ);
        setSelected(null);
        setAnswered(false);
        localAnswered.current = false;
        setStealWindow(false);
        setStealMsg("");
        setTimeLeft(10);
      }
      if (data.status === "finished") router.push(`/result/${id}`);
    });
    return () => unsub();
  }, [id, currentQ]);

  // Timer
  useEffect(() => {
    if (quizQuestions.length === 0) return;
    clearInterval(timerRef.current);
    setTimeLeft(10);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Time up — show steal window then move next
          setStealWindow(true);
          stealTimeoutRef.current = setTimeout(() => {
            setStealWindow(false);
            if (isHostRef.current) moveNext();
          }, 2500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(stealTimeoutRef.current);
    };
  }, [currentQ, quizQuestions]);

  const moveNext = async () => {
    const snap = await get(ref(db, `rooms/${id}`));
    if (!snap.exists()) return;
    const data = snap.val();
    const total = data.questionCount || 15;
    const next = (data.currentQ || 0) + 1;

    if (next >= total) {
      await update(ref(db, `rooms/${id}`), { status: "finished" });
    } else {
      // Reset all players' answered flag
      const updates = { currentQ: next };
      Object.keys(data.players || {}).forEach((p) => {
        updates[`players/${p}/answered`] = false;
      });
      await update(ref(db, `rooms/${id}`), updates);
    }
  };

  const handleAnswer = async (idx) => {
    if (localAnswered.current) return;

    // Double-check Firebase too
    const name = localStorage.getItem("playerName") || "";
    const playerSnap = await get(ref(db, `rooms/${id}/players/${name}`));
    if (playerSnap.exists() && playerSnap.val().answered === true) return;

    localAnswered.current = true;
    await update(ref(db, `rooms/${id}/players/${name}`), { answered: true });

    clearInterval(timerRef.current);
    clearTimeout(stealTimeoutRef.current);
    setAnswered(true);
    setSelected(idx);

    const correct = quizQuestions[currentQ]?.ans === idx;
    const currentScore = playerSnap.exists() ? playerSnap.val().score || 0 : 0;

    if (correct) {
      await update(ref(db, `rooms/${id}/players/${name}`), { score: currentScore + 10 });
      setStealWindow(true);
      stealTimeoutRef.current = setTimeout(() => {
        setStealWindow(false);
        if (isHostRef.current) moveNext();
      }, 2500);
    } else {
      await update(ref(db, `rooms/${id}/players/${name}`), {
        score: Math.max(0, currentScore - 2),
      });
      stealTimeoutRef.current = setTimeout(() => {
        if (isHostRef.current) moveNext();
      }, 2000);
    }
  };

  const handleSteal = async (targetName) => {
    if (stealing) return;
    setStealing(true);
    const name = localStorage.getItem("playerName") || "";
    const snap = await get(ref(db, `rooms/${id}/players`));
    if (!snap.exists()) { setStealing(false); return; }
    const players = snap.val();
    const targetScore = players[targetName]?.score || 0;
    const myScore = players[name]?.score || 0;
    if (targetScore >= 5) {
      await update(ref(db, `rooms/${id}/players/${targetName}`), { score: targetScore - 5 });
      await update(ref(db, `rooms/${id}/players/${name}`), { score: myScore + 5 });
      setStealMsg(`🔥 Stole 5 pts from ${targetName}!`);
    } else {
      setStealMsg(`❌ ${targetName} has less than 5 pts!`);
    }
    setStealing(false);
  };

  if (!room || quizQuestions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#050508" }}>
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white text-lg font-bold">Loading Quiz...</p>
      <p className="text-gray-600 text-sm">Shuffling questions for you...</p>
    </div>
  );

  const q = quizQuestions[currentQ];
  const players = Object.entries(room.players || {}).sort((a, b) => b[1].score - a[1].score);
  const totalQ = room.questionCount || 15;
  const progress = ((currentQ + 1) / totalQ) * 100;

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: "#050508" }}>

      {/* PROGRESS BAR */}
      <div className="w-full h-1" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-1 transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(to right, #facc15, #f59e0b)" }} />
      </div>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full pb-6">

        {/* Header row */}
        <div className="flex items-center justify-between mt-3 mb-5">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-widest">Question</p>
            <p className="text-2xl font-black">
              {currentQ + 1}
              <span className="text-gray-600 text-lg font-normal"> / {totalQ}</span>
            </p>
          </div>

          {/* Timer */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 transition-all ${
            timeLeft <= 3
              ? "border-red-500 text-red-400 animate-pulse"
              : timeLeft <= 6
              ? "border-orange-400 text-orange-400"
              : "border-yellow-400 text-yellow-400"
          }`} style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: timeLeft <= 3 ? "0 0 20px rgba(239,68,68,0.3)" : timeLeft <= 6 ? "0 0 20px rgba(249,115,22,0.3)" : "0 0 20px rgba(250,204,21,0.2)"
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="flex gap-2 flex-wrap mb-5">
          {players.map(([name, p], i) => (
            <div key={name}
              className="rounded-xl px-3 py-2 text-center min-w-[70px] flex-1"
              style={{
                background: name === playerName ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.04)",
                border: name === playerName ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xl">{p.avatar || "🎮"}</p>
              <p className="text-xs font-semibold truncate max-w-[80px] mx-auto" style={{ color: name === playerName ? "#facc15" : "#9ca3af" }}>
                {i === 0 ? "👑 " : ""}{name}
              </p>
              <p className="font-black text-base" style={{ color: name === playerName ? "#facc15" : "white" }}>{p.score}</p>
              {p.answered && <p className="text-xs text-green-400">✓</p>}
            </div>
          ))}
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest" style={{
            background: "rgba(250,204,21,0.1)",
            color: "#facc15",
            border: "1px solid rgba(250,204,21,0.2)"
          }}>
            {room.category || "GK"}
          </span>
        </div>

        {/* Question Box */}
        <div className="rounded-2xl p-5 mb-4 border" style={{
          background: "rgba(10,10,15,0.9)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)"
        }}>
          <p className="text-base sm:text-lg font-bold leading-relaxed">{q.q}</p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-2.5 mb-4">
          {q.options.map((opt, idx) => {
            let bgStyle = { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" };
            if (answered) {
              if (idx === q.ans) bgStyle = { background: "rgba(34,197,94,0.2)", borderColor: "rgba(34,197,94,0.5)", boxShadow: "0 0 15px rgba(34,197,94,0.2)" };
              else if (idx === selected) bgStyle = { background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.5)" };
              else bgStyle = { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.04)", opacity: 0.4 };
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                className="rounded-xl px-4 py-3.5 text-left font-semibold transition-all border hover:scale-[1.01] disabled:cursor-default text-sm sm:text-base"
                style={bgStyle}
              >
                <span className="font-black mr-3 text-sm" style={{ color: answered && idx === q.ans ? "#22c55e" : "#facc15" }}>
                  {["A", "B", "C", "D"][idx]}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className="rounded-xl p-3 text-center mb-4" style={{
            background: selected === q.ans ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${selected === q.ans ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`
          }}>
            <p className="font-bold">
              {selected === q.ans ? "✅ Correct! +10 points" : "❌ Wrong! -2 points"}
            </p>
            <p className="text-gray-500 text-xs mt-1">Next question coming...</p>
          </div>
        )}

        {/* Steal Window */}
        {stealWindow && (
          <div className="rounded-2xl p-4 border-2 animate-pulse" style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.5)",
            boxShadow: "0 0 30px rgba(239,68,68,0.15)"
          }}>
            <p className="text-red-400 font-black text-center text-lg mb-1">⚡ STEAL WINDOW!</p>
            <p className="text-gray-500 text-xs text-center mb-3">Steal 5 points from any opponent!</p>
            {stealMsg && (
              <p className="text-center text-white font-bold text-sm mb-2">{stealMsg}</p>
            )}
            <div className="flex gap-2 flex-wrap justify-center">
              {players
                .filter(([name]) => name !== playerName)
                .map(([name, p]) => (
                  <button
                    key={name}
                    onClick={() => handleSteal(name)}
                    disabled={stealing}
                    className="rounded-xl px-4 py-2 font-bold transition-all hover:scale-105 text-sm disabled:opacity-50 flex items-center gap-2"
                    style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5" }}
                  >
                    <span>{p.avatar || "🎮"}</span>
                    <span>🔥 {name} ({p.score} pts)</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer bar */}
      <div className="py-3 px-6 text-center border-t" style={{ background: "rgba(10,10,15,0.8)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-gray-700 text-xs">
          Room<span style={{ color: "#facc15" }}>IQ</span> • Room: <span className="text-gray-500">{id}</span> • Q {currentQ + 1}/{totalQ}
        </p>
      </div>
    </div>
  );
}