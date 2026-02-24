"use client";

import { Download, Shield, Eye, EyeOff, Trophy, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
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

export default function NormalChallenge({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
  onEdit
}) {
  const [visibleFlags, setVisibleFlags] = useState(new Set());

  const toggleFlagVisibility = (challengeId) => {
    setVisibleFlags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <span className="flex items-center gap-2 px-2 py-1 bg-white/80 text-black text-xs rounded-full">
            <span className="font-bold uppercase">{challenge.category}</span>
            <span className="font-semibold">Normal</span>
          </span>

          {/* Points */}
          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
            <Trophy className="w-3 h-3" />
            {challenge.value}
          </div>

          {/* Visibility */}
          <div
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${challenge.visible
                ? "bg-green-900/60 text-green-300"
                : "bg-red-900/60 text-red-300"
              }`}
          >
            {challenge.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            {challenge.visible ? "Live" : "Hidden"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(challenge)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleVisibility(challenge._id, challenge.visible)}
            disabled={togglingId === challenge._id}
            className={`p-2 rounded transition ${challenge.visible
                ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
              }`}
          >
            {togglingId === challenge._id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : challenge.visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onDeleteChallenge(challenge._id)}
            disabled={deletingId === challenge._id}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded disabled:opacity-50 transition"
          >
            {deletingId === challenge._id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Title + Author */}
      <div>
        <div className="flex flex-wrap items-baseline gap-2 mb-2">
          <h3 className="text-xl font-bold text-white">
            {challenge.name}
          </h3>
          <span className="text-sm text-white/70">by {challenge.author}</span>
        </div>

        {/* Description */}
        <div className="markdown prose prose-sm prose-invert max-w-none bg-white/5 border border-white/10 rounded p-3">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
          >
            {challenge.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Flag */}
        <div className="bg-white/5 border border-white/10 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-white uppercase">
                Flag
              </span>
            </div>

            <button
              onClick={() => toggleFlagVisibility(challenge._id)}
              className="p-1 text-white/70 hover:text-white"
            >
              {visibleFlags.has(challenge._id) ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
            </button>
          </div>

          <div className="bg-black/20 rounded p-2">
            <code className="text-xs text-slate-200 font-mono break-all">
              {visibleFlags.has(challenge._id)
                ? challenge.flag
                : "•".repeat(Math.min(challenge.flag.length, 20))}
            </code>
          </div>
        </div>

        {/* File */}
        {challenge.file_url && (
          <div className="bg-white/5 border border-white/10 rounded p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">File</p>
              <p className="text-xs text-white/70">Download available</p>
            </div>

            <a
              href={challenge.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/90 hover:bg-white text-black px-3 py-2 rounded-full text-xs font-medium transition"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
