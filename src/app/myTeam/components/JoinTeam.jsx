"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function JoinTeam({ onJoined }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  /* ---------------- FETCH TEAM NAMES ---------------- */

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team/names");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setTeams(data.teams || []);
      } catch (err) {
        toast.error("Failed to load teams", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
          toastId: "myTeam",
        });
      }
    };

    fetchTeams();
  }, []);

  /* ---------------- JOIN TEAM ---------------- */

  const joinTeam = async () => {
    if (!selectedTeam || !password) {
      toast.error("All Fields Are Required", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          teamName: selectedTeam,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Team Joined Successfully", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      onJoined();

      login(data.token, data.user);

    } catch (err) {
      toast.error(err?.message || "Failed to join team", {
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
                <Users className="w-8 h-8 text-neutral-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Join Existing Team</h2>
            <p className="text-neutral-500 text-sm">Select your team from the list and enter access credentials</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Team Dropdown */}
          <div className="space-y-2 text-left">
            <label className="text-xs uppercase tracking-widest font-bold text-neutral-500 ml-1">
              Select Team
            </label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-4
                  bg-neutral-900/50
                  border border-neutral-800
                  rounded-xl
                  text-white
                  outline-none
                  focus:border-neutral-600
                  focus:bg-neutral-900
                  transition-all duration-300
                  appearance-none
                "
              >
                <option value="" disabled className="bg-neutral-900 text-neutral-500">
                    Select a team...
                </option>
                {teams.map((team) => (
                  <option
                    key={team}
                    value={team}
                    className="bg-neutral-900 text-white"
                  >
                    {team}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
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
                placeholder="Enter team password"
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

          {/* Action */}
          <button
            onClick={joinTeam}
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
                    Joining...
                </span>
            ) : (
                "Join Team"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
