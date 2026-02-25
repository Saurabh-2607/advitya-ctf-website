import React, { memo } from "react";
import { Trophy, Medal, Crown } from "lucide-react";

const getRankStyle = (position) => {
    switch(position) {
        case 1: return { 
            bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]", 
            icon: <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> 
        };
        case 2: return { 
            bg: "bg-neutral-300/10 border-neutral-300/20 text-neutral-300", 
            icon: <Medal className="w-5 h-5 text-neutral-300" /> 
        };
        case 3: return { 
            bg: "bg-amber-700/10 border-amber-700/20 text-amber-600", 
            icon: <Medal className="w-5 h-5 text-amber-700" /> 
        };
        default: return { 
            bg: "bg-neutral-900 border-neutral-800 text-neutral-500", 
            icon: <span className="font-mono text-sm font-bold">{position}</span> 
        };
    }
};

const TableRow = memo(function TableRow({
  participant,
  position,
  isCurrentUser,
}) {
    const rankStyle = getRankStyle(position);

  return (
    <tr
      className={`
        group transition-all duration-200 border-b border-neutral-800/50 last:border-0
        ${isCurrentUser ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'hover:bg-white/[0.02]'}
      `}
    >
      {/* Rank */}
      <td className="px-6 py-5 w-24">
        <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center border
            ${rankStyle.bg}
            transition-transform group-hover:scale-110 duration-300
        `}>
            {rankStyle.icon}
        </div>
      </td>

      {/* Team */}
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <span className={`font-bold text-base tracking-tight transition-colors ${
                    isCurrentUser ? 'text-emerald-400' : 'text-neutral-300 group-hover:text-white'
                }`}>
                    {participant.name}
                </span>
                {isCurrentUser && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_-4px_rgba(16,185,129,0.3)]">
                        You
                    </span>
                )}
            </div>
        </div>
      </td>

      {/* Score */}
      <td className="px-6 py-5 text-right">
        <div className="flex flex-col items-end gap-1">
            <span className={`font-mono font-bold text-xl leading-none tracking-tight ${
                position === 1 ? 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 
                position === 2 ? 'text-neutral-300' : 
                position === 3 ? 'text-amber-600' : 'text-white'
            }`}>
                {participant.score}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold">Points</span>
        </div>
      </td>
    </tr>
  );
});

const FullRanking = ({ leaderboardData = [], currentUserInfo }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-2xl">
      <table className="w-full table-auto">
        {/* Header */}
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/80">
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
              Team
            </th>
            <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
              Score
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {leaderboardData.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800">
                        <Trophy className="w-8 h-8 text-neutral-700" />
                    </div>
                    <div>
                        <p className="text-neutral-400 font-bold">No Records Found</p>
                        <p className="text-neutral-600 text-sm mt-1">Be the first to score points!</p>
                    </div>
                </div>
              </td>
            </tr>
          )}

          {leaderboardData.map((participant, index) => {
            const position = index + 1;
            const isCurrentUser =
              currentUserInfo?.teamId === participant.teamId;

            return (
              <TableRow
                key={participant.teamId}
                participant={participant}
                position={position}
                isCurrentUser={isCurrentUser}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FullRanking;
