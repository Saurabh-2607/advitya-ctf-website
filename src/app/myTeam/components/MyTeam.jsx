"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Mail, CheckCircle, User } from "lucide-react";

const page = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user || !isAuthenticated) {
      toast.error("Log in to view your Team", {
        theme: "dark",
        position: "bottom-right",
        toastId: "myTeam",
      });

      router.push("/Auth/login");
      return;
    }

    fetchTeam();
  }, [user, isAuthenticated]);

  const fetchTeam = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/user/team", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTeam(data.team);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">Loading Your Team...</div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white/50">
        You are not part of any team yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
        </div>

        <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium">
          <Users className="w-4 h-4" />
          Score: {team.score}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10 text-white/70 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Solved</th>
            </tr>
          </thead>

          <tbody>
            {team.members.map((member) => {
              const isLeader =
                String(member._id) === String(team.leader?._id);

              return (
                <tr
                  key={member._id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-white/40" />
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/30" />
                      {member.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {isLeader ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        LEADER
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70 border border-white/20">
                        MEMBER
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 w-[260px]">
                    {member.solvedChallenges?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {member.solvedChallenges.map((ch) => (
                          <span
                            key={ch._id}
                            className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30 whitespace-nowrap"
                          >
                            {ch.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/40 italic">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;