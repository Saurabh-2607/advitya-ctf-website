"use client";

import React from "react";
import { Trophy, Check, ArrowRight } from "lucide-react";

const ChallengeCard = ({ challenge, isSolved, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-neutral-900/60 p-5 backdrop-blur-md transition-all duration-300 ${
        isSolved
          ? "border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]"
          : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
      
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-400">
                {challenge.category}
            </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1.5 leading-tight group-hover:text-neutral-200 transition-colors truncate tracking-tight">
            {challenge.name}
        </h3>
        <p className="text-[10px] text-neutral-500 font-mono tracking-wide truncate">
            CREATED BY <span className="text-white font-bold ml-1">{challenge.author}</span>
        </p>
      </div>

      <div className={`relative z-10 flex items-end justify-between mt-auto pt-4 border-t border-dashed transition-colors ${
        isSolved ? "border-emerald-500/30" : "border-neutral-800 group-hover:border-neutral-700"
      }`}>
        <div className="flex flex-col gap-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">Reward</span>
            <div className="flex items-center gap-1.5">
                <Trophy className={`w-3.5 h-3.5 ${isSolved ? "text-emerald-500" : "text-neutral-500"}`} />
                <span className={`text-lg font-bold font-mono leading-none ${isSolved ? "text-emerald-400" : "text-white"}`}>
                    {challenge.value}
                </span>
            </div>
        </div>
        
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-neutral-900 border-neutral-800 ${
            isSolved
            ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-black"
            : "group-hover:bg-neutral-200 group-hover:text-black"
        }`}>
            {isSolved ? (
                <div className="relative w-5 h-5">
                    <Check className="absolute inset-0 w-full h-full transition-all duration-300 opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-75" />
                    <ArrowRight className="absolute inset-0 w-full h-full transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                </div>
            ) : (
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
