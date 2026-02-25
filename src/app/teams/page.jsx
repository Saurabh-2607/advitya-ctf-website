"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Crown, Shield, Trophy, User } from "lucide-react";

const TeamPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we want to allow public viewing, we can remove this check or make it optional
    // but the original code had it.
    if (!user) {
      router.push("/Auth/login");
      return;
    }

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/team", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.success) {
          setTeams(data.teams ? data.teams : []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Loading Teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Participating Teams</h1>
            <p className="text-neutral-500 text-sm">View all registered teams and their progress</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-4 py-2 rounded-full backdrop-blur-md">
          <Users className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-300 text-sm font-medium">Total: <span className="text-white font-bold ml-1">{teams.length}</span></span>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/80">
                    <th className="pl-8 pr-6 py-5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[25%]">
                        Team Information
                    </th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[35%]">
                        Members
                    </th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold w-[40%]">
                        Solved Challenges
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/50">
                {teams.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="px-8 py-12 text-center text-neutral-500">
                            No teams registered yet.
                        </td>
                    </tr>
                ) : (
                    teams.map((team) => (
                    <tr key={team._id} className="group hover:bg-white/[0.02] transition-colors">
                        {/* Team Name */}
                        <td className="pl-8 pr-6 py-6 align-top">
                            <div>
                                <div className="font-bold text-lg text-neutral-200 group-hover:text-white transition-colors">
                                    {team.name}
                                </div>
                            </div>
                        </td>

                        {/* Members */}
                        <td className="px-6 py-6 align-top">
                            <div className="flex flex-col gap-2">
                                {/* Leader First */}
                                {team.members
                                    .sort((a, b) => (a._id === team.leader._id ? -1 : 1))
                                    .map((member) => {
                                        const isLeader = member._id === team.leader._id;
                                        return (
                                            <div key={member._id} className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                                                <span className={`text-sm ${isLeader ? 'text-neutral-300 font-medium' : 'text-neutral-500'}`}>
                                                    {member.name}
                                                </span>
                                                {isLeader && (
                                                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1 border border-neutral-800 px-1.5 py-0.5 rounded-full bg-neutral-900/50">
                                                        Leader
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </td>

                        {/* Solved Challenges */}
                        <td className="px-6 py-6 align-top">
                        {team.solvedChallenges && team.solvedChallenges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                            {team.solvedChallenges.map((c, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-[10px] font-mono font-medium rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 transition-all cursor-default"
                                >
                                {c.name || 'Challenge'}
                                </span>
                            ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-neutral-600 text-sm italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span>
                                No solves yet
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
