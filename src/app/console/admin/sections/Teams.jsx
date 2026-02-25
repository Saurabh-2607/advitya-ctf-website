"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Trophy, Mail } from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/Auth/login");
      return;
    }

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/admin/teams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success || data.role !== "sudo") {
          router.push("/");
          return;
        }

        setTeams(data.teams || []);
      } catch (err) {
        console.error("Fetch error:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-neutral-100 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-neutral-400 font-medium animate-pulse">
            Loading Teams...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Management</h1>
          <p className="text-neutral-400 mt-1">Monitor team progress and member details</p>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-neutral-400">Total Teams:</span>
          <span className="font-bold">{teams.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-neutral-800/50 text-neutral-400 font-semibold uppercase tracking-wider text-xs border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Team Info</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Roles</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 w-[300px]">Solved Challenges</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800">
              {teams.map((team) => (
                <tr key={team._id} className="hover:bg-neutral-800/30 transition-colors">
                  {/* Team */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold border border-neutral-700">
                        {team.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{team.name}</span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full w-fit border border-amber-500/10 font-medium">
                      <Trophy className="w-3.5 h-3.5" />
                      {team.score} pts
                    </div>
                  </td>

                  {/* Members */}
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      {team.members.map((m) => (
                        <div key={m._id} className="text-neutral-300 font-medium h-6 flex items-center">
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      {team.members.map((m) => (
                        <div key={m._id} className="h-6 flex items-center">
                          {m._id === team.leader ? (
                            <span className="text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">Leader</span>
                          ) : (
                            <span className="text-neutral-500 text-xs font-medium">Member</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Emails */}
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      {team.members.map((m) => (
                        <div key={m._id} className="h-6 flex items-center gap-2 text-neutral-400 text-xs">
                          <Mail className="w-3 h-3" />
                          {m.email}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Solved Challenges */}
                  <td className="px-6 py-4 align-top w-[300px]">
                    {team.members.some((m) => m.solvedChallenges?.length > 0) ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {team.members.flatMap((m) =>
                          m.solvedChallenges?.map((ch) => (
                            <span
                              key={`${m._id}-${ch._id}`}
                              className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide truncate max-w-[120px]"
                              title={ch.name}
                            >
                              {ch.name}
                            </span>
                          ))
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-600 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
