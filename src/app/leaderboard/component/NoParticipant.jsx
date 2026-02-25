import React from "react";
import { Trophy } from "lucide-react";

const NoParticipant = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-2xl p-16 text-center">
      <div className="w-16 h-16 bg-neutral-900/80 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-800 shadow-inner">
        <Trophy className="w-8 h-8 text-neutral-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        No participants yet
      </h3>
      <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Be the first to join the competition</p>
    </div>
  );
};

export default NoParticipant;
