"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
  User,
} from "lucide-react";

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

export default function UserRegister() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);

  const [form, setDesignForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Helper to update form state
  const setForm = (updater) => {
    if (typeof updater === 'function') {
      setDesignForm(updater);
    } else {
      setDesignForm(updater);
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      toast.error("Already logged in", {
        theme: "dark",
        position: "bottom-right",
        toastId: "auth",
      });
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setDesignForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const isVitEmail = (email) =>
    email.toLowerCase().endsWith("@vitbhopal.ac.in");

  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

  const validateStep1 = () => {
    if (!form.name || form.name.length < 2) return "Please enter a valid name";

    if (!form.email) return "Email is required";
    // if (!isVitEmail(form.email)) return "Only @vitbhopal.ac.in emails allowed";

    if (!form.password) return "Password is required";
    if (!isStrongPassword(form.password))
      return "Password must be 8+ chars with upper, lower, number & symbol";

    if (form.password !== form.confirmPassword) return "Passwords do not match";

    return null;
  };

  /* ---------------- STEP 1: SEND OTP ---------------- */

  const handleNext = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: "", success: "" });

    const error = validateStep1();
    if (error) {
      setStatus({ loading: false, error, success: "" });
      return;
    }

    setStatus((p) => ({ ...p, loading: true }));

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: "" });
        return;
      }

      setStatus({
        loading: false,
        error: "",
        success: "OTP sent to your email",
      });

      setStep(2);
    } catch {
      setStatus({
        loading: false,
        error: "Failed to send OTP",
        success: "",
      });
    }
  };

  /* ------------------- VERIFY OTP ---------------- */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: "", success: "" });

    if (!/^\d{6}$/.test(otp)) {
      setStatus({
        loading: false,
        error: "Enter a valid 6-digit OTP",
        success: "",
      });
      return;
    }

    setStatus((p) => ({ ...p, loading: true }));

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: "" });
        return;
      }

      login(data.token, data.user);

      toast.success("Registration complete!", {
        theme: "dark",
        position: "bottom-right",
        toastId: "auth",
      });

      router.push("/myTeam");
    } catch {
      setStatus({
        loading: false,
        error: "OTP verification failed",
        success: "",
      });
    }
  };


  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setStatus({ loading: false, error: "", success: "" });
    setResendTimer(60); 

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: "" });
        return;
      }

      setStatus({
        loading: false,
        error: "",
        success: "OTP resent successfully",
      });
    } catch {
      setStatus({
        loading: false,
        error: "Failed to resend OTP",
        success: "",
      });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full grid grid-cols-1 lg:grid-cols-2 bg-[#09090b] text-white overflow-hidden z-[40]">
      {/* ── LEFT COLUMN (Visuals) ── */}
      <div className="hidden lg:flex relative flex-col justify-center items-center bg-neutral-950 border-white/10 overflow-hidden h-full">
        <MatrixRain />

        <div className="relative z-10 text-center p-12 max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Shield className="w-10 h-10 text-white/80" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">
            Join The Ranks
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            Create your operative identity. Secure your access to the mainframe and begin the challenge.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5 w-fit mx-auto">
            <Terminal className="w-3 h-3" />
            <span>Registration Portal • Secure Channel</span>
          </div>

          <div className="mt-8 text-left bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 w-full shadow-2xl max-w-xs mx-auto">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-white/5 rounded-md border border-white/5">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Protocols
                </h3>
             </div>
             <ul className="space-y-2 text-[10px] text-gray-400 font-mono">
                <li className="flex items-start gap-2">
                   <span className="block w-0.5 h-0.5 mt-1.5 rounded-full bg-white/40 shrink-0" />
                   <span className="leading-relaxed">Strong password required (mixed chars).</span>
                </li>
                <li className="flex items-start gap-2">
                   <span className="block w-0.5 h-0.5 mt-1.5 rounded-full bg-white/40 shrink-0" />
                   <span className="leading-relaxed">Email verification required.</span>
                </li>
             </ul>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN (Form) ── */}
      <div className="flex flex-col justify-center items-center p-8 pt-16 bg-[#09090b] relative h-full overflow-y-auto w-full">
        
        <div className="w-full max-w-md space-y-8 my-auto min-h-min">
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Sign Up
            </h1>
            <p className="text-gray-400 text-sm">Join the Cyber Carnival</p>
          </div>

          <div className="w-full">
            <div className={`mb-8 ${step === 1 ? 'hidden' : 'block'}`}>
                <h2 className="text-3xl font-bold text-white mb-2">
                   Verify Email
                </h2>
                <p className="text-gray-400">
                   We sent a code to {form.email}
                </p>
            </div>

<form onSubmit={step === 1 ? handleNext : handleVerifyOtp} className="space-y-6">
                
                {step === 1 && (
                  <>
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          autoComplete="off"
                          className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          autoComplete="off"
                          className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                        <input
                          type={show.password ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={(e) => setDesignForm(p => ({ ...p, password: e.target.value }))}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                        />
                        <button
                          type="button"
                          onClick={() => setShow(p => ({ ...p, password: !p.password }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                        >
                          {show.password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                        <input
                          type={show.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={(e) => setDesignForm(p => ({ ...p, confirmPassword: e.target.value }))}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                        />
                        <button
                          type="button"
                          onClick={() => setShow(p => ({ ...p, confirm: !p.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                        >
                          {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      One-Time Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors h-5 w-5" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#202020] transition-all tracking-widest text-center text-lg"
                      />
                    </div>
                     <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendTimer > 0}
                          className="text-xs text-neutral-400 hover:text-neutral-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                        >
                          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                        </button>
                    </div>
                  </div>
                )}


                {/* Messages */}
                {status.error && (
                  <div className="flex items-center space-x-2 p-4 bg-white/5 border border-red-500/20 rounded-xl animate-fadeIn">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <span className="text-sm font-medium text-red-400">{status.error}</span>
                  </div>
                )}
                
                {status.success && (
                  <div className="flex items-center space-x-2 p-4 bg-white/5 border border-green-500/20 rounded-xl animate-fadeIn">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-green-400">{status.success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {status.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{step === 1 ? "Send OTP" : "Verify & Create Account"}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
            </form>

            {/* Footer */}
            <div className="pt-6 border-t border-white/5 mt-8 space-y-6">
                 <p className="text-xs text-center text-gray-500">
                    Already have an account?{" "}
                    <Link href="/Auth/login" className="text-white font-semibold hover:underline">
                      Sign in here
                    </Link>
                 </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

