"use client";

import React, { useEffect, useState, useRef } from "react";
import { Trophy, Filter, CheckCircle, Clock, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import ChallengeGrid from "./ChallengeGrid";
import ChallengeModal from "./ChallengeModal";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [solvedChallenges, setSolvedChallenges] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingFlag, setSubmittingFlag] = useState(null);
  const [flagInputs, setFlagInputs] = useState({});
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web", label: "Web" },
    { value: "OSINT", label: "OSINT" },
    { value: "pwn", label: "PWN" },
    { value: "crypto", label: "Crypto" },
    { value: "forensics", label: "Forensics" },
    { value: "reverse", label: "Reverse" },
    { value: "misc", label: "Misc" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login First to View Challenges", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth error",
      });
      setError("Authentication Error");
      setLoading(false);
      router.replace("/Auth/login");

      return;
    }
    if (!user) {
      toast.error("Login First to View Challenges", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth error",
      });
      setError("Authentication Error");
      setLoading(false);
      router.replace("/Auth/login");
      return;
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/challenges", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch challenges");
        }

        setChallenges(data.challenges);
        setFilteredChallenges(data.challenges);

        if (data.solved && Array.isArray(data.solved)) {
          setSolvedChallenges(new Set(data.solved));
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredChallenges(challenges);
    } else {
      setFilteredChallenges(
        challenges.filter(
          (challenge) =>
            challenge.category.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }
  }, [selectedCategory, challenges]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFlagInputChange = (challengeId, value) => {
    setFlagInputs((prev) => ({
      ...prev,
      [challengeId]: value,
    }));
  };

  const submitFlag = async (challengeId) => {
    const flag = flagInputs[challengeId]?.trim();
    if (!flag) return;

    setSubmittingFlag(challengeId);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId,
          flag,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSolvedChallenges((prev) => new Set([...prev, challengeId]));
        setFlagInputs((prev) => ({
          ...prev,
          [challengeId]: "",
        }));
        
        // Custom Solved Toast
        toast(
          <div className="flex items-start gap-4 p-1">
             <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-in zoom-in spin-in-90 duration-300">
                   <Check className="w-5 h-5 text-emerald-500" />
                </div>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight mb-1">Challenge Solved!</p>
                <p className="text-xs text-neutral-400 leading-snug break-words">{data.message}</p>
             </div>
          </div>
        , {
          position: "bottom-right",
          autoClose: 4000,
          theme: "dark",
          style: {
              background: "#09090b", // neutral-950
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "8px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" 
          },
          progressStyle: {
              background: "#10b981", // emerald-500
              height: "2px"
          },
          hideProgressBar: false,
          icon: false
        });

        setSelectedChallenge(null);
      } else {
        toast.error(data.message, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Error submitting flag. Please try again.", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setSubmittingFlag(null);
    }
  };

  const handleKeyPress = (e, challengeId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFlag(challengeId);
    }
  };

  const openChallengeModal = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const closeChallengeModal = () => {
    setSelectedChallenge(null);
  };

  if (role === "sudo") {
    return (
      <div className="min-h-[80vh] bg-[#09090b] flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-white font-bold text-xl mb-2 tracking-widest uppercase">
            Restricted Access
          </div>
          <div className="text-neutral-400 font-mono text-sm">
            Admin accounts are prohibited from competition entry.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#09090b] flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
          <div className="text-neutral-400 font-mono text-sm tracking-widest uppercase animate-pulse">
            Initializing System...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] bg-[#09090b] flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-white font-bold text-xl mb-2 tracking-widest uppercase">System Message</div>
          <div className="text-neutral-400 font-mono text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      
      {isAuthenticated && (
        <div className="relative z-10 pb-20">
          {/* Header Section */}
          <div className="pt-6 pb-2">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Challenges
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-neutral-900 border-2 border-neutral-800 pr-5 pl-1.5 py-1.5 rounded-full">
                    <div className="p-2 bg-neutral-800 rounded-full border border-neutral-700">
                      <Trophy className="w-3.5 h-3.5 text-neutral-200" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] text-neutral-500 font-bold tracking-widest uppercase">
                        Solved
                      </span>
                      <span className="text-xl font-bold font-mono text-white leading-none">
                        {solvedChallenges.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              filteredChallenges={filteredChallenges}
              challenges={challenges}
              onCategoryChange={handleCategoryChange}
            />

            <ChallengeGrid
              challenges={filteredChallenges}
              selectedCategory={selectedCategory}
              solvedChallenges={solvedChallenges}
              categories={categories}
              onChallengeClick={openChallengeModal}
            />
          </div>

          <ChallengeModal
            challenge={selectedChallenge}
            isSolved={
              selectedChallenge
                ? solvedChallenges.has(selectedChallenge._id)
                : false
            }
            flagInput={
              selectedChallenge ? flagInputs[selectedChallenge._id] || "" : ""
            }
            onFlagChange={(value) =>
              handleFlagInputChange(selectedChallenge._id, value)
            }
            onKeyPress={handleKeyPress}
            onSubmit={submitFlag}
            onClose={closeChallengeModal}
            submittingFlag={submittingFlag}
          />
        </div>
      )}
    </div>
  );
};

export default Challenges;
