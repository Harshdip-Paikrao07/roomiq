"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Quiz/Room pages pe navbar simple rakho
  const isGamePage =
    pathname.includes("/quiz/") ||
    pathname.includes("/room/") ||
    pathname.includes("/result/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isGamePage) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/">
          <h1 className="text-xl font-black">
            Room<span className="text-yellow-400">IQ</span>
          </h1>
        </Link>
        <Link
          href="/play"
          className="bg-yellow-400 text-gray-950 font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-300 transition"
        >
          New Game
        </Link>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/95 backdrop-blur border-b border-gray-800 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-black text-white">
            Room<span className="text-yellow-400">IQ</span>
          </h1>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition text-sm">
            Features
          </a>
          <a href="#how-to-play" className="text-gray-400 hover:text-white transition text-sm">
            How to Play
          </a>
          <a href="#preview" className="text-gray-400 hover:text-white transition text-sm">
            Preview
          </a>
          <Link
            href="/play"
            className="bg-yellow-400 text-gray-950 font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 transition text-sm"
          >
            Play Now →
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-4">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">
            Features
          </a>
          <a href="#how-to-play" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">
            How to Play
          </a>
          <a href="#preview" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">
            Preview
          </a>
          <Link href="/play" className="bg-yellow-400 text-gray-950 font-bold px-5 py-2 rounded-xl text-center">
            Play Now →
          </Link>
        </div>
      )}
    </nav>
  );
}