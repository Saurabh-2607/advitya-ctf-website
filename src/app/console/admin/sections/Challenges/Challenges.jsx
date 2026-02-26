"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import GetChallenges from "./components/GetChallenges";
import NewNormalChall from "./components/NewNormalChall";
import NewInstanceChall from "./components/NewInstanceChall";
import EditNormalChall from "./components/EditNormalChall";
import { useAuth } from "@/context/AuthContext";

const Challenges = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [buildingId, setBuildingId] = useState(null);
  const [editingChallenge, setEditingChallenge] = useState(null);

  const [showNewNormal, setShowNewNormal] = useState(false);
  const [showNewInstance, setShowNewInstance] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  /* ---------- auth + initial fetch ---------- */
  useEffect(() => {
    if (!user) {
      router.push("/Auth/login");
      return;
    }
    refreshChallenges();
  }, [user]);

  /* ---------- fetch ---------- */
  const refreshChallenges = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/admin/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success || data.role !== "sudo") {
        router.push("/");
        return;
      }

      setChallenges(data.challenges || []);
    } catch (err) {
      console.error("Fetch error:", err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- toggle visibility ---------- */
  const toggleVisibility = async (challengeId, currentVisibility) => {
    setTogglingId(challengeId);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/admin/challenges/toggleVisiblity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId,
          visible: !currentVisibility,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setChallenges((prev) =>
          prev.map((ch) =>
            ch._id === challengeId
              ? { ...ch, visible: !currentVisibility }
              : ch,
          ),
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  /* ---------- delete ---------- */
  const deleteChallenge = async (challengeId) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    const adminPassword = prompt(
      "Enter your admin password to confirm deletion:",
    );
    if (!adminPassword) return;

    setDeletingId(challengeId);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/challenges/${challengeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setChallenges((prev) => prev.filter((c) => c._id !== challengeId));
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);

    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
  };

  const buildInstance = async (id) => {
    setBuildingId(id);
    setChallenges((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
            ...c,
            instance: {
              ...c.instance,
              buildStatus: "building",
              buildError: null,
            },
          }
          : c,
      ),
    );
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/challenges/instance/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeId: id }),
      });

      const data = await res.json();
      if (data.success) {
        setChallenges((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                ...c,
                instance: {
                  ...c.instance,
                  buildStatus: "built",
                  buildError: null
                },
              }
              : c,
          ),
        );
      }
      if (!data.success) {
        setChallenges((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                ...c,
                instance: {
                  ...c.instance,
                  buildStatus: "failed",
                  buildError: data.message || "Build failed",
                },
              }
              : c,
          ),
        );
      }
    } catch (err) {
      setChallenges((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
              ...c,
              instance: {
                ...c.instance,
                buildStatus: "failed",
                buildError: err.message || "Build failed",
              },
            }
            : c,
        ),
      );
    } finally {
      setBuildingId(null);
    }
  };

  const getUniqueValues = (key) => {
    const values = challenges.map((c) => c[key] || "Unknown");
    return ["All", ...new Set(values)];
  };

  const categories = getUniqueValues("category");
  const authors = getUniqueValues("author");
  const statuses = ["All", "Live", "Hidden"];

  const filteredChallenges = challenges.filter((c) => {
    const matchCategory =
      selectedCategory === "All" || (c.category || "Unknown") === selectedCategory;
    const matchAuthor =
      selectedAuthor === "All" || (c.author || "Unknown") === selectedAuthor;
    const matchStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Live" ? c.visible : !c.visible);

    return matchCategory && matchAuthor && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Challenges (Admin)
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowNewNormal(true)}
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Challenge
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-xs text-neutral-400 font-medium ml-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-neutral-800 text-white text-sm border border-neutral-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div className="space-y-1">
          <label className="text-xs text-neutral-400 font-medium ml-1">
            Author
          </label>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full bg-neutral-800 text-white text-sm border border-neutral-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {authors.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs text-neutral-400 font-medium ml-1">
            Visibility
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-neutral-800 text-white text-sm border border-neutral-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}
      <GetChallenges
        challenges={filteredChallenges}
        loading={loading}
        togglingId={togglingId}
        deletingId={deletingId}
        onToggleVisibility={toggleVisibility}
        onDeleteChallenge={deleteChallenge}
        onBuildInstance={buildInstance}
        onEdit={handleEdit}
      />

      {/* MODALS */}
      {showNewNormal && (
        <NewNormalChall
          onClose={() => setShowNewNormal(false)}
          onCreated={refreshChallenges}
        />
      )}

      {editingChallenge && (
        <EditNormalChall
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onUpdated={(updatedChallenge) => {
            setChallenges((prev) =>
              prev.map((c) =>
                c._id === updatedChallenge._id ? updatedChallenge : c
              )
            );
          }}
        />
      )}

      {showNewInstance && (
        <NewInstanceChall
          onClose={() => setShowNewInstance(false)}
          onCreated={refreshChallenges}
        />
      )}
    </div>
  );
};

export default Challenges;


