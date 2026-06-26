import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Mode biasa warna putih saja dengan elegan dan cantik di pandang
export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const { darkMode } = useTheme();

  return (
    <div className="relative min-h-screen flex transition-all duration-300 overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {darkMode ? (
          // DARK MODE: Aurora/gradient cantik
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#23194a] to-[#11192a] transition-colors duration-700" />
            <div
              className="absolute w-[38rem] h-[38rem] left-[-8rem] top-[-8rem] rounded-full opacity-40 blur-[100px] bg-gradient-conic from-fuchsia-700 via-indigo-800 to-blue-900 animate-blobAurora1"
              style={{ animationDuration: "23s" }}
            />
            <div
              className="absolute w-[30rem] h-[32rem] right-[-12rem] top-[5rem] rounded-full opacity-50 blur-[100px] bg-gradient-to-bl from-cyan-900 via-blue-950 to-indigo-900 animate-blobAurora2"
              style={{ animationDuration: "27s" }}
            />
            <div
              className="absolute w-[26rem] h-[22rem] left-1/2 bottom-10 -translate-x-1/2 rounded-full opacity-30 blur-[110px] bg-gradient-to-tr from-pink-700 via-fuchsia-800 to-cyan-800 animate-blobAurora3"
              style={{ animationDuration: "34s" }}
            />
            <div className="absolute left-12 top-[40%] w-2 h-[370px] bg-gradient-to-b from-blue-400/50 via-fuchsia-400/30 to-transparent rounded-full blur-[7px] rotate-[12deg]" />
            <div className="absolute right-8 bottom-24 w-2 h-[300px] bg-gradient-to-t from-pink-500/40 via-sky-300/20 to-transparent rounded-full blur-[5px] -rotate-12" />
            <div className="absolute inset-0 pointer-events-none">
              <svg width="100%" height="100%">
                <circle cx="18%" cy="11%" r="1.1" fill="#fff" fillOpacity="0.12" />
                <circle cx="79%" cy="23%" r="0.9" fill="#fff" fillOpacity="0.11" />
                <circle cx="52%" cy="61%" r="1.4" fill="#fff" fillOpacity="0.20" />
                <circle cx="67%" cy="87%" r="1.2" fill="#fff" fillOpacity="0.16" />
                <circle cx="32%" cy="72%" r="0.7" fill="#fff" fillOpacity="0.19" />
                <circle cx="91%" cy="44%" r="0.8" fill="#fff" fillOpacity="0.13" />
                <circle cx="43%" cy="39%" r="1.6" fill="#fff" fillOpacity="0.11" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-slate-950/70 mix-blend-multiply pointer-events-none" />
          </>
        ) : (
          // LIGHT MODE: BG putih elegan, subtle shadow, lembut & cantik
          <div className="absolute inset-0 bg-white transition-colors duration-700" />
        )}
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Animated background keyframes (untuk dark mode saja) */}
      <style>
        {`
          @keyframes blobAurora1 {
            0%,100% { transform: translate(0,0) scale(1);}
            33% { transform: translate(30px, 45px) scale(1.09);}
            69% { transform: translate(-24px, -15px) scale(0.98);}
          }
          @keyframes blobAurora2 {
            0%,100% { transform: translate(0,0) scale(1);}
            28% { transform: translate(-20px, 26px) scale(0.92);}
            76% { transform: translate(22px, -10px) scale(1.12);}
          }
          @keyframes blobAurora3 {
            0%,100% { transform: translate(0,0) scale(1);}
            19% { transform: translate(14px, 16px) scale(1.08);}
            57% { transform: translate(-18px, -11px) scale(1.02);}
          }
          .animate-blobAurora1 { animation: blobAurora1 23s ease-in-out infinite alternate; }
          .animate-blobAurora2 { animation: blobAurora2 27s ease-in-out infinite alternate; }
          .animate-blobAurora3 { animation: blobAurora3 34s ease-in-out infinite alternate; }
        `}
      </style>
    </div>
  );
}

