"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const AVATARS = ["🦊","🐯","🦁","🐻","🦄","🐺","🦅","🐉","👾","🤖"];
const CATEGORIES = [
  { icon: "🌍", name: "General Knowledge", color: "#facc15", players: "2.1k" },
  { icon: "🎬", name: "Entertainment", color: "#a855f7", players: "1.8k" },
  { icon: "⚽", name: "Sports", color: "#22c55e", players: "1.5k" },
  { icon: "🔬", name: "Science", color: "#06b6d4", players: "980" },
  { icon: "💻", name: "Coding", color: "#f97316", players: "1.2k" },
  { icon: "🤖", name: "AI & Tech", color: "#ef4444", players: "2.4k" },
];

const LEADERBOARD = [
  { rank: 1, avatar: "🐉", name: "DragonMaster", score: 450, badge: "🏆" },
  { rank: 2, avatar: "🦄", name: "UnicornPro", score: 380, badge: "🥈" },
  { rank: 3, avatar: "🦊", name: "FoxGaming", score: 320, badge: "🥉" },
  { rank: 4, avatar: "🐯", name: "TigerQuiz", score: 280, badge: "" },
  { rank: 5, avatar: "👾", name: "AlienBrain", score: 240, badge: "" },
];

export default function LandingPage() {
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [counts, setCounts] = useState({ players: 0, questions: 0, categories: 0, rooms: 0 });
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveAvatar(p => (p + 1) % AVATARS.length), 600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveCategory(p => (p + 1) % CATEGORIES.length), 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const targets = { players: 5, questions: 1000, categories: 6, rooms: 50 };
    let step = 0;
    const t = setInterval(() => {
      step++;
      const p = Math.min(step / 60, 1);
      setCounts({
        players: Math.round(targets.players * p),
        questions: Math.round(targets.questions * p),
        categories: Math.round(targets.categories * p),
        rooms: Math.round(targets.rooms * p),
      });
      if (step >= 60) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="text-white overflow-x-hidden" style={{ background: "#050508" }}>

      {/* ══════════════════════════════════
           HERO SECTION
      ══════════════════════════════════ */}
      <section className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">

        {/* BG Image with parallax */}
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <Image
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
            alt="Gaming"
            fill
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.75) 50%, rgba(5,5,8,0.95) 100%)"
          }} />
        </div>

        {/* Neon scan lines */}
        <div className="absolute inset-0 z-1 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(250,204,21,0.03) 2px, rgba(250,204,21,0.03) 4px)",
        }} />

        {/* Grid */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(250,204,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

        {/* Glow orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30" style={{ background: "rgba(250,204,21,0.2)" }} />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20" style={{ background: "rgba(168,85,247,0.3)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10" style={{ background: "rgba(250,204,21,0.4)" }} />

        {/* Floating LEFT card */}
        <div className="absolute left-4 sm:left-12 top-1/3 z-20 hidden md:block animate-bounce" style={{ animationDuration: "3s" }}>
          <div className="rounded-2xl p-4 border text-left w-40" style={{
            background: "rgba(15,15,20,0.9)",
            borderColor: "rgba(250,204,21,0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(250,204,21,0.15)"
          }}>
            <p className="text-xs text-gray-400 mb-1">🏆 Top Score</p>
            <p className="text-2xl font-black text-yellow-400">450</p>
            <p className="text-xs text-gray-500 mt-1">🐉 DragonMaster</p>
            <div className="mt-2 h-1 rounded-full" style={{ background: "rgba(250,204,21,0.2)" }}>
              <div className="h-1 rounded-full bg-yellow-400" style={{ width: "90%" }} />
            </div>
          </div>
        </div>

        {/* Floating RIGHT card */}
        <div className="absolute right-4 sm:right-12 top-1/3 z-20 hidden md:block animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
          <div className="rounded-2xl p-4 border text-left w-40" style={{
            background: "rgba(15,15,20,0.9)",
            borderColor: "rgba(239,68,68,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(239,68,68,0.15)"
          }}>
            <p className="text-xs text-red-400 font-black mb-1">⚡ STEAL!</p>
            <p className="text-xl font-black text-white">-5 pts</p>
            <p className="text-xs text-gray-400 mt-1">🐯 Rahul → 🦊 You</p>
            <p className="text-xs text-green-400 font-bold mt-1">+5 pts stolen!</p>
          </div>
        </div>

        {/* Floating BOTTOM LEFT card */}
        <div className="absolute left-4 sm:left-16 bottom-24 z-20 hidden lg:block" style={{ animation: "bounce 5s infinite", animationDelay: "2s" }}>
          <div className="rounded-2xl p-3 border w-36" style={{
            background: "rgba(15,15,20,0.9)",
            borderColor: "rgba(168,85,247,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(168,85,247,0.15)"
          }}>
            <p className="text-xs text-purple-400 mb-2">👥 Room Active</p>
            <div className="flex -space-x-1">
              {["🦊","🐯","🦁","🐻"].map(a => (
                <span key={a} className="text-lg">{a}</span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">4/5 players</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 border rounded-full px-3 sm:px-4 py-1.5 mb-6 text-xs sm:text-sm font-semibold" style={{
            borderColor: "rgba(250,204,21,0.5)",
            color: "#facc15",
            background: "rgba(250,204,21,0.08)",
            backdropFilter: "blur(10px)"
          }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Real-time Multiplayer Quiz Battle • Up to 5 Players
          </div>

          <div className="text-4xl sm:text-5xl mb-3 transition-all duration-300 drop-shadow-2xl">
            {AVATARS[activeAvatar]}
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 leading-none" style={{
            textShadow: "0 0 40px rgba(250,204,21,0.5), 0 0 80px rgba(250,204,21,0.2)",
          }}>
            Room<span style={{
              color: "#facc15",
              textShadow: "0 0 40px rgba(250,204,21,1), 0 0 80px rgba(250,204,21,0.5)"
            }}>IQ</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-xl mx-auto mb-3 leading-relaxed">
            Challenge your friends in <span className="text-yellow-400 font-bold">real-time quiz battles</span>. Create a room, share the code, and let the battle begin.
          </p>

          <div className="inline-flex items-center gap-2 font-bold mb-8 text-sm sm:text-base px-4 py-2 rounded-full" style={{
            color: "#c084fc",
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.3)"
          }}>
            ⚡ Steal points from opponents — the ultimate twist!
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/play"
              className="font-black px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg transition-all hover:scale-105 transform"
              style={{
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#0a0a0a",
                boxShadow: "0 0 30px rgba(250,204,21,0.5), 0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              🚀 Start Playing Free
            </Link>
            <a href="#how-to-play"
              className="font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg hover:scale-105 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)"
              }}
            >
              How it Works →
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {[
              { val: counts.players, suffix: "", label: "Max Players" },
              { val: counts.questions, suffix: "+", label: "Questions" },
              { val: counts.categories, suffix: "", label: "Categories" },
              { val: counts.rooms, suffix: "+", label: "Rooms Created" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl py-3 px-2 text-center" style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)"
              }}>
                <p className="text-xl sm:text-2xl font-black text-yellow-400">{s.val}{s.suffix}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
           LIVE GAME PREVIEW CARDS
      ══════════════════════════════════ */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, rgba(250,204,21,0.04) 0%, transparent 70%)"
        }} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Live Action</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">See The Game In Action</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Card 1 — Quiz Screen */}
            <div className="rounded-3xl overflow-hidden border relative group hover:scale-105 transition-all duration-300" style={{
              background: "rgba(10,10,15,0.95)",
              borderColor: "rgba(250,204,21,0.2)",
              boxShadow: "0 0 40px rgba(250,204,21,0.05)"
            }}>
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80" alt="Quiz" fill className="object-cover group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,8,0.3), rgba(5,5,8,0.9))" }} />
                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-950 text-xs font-black px-2 py-1 rounded-lg">⚡ LIVE</div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-400 font-black text-sm" style={{ background: "rgba(5,5,8,0.8)" }}>7</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-2">🎮 Quiz Screen</p>
                <p className="text-sm font-bold mb-3">Which is the indian National Animal ?</p>
                <div className="space-y-1.5">
                  {["Lion", "Tiger ✓", "Elephant", "Leopard"].map((o, i) => (
                    <div key={o} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${i === 1 ? "bg-green-600 text-white" : "text-gray-400"}`}
                      style={i !== 1 ? { background: "rgba(255,255,255,0.05)" } : {}}>
                      {["A","B","C","D"][i]}. {o}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — Leaderboard */}
            <div className="rounded-3xl overflow-hidden border relative group hover:scale-105 transition-all duration-300" style={{
              background: "rgba(10,10,15,0.95)",
              borderColor: "rgba(168,85,247,0.2)",
              boxShadow: "0 0 40px rgba(168,85,247,0.05)"
            }}>
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80" alt="Leaderboard" fill className="object-cover group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,8,0.3), rgba(5,5,8,0.9))" }} />
                <div className="absolute top-3 left-3 text-xs font-black px-2 py-1 rounded-lg" style={{ background: "rgba(168,85,247,0.8)", color: "white" }}>🏆 SCORES</div>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#a855f7" }}>📊 Live Leaderboard</p>
                <div className="space-y-2">
                  {LEADERBOARD.slice(0, 4).map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-lg px-3 py-1.5" style={{
                      background: p.rank === 1 ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.04)"
                    }}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.avatar}</span>
                        <span className="text-xs font-semibold truncate max-w-[80px]">{p.name}</span>
                        {p.badge && <span className="text-xs">{p.badge}</span>}
                      </div>
                      <span className="text-yellow-400 font-black text-sm">{p.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 — Steal Feature */}
            <div className="rounded-3xl overflow-hidden border relative group hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1" style={{
              background: "rgba(10,10,15,0.95)",
              borderColor: "rgba(239,68,68,0.2)",
              boxShadow: "0 0 40px rgba(239,68,68,0.05)"
            }}>
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80" alt="Steal" fill className="object-cover group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,8,0.3), rgba(5,5,8,0.9))" }} />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg animate-pulse">⚡ STEAL!</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-2">🔥 Steal Window</p>
                <p className="text-sm text-gray-300 mb-3">Answer correctly to unlock a 2-second steal window!</p>
                <div className="space-y-2">
                  {[["🐯 Rahul", 80], ["🦁 Priya", 60], ["🐻 Raj", 40]].map(([name, score]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg px-3 py-2 border cursor-pointer hover:border-red-400 transition-all" style={{
                      background: "rgba(239,68,68,0.08)",
                      borderColor: "rgba(239,68,68,0.2)"
                    }}>
                      <span className="text-xs font-semibold">{name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-black text-xs">{score} pts</span>
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">Steal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
           FEATURES
      ══════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-2">Why RoomIQ?</h2>
          </div>

          {/* Big feature — image left, text right */}
          <div className="rounded-3xl overflow-hidden border mb-6 grid grid-cols-1 md:grid-cols-2" style={{
            borderColor: "rgba(250,204,21,0.2)",
            background: "rgba(10,10,15,0.8)"
          }}>
            <div className="relative h-48 sm:h-56 md:h-auto">
              <Image src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" alt="Feature" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, rgba(10,10,15,0.5))" }} />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">⭐ Signature Feature</span>
              <h3 className="text-2xl sm:text-3xl font-black mb-3">The Steal Mechanic</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Answer a question correctly and a <span className="text-red-400 font-bold">2-second Steal Window</span> opens! Quickly steal 5 points from any opponent. One right answer can flip the entire scoreboard!</p>
              <div className="mt-4 flex gap-3">
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}>
                  <p className="text-yellow-400 font-black">+10</p>
                  <p className="text-xs text-gray-500">Correct</p>
                </div>
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-red-400 font-black">-2</p>
                  <p className="text-xs text-gray-500">Wrong</p>
                </div>
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                  <p className="font-black" style={{ color: "#a855f7" }}>±5</p>
                  <p className="text-xs text-gray-500">Steal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏠", title: "Private Rooms", desc: "6-digit code. Share with friends. Up to 5 players.", color: "#a855f7", img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80" },
              { icon: "⏱️", title: "10-Sec Timer", desc: "Race against the clock every single question!", color: "#ef4444", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" },
              { icon: "🎭", title: "Avatar System", desc: "Pick your emoji fighter before entering battle!", color: "#f97316", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
              { icon: "📊", title: "Live Scoreboard", desc: "Real-time scores update after every answer.", color: "#22c55e", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
              { icon: "💬", title: "Lobby Chat", desc: "Trash talk before the game even starts!", color: "#06b6d4", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80" },
              { icon: "🏆", title: "Winner Podium", desc: "Epic winner screen with full leaderboard!", color: "#facc15", img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80" },
            ].map((f) => (
              <div key={f.title}
                className="rounded-2xl overflow-hidden border group hover:scale-105 transition-all duration-300 cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(10,10,15,0.8)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = f.color + "50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              >
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-110 transition-all duration-500 opacity-60" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, rgba(10,10,15,0.9))` }} />
                  <span className="absolute bottom-3 left-4 text-2xl">{f.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-base mb-1" style={{ color: f.color }}>{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
           HOW TO PLAY
      ══════════════════════════════════ */}
      <section id="how-to-play" className="py-16 sm:py-20 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">How to Play</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-2">Battle in 4 Steps</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { step: "01", icon: "✍️", title: "Pick Avatar & Name", desc: "Choose your emoji fighter and enter your name. No signup, no password — just jump in!", color: "#facc15" },
              { step: "02", icon: "🏠", title: "Create or Join Room", desc: "Host picks category + question count and gets a 6-digit code. Friends join with the code.", color: "#a855f7" },
              { step: "03", icon: "✅", title: "Get Ready!", desc: "Everyone hits Ready. Chat in the lobby. When all ready — host launches the quiz!", color: "#22c55e" },
              { step: "04", icon: "⚡", title: "Answer, Steal & Win!", desc: "10 seconds per question. Correct = +10, Wrong = -2. Answer correctly → Steal Window opens → steal 5 pts from anyone!", color: "#ef4444" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 items-start rounded-2xl p-4 sm:p-5 border hover:border-yellow-400/20 transition-all" style={{
                background: "rgba(10,10,15,0.6)",
                borderColor: "rgba(255,255,255,0.06)"
              }}>
                <div className="text-3xl flex-shrink-0">{s.icon}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-xs px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.color + "20" }}>STEP {s.step}</span>
                    <h3 className="text-base sm:text-lg font-black">{s.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
           CATEGORIES
      ══════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Categories</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-2">Pick Your Battleground</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {CATEGORIES.map((c, i) => (
              <div key={c.name}
                className={`rounded-2xl p-4 sm:p-5 border cursor-default transition-all duration-300 hover:scale-105 ${activeCategory === i ? "scale-105" : ""}`}
                style={{
                  background: activeCategory === i ? c.color + "15" : "rgba(10,10,15,0.8)",
                  borderColor: activeCategory === i ? c.color + "60" : "rgba(255,255,255,0.07)",
                  boxShadow: activeCategory === i ? `0 0 30px ${c.color}20` : "none"
                }}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{c.icon}</div>
                <h3 className="font-black text-sm sm:text-base mb-1" style={{ color: c.color }}>{c.name}</h3>
                <p className="text-gray-500 text-xs">{c.players} players</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
           CTA FINAL
      ══════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80" alt="CTA" fill className="object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,8,0.9), rgba(5,5,8,0.95))" }} />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="text-5xl sm:text-7xl mb-4">🏆</div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4">Ready to Battle?</h2>
          <p className="text-gray-400 text-sm sm:text-lg mb-8">No signup. No download. Just open and play!</p>
          <Link href="/play"
            className="inline-block font-black px-8 sm:px-12 py-4 rounded-2xl text-lg sm:text-xl transition-all hover:scale-110 transform"
            style={{
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0a",
              boxShadow: "0 0 50px rgba(250,204,21,0.5)"
            }}
          >
            🚀 Play RoomIQ Free
          </Link>
        </div>
      </section>

    </div>
  );
}