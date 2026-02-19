"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Lock,
  Bug,
  Binary,
  Search,
  Shield,
  Target,
  Calendar,
  ArrowRight,
  Github,
  ChevronRight,
  Flag,
  Clock,
  MapPin,
  Terminal,
  ExternalLink,
  Code,
  ShieldCheck,
  Linkedin,
  Sparkles,
} from "lucide-react";

/* ══════════════════════════════════════════════
   UTILITY COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Scroll-triggered reveal (motion.dev scroll-triggered style) ── */
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : `opacity-0 ${transforms[direction]} scale-[0.97]`
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated border trail card (animata.design inspired) ── */
function TrailCard({ children, className = "", duration = "6s" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-px ${className}`}>
      <div
        className="absolute inset-0 animate-trail"
        style={{
          "--duration": duration,
          background: "conic-gradient(from var(--angle, 0deg) at 50% 50%, transparent 85%, #a855f7)",
        }}
      />
      <div className="relative h-full w-full rounded-[15px] bg-[#0f0f13] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ── Matrix code rain (minimal, purple-only) ── */
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const chars = "01アウエオFLAG{}CTFpwnhash$>_";
    const fontSize = 14;
    let columns, drops;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.fillStyle = "rgba(9, 9, 11, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = (Math.random() * 0.15 + 0.05).toFixed(2);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}

/* ── Countdown timer ── */
function CountdownTimer() {
  const target = new Date("2026-02-27T10:00:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", val: timeLeft.d },
    { label: "Hours", val: timeLeft.h },
    { label: "Mins", val: timeLeft.m },
    { label: "Secs", val: timeLeft.s },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-purple-500/20 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center overflow-hidden group">
              {/* subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
              <span className="relative text-2xl sm:text-3xl font-mono font-black text-purple-400 tabular-nums">
                {String(u.val).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 mt-1.5 font-medium">
              {u.label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-lg font-bold text-purple-500/40 animate-pulse mb-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Typing terminal ── */
const terminalLines = [
  "$ nmap -sV 10.0.0.1",
  "$ sqlmap -u 'target.com/login?id=1'",
  "$ cat flag.txt",
  "4DV1TY426{w3lc0me_t0_cyb3r_c4rn1v4l}",
  "$ python3 exploit.py --payload rev_shell",
  "$ hashcat -m 0 hash.txt rockyou.txt",
  "[+] Flag submitted successfully!",
];

function TypingTerminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayLines, setDisplayLines] = useState([]);

  useEffect(() => {
    if (lineIdx >= terminalLines.length) {
      const t = setTimeout(() => { setDisplayLines([]); setLineIdx(0); setCharIdx(0); }, 3000);
      return () => clearTimeout(t);
    }
    const line = terminalLines[lineIdx];
    if (charIdx < line.length) {
      const speed = line.startsWith("CTF{") ? 60 : 35;
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setDisplayLines((p) => [...p, line]); setLineIdx((l) => l + 1); setCharIdx(0); }, 500);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const currentLine = lineIdx < terminalLines.length ? terminalLines[lineIdx] : "";
  const typingText = currentLine.slice(0, charIdx);

  const lineColor = (l) =>
    l.startsWith("4DV1TY426{") ? "text-purple-400 font-bold" :
      l.startsWith("[") ? "text-purple-300/70" : "text-gray-500";

  return (
    <TrailCard className="max-w-lg mx-auto" duration="8s">
      <div className="text-left">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.01]">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
          <span className="ml-2 text-[11px] text-gray-600 font-mono flex items-center gap-1.5">
            <Terminal className="w-3 h-3" /> cyber-carnival ~ /ctf
          </span>
        </div>
        {/* output */}
        <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed h-[180px] overflow-hidden">
          {displayLines.map((line, i) => (
            <div key={i} className={lineColor(line)}>{line}</div>
          ))}
          {lineIdx < terminalLines.length && (
            <div className={lineColor(currentLine)}>
              {typingText}
              <span className="inline-block w-2 h-4 bg-purple-500 ml-0.5 animate-pulse rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </TrailCard>
  );
}

/* ── 3D Tilt Card (motion.dev hover style) ── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  }, []);

  return (
    <div ref={ref} className={`transition-transform duration-200 ease-out ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

/* ── Custom cursor (crosshair dot + trailing ring) ── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    // Check for touch device
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => { hovering.current = true; ringRef.current?.classList.add("hovering"); };
    const onLeave = () => { hovering.current = false; ringRef.current?.classList.remove("hovering"); };

    const animate = () => {
      const dx = mouse.current.x - ring.current.x;
      const dy = mouse.current.y - ring.current.y;
      ring.current.x += dx * 0.15;
      ring.current.y += dy * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const size = hovering.current ? 50 : 36;
        ringRef.current.style.transform = `translate(${ring.current.x - size / 2}px, ${ring.current.y - size / 2}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ── Slice-to-reveal intro (pirate slash) ── */
function SliceIntro({ onComplete }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);        // 0..1
  const [isDragging, setIsDragging] = useState(false);
  const [done, setDone] = useState(false);
  const [sparks, setSparks] = useState([]);
  const startY = useRef(0);
  const sparkId = useRef(0);

  const threshold = 180; // px drag to complete

  const spawnSparks = useCallback((y) => {
    const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    const newSparks = Array.from({ length: 6 }, () => {
      sparkId.current += 1;
      return {
        id: sparkId.current,
        x: cx + (Math.random() - 0.5) * 30,
        y: y,
        sx: `${(Math.random() - 0.5) * 120}px`,
        sy: `${(Math.random() - 0.5) * 120}px`,
      };
    });
    setSparks((prev) => [...prev.slice(-30), ...newSparks]);
  }, []);

  const handleStart = useCallback((clientY) => {
    setIsDragging(true);
    startY.current = clientY;
  }, []);

  const handleMove = useCallback((clientY) => {
    if (!isDragging || done) return;
    const dist = Math.abs(clientY - startY.current);
    const p = Math.min(1, dist / threshold);
    setProgress(p);
    if (dist % 12 < 4) spawnSparks(clientY);
    if (p >= 1) {
      setDone(true);
      setTimeout(() => onComplete(), 700);
    }
  }, [isDragging, done, onComplete, spawnSparks]);

  const handleEnd = useCallback(() => {
    if (!done && progress < 1) {
      setIsDragging(false);
      setProgress(0);
    }
  }, [done, progress]);

  // Mouse events
  const onMouseDown = (e) => handleStart(e.clientY);
  const onMouseMove = (e) => handleMove(e.clientY);
  const onMouseUp = () => handleEnd();

  // Touch events
  const onTouchStart = (e) => handleStart(e.touches[0].clientY);
  const onTouchMove = (e) => handleMove(e.touches[0].clientY);
  const onTouchEnd = () => handleEnd();

  const splitOffset = done ? 100 : progress * 12;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        pointerEvents: done ? "none" : "auto",
        opacity: done ? 0 : 1,
        transition: done ? "opacity 0.6s ease" : "none",
      }}
    >
      {/* Left half */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-[#09090b] flex items-center justify-end overflow-hidden"
        style={{
          transform: `translateX(-${splitOffset}%)`,
          transition: done ? "transform 0.7s cubic-bezier(0.65,0,0.35,1)" : "transform 0.05s ease-out",
        }}
      >
        <div className="text-right pr-8 sm:pr-16">
          <pre className="text-purple-500/40 text-[8px] sm:text-xs font-mono leading-tight mb-4 hidden sm:block select-none" style={{ animation: "intro-text-flicker 3s infinite" }}>{`
    ▄▄▄▄▄▄▄ 
   ▐░░░░░░░▌
   ▐░▄▄▄░▄▄▄ 
   ▐░▌   ▐░▌
   ▐░▌   ▐░▌
   ▐░▌   ▐░▌
    ▀▀▀▀▀▀▀ 
          `}</pre>
          <p className="text-gray-600 text-xs sm:text-sm font-mono tracking-wider uppercase">
            System locked
          </p>
        </div>
      </div>

      {/* Right half */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-[#09090b] flex items-center justify-start overflow-hidden"
        style={{
          transform: `translateX(${splitOffset}%)`,
          transition: done ? "transform 0.7s cubic-bezier(0.65,0,0.35,1)" : "transform 0.05s ease-out",
        }}
      >
        <div className="text-left pl-8 sm:pl-16">
          <p className="text-gray-600 text-xs sm:text-sm font-mono tracking-wider uppercase">
            Breach required
          </p>
        </div>
      </div>

      {/* Center glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full pointer-events-none z-10">
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to bottom, transparent 10%, rgba(168,85,247,${0.2 + progress * 0.6}) 30%, rgba(168,85,247,${0.3 + progress * 0.7}) 50%, rgba(168,85,247,${0.2 + progress * 0.6}) 70%, transparent 90%)`,
            boxShadow: `0 0 ${10 + progress * 25}px rgba(168,85,247,${0.3 + progress * 0.5}), 0 0 ${20 + progress * 40}px rgba(168,85,247,${0.15 + progress * 0.3})`,
            transition: "all 0.1s ease",
          }}
        />
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 text-center"
          style={{
            animation: "intro-text-flicker 3s infinite",
            opacity: 1 - progress,
            transition: "opacity 0.15s ease",
          }}
        >
          <span className="text-gray-400">BREACH</span>{" "}
          <span className="text-purple-500">THE SYSTEM</span>
        </h2>
        <p
          className="text-gray-600 text-xs sm:text-sm font-mono tracking-widest uppercase drag-hint"
          style={{ opacity: Math.max(0, 1 - progress * 2) }}
        >
          ↕ drag to slash
        </p>

        {/* progress ring */}
        <svg className="mt-6" width="48" height="48" viewBox="0 0 48 48" style={{ opacity: progress > 0.05 ? 1 : 0, transition: "opacity 0.2s" }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="2" />
          <circle
            cx="24" cy="24" r="20" fill="none" stroke="#a855f7" strokeWidth="2"
            strokeDasharray={`${progress * 125.6} 125.6`}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dasharray 0.1s ease" }}
          />
        </svg>
      </div>

      {/* Sparks */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="spark"
          style={{ left: s.x, top: s.y, "--sx": s.sx, "--sy": s.sy }}
        />
      ))}
    </div>
  );
}

/* ── Hidden flag easter egg ── */
function HiddenFlag() {
  const [found, setFound] = useState(false);
  const [clicks, setClicks] = useState(0);
  const handleClick = () => { const n = clicks + 1; setClicks(n); if (n >= 5) setFound(true); };

  return (
    <span className="relative inline-block">
      <span onClick={handleClick} className="cursor-pointer select-none" title={found ? "Flag found!" : "..."} role="button" tabIndex={0}>💀</span>
      {found && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-3 py-1 border border-purple-500/30 rounded-lg animate-fadeInUp z-50">
          <span className="font-mono text-xs text-purple-400 font-bold">{"CTF{y0u_f0und_th3_34st3r_3gg}"}</span>
        </span>
      )}
    </span>
  );
}

/* ══════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════ */

const categories = [
  { name: "Web Exploitation", icon: Globe, desc: "Break through web app defenses, exploit XSS, SQLi, and SSRF vulnerabilities." },
  { name: "Cryptography", icon: Lock, desc: "Crack ciphers, break encryption, and unravel mathematical puzzles." },
  { name: "Pwn / Binary", icon: Bug, desc: "Stack smashing, ROP chains, heap exploits — master binary exploitation." },
  { name: "Reverse Engineering", icon: Binary, desc: "Disassemble, decompile, and dissect binaries to uncover hidden logic." },
  { name: "Forensics", icon: Search, desc: "Analyze disk images, packet captures, and memory dumps for evidence." },
  { name: "OSINT", icon: Shield, desc: "Gather intelligence from public sources and connect the dots." },
];

const events = [
  { title: "Hackathon — Phase 1: Ideation", date: "Feb 12–14, 2026", desc: "Submit your ideas and form your team. Innovation starts here." },
  { title: "Hackathon — Phase 2: The Build", date: "Feb 15–25, 2026", desc: "Build your project and push limits. Mentorship and guidance provided." },
  { title: "Treasure Hunt", date: "Feb 26, 2026 • 10 AM – 4 PM", desc: "Crack cryptic clues, chase hidden maps, and race against time. Venue: ARCH-002." },
  { title: "CTF — Capture The Flag", date: "Feb 27, 2026 • 10 AM – 4 PM", desc: "Battle Web, Pwn, Crypto & AI/ML challenges. Crack flags and dominate the leaderboard. Venue: AR-002." },
  { title: "Hackathon — Phase 3: The Showdown", date: "Feb 27, 2026", desc: "Final presentations and judgment. Winners get an exclusive internship opportunity!" },
];

/* ── Team data (placeholders — you'll fill these in) ── */
const challengeDevs = [
  { name: "Developer 1", link: "#" },
  { name: "Developer 2", link: "#" },
  { name: "Developer 3", link: "#" },
  { name: "Developer 4", link: "#" },
  { name: "Developer 5", link: "#" },
  { name: "Developer 6", link: "#" },
];

const webDevs = [
  { name: "Developer 1", link: "#" },
  { name: "Developer 2", link: "#" },
  { name: "Developer 3", link: "#" },
  { name: "Developer 4", link: "#" },
];

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function CyberCarnivalHome() {
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`min-h-screen bg-[#09090b] text-white overflow-x-hidden ${mounted ? "custom-cursor-area" : ""}`}>

      {/* ── Slice-to-reveal intro ── */}
      {mounted && !introDone && <SliceIntro onComplete={() => setIntroDone(true)} />}

      {/* ── Custom cursor ── */}
      {mounted && <CustomCursor />}

      {/* ════ HERO ════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center cyber-grid overflow-hidden">
        <div className="absolute inset-0 scan-line pointer-events-none z-[1]" />
        {mounted && <MatrixRain />}

        {/* radial glow — purple only */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(168,85,247,0.08) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* badge */}
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              AdVitya 2026 • Capture The Flag
            </div>
          </Reveal>

          {/* title */}
          <Reveal delay={100}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.92] mb-6 tracking-tight">
              <span className="block text-gray-300 animate-glitch">WELCOME TO</span>
              <span
                className="block mt-2 bg-clip-text text-transparent animate-text-shimmer"
                style={{ backgroundImage: "linear-gradient(90deg, #a855f7, #7c3aed, #c084fc, #a855f7)" }}
              >
                CYBER CARNIVAL
              </span>
            </h1>
          </Reveal>

          {/* subtitle */}
          <Reveal delay={200}>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Step through the neon gates into AdVitya&apos;s ultimate
              cybersecurity arena. Solve challenges, climb the leaderboard, and
              prove your skill at the <span className="text-purple-400 font-semibold">Cyber Carnival</span>.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/Auth/register"
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white overflow-hidden transition-all duration-300 bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                <Flag className="w-4 h-4" />
                Join the Carnival
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-gray-300 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
              >
                <Target className="w-4 h-4 text-purple-400" />
                View Challenges
              </Link>
            </div>
          </Reveal>

          {/* countdown */}
          <Reveal delay={400}>
            <div className="mt-14 mb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-4 font-medium">CTF begins in</p>
              <CountdownTimer />
            </div>
          </Reveal>

          {/* terminal */}
          <Reveal delay={500}>
            <div className="mt-10">
              <TypingTerminal />
            </div>
          </Reveal>

          {/* scroll */}
          <div className="mt-14 flex flex-col items-center gap-1 animate-bounce opacity-30">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">scroll</span>
            <ChevronRight className="w-4 h-4 rotate-90 text-gray-600" />
          </div>
        </div>
      </section>

      {/* ════ CHALLENGE CATEGORIES ════════════════ */}
      <section className="relative py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-purple-400">Challenge</span> <span className="text-gray-300">Categories</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Choose your arena. Each category tests a different dimension of your cybersecurity expertise.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.name} delay={i * 80}>
                  <TiltCard className="h-full">
                    <div className="glass-card p-6 group relative overflow-hidden h-full cursor-default border border-white/[0.04] hover:border-purple-500/30">
                      {/* hover glow */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-3xl bg-purple-500" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-purple-500/[0.08] border border-purple-500/20">
                          <Icon className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-200">{cat.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ THE EVENT ═══════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-purple-400">The</span> <span className="text-gray-300">Event</span>
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                A high-stakes cybersecurity CTF at AdVITya 2026, where logic beats luck and precision wins.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <TrailCard duration="10s">
              {/* Poster */}
              <div className="relative w-full bg-black/30">
                <Image src="/poster.jpeg" alt="Cyber Carnival CTF — AdVITya 2026" width={1200} height={700} className="w-full h-auto" quality={90} priority />
              </div>

              {/* Details */}
              <div className="p-8 sm:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold mb-3 text-gray-200">
                      <span className="text-purple-400">Capture</span> The Flag 🚩
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      Built to test your skill, speed, and strategy. Battle Web, Pwn, Crypto & AI/ML challenges, crack flags, dominate the leaderboard, and win big.
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" /><span>27 February 2026 (AdVITya&apos;26)</span></div>
                      <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-purple-400 flex-shrink-0" /><span>10:00 AM – 4:00 PM</span></div>
                      <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" /><span>Venue: AR-002</span></div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex-shrink-0">
                    <div className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02]">
                      <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-4 font-bold">💰 Participation Fee</p>
                      <div className="space-y-3">
                        {[
                          { label: "Solo (1 member)", price: "₹49" },
                          { label: "Team of 2", price: "₹89" },
                          { label: "Team of 3", price: "₹129" },
                          { label: "Team of 4", price: "₹159" },
                        ].map((t) => (
                          <div key={t.label} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.label}</span>
                            <span className="font-bold text-gray-200">{t.price}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/Auth/register"
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      >
                        <Flag className="w-4 h-4" />
                        Register Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </TrailCard>
          </Reveal>
        </div>
      </section>

      {/* ════ EVENT TIMELINE ══════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />

        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-purple-400">Event</span> <span className="text-gray-300">Timeline</span>
              </h2>
              <p className="text-gray-600 text-sm">Key milestones of the Cyber Carnival.</p>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent" />

            <div className="space-y-8">
              {events.map((evt, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="flex gap-5 sm:gap-6 items-start">
                    <div className="relative flex-shrink-0 mt-1.5">
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-purple-500 animate-pulse-glow ring-4 ring-purple-500/10" />
                    </div>
                    <div className="glass-card p-5 flex-1 border border-white/[0.04]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="text-base font-bold text-gray-200">{evt.title}</h3>
                        <span className="inline-flex items-center gap-1.5 text-xs text-purple-400/70 font-mono">
                          <Calendar className="w-3 h-3" /> {evt.date}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{evt.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ MEET THE TEAM ══════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />

        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-purple-400">Meet</span> <span className="text-gray-300">the Team</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                The minds behind the challenges and the platform.
              </p>
            </div>
          </Reveal>

          {/* CTF Challenge Developers */}
          <Reveal delay={100}>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/[0.08] border border-purple-500/20">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">CTF Challenge Developers</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {challengeDevs.map((dev, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <a href={dev.link} target="_blank" rel="noopener noreferrer"
                      className="block p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group text-center hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center border border-purple-500/20 bg-purple-500/[0.06] group-hover:bg-purple-500/[0.12] group-hover:border-purple-500/40 transition-all duration-300">
                        <span className="text-xl font-black text-purple-400">
                          {dev.name.split(" ").pop().charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-300 mb-1.5 truncate">{dev.name}</p>
                      <ExternalLink className="w-3.5 h-3.5 mx-auto text-gray-700 group-hover:text-purple-400 transition-colors" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Web Developers */}
          <Reveal delay={200}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/[0.08] border border-purple-500/20">
                  <Code className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">Web Developers</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {webDevs.map((dev, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <a href={dev.link} target="_blank" rel="noopener noreferrer"
                      className="block p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group text-center hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center border border-purple-500/20 bg-purple-500/[0.06] group-hover:bg-purple-500/[0.12] group-hover:border-purple-500/40 transition-all duration-300">
                        <span className="text-xl font-black text-purple-400">
                          {dev.name.split(" ").pop().charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-300 mb-1.5 truncate">{dev.name}</p>
                      <ExternalLink className="w-3.5 h-3.5 mx-auto text-gray-700 group-hover:text-purple-400 transition-colors" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════ */}
      <footer className="relative border-t border-white/[0.04] pt-16 pb-8 px-4 mt-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div>
              <h3 className="text-xl font-extrabold text-purple-400 mb-3">CyberCarnival</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The ultimate CTF battleground — organized by 5 clubs of VIT Bhopal as part of AdVitya 2026.
              </p>
            </div>

            {/* quick links */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { name: "Challenges", href: "/challenges" },
                  { name: "Leaderboard", href: "/leaderboard" },
                  { name: "Teams", href: "/teams" },
                  { name: "Register", href: "/Auth/register" },
                ].map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-sm text-gray-600 hover:text-purple-400 transition-colors inline-flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" /> {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* connect */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Connect</h4>
              <ul className="space-y-2.5">
                {[
                  { name: "GitHub", icon: Github, href: "#" },
                  { name: "LinkedIn", icon: Linkedin, href: "#" },
                ].map((s) => {
                  const SIcon = s.icon;
                  return (
                    <li key={s.name}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                        <SIcon className="w-4 h-4" /> {s.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* about */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">About</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organized by <span className="text-purple-400 font-semibold">5 clubs of VIT Bhopal</span> — fostering cybersecurity culture through hands-on competitions, workshops, and community events.
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-700">&copy; {new Date().getFullYear()} CyberCarnival &bull; AdVitya 2026. All rights reserved.</span>
            <span className="text-xs text-gray-700 font-mono inline-flex items-center gap-1.5">
              &lt;/&gt; Built with ♥ for AdVitya 2026 <HiddenFlag />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
