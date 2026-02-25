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
      <div className="min-h-[80vh] flex items-center justify-center text-gray-400">
        Loading MyTeam...
      </div>
    );
  }

  if (team) {
    return <MyTeam />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center space-y-8">
      {/* MENU */}
      {view === "menu" && (
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-3xl font-bold text-slate-100">
            Create or Join Team
          </h1>
          {/* Join Team */}
          <button
            onClick={() => setView("join")}
            className="
              flex items-center gap-3
              px-6 py-4
              rounded-xl
              bg-white/5
              border border-white/20
              text-white
              hover:bg-white/10
              hover:border-white/40
              transition-all
              group
            "
          >
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition">
              <Users className="w-5 h-5" />
            </div>

            <div className="text-left">
              <div className="font-semibold">Join Team</div>
              <div className="text-xs text-gray-400">
                Use invite code & password
              </div>
            </div>
          </button>

          {/* Create Team */}
          <button
            onClick={() => setView("create")}
            className="
              flex items-center gap-3
              px-6 py-4
              rounded-xl
              bg-white/5
              border border-white/20
              text-white
              hover:bg-white/10
              hover:border-white/40
              transition-all
              group
            "
          >
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition">
              <PlusCircle className="w-5 h-5" />
            </div>

            <div className="text-left">
              <div className="font-semibold">Create Team</div>
              <div className="text-xs text-gray-400">Become a team captain</div>
            </div>
          </button>
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
