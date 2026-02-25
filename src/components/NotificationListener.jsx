"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "react-toastify";
import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, Trophy, AlertTriangle } from "lucide-react";

export default function NotificationListener() {
  const { token } = useAuth();
  const [firstBlood, setFirstBlood] = useState(null);

  const firstBloodAudioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !firstBloodAudioRef.current) {
      firstBloodAudioRef.current = new Audio("/sounds/first-blood.mp3");
    }
  }, []);

  useNotifications((event) => {
    if (event.type === "FIRST_BLOOD") {
      if (firstBloodAudioRef.current) {
        firstBloodAudioRef.current.currentTime = 0;
        firstBloodAudioRef.current.volume = 0.15;
        firstBloodAudioRef.current.play().catch(() => {});
      }

      setFirstBlood({
        user: event.user,
        team: event.team,
        challenge: event.challenge,
        value: event.value,
        startTime: Date.now(),
      });

      setTimeout(() => setFirstBlood(null), 4000);
      return;
    }

    if (event.type === "SOLVE") {
      toast(
        <div className="flex items-start gap-4 p-1">
           <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-in zoom-in spin-in-90 duration-300">
                 <Check className="w-5 h-5 text-emerald-500" />
              </div>
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight mb-1">Challenge Solved!</p>
              <p className="text-xs text-neutral-400 leading-snug break-words">{event.message}</p>
           </div>
        </div>
      , {
        position: "bottom-right",
        autoClose: 4000,
        theme: "dark",
        style: {
            background: "#09090b", // neutral-950
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "8px",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" 
        },
        progressStyle: {
            background: "#10b981", // emerald-500
            height: "2px"
        },
        hideProgressBar: false,
        icon: false
      });
      return;
    }

    if (event.type === "ADMIN_NOTIFICATION") {
      if (event.level === "warning") {
        toast(
          <div className="flex items-start gap-4 p-1">
             <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center animate-in zoom-in spin-in-90 duration-300">
                   <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight mb-1">Warning</p>
                <p className="text-xs text-neutral-400 leading-snug break-words">{event.message}</p>
             </div>
          </div>
        , {
          position: "top-right",
          autoClose: 6000,
          theme: "dark",
          toastId: event.notificationId,
          style: {
              background: "#09090b", // neutral-950
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "8px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" 
          },
          progressStyle: {
              background: "#eab308", // yellow-500
              height: "2px"
          },
          icon: false
        });
      } else {
        const toastType =
          event.level === "critical"
            ? toast.error
            : toast.info;

        toastType(event.message, {
          position: "top-right",
          theme: "dark",
          toastId: event.notificationId,
        });
      }
    }
  }, token);

  const glitterParticles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random(),
        drift: Math.random() * 100 - 50,
      })),
    [],
  );

  return (
    <>
      {firstBlood && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-neutral-950/60 backdrop-blur-xl animate-in fade-in duration-200">
            
          {/* Confetti / Glitter Explosion */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {glitterParticles.map((p) => (
                <div
                   key={p.id}
                   className="absolute w-2 h-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                   style={{
                      left: '50%',
                      top: '50%',
                      animation: `explode 1.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards ${Math.random() * 0.2}s`,
                      '--x': `${(Math.random() - 0.5) * 200}vw`,
                      '--y': `${(Math.random() - 0.5) * 200}vh`,
                      '--r': `${Math.random() * 720}deg`,
                      '--s': `${Math.random() * 2 + 0.5}`,
                   }}
                />
             ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in-50 duration-500">
            
            <div className="relative">
                <h1 className="text-[12vw] md:text-[180px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-red-500 drop-shadow-[0_5px_5px_rgba(220,38,38,0.2)] leading-[0.85] select-none skew-x-[-10deg]">
                FIRST
                <span className="block text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">BLOOD</span>
                </h1>
                
                {/* Glitch Overlay Text (Decoration) - Static low glow */}
                <h1 className="absolute inset-0 text-[12vw] md:text-[180px] font-black italic tracking-tighter text-red-500 opacity-5 blur-[2px] leading-[0.85] select-none skew-x-[-10deg] pointer-events-none">
                FIRST
                <span className="block">BLOOD</span>
                </h1>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300">
               
               <div className="px-8 py-4 bg-red-900/20 border border-red-500/30 rounded-full backdrop-blur-md">
                  <p className="text-xl md:text-3xl font-bold text-white tracking-wide">
                     <span className="text-red-400">{firstBlood.user}</span> just solved <span className="text-white border-b-2 border-red-500 pb-0.5">{firstBlood.challenge}</span>
                  </p>
               </div>

                <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-red-500/50"></div>
                    <span className="text-2xl font-black text-red-500 tracking-[0.2em]">+{firstBlood.value} PTS</span>
                    <div className="h-px w-12 bg-red-500/50"></div>
                </div>

            </div>
          </div>
          
          <style>{`
            @keyframes explode {
               0% {
                  transform: translate(-50%, -50%) rotate(0deg) scale(0);
                  opacity: 1;
               }
               100% {
                  transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(var(--s));
                  opacity: 0;
               }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
