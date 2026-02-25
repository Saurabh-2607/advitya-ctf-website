import React from "react";
import { Shield, Loader2, Hammer, Server, AlertCircle } from "lucide-react";

const statusStyleMap = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  building: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  built: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

const InstanceControl = ({ instance, onBuildInstance, building }) => {
  const { buildStatus, buildError } = instance;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Instance Status
        </span>
      </div>

      {/* STATUS BADGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider ${statusStyleMap[buildStatus] || "bg-neutral-800 text-neutral-400 border-neutral-700"}`}
        >
          {buildStatus === "building" && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          )}
          {buildStatus}
        </div>
        
        {buildStatus !== "building" && buildStatus !== "built" && (
          <button
            onClick={onBuildInstance}
            disabled={building}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-900 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <Hammer className="w-3.5 h-3.5" />
            {building ? "Building..." : "Build Image"}
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {buildStatus === "failed" && buildError && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-3 text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs font-mono break-all">
            <strong className="block mb-1 font-semibold">Build Error:</strong> 
            {buildError}
          </div>
        </div>
      )}

      {/* BUILDING NOTE */}
      {buildStatus === "building" && (
        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
           <p className="text-xs text-blue-300 leading-relaxed">
             Building container image... this may take 1-5 minutes depending on complexity. 
             If the status freezes, try reloading the page. Challenge will not be live until 'Built' status is confirmed.
           </p>
        </div>
      )}
    </div>
  );
};

export default InstanceControl;
