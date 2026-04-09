"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, set, get, update } from "firebase/database";

const AVATARS = ["🦊","🐯","🦁","🐻","🦄","🐺","🦅","🐉","👾","🤖","🎮","⚡"];

const CATEGORIES = [
  { id: "gk", label: "🌍 GK" },
  { id: "entertainment", label: "🎬 Entertainment" },
  { id: "sports", label: "⚽ Sports" },
  { id: "science", label: "🔬 Science" },
  { id: "coding", label: "💻 Coding" },
  { id: "ai", label: "🤖 AI" },
];

export default function PlayPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("gk");
  const [questionCount, setQuestionCount] = useState(15);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [tab, setTab] = useState("create"); // "create" | "join"

  const createRoom = async () => {
    if (!name.trim()) return alert("Enter your name!");
    setLoading(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await set(ref(db, `rooms/${code}`), {
      host: name,
      players: {
        [name]: { score: 0, ready: false, answered: false, avatar: selectedAvatar },
      },
      status: "waiting",
      category,
      questionCount,
      currentQ: 0,
    });
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerAvatar", selectedAvatar);
    router.push(`/room/${code}`);
  };

  const joinRoom = async () => {
    if (!name.trim()) return alert("Enter your name!");
    if (!roomCode.trim()) return alert("Enter room code!");
    setLoading(true);
    const code = roomCode.toUpperCase();
    const snap = await get(ref(db, `rooms/${code}`));
    if (!snap.exists()) {
      alert("Room not found! Check the code.");
      setLoading(false);
      return;
    }
    const data = snap.val();
    const playerCount = Object.keys(data.players || {}).length;
    if (playerCount >= 5) {
      alert("Room is full! Max 5 players.");
      setLoading(false);
      return;
    }
    if (data.status === "started" || data.status === "finished") {
      alert("Game already started!");
      setLoading(false);
      return;
    }
    await set(ref(db, `rooms/${code}/players/${name}`), {
      score: 0,
      ready: false,
      answered: false,
      avatar: selectedAvatar,
    });
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerAvatar", selectedAvatar);
    router.push(`/room/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#050508" }}>
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(250,204,21,0.06)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black">
            Room<span style={{ color: "#facc15", textShadow: "0 0 20px rgba(250,204,21,0.6)" }}>IQ</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Multiplayer Quiz — Up to 5 Players</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 border space-y-5" style={{
          background: "rgba(10,10,15,0.95)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}>

          {/* Avatar Picker */}
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Choose Your Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className="text-2xl rounded-xl py-2 transition-all hover:scale-110"
                  style={{
                    background: selectedAvatar === a ? "rgba(250,204,21,0.2)" : "rgba(255,255,255,0.05)",
                    border: selectedAvatar === a ? "2px solid rgba(250,204,21,0.6)" : "2px solid transparent",
                    boxShadow: selectedAvatar === a ? "0 0 12px rgba(250,204,21,0.3)" : "none"
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />

          {/* Tab Switcher */}
          <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setTab("create")}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: tab === "create" ? "rgba(250,204,21,0.15)" : "transparent",
                color: tab === "create" ? "#facc15" : "#6b7280",
                borderRight: "1px solid rgba(255,255,255,0.06)"
              }}
            >
              🏠 Create Room
            </button>
            <button
              onClick={() => setTab("join")}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: tab === "join" ? "rgba(250,204,21,0.15)" : "transparent",
                color: tab === "join" ? "#facc15" : "#6b7280",
              }}
            >
              🚪 Join Room
            </button>
          </div>

          {/* Create Tab */}
          {tab === "create" && (
            <div className="space-y-4">
              {/* Category */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Category</p>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className="rounded-xl py-2 text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: category === c.id ? "rgba(250,204,21,0.2)" : "rgba(255,255,255,0.05)",
                        border: category === c.id ? "1px solid rgba(250,204,21,0.5)" : "1px solid rgba(255,255,255,0.06)",
                        color: category === c.id ? "#facc15" : "#9ca3af",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Questions: <span style={{ color: "#facc15" }}>{questionCount}</span>
                </p>
                <div className="flex gap-2">
                  {[10, 15, 30, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className="flex-1 rounded-xl py-2 text-sm font-bold transition-all hover:scale-105"
                      style={{
                        background: questionCount === n ? "rgba(250,204,21,0.2)" : "rgba(255,255,255,0.05)",
                        border: questionCount === n ? "1px solid rgba(250,204,21,0.5)" : "1px solid rgba(255,255,255,0.06)",
                        color: questionCount === n ? "#facc15" : "#9ca3af",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={createRoom}
                disabled={loading}
                className="w-full font-black py-3.5 rounded-2xl text-base transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #facc15, #f59e0b)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 20px rgba(250,204,21,0.3)"
                }}
              >
                {loading ? "Creating..." : `${selectedAvatar} Create Room`}
              </button>
            </div>
          )}

          {/* Join Tab */}
          {tab === "join" && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Room Code</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit code (e.g. ABC123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full rounded-xl px-4 py-3 text-white outline-none text-center text-2xl font-black tracking-widest transition-all uppercase"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#facc15"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <button
                onClick={joinRoom}
                disabled={loading}
                className="w-full font-black py-3.5 rounded-2xl text-base transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white"
                }}
              >
                {loading ? "Joining..." : `${selectedAvatar} Join Room`}
              </button>
            </div>
          )}
        </div>

        {/* Back link */}
        <p className="text-center mt-4 text-gray-600 text-xs">
          <a href="/" className="hover:text-gray-400 transition">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}