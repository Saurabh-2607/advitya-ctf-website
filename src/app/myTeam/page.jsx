"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Users, PlusCircle } from "lucide-react";

import JoinTeam from "./components/JoinTeam";
import CreateTeam from "./components/CreateTeam";
import MyTeam from "./components/MyTeam";

const page = () => {
  const [view, setView] = useState("menu");
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
    }

    fetchTeam();
  }, [user, isAuthenticated, router]);

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
          <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Checking Team Status...</div>
        </div>
      </div>
    );
  }

  if (team) {
    return <MyTeam team={team} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center">
      {/* MENU */}
      {view === "menu" && (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                    Team Selection
                </h1>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Join an existing squad or establish a new team to compete in the challenges.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Join Team */}
                <button
                    onClick={() => setView("join")}
                    className="
                        group relative overflow-hidden
                        p-8 rounded-3xl
                        bg-neutral-900/40 border border-neutral-800
                        hover:bg-neutral-800/40 hover:border-neutral-700
                        transition-all duration-300
                        text-left
                    "
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Users className="w-6 h-6 text-neutral-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Join Existing Team</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                            Enter an invite code to join your teammates and start solving.
                        </p>
                    </div>
                </button>

                {/* Create Team */}
                <button
                    onClick={() => setView("create")}
                    className="
                        group relative overflow-hidden
                        p-8 rounded-3xl
                        bg-neutral-900/40 border border-neutral-800
                        hover:bg-neutral-800/40 hover:border-neutral-700
                        transition-all duration-300
                        text-left
                    "
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PlusCircle className="w-24 h-24 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                            <PlusCircle className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Create New Team</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                            Start a new team, invite members, and lead them to victory.
                        </p>
                    </div>
                </button>
            </div>
        </div>
      )}

      {/* JOIN */}
      {view === "join" && (
        <>
          <JoinTeam
            onJoined={async () => {
              await fetchTeam();
              setView("menu");
            }}
          />

          <button
            onClick={() => setView("menu")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        </>
      )}

      {/* CREATE */}
      {view === "create" && (
        <>
          <CreateTeam
            onCreated={async () => {
              await fetchTeam();
              setView("menu");
            }}
          />

          <button
            onClick={() => setView("menu")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        </>
      )}
    </div>
  );
};

export default page;
