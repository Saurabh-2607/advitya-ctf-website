"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const TABS = [
  { key: "auth", label: "Auth" },
  { key: "flags", label: "Flags" },
  { key: "error", label: "Errors" },
];

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("auth");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          router.push("/");
          return;
        }

        const data = await res.json();

        if (data.success) {
          const formatted = data.logs.map((log, index) => {
            let parsed;

            // Parse Winston JSON log safely
            try {
              parsed = JSON.parse(log.message);
            } catch {
              parsed = {
                level: log.type === "error" ? "error" : "info",
                message: log.message,
                timestamp: null,
              };
            }

            const level = parsed.level || "info";

            return {
              id: index,
              type: log.type,
              level,
              message: parsed.message || log.message,
              time: parsed.timestamp
                ? new Date(parsed.timestamp).toLocaleString()
                : "recent",
            };
          });

          setLogs(formatted);
        }
      } catch {
        setLogs([]);
      }

      setLoading(false);
    };

    fetchLogs();
  }, [router]);

  const filteredLogs = logs.filter((log) => log.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-6">
        <h2 className="text-2xl font-light text-white flex items-center gap-3">
          <Terminal className="w-6 h-6 text-neutral-400" />
          Admin Logs
        </h2>
        <p className="text-neutral-500 text-sm mt-1 font-mono">
          Audit trail and system monitoring
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition ${
              activeTab === tab.key
                ? "bg-neutral-800 border-neutral-600 text-white"
                : "bg-neutral-900/50 border-neutral-800 text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
          </div>
          <span className="text-xs font-mono text-neutral-500 ml-2">
            tail -n 100 /logs/{activeTab}.log
          </span>
        </div>

        <div className="divide-y divide-neutral-800/50 max-h-[600px] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-neutral-500">
              Loading logs...
            </div>
          )}

          {!loading && filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 flex items-start gap-4 hover:bg-neutral-800/30 transition-colors"
            >
              <div className="mt-0.5 flex-shrink-0">
                {log.level === "info" && (
                  <Info className="w-4 h-4 text-blue-500/70" />
                )}
                {log.level === "warn" && (
                  <AlertCircle className="w-4 h-4 text-amber-500/70" />
                )}
                {log.level === "error" && (
                  <AlertCircle className="w-4 h-4 text-red-500/70" />
                )}
                {log.level === "success" && (
                  <CheckCircle className="w-4 h-4 text-emerald-500/70" />
                )}
              </div>

              <div className="flex-1 min-w-0 grid gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border bg-neutral-700/30 border-neutral-600/30 text-neutral-400">
                    {log.type}
                  </span>
                  <span className="text-xs text-white/60 font-mono flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </span>
                </div>

                <p className="text-sm text-neutral-300 font-mono break-all leading-relaxed">
                  {log.message}
                </p>
              </div>
            </div>
          ))}

          {!loading && filteredLogs.length === 0 && (
            <div className="p-12 text-center text-neutral-500">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No {activeTab} logs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;