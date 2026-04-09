"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT SIDE */}
          <div>
            <h3 className="text-2xl font-black tracking-wide">
              Room<span className="text-yellow-400">IQ</span>
            </h3>

            <p className="text-gray-400 text-sm mt-3 max-w-md leading-relaxed">
              Real-time multiplayer quiz platform where players compete,
              improve knowledge, and track their performance instantly.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col md:items-end gap-4">

            <div className="flex gap-6 text-gray-400 text-sm flex-wrap">
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#how-to-play" className="hover:text-white transition">
                How to Play
              </a>
              <a href="#preview" className="hover:text-white transition">
                Preview
              </a>
              <Link href="/play" className="hover:text-yellow-400 transition">
                Play
              </Link>
            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500 text-sm">

          <p>
            © {new Date().getFullYear()} RoomIQ. All rights reserved.
          </p>

          <p>
            Made with ❤️ by BCA Students
          </p>

        </div>

      </div>
    </footer>
  );
}