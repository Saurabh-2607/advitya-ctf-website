"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Globe,
  Lock,
  Bug,
  Binary,
  Search,
  Shield,
  Target,
  Calendar,
  ChevronRight,
  Flag,
  Terminal,
  ExternalLink,
  Code,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ══════════════════════════════════════════════
   UTILITY COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Scroll-triggered reveal ── */
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
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
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : `opacity-0 ${transforms[direction]} scale-[0.97]`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated border trail card ── */
function TrailCard({ children, className = "", duration = "6s" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-px bg-[#050509] ${className}`}
    >
      <div
        className="absolute inset-0 animate-trail [background:conic-gradient(from_var(--angle,0deg)_at_50%_50%,transparent_85%,rgba(255,255,255,0.5))]"
        style={{
          "--duration": duration,
        }}
      />
      <div className="relative h-full w-full rounded-3xl bg-[#0f0f13] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ── Matrix code rain (white/grey) ── */
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
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -(canvas.height / fontSize));
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.fillStyle = "rgba(9, 9, 11, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = (Math.random() * 0.12 + 0.03).toFixed(2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
    <div
      className="absolute inset-0 -top-20 pointer-events-none z-0"
      style={{
        height: "calc(100% + 5rem)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 40%, black 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 40%, black 80%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
    </div>
  );
}

/* ── Countdown timer ── */
const START_TIME = new Date("2026-02-27T10:00:00+05:30").getTime();
const END_TIME = new Date("2026-02-27T16:00:00+05:30").getTime();

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [status, setStatus] = useState("upcoming"); // "upcoming" | "active" | "ended"

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let target;

      if (now < START_TIME) {
        setStatus("upcoming");
        target = START_TIME;
      } else if (now < END_TIME) {
        setStatus("active");
        target = END_TIME;
      } else {
        setStatus("ended");
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const diff = Math.max(0, target - now);
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
  }, []);

  const units = [
    { label: "Days", val: timeLeft.d },
    { label: "Hours", val: timeLeft.h },
    { label: "Mins", val: timeLeft.m },
    { label: "Secs", val: timeLeft.s },
  ];

  return (
    <div className="flex flex-col text-left">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
        {status === "upcoming"
          ? "CTF BEGINS IN"
          : status === "active"
            ? "TIME LEFT"
            : "CTF HAS ENDED"}
      </p>
      <div className="flex items-center gap-2 sm:gap-4">
        {units.map((u, i) => (
          <div key={u.label + status} className="flex flex-col items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-[#111113] border border-white/5 flex items-center justify-center shadow-inner group">
                <span className="text-xl sm:text-3xl font-black text-white tracking-widest tabular-nums">
                  {String(u.val).padStart(2, "0")}
                </span>
              </div>
              {i < 3 && (
                <div className="flex flex-col gap-1.5 opacity-30 px-1">
                  <div className="w-1 h-1 rounded-3xl bg-white" />
                  <div className="w-1 h-1 rounded-3xl bg-white" />
                </div>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 mt-3 font-semibold mr-auto sm:ml-2">
              {u.label}
            </span>
          </div>
        ))}
      </div>
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
      const t = setTimeout(() => {
        setDisplayLines([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 3000);
      return () => clearTimeout(t);
    }
    const line = terminalLines[lineIdx];
    if (charIdx < line.length) {
      const speed = line.startsWith("CTF{") ? 60 : 35;
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayLines((p) => [...p, line]);
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const currentLine =
    lineIdx < terminalLines.length ? terminalLines[lineIdx] : "";
  const typingText = currentLine.slice(0, charIdx);

  const lineColor = (l) =>
    l.startsWith("4DV1TY426{")
      ? "text-green-400 font-bold"
      : l.startsWith("[")
        ? "text-gray-400"
        : "text-gray-500";

  return (
    <TrailCard
      className="w-[320px] sm:w-[400px] md:w-[480px] mx-auto"
      duration="8s"
    >
      <div className="text-left flex flex-col h-[260px]">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#121215]">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
            <Terminal className="w-3 h-3" /> cyber-carnival ~ /ctf
          </span>
        </div>
        {/* output */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed flex-1 bg-[#0a0a0c]">
          {displayLines.map((line, i) => (
            <div key={i} className={lineColor(line)}>
              {line}
            </div>
          ))}
          {lineIdx < terminalLines.length && (
            <div className={lineColor(currentLine)}>
              {typingText}
              <span className="inline-block w-2 h-4 bg-white/70 ml-0.5 animate-pulse rounded-sm align-middle" />
            </div>
          )}
        </div>
      </div>
    </TrailCard>
  );
}

/* ── 3D Tilt Card ── */
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
    if (ref.current)
      ref.current.style.transform =
        "perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ── Custom cursor (white) ── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    )
      return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => {
      hovering.current = true;
      ringRef.current?.classList.add("hovering");
    };
    const onLeave = () => {
      hovering.current = false;
      ringRef.current?.classList.remove("hovering");
    };

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
    document
      .querySelectorAll("a, button, [role='button'], input, textarea, select")
      .forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document
        .querySelectorAll("a, button, [role='button'], input, textarea, select")
        .forEach((el) => {
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

/* ── Hidden flag easter egg ── */
function HiddenFlag() {
  const [found, setFound] = useState(false);
  const [clicks, setClicks] = useState(0);
  const handleClick = () => {
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) setFound(true);
  };

  return (
    <span className="relative inline-block">
      <span
        onClick={handleClick}
        className="cursor-pointer select-none"
        title={found ? "Flag found!" : "..."}
        role="button"
        tabIndex={0}
      >
        💀
      </span>
      {found && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-3 py-1 border border-white/20 rounded-3xl animate-fadeInUp z-50">
          <span className="font-mono text-xs text-white font-bold">
            {"CTF{y0u_f0und_th3_34st3r_3gg}"}
          </span>
        </span>
      )}
    </span>
  );
}

/* ══════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════ */

const categories = [
  {
    name: "Web Exploitation",
    icon: Globe,
    desc: "Break through web app defenses, exploit XSS, SQLi, and SSRF vulnerabilities.",
  },
  {
    name: "Cryptography",
    icon: Lock,
    desc: "Crack ciphers, break encryption, and unravel mathematical puzzles.",
  },
  {
    name: "Pwn / Binary",
    icon: Bug,
    desc: "Stack smashing, ROP chains, heap exploits — master binary exploitation.",
  },
  {
    name: "Reverse Engineering",
    icon: Binary,
    desc: "Disassemble, decompile, and dissect binaries to uncover hidden logic.",
  },
  {
    name: "Forensics",
    icon: Search,
    desc: "Analyze disk images, packet captures, and memory dumps for evidence.",
  },
  {
    name: "OSINT",
    icon: Shield,
    desc: "Gather intelligence from public sources and connect the dots.",
  },
];

const events = [
  {
    title: "Hackathon — Phase 1: Ideation",
    date: "Feb 12–14, 2026",
    desc: "Submit your ideas and form your team. Innovation starts here.",
    startDate: "2026-02-12T00:00:00+05:30",
    endDate: "2026-02-14T23:59:59+05:30"
  },
  {
    title: "Hackathon — Phase 2: The Build",
    date: "Feb 15–25, 2026",
    desc: "Build your project and push limits. Mentorship and guidance provided.",
    startDate: "2026-02-15T00:00:00+05:30",
    endDate: "2026-02-25T23:59:59+05:30"
  },
  {
    title: "Treasure Hunt",
    date: "Feb 26, 2026 • 10 AM – 4 PM",
    desc: "Crack cryptic clues, chase hidden maps, and race against time. Venue: ARCH-002.",
    startDate: "2026-02-26T10:00:00+05:30",
    endDate: "2026-02-26T16:00:00+05:30"
  },
  {
    title: "CTF — Capture The Flag",
    date: "Feb 27, 2026 • 10 AM – 4 PM",
    desc: "Battle Web, Pwn, Crypto & AI/ML challenges. Crack flags and dominate the leaderboard. Venue: AR-002.",
    startDate: "2026-02-27T10:00:00+05:30",
    endDate: "2026-02-27T16:00:00+05:30"
  },
  {
    title: "Hackathon — Phase 3: The Showdown",
    date: "Feb 27, 2026",
    desc: "Final presentations and judgment. Winners get an exclusive internship opportunity!",
    startDate: "2026-02-27T00:00:00+05:30",
    endDate: "2026-02-27T23:59:59+05:30"
  },
];

const clubLinks = [
  { name: "OWASP Chapter VITB", href: "https://instagram.com/owaspvitbhopal" },
  {
    name: "Null Student Chapter VITB",
    href: "https://instagram.com/null_vitbhopal",
  },
  { name: "K.A.V.A.C.H", href: "https://instagram.com/kavach_vitb" },
  { name: "WiCys VIT Bhopal", href: "https://instagram.com/wicys_vitbhopal" },
  {
    name: "Cyber Warriors Club",
    href: "https://instagram.com/cyberwarriors_vitb",
  },
];

/* ── Team data ── */
const challengeDevs = [
  {
    name: "0xcafebabe",
    link: "https://www.linkedin.com/in/das-somnath/",
    tags: ["REV", "BIN", "CRYPTO"],
  },
  { name: "mindxflayer", link: "#", tags: ["OSINT", "AI/ML"] },
  {
    name: "wrongmanoff",
    link: "https://github.com/wrongmanoff",
    tags: ["REVERSE", "OSINT"],
  },
  { name: "pphreak_1001", link: "#", tags: ["WEB", "OSINT"] },
  {
    name: "Headbanger",
    link: "https://www.srbh.site/",
    tags: ["WEB", "OSINT"],
  },
  {
    name: "craycray",
    link: "https://www.linkedin.com/in/akshat-singh-1311ca/",
    tags: ["CRYPTO", "REVERSE", "DFIR"],
  },
  {
    name: "H34D_L355_",
    link: "https://github.com/DhyaanKanoja11",
    tags: ["WEB", "OSINT"],
  },
  { name: "rootk3", link: "https://github.com/rootk3c", tags: ["WEB"] },
  {
    name: "AnkitS01",
    link: "https://linkedin.com/in/ankit-s01",
    tags: ["CRYPTO"],
  },
  {
    name: "Ahundred21",
    link: "https://github.com/saimerit",
    tags: ["CRYPTO", "REVERSE"],
  },
  {
    name: "Mr0x00",
    link: "https://www.linkedin.com/in/snehilshourya101",
    tags: ["DFIR", "OSINT"],
  },
  { name: "0verla1n", link: "#", tags: ["REVERSE", "OSINT"] },
  {
    name: "cr00k5",
    link: "https://www.linkedin.com/in/jayanth-renganathan-a08288280/",
    tags: ["CRYPTO", "OSINT"],
  },
  { name: "s0suk3", link: "https://github.com/s0suk3", tags: ["WEB"] },
  {
    name: "0xNiazi",
    link: "https://www.linkedin.com/in/0xniazi",
    tags: ["REVERSE"],
  },
  {
    name: "Codezy",
    link: "https://www.linkedin.com/in/samridhi-tyagi-554463324",
    tags: ["WEB"],
  },
  {
    name: "TRAPZI",
    link: "https://www.linkedin.com/in/shatabdi-singh-736ba2360",
    tags: ["WEB"],
  },
  {
    name: "drizzlehx",
    link: "https://www.linkedin.com/in/0xutkarsh",
    tags: ["WEB"],
  },
  {
    name: "Akriti",
    link: "https://www.linkedin.com/in/akriti-sharma-14259b284/",
    tags: ["DFIR"],
  },
  {
    name: "NishKov",
    link: "https://www.linkedin.com/in/nishant-kumar-choudhary-516872287?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    tags: ["DFIR"],
  },
  {
    name: "Cyberdev007",
    link: "https://github.com/Devanarayananb",
    tags: ["WEB"],
  },
];

const webDevs = [
  {
    name: "Par1n1ta",
    link: "https://www.linkedin.com/in/parinita-piplewar/",
    tags: ["Frontend", "Notifications"],
  },
  {
    name: "AnkitS01",
    link: "https://linkedin.com/in/ankit-s01",
    tags: ["Frontend", "Home Page"],
  },
  {
    name: "Snow",
    link: "https://www.linkedin.com/in/shital-das-537014326",
    tags: ["Frontend", "Rules Page"],
  },
];

/* ══════════════════════════════════════════════
   TEAM MEMBER CARD
   ══════════════════════════════════════════════ */
function TeamMemberCard({ dev, delay }) {
  return (
    <Reveal delay={delay}>
      <a
        href={dev.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 rounded-3xl border border-white/5 bg-neutral-900/40 group hover:border-white/20 hover:bg-neutral-800/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-2.5">
          <p className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors truncate">
            {dev.name}
          </p>
          <ExternalLink className="w-3 h-3 shrink-0 text-neutral-500 group-hover:text-white transition-colors" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dev.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-3xl bg-white/5 text-neutral-400 border border-white/5 group-hover:bg-white/10 group-hover:text-neutral-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </a>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function CyberCarnivalHome() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`min-h-screen bg-neutral-950 text-white overflow-x-hidden capitalize ${mounted ? "custom-cursor-area" : ""}`}
    >
      {/* ── Custom cursor ── */}
      {mounted && <CustomCursor />}

      <section className="relative min-h-screen">
        {mounted && <MatrixRain />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-4rem)] pt-20 lg:pt-0">
            {/* Left Column: Text & CTAs */}
            <div className="flex-1 text-left w-full flex flex-col justify-center lg:items-start lg:px-0">
              {/* badge */}
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-3xl border border-white/10 bg-white/3 text-gray-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  AdVitya 2026 • Capture The Flag
                </div>
              </Reveal>

              {/* title */}
              <Reveal delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] mb-8 font-sans">
                  <span className="block text-gray-400">Welcome to</span>
                  <span className="block text-white">Cyber Carnival</span>
                </h1>
              </Reveal>

              {/* subtitle */}
              <Reveal delay={200}>
                <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md mb-12 font-light">
                  Solve challenges, climb the leaderboard, and prove your skill
                  at the{" "}
                  <span className="text-white font-semibold">
                    Cyber Carnival
                  </span>
                  .
                </p>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={300}>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <Link
                    href="/Auth/register"
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 w-full sm:w-auto min-w-[200px] text-sm font-bold tracking-widest bg-[#c8c8c8] text-black transition-all hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-full"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    JOIN THE CARNIVAL
                  </Link>

                  <div className="relative p-[1px] inline-flex items-center justify-center w-full sm:w-auto min-w-[200px] rounded-full overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <Link
                      href="/challenges"
                      className="relative w-full h-full bg-[#09090b] hover:bg-[#121215] text-white flex items-center justify-center px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-all rounded-full"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      VIEW CHALLENGES
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Terminal & Decor */}
            <div className="flex-1 w-full lg:w-auto relative flex flex-col justify-center items-center lg:items-end pb-12 lg:pb-0">
              {/* countdown */}
              <Reveal delay={400}>
                <div className="mb-8 w-[320px] sm:w-[400px] md:w-[480px] lg:ml-auto flex flex-col items-start">
                  <CountdownTimer />
                </div>
              </Reveal>

              <Reveal delay={500}>
                <div className="w-full max-w-lg lg:ml-auto flex justify-center lg:justify-end">
                  <TypingTerminal className="w-full" />
                </div>
              </Reveal>

              {/* scroll down indicator */}
            </div>
          </div>
        </div>
      </section>

      {/* ════ CHALLENGE CATEGORIES ════════════════ */}
      <section className="relative py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-white">Challenge</span>{" "}
                <span className="text-gray-500">Categories</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Choose your arena. Each category tests a different dimension of
                your cybersecurity expertise.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.name} delay={i * 80}>
                  <TiltCard className="h-full">
                    <div className="glass-card p-6 group relative overflow-hidden h-full cursor-default border border-white/4 hover:border-white/15">
                      {/* hover glow */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl bg-white" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-3xl flex items-center justify-center mb-4 bg-white/5 border border-white/10">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-200">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ EVENT TIMELINE ══════════════════════ */}
      <section className="relative py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-white">Event</span>{" "}
                <span className="text-gray-500">Timeline</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Key milestones of the Cyber Carnival.
              </p>
            </div>
          </Reveal>

          <div className="relative">
            <div className="space-y-6 max-w-2xl mx-auto">
              {events.map((evt, i) => {
                // Determine status dynamically based on current date
                const now = new Date();
                const start = new Date(evt.startDate);
                const end = new Date(evt.endDate);
                let status = "upcoming";
                if (now > end) status = "completed";
                else if (now >= start && now <= end) status = "active";

                return (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      className={`glass-card p-6 border rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative ${
                        status === "active"
                          ? "border-white/50 bg-[#0f0f13] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                          : "border-white/4 bg-[#0f0f13]"
                      }`}
                    >
                      {status === "active" && (
                        <span className="absolute -top-3 left-6 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
                          Current Phase
                        </span>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3
                          className={`text-lg font-bold ${
                            status === "active"
                              ? "text-white"
                              : "text-gray-200"
                          }`}
                        >
                          {evt.title}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-mono bg-white/3 px-3 py-1 rounded-3xl border border-white/5">
                          <Calendar className="w-3.5 h-3.5" /> {evt.date}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {evt.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════ MEET THE TEAM ══════════════════════ */}
      <section className="relative py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-white">Meet</span>{" "}
                <span className="text-gray-500">the Team</span>
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
                <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">
                  CTF Challenge Developers
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {challengeDevs.map((dev, i) => (
                  <TeamMemberCard key={i} dev={dev} delay={i * 60} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Web Developers */}
          <Reveal delay={200}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10">
                  <Code className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">
                  Web Developers
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {webDevs.map((dev, i) => (
                  <TeamMemberCard key={i} dev={dev} delay={i * 60} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════ */}
      <footer className="relative border-t border-white/5 pt-16 pb-8 -mt-12 backdrop-blur-3xl bg-black/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
            {/* brand */}
            <div className="lg:pr-12">
              <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">
                CyberCarnival
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The ultimate CTF battleground organized as part of AdVitya 2026.
              </p>
            </div>

            {/* quick links */}
            <div className="sm:pl-8">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Challenges", href: "/challenges" },
                  { name: "Leaderboard", href: "/leaderboard" },
                  { name: "Teams", href: "/teams" },
                  { name: "Register", href: "/Auth/register" },
                ].map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-neutral-400 hover:text-white transition-all duration-300 inline-flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:translate-x-0.5 transition-transform" />{" "}
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* organized by */}
            <div className="sm:pl-8">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-5">
                Organized By
              </h4>
              <ul className="space-y-3">
                {clubLinks.map((club) => (
                  <li key={club.name}>
                    <a
                      href={club.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-400 hover:text-white transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-3xl bg-neutral-700 group-hover:bg-white transition-colors" />
                      {club.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">
              &copy; {new Date().getFullYear()} CyberCarnival &bull; AdVitya
              2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
