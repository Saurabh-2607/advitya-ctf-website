"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  Megaphone, 
  Users, 
  User, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Send,
  Radio,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function AdminNotificationsPage() {
  const { token, user, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  // Form State
  const [target, setTarget] = useState("global");
  const [targetId, setTargetId] = useState("");
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("info");

  // UI State
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token || role !== "sudo") {
      // creating a slight delay to allow auth check to settle or redirect
      if (!authLoading && (role !== "sudo" || !user)) {
         router.replace("/");
      }
      return;
    }

    setAuthorized(true);
  }, [authLoading, user, token, role, router]);


  useEffect(() => {
    if (!authorized) return;

    const controller = new AbortController();
    setLoadingMeta(true);
    setError("");

    Promise.all([
      fetch("/api/admin/notify/meta/teams", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).then((r) => r.json()),

      fetch("/api/admin/notify/meta/users", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).then((r) => r.json()),
    ])
      .then(([teamsRes, usersRes]) => {
        if (!teamsRes.success || !usersRes.success) {
          throw new Error("Failed to fetch metadata");
        }
        setTeams(teamsRes.teams || []);
        setUsers(usersRes.users || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load recipients list.");
        }
      })
      .finally(() => setLoadingMeta(false));

    return () => controller.abort();
  }, [authorized, token]);


  async function sendNotification() {
    if (!message.trim()) return;

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target,
          targetId: target === "global" ? null : targetId,
          event: {
            type: "ADMIN_NOTIFICATION",
            message,
            level,
          },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");

      setMessage("");
      setSuccess("Notification broadcasted successfully.");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Failed to send notification. Check console for details.");
    } finally {
      setSending(false);
    }
  }

  // Derived state to disable button if form is invalid
  const isTargetInvalid = (target === "team" || target === "user") && !targetId;
  const isFormInvalid = !message.trim() || isTargetInvalid;

  if (loadingMeta || !authorized) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
        <p className="text-neutral-500 font-mono text-sm animate-pulse">Initializing Comm Links...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
            <Radio className="w-6 h-6 text-neutral-400" />
            Global Broadcast System
          </h2>
          <p className="text-neutral-500 text-sm mt-1 font-mono">
            Send real-time alerts to participants and teams.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
            
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-6">
              
              {/* Target Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Recipients</label>
                    <div className="relative">
                      <select
                        disabled={sending}
                        className="w-full bg-neutral-800/50 border border-neutral-700 text-neutral-200 text-sm rounded-lg p-3 pl-10 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none appearance-none transition-all"
                        value={target}
                        onChange={(e) => {
                          setTarget(e.target.value);
                          setTargetId("");
                        }}
                      >
                        <option value="global">All Participants (Global)</option>
                        <option value="team">Specific Team</option>
                        <option value="user">Specific User</option>
                      </select>
                      <Users className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                    </div>
                 </div>

                 {/* Dynamic Target Selection */}
                 {target !== "global" && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                        {target === "team" ? "Select Team" : "Select User"}
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-neutral-800/50 border border-neutral-700 text-neutral-200 text-sm rounded-lg p-3 pl-10 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none appearance-none transition-all"
                          value={targetId}
                          onChange={(e) => setTargetId(e.target.value)}
                        >
                          <option value="" disabled>Select {target === "team" ? "Team" : "User"}</option>
                          {target === "team" 
                            ? teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)
                            : users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)
                          }
                        </select>
                        {target === "team" 
                          ? <Users className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                          : <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                        }
                      </div>
                   </div>
                 )}
              </div>

              {/* Alert Level */}
              <div className="space-y-2">
                 <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Alert Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setLevel("info")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${level === "info" ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-neutral-800/30 border-neutral-800 text-neutral-400 hover:bg-neutral-800"}`}
                    >
                      <Info className="w-4 h-4" />
                      Info
                    </button>
                    <button
                      onClick={() => setLevel("warning")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${level === "warning" ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-neutral-800/30 border-neutral-800 text-neutral-400 hover:bg-neutral-800"}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Warning
                    </button>
                    <button
                      onClick={() => setLevel("critical")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${level === "critical" ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-neutral-800/30 border-neutral-800 text-neutral-400 hover:bg-neutral-800"}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Critical
                    </button>
                  </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Message Content</label>
                <div className="relative">
                  <textarea
                    className="w-full bg-neutral-800/50 border border-neutral-700 text-neutral-200 text-sm rounded-lg p-4 pl-4 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none transition-all resize-none min-h-[120px]"
                    placeholder="Enter message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-neutral-600 font-mono">
                     {message.length} chars
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={sendNotification}
                  disabled={sending || isFormInvalid}
                  className="bg-neutral-100 hover:bg-white text-black text-sm font-medium px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Broadcast Message
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Info - Contextual Help or Tips */}
        <div className="space-y-6">
           <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                 <Megaphone className="w-4 h-4 text-neutral-400" />
                 Broadcast Guidelines
              </h3>
              <ul className="space-y-3 text-xs text-neutral-400 leading-relaxed">
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span><strong>Global</strong> messages are visible to all registered participants immediately.</span>
                 </li>
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>Use <strong>Warning</strong> level for service interruptions or critical rule clarifications.</span>
                 </li>
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <span><strong>Critical</strong> alerts will persist until dismissed by the user (if enabled).</span>
                 </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
}
