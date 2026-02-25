"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Users, Lock, Shield, Eye, EyeOff, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CreateTeam({ onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const createTeam = async () => {
    if (!teamName || !password || !confirmPassword) {
      toast.error("All Fields Are Required", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password do not Match", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          teamName,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.token, data.user);

      toast.success("Team Created Successfully", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      onCreated(data.team);

      window.location.reload();
    } catch (err) {
      console.log(err);

      toast.error(err.message || "Error creating team...", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Card */}
      <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-neutral-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Create New Team</h2>
            <p className="text-neutral-500 text-sm">Establish your squad and start competing</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2 text-left">
            <label className="text-xs uppercase tracking-widest font-bold text-neutral-500 ml-1">
              Team Name
            </label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberPunks"
                className="
                  w-full pl-12 pr-4 py-4
                  bg-neutral-900/50
                  border border-neutral-800
                  rounded-xl
                  text-white
                  placeholder-neutral-600
                  outline-none
                  focus:border-neutral-600
                  focus:bg-neutral-900
                  transition-all duration-300
                "
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 text-left">
            <label className="text-xs uppercase tracking-widest font-bold text-neutral-500 ml-1">
              Team Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="
                  w-full pl-12 pr-12 py-4
                  bg-neutral-900/50
                  border border-neutral-800
                  rounded-xl
                  text-white
                  placeholder-neutral-600
                  outline-none
                  focus:border-neutral-600
                  focus:bg-neutral-900
                  transition-all duration-300
                "
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2 text-left">
            <label className="text-xs uppercase tracking-widest font-bold text-neutral-500 ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="
                  w-full pl-12 pr-12 py-4
                  bg-neutral-900/50
                  border border-neutral-800
                  rounded-xl
                  text-white
                  placeholder-neutral-600
                  outline-none
                  focus:border-neutral-600
                  focus:bg-neutral-900
                  transition-all duration-300
                "
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-neutral-800/50 border border-neutral-800 p-3 flex items-start gap-3">
             <div className="mt-0.5 text-neutral-400">
                <Shield className="w-4 h-4" /> 
             </div>
             <p className="text-xs text-neutral-400 leading-relaxed">
                Save this password securely. You will need to share it with your teammates so they can join your squad.
             </p>
          </div>

          {/* Action */}
          <button
            onClick={createTeam}
            disabled={loading}
            className="
              w-full py-4 rounded-xl
              bg-white text-black font-bold
              hover:bg-neutral-200
              disabled:opacity-50 disabled:cursor-not-allowed
              transform active:scale-[0.98]
              transition-all duration-200
              mt-2
              shadow-lg shadow-white/5
            "
          >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    Creating...
                </span>
            ) : (
                "Create Team"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}