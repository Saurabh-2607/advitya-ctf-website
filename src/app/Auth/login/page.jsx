"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/* ── Matrix code rain (reused for visual consistency) ── */
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const chars = "01ABCDxyz!@#$%^&*";
    const fontSize = 14;
    let columns, drops;

    function resize() {
      if (!canvas.parentElement) return;
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
    <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      toast.error("Already Logged In...", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth",
      });
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.token && data.user) {
          login(data.token, data.user);
        }
        setSuccess("Login successful!");
        toast.success("Logged in successfully!", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
          toastId: "auth",
        });
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      toast.error("Oops... Something went Wrong..", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full grid grid-cols-1 lg:grid-cols-2 bg-[#09090b] text-white overflow-hidden z-[40]">
      <div className="hidden lg:flex relative flex-col justify-center items-center bg-neutral-950 border-white/10 overflow-hidden h-full">
        <MatrixRain />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center p-12 max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Shield className="w-10 h-10 text-white/80" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">
            Cyber Carnival
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            Enter the arena, solve challenges, and climb the leaderboard.
            Authorized personnel only.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5 w-fit mx-auto">
            <Terminal className="w-3 h-3" />
            <span>System Secure • Encrypted Connection</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN (Form) ── */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#09090b] relative">
        
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header (only visible on small screens) */}
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-gray-400 text-sm">Welcome back to Cyber Carnival</p>
          </div>

          <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Please sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeIn">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-fadeIn">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-sm text-green-400">{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="pt-6 border-t border-white/5 space-y-6">
                 <p className="text-xs text-center text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/Auth/register" className="text-white font-semibold hover:underline">
                      Register here
                    </Link>
                 </p>

                {/* Warning Details */}
                <div className="bg-red-500/5 mt-6 rounded-xl p-4 border border-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                      Warning & Info
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-start gap-2">
                       <span className="block w-1 h-1 mt-1.5 rounded-full bg-red-500 shrink-0" />
                       <span className="leading-relaxed">Keep your credentials secret. Sharing them may result in disqualification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                       <span className="block w-1 h-1 mt-1.5 rounded-full bg-red-500 shrink-0" />
                       <span className="leading-relaxed">Access is monitored. Unauthorized attempts will be logged.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
