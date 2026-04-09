"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Link from "next/link";

export default function ResultPage() {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("playerName") || "";
    setPlayerName(name);

    const roomRef = ref(db, `rooms/${id}`);
    const unsub = onValue(roomRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      setRoom(data);
      if (data.players) {
        const sorted = Object.entries(data.players)
          .map(([n, p]) => ({
            name: n,
            score: p.score || 0,
            avatar: p.avatar || "🎮",
          }))
          .sort((a, b) => b.score - a.score);
        setPlayers(sorted);
        if (sorted[0]?.name === name) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }
    });

    return () => unsub();
  }, [id]);

  const myRank = players.findIndex((p) => p.name === playerName);
  const winner = players[0];
  const iWon = winner?.name === playerName;

  const MEDALS = ["🥇", "🥈", "🥉"];

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#050508" }}
    >
      {/* BG glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: iWon ? "rgba(250,204,21,0.06)" : "rgba(168,85,247,0.05)" }}
      />

      {/* Confetti */}
      {showConfetti &&
        Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-bounce pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.8 + Math.random()}s`,
            }}
          >
            {["🎉", "🏆", "⭐", "✨", "🎊"][i % 5]}
          </div>
        ))}

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black">
            Room<span style={{ color: "#facc15" }}>IQ</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quiz Complete!</p>
        </div>

        {/* Room info badges */}
        {room && (
          <div className="flex gap-2 justify-center mb-5">
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
              style={{
                background: "rgba(250,204,21,0.1)",
                color: "#facc15",
                border: "1px solid rgba(250,204,21,0.2)",
              }}
            >
              {room.category || "GK"}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {room.questionCount} Questions
            </span>
          </div>
        )}

        {/* Winner Banner */}
        {winner && (
          <div
            className="rounded-3xl p-6 text-center mb-5 border"
            style={{
              background: "linear-gradient(135deg, rgba(250,204,21,0.15), rgba(250,204,21,0.04))",
              borderColor: "rgba(250,204,21,0.3)",
              boxShadow: "0 0 40px rgba(250,204,21,0.12)",
            }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Winner</p>
            <div className="text-5xl mb-2">{winner.avatar}</div>
            <p className="text-2xl font-black">{winner.name}</p>
            <p className="text-yellow-400 font-black text-3xl mt-1">{winner.score} pts</p>
            {iWon && (
              <p className="text-green-400 font-bold text-sm mt-3 animate-pulse">
                🎉 You Won! Amazing!
              </p>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Final Standings
            </p>
          </div>

          {players.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                background:
                  p.name === playerName
                    ? "rgba(250,204,21,0.08)"
                    : i === 0
                    ? "rgba(250,204,21,0.05)"
                    : i === 1
                    ? "rgba(156,163,175,0.05)"
                    : i === 2
                    ? "rgba(180,83,9,0.05)"
                    : "transparent",
                borderLeft:
                  p.name === playerName
                    ? "3px solid rgba(250,204,21,0.5)"
                    : "3px solid transparent",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0">
                {MEDALS[i] || `#${i + 1}`}
              </span>
              <span className="text-xl flex-shrink-0">{p.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">
                  {p.name}
                  {p.name === playerName && (
                    <span className="text-yellow-400 text-xs ml-1">(You)</span>
                  )}
                </p>
                <p className="text-gray-600 text-xs">Rank #{i + 1}</p>
              </div>
              <p
                className="font-black text-lg flex-shrink-0"
                style={{ color: i === 0 ? "#facc15" : "white" }}
              >
                {p.score}
              </p>
            </div>
          ))}
        </div>

        {/* My rank pill */}
        <div
          className="text-center py-3 rounded-2xl mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-gray-500 text-xs">Your Result</p>
          <p
            className="text-2xl font-black mt-1"
            style={{ color: myRank === 0 ? "#facc15" : "#ffffff" }}
          >
            {myRank === 0
              ? "🏆 1st Place!"
              : myRank === 1
              ? "🥈 2nd Place!"
              : myRank === 2
              ? "🥉 3rd Place!"
              : `#${myRank + 1} Place`}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {players.find((p) => p.name === playerName)?.score || 0} points total
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/play"
            className="w-full font-black py-4 rounded-2xl text-lg text-center transition-all hover:scale-105 block"
            style={{
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0a",
              boxShadow: "0 0 20px rgba(250,204,21,0.3)",
            }}
          >
            🔄 Play Again
          </Link>
          <Link
            href="/"
            className="w-full font-bold py-3 rounded-2xl text-base text-center transition-all hover:scale-105 block"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#9ca3af",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}