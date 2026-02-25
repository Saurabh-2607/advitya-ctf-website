"use client";

import { Trophy, Eye, EyeOff, Trash2 } from "lucide-react";
import InstanceControl from "./InstanceControl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: ["className"],
    code: ["className"],
  },
};

export default function InstanceChallenge({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
  buildingId,
  onBuildInstance,
}) {
  return (
    <div className="bg-neutral-800/70 border-2 border-neutral-800 rounded-lg p-5 transition-all hover:border-neutral-700">
      
       {/* Header Row */}
       <div className="flex items-start justify-between mb-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h3 className="text-base font-bold text-white">{challenge.name}</h3>
               <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border bg-blue-500/10 text-blue-500 border-blue-500/20">
                 Docker
               </span>
               <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                 challenge.visible 
                   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                   : "bg-red-500/10 text-red-500 border-red-500/20"
               }`}>
                 {challenge.visible ? "Live" : "Hidden"}
               </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-neutral-400 font-bold">{challenge.category}</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  <span>{challenge.value} pts</span>
               </div>
               <div className="flex items-center gap-1">
                  <span className="text-neutral-600">by</span>
                  <span className="text-neutral-400">{challenge.author || 'Unknown'}</span>
               </div>
            </div>
         </div>
 
         <div className="flex items-center gap-2">
            {challenge.instance.buildStatus === "built" && (
                <button 
                  onClick={() => onToggleVisibility(challenge._id, challenge.visible)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded transition-colors"
                >
                   {togglingId === challenge._id ? (
                      <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin"/>
                   ) : (
                      challenge.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />
                   )}
                   {challenge.visible ? "Hide" : "Publish"}
                </button>
            )}
            
            <button onClick={() => onDeleteChallenge(challenge._id)} className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors">
               {deletingId === challenge._id ? (
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"/>
               ) : (
                  <Trash2 className="w-4 h-4" />
               )}
            </button>
         </div>
       </div>
 
       <div className="w-full h-px bg-neutral-900 mb-6" />
 
       {/* Main Content Area */}
       <div className="space-y-6">
          
          {/* Description (Full Width) */}
          <div>
             <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3">Public Description</h4>
             <div className="prose prose-invert prose-sm max-w-none prose-p:text-neutral-400 prose-headings:text-neutral-300 prose-a:text-blue-400 prose-code:text-neutral-300 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded">
               <ReactMarkdown
                 remarkPlugins={[remarkGfm]}
                 rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
               >
                 {challenge.description}
               </ReactMarkdown>
             </div>
          </div>
 
          {/* Footer: Instance Controls */}
          <div className="pt-4 border-t border-neutral-900/50">
               <div className="bg-neutral-900/50 border border-neutral-800 rounded p-4">
                     <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                           Instance Controls
                        </h4>
                     </div>
                     <InstanceControl
                        instance={challenge.instance}
                        building={buildingId === challenge._id}
                        onBuildInstance={() => onBuildInstance(challenge._id)}
                      />
               </div>
          </div>
 
       </div>
    </div>
  );
}

