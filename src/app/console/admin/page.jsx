"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Flag,
  Shield,
  Bell,
  Terminal,
  Settings,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";

import Challenges from "@/app/console/admin/sections/Challenges/Challenges";
import UsersComponent from "@/app/console/admin/sections/Users";
import Teams from "@/app/console/admin/sections/Teams";
import Logs from "@/app/console/admin/sections/Logs";
import Notifications from "@/app/console/admin/sections/Notifications";
import Controls from "@/app/console/admin/sections/Controls";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "challenges", label: "Challenges", icon: Flag, component: Challenges },
  { id: "users", label: "Users", icon: Users, component: UsersComponent },
  { id: "teams", label: "Teams", icon: LayoutDashboard, component: Teams },
  {
    id: "notification",
    label: "Notifications",
    icon: Bell,
    component: Notifications,
  },
  { id: "logs", label: "System Logs", icon: Terminal, component: Logs },
  {
    id: "controls",
    label: "Controls",
    icon: Settings,
    component: Controls,
  },
];

export default function Page() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("challenges");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (role !== "sudo") {
      router.push("/");
    }

    setLoading(false);
  }, [user, router, role]);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
            Loading Admin Portal...
          </div>
        </div>
      </div>
    );
  }

  if (role !== "sudo") return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white font-sans relative">

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-32 overflow-y-auto">
         <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'challenges' && <Challenges />}
                {activeTab === 'users' && <UsersComponent />}
                {activeTab === 'teams' && <Teams />}
                {activeTab === 'notification' && <Notifications />}
                {activeTab === 'logs' && <Logs />}
                {activeTab === 'controls' && <Controls />}
            </div>
         </div>
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <nav className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 p-2 rounded-2xl shadow-2xl shadow-black/80 ring-1 ring-white/5">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            group relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center
                            ${isActive 
                                ? 'bg-white text-black shadow-lg shadow-white/20 scale-110' 
                                : 'text-neutral-400 hover:text-white hover:bg-white/10 hover:scale-105'
                            }
                        `}
                    >
                        <tab.icon className="w-5 h-5" />
                        
                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                            {tab.label}
                            {/* Little arrow at the bottom of tooltip */}
                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900"></span>
                        </span>
                    </button>
                )
            })}
        </nav>
      </div>

    </div>
  );
}
