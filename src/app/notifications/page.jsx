"use client";

import React, { useEffect, useState } from "react";
import { Bell, Users, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const tabs = [
  { id: "global", label: "Global", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "personal", label: "Personal", icon: User },
];

const NotificationsPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("global");
  const [globalNotifs, setGlobalNotifs] = useState([]);
  const [teamNotifs, setTeamNotifs] = useState([]);
  const [personalNotifs, setPersonalNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      toast.error("Login first to view notifications", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "notif-auth",
      });

      setError("Authentication required");
      setLoading(false);
      router.replace("/Auth/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch notifications");
        }

        const globals = [];
        const teams = [];
        const personals = [];

        data.notifications.forEach((n) => {
          if (n.scope === "global") globals.push(n);
          if (n.scope === "team") teams.push(n);
          if (n.scope === "user") personals.push(n);
        });

        setGlobalNotifs(globals);
        setTeamNotifs(teams);
        setPersonalNotifs(personals);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-neutral-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
            Loading Notifications...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <div className="text-red-400 font-bold mb-2">Error</div>
          <div className="text-neutral-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  const activeData =
    activeTab === "global"
      ? globalNotifs
      : activeTab === "team"
      ? teamNotifs
      : personalNotifs;

  return (
    <div className="flex flex-col bg-neutral-950 text-white">

      <main className="flex-1 w-full pb-32 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Notification History</h1>

          <NotificationList notifications={activeData} />
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="flex gap-2 bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 p-2 rounded-2xl shadow-2xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative p-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-white text-black scale-110"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />

                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 text-xs font-semibold bg-neutral-900 border border-neutral-800 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NotificationsPage;


const NotificationList = ({ notifications }) => {
  if (!notifications.length) {
    return (
      <div className="text-neutral-500 italic text-sm">
        No notifications found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((note) => (
        <div
          key={note._id}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-neutral-500 font-mono">
              {new Date(note.createdAt).toLocaleString()}
            </span>

            <LevelBadge level={note.level} />
          </div>

          <div className="text-sm text-neutral-200 mb-2">
            {note.message}
          </div>

          <div className="text-[10px] uppercase tracking-wider text-neutral-500">
            {note.type}
          </div>
        </div>
      ))}
    </div>
  );
};

const LevelBadge = ({ level }) => {
  const styles = {
    critical: "bg-red-500/20 text-red-400 border-red-500/40",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  };

  const label = (level || "info").toUpperCase();

  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-md border font-semibold tracking-wider ${
        styles[level] || styles.info
      }`}
    >
      {label}
    </span>
  );
};