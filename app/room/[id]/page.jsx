"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue, update, push, get } from "firebase/database";

export default function RoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState("🎮");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem("playerName") || "";
    const avatar = localStorage.getItem("playerAvatar") || "🎮";
    setPlayerName(name);
    setPlayerAvatar(avatar);

    const roomRef = ref(db, `rooms/${id}`);
    const unsub = onValue(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setRoom(data);
        if (data.status === "started") router.push(`/quiz/${id}`);
      }
    });

    const chatRef = ref(db, `rooms/${id}/chat`);
    const chatUnsub = onValue(chatRef, (snap) => {
      if (snap.exists()) {
        const msgs = Object.values(snap.val());
        setMessages(msgs);
      }
    });

    return () => { unsub(); chatUnsub(); };
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const setReady = async () => {
    const name = localStorage.getItem("playerName") || "";
    await update(ref(db, `rooms/${id}/players/${name}`), { ready: true });
  };

  const startQuiz = async () => {
    await update(ref(db, `rooms/${id}`), { status: "started", currentQ: 0 });
  };

  const sendMessage = async () => {
    if (!chatMsg.trim()) return;
    const name = localStorage.getItem("playerName") || "";
    const avatar = localStorage.getItem("playerAvatar") || "🎮";
    await push(ref(db, `rooms/${id}/chat`), {
      sender: name,
      avatar,
      text: chatMsg.trim(),
      time: Date.now(),
    });
    setChatMsg("");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050508" }}>
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const players = Object.entries(room.players || {});
  const allReady = players.length >= 2 && players.every(([, p]) => p.ready);
  const isHost = room.host === playerName;
  const myReady = room.players?.[playerName]?.ready;

  return (
    <div className="min-h-screen text-white" style={{ background: "#050508" }}>
      <div className="max-w-2xl mx-auto p-4 pb-8">

        {/* Header */}
        <div className="text-center mt-4 mb-6">
          <h1 className="text-3xl font-black">
            Room<span style={{ color: "#facc15" }}>IQ</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Lobby — waiting for players</p>
        </div>

        {/* Room Code Card */}
        <div className="rounded-2xl p-5 text-center mb-4 border" style={{
          background: "rgba(250,204,21,0.06)",
          borderColor: "rgba(250,204,21,0.2)"
        }}>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Room Code</p>
          <p className="text-5xl font-black tracking-widest mb-3" style={{ color: "#facc15" }}>{id}</p>
          <button
            onClick={copyCode}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: copied ? "#22c55e" : "#9ca3af"
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </button>
          <p className="text-gray-600 text-xs mt-2">Share this code with your friends</p>
        </div>

        {/* Room Info */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-gray-500">Category</p>
            <p className="font-black text-sm text-yellow-400 mt-1 capitalize">{room.category || "GK"}</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-gray-500">Questions</p>
            <p className="font-black text-sm text-yellow-400 mt-1">{room.questionCount || 15}</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-gray-500">Players</p>
            <p className="font-black text-sm text-yellow-400 mt-1">{players.length}/5</p>
          </div>
        </div>

        {/* Players List */}
        <div className="rounded-2xl p-4 mb-4 border" style={{ background: "rgba(10,10,15,0.8)", borderColor: "rgba(255,255,255,0.06)" }}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Players</h3>
          <div className="space-y-2">
            {players.map(([name, p]) => (
              <div key={name}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{
                  background: name === playerName ? "rgba(250,204,21,0.1)" : "rgba(255,255,255,0.04)",
                  border: name === playerName ? "1px solid rgba(250,204,21,0.2)" : "1px solid transparent"
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar || "🎮"}</span>
                  <div>
                    <p className="font-bold text-sm">
                      {name}
                      {room.host === name && <span className="ml-2 text-xs text-yellow-400">👑 Host</span>}
                      {name === playerName && <span className="ml-1 text-xs text-gray-500">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-600">Score: {p.score}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${p.ready ? "text-green-400" : "text-gray-600"}`}>
                  {p.ready ? "✅ Ready" : "⏳ Waiting"}
                </span>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 2 - players.length) }).map((_, i) => (
              <div key={i} className="rounded-xl px-4 py-3 border border-dashed" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-gray-700 text-sm text-center">Waiting for player...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="rounded-2xl mb-4 border overflow-hidden" style={{ background: "rgba(10,10,15,0.8)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">💬 Lobby Chat</h3>
          </div>
          <div className="h-36 overflow-y-auto px-4 py-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-gray-700 text-xs text-center mt-4">No messages yet. Say something! 👋</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 items-start ${m.sender === playerName ? "flex-row-reverse" : ""}`}>
                <span className="text-lg flex-shrink-0">{m.avatar || "🎮"}</span>
                <div className={`rounded-xl px-3 py-1.5 max-w-[70%] ${m.sender === playerName ? "text-right" : ""}`}
                  style={{
                    background: m.sender === playerName ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.06)",
                    border: m.sender === playerName ? "1px solid rgba(250,204,21,0.2)" : "1px solid rgba(255,255,255,0.06)"
                  }}>
                  <p className="text-xs font-bold" style={{ color: m.sender === playerName ? "#facc15" : "#9ca3af" }}>{m.sender}</p>
                  <p className="text-sm text-white">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 pb-3 pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              maxLength={80}
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button
              onClick={sendMessage}
              className="px-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: "rgba(250,204,21,0.15)", color: "#facc15", border: "1px solid rgba(250,204,21,0.2)" }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {!myReady && (
          <button
            onClick={setReady}
            className="w-full font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 mb-3"
            style={{
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0a",
              boxShadow: "0 0 20px rgba(250,204,21,0.3)"
            }}
          >
            ✅ I'm Ready!
          </button>
        )}

        {myReady && !allReady && (
          <div className="text-center py-3 rounded-2xl mb-3" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <p className="text-green-400 font-bold text-sm">✅ You're ready! Waiting for others...</p>
          </div>
        )}

        {allReady && isHost && (
          <button
            onClick={startQuiz}
            className="w-full font-black py-4 rounded-2xl text-lg transition-all hover:scale-105 animate-pulse"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              boxShadow: "0 0 30px rgba(34,197,94,0.4)"
            }}
          >
            🚀 Start Quiz!
          </button>
        )}

        {allReady && !isHost && (
          <div className="text-center py-3 rounded-2xl" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)" }}>
            <p className="text-yellow-400 font-bold text-sm">⏳ Waiting for host to start...</p>
          </div>
        )}

        {!allReady && players.length < 2 && (
          <p className="text-center text-gray-600 text-xs mt-2">Need at least 2 players to start</p>
        )}
      </div>
    </div>
  );
}