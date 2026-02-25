"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Users, Calendar, CheckCircle, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Access denied");
        }

        setUsers(data.users);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, {
          theme: "dark",
          position: "bottom-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-neutral-100 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-neutral-400 font-medium animate-pulse">
            Loading Users...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-md">
          <div className="text-red-400 font-semibold mb-2">Error Loading Users</div>
          <p className="text-neutral-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-neutral-400 mt-1">Monitor and manage registered participants</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="text-neutral-400">Total Users:</span>
            <span className="font-bold">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-neutral-800/50 text-neutral-400 font-semibold uppercase tracking-wider text-xs border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Date Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-neutral-800/30 transition-colors group"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-400 group-hover:text-neutral-300 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {user.role === "sudo" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/10">
                        <Shield className="w-3 h-3" /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                        USER
                      </span>
                    )}
                  </td>

                  {/* Team */}
                  <td className="px-6 py-4">
                    {user.team ? (
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center">
                          <Users className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="font-medium">{user.team.name}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-600 italic text-xs">No Team</span>
                    )}
                  </td>

                  {/* Solved */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono font-medium">{user.solvedChallenges?.length || 0}</span>
                      <span className="text-xs text-neutral-500 uppercase tracking-widest">Solves</span>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
