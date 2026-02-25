"use client";

import React, { useEffect } from "react";
import { X, Download, Trophy, User, Check, Clock, ArrowRight } from "lucide-react";
import InstancePanel from "@/app/challenges/InstancePanel";
import MarkdownRenderer from "./MarkdownRenderer";
import FlagSubmit from "./FlagSubmit";

const ChallengeModal = ({
  challenge,
  isSolved,
  flagInput,
  onFlagChange,
  onKeyPress,
  onSubmit,
  onClose,
  submittingFlag,
}) => {
  useEffect(() => {
    if (!challenge) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [challenge]);

  if (!challenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Terminal Style */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-white/20 border border-white/50"></div>
                 <div className="w-3 h-3 rounded-full bg-white/20 border border-white/50"></div>
                 <div className="w-3 h-3 rounded-full bg-white/20 border border-white/50"></div>
              </div>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                 <span className="text-white">root@ctf:</span>
                 <span>~/challenges/{challenge.category}/{challenge.name.toLowerCase().replace(/\s+/g, '_')}</span>
              </div>
           </div>

           <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
           >
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="p-8 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 
                 {/* Left Column: Info, Briefing, Assets */}
                 <div className="lg:col-span-2 space-y-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                             {challenge.category}
                          </span>
                          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                             {challenge.name}
                          </h2>
                       </div>
                       
                       <div className="flex items-center gap-4 text-sm text-neutral-400 font-mono">
                          <div className="flex items-center gap-2">
                             <User className="w-4 h-4 text-neutral-500" />
                             <span>{challenge.author}</span>
                          </div>
                          <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
                          <div className="flex items-center gap-2 text-white">
                             <Trophy className="w-4 h-4" />
                             <span className="font-bold">{challenge.value} pts</span>
                          </div>
                       </div>
                    </div>

                    {/* Mission Briefing */}
                    <div className="prose prose-invert prose-p:text-neutral-400 prose-headings:text-white max-w-none">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-l-2 border-white pl-3">
                          Mission Briefing
                       </h3>
                       <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                          <MarkdownRenderer content={challenge.description} />
                       </div>
                    </div>

                    {/* Assets */}
                    {challenge.file_url && (
                        <div>
                           <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-l-2 border-white pl-3">
                              Assets
                           </h3>
                           <a
                              href={challenge.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white/10 rounded-lg text-white group-hover:text-white">
                                    <Download className="w-5 h-5" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white group-hover:underline">Download Challenge Files</span>
                                    <span className="text-xs text-neutral-500 font-mono">SECURE_TRANSFER_PROTOCOL</span>
                                 </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all" />
                           </a>
                        </div>
                    )}
                 </div>

                 {/* Right Column: Status & Submission */}
                 <div className="space-y-6">
                    {/* Status Box */}
                    {isSolved ? (
                       <div className="flex items-center gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                          <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-500/20">
                             <Check className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                             <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest mb-0.5">Status</p>
                             <p className="text-lg font-bold text-white leading-none">Challenge Solved</p>
                          </div>
                       </div>
                    ) : (
                       <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-3xl">
                          <div className="p-3 bg-white/10 rounded-full border border-white/10">
                             <Clock className="w-5 h-5 text-neutral-400" />
                          </div>
                          <div>
                             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-0.5">Status</p>
                             <p className="text-lg font-bold text-white leading-none">Unsolved</p>
                          </div>
                       </div>
                    )}

                    {/* Submission Interface */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-l-2 border-white pl-3">
                          Submission Interface
                       </h3>
                       
                       {isSolved ? (
                          <div className="text-center py-8 flex flex-col items-center justify-center">
                             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                                <Check className="w-8 h-8 text-emerald-500" />
                             </div>
                             <p className="text-white font-bold text-lg mb-1">Flag Captured!</p>
                             <p className="text-xs text-neutral-500 max-w-[200px] leading-relaxed">You have successfully completed this challenge.</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             <p className="text-xs text-gray-400 mb-4 font-mono">Enter the flag below to complete the mission.</p>
                             <FlagSubmit
                                challengeId={challenge._id}
                                flagInput={flagInput}
                                onFlagChange={onFlagChange}
                                onKeyPress={onKeyPress}
                                onSubmit={onSubmit}
                                submittingFlag={submittingFlag}
                             />
                          </div>
                       )}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
