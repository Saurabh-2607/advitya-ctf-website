import React from "react";
import { Users, Mail, User, Trophy, Hash, Copy } from "lucide-react";
import { toast } from "react-toastify";

const MyTeam = ({ team }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 2000
    });
  };

  if (!team) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            {team.name}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <button 
                onClick={() => copyToClipboard(team._id)}
                className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors group"
                title="Copy Team ID"
            >
                <Hash className="w-4 h-4" />
                <span className="font-mono">{team._id}</span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            {team.teamCode && (
                 <button 
                    onClick={() => copyToClipboard(team.teamCode)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors group"
                    title="Copy Invite Code"
                >
                    <span className="font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-xs">
                        Code: {team.teamCode}
                    </span>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-full bg-neutral-900/50 border border-neutral-800 backdrop-blur-md flex items-center gap-3 shadow-lg">
                <Trophy className="w-5 h-5 text-neutral-400" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold leading-none mb-1">Current Score</span>
                    <span className="text-xl font-bold text-white leading-none font-mono">{team.score} <span className="text-sm text-neutral-600 font-normal">pts</span></span>
                </div>
            </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-xl">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-neutral-400" />
                Team Members
            </h2>
            <span className="text-xs font-mono text-neutral-500 px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
                {team.members.length} / 4
            </span>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/80">
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[30%]">
                    Member Details
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[30%]">
                    Contact
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[15%]">
                    Role
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[25%]">
                    Solved Challenges
                </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/50">
                {team.members.map((member) => {
                const isLeader =
                    String(member._id) === String(team.leader?._id);

                return (
                    <tr
                    key={member._id}
                    className="group hover:bg-white/[0.02] transition-colors"
                    >
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                isLeader ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-900 border-neutral-800'
                            }`}>
                                <User className={`w-5 h-5 ${isLeader ? 'text-neutral-300' : 'text-neutral-500'}`} />
                            </div>
                            <span className={`font-medium ${isLeader ? 'text-white' : 'text-neutral-300'}`}>
                                {member.name}
                            </span>
                        </div>
                    </td>

                    <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors">
                        <Mail className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{member.email}</span>
                        </div>
                    </td>

                    <td className="px-6 py-5">
                        {isLeader ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-neutral-800 text-neutral-300 border border-neutral-700 shadow-sm">
                            Leader
                        </span>
                        ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-neutral-900 text-neutral-500 border border-neutral-800">
                            Member
                        </span>
                        )}
                    </td>

                    <td className="px-6 py-5">
                        {member.solvedChallenges?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {member.solvedChallenges.map((ch, idx) => (
                            <span
                                key={idx}
                                title={ch.name}
                                className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-default"
                            >
                                {ch.name}
                            </span>
                            ))}
                        </div>
                        ) : (
                        <span className="text-xs text-neutral-600 italic pl-1">—</span>
                        )}
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;