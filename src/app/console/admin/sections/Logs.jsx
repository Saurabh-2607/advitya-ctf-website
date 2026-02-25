import React, { useState } from "react";
import { Terminal, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";

const Logs = () => {
  const [logs] = useState([
    { id: 1, type: "system", message: "System initialized successfully", time: "2 mins ago", level: "info" },
    { id: 2, type: "auth", message: "Admin user logged in from 192.168.1.1", time: "5 mins ago", level: "success" },
    { id: 3, type: "challenge", message: "Challenge 'Binary Exploitation 101' updated", time: "1 hour ago", level: "info" },
    { id: 4, type: "error", message: "Failed to fetch instance status for container-7ad2", time: "2 hours ago", level: "error" },
    { id: 5, type: "user", message: "User 'hacker_01' registered", time: "3 hours ago", level: "success" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-neutral-400" />
            System Logs
          </h2>
          <p className="text-neutral-500 text-sm mt-1 font-mono">
            Audit trail and system activity monitoring.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
            <span className="text-xs font-mono text-neutral-500 ml-2">tail -f /var/log/syslog</span>
        </div>
        
        <div className="divide-y divide-neutral-800/50">
            {logs.map((log) => (
                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-neutral-800/30 transition-colors group">
                    <div className="mt-0.5 flex-shrink-0">
                        {log.level === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500/70" />}
                        {log.level === 'error' && <AlertCircle className="w-4 h-4 text-red-500/70" />}
                        {log.level === 'info' && <Info className="w-4 h-4 text-blue-500/70" />}
                    </div>
                    
                    <div className="flex-1 min-w-0 grid gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                                log.type === 'system' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                log.type === 'auth' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                                log.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-neutral-700/30 border-neutral-600/30 text-neutral-400'
                            }`}>
                                {log.type}
                            </span>
                            <span className="text-xs text-neutral-600 font-mono flex items-center gap-1 ml-auto">
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
            
            {logs.length === 0 && (
                <div className="p-12 text-center text-neutral-500">
                    <Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No activity recorded yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
