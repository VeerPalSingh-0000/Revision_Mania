// src/Revision/AllProblemsTable.jsx

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemDetailsModal from "./ProblemDetailsModal";

// --- SVG Icons ---
const FiSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FiFilter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const FiSort = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="15" y2="6"></line>
    <line x1="3" y1="12" x2="11" y2="12"></line>
    <line x1="3" y1="18" x2="7" y2="18"></line>
    <polyline points="16 16 19 19 22 16"></polyline>
    <line x1="19" y1="8" x2="19" y2="19"></line>
  </svg>
);

const FiX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FiTag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const FiCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AllProblemsTable = ({
  problems,
  onMarkAsSolved,
  onUpdateNotes,
  intervals,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("added-asc"); // Default: Order added (Oldest First)

  // Detect touch devices
  useEffect(() => {
    const checkDevice = () => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      setIsTouchDevice(isTouch);
    };

    checkDevice();
    const mediaQuery = window.matchMedia("(hover: none)");
    const handler = (e) => setIsTouchDevice(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const uniqueProblems = useMemo(() => {
    if (!problems) return [];

    const problemMap = new Map();

    problems.forEach((problem) => {
      const canonical = problem.problem.toLowerCase();

      if (problemMap.has(canonical)) {
        const existing = problemMap.get(canonical);
        existing.solveCount += problem.solveCount || 0;
        if (problem.tags && problem.tags.length > 0)
          existing.tags = problem.tags;
        if (problem.platform) existing.platform = problem.platform;
      } else {
        problemMap.set(canonical, { ...problem });
      }
    });

    return Array.from(problemMap.values());
  }, [problems]);

  // Extract unique topics with problem counts
  const allTopics = useMemo(() => {
    const topicCounts = new Map();

    uniqueProblems.forEach((problem) => {
      if (Array.isArray(problem.tags)) {
        problem.tags.forEach((tag) => {
          if (tag && tag.trim()) {
            const formattedTag = tag.trim();
            const existingKey = Array.from(topicCounts.keys()).find(
              (k) => k.toLowerCase() === formattedTag.toLowerCase()
            );
            const keyToUse = existingKey || formattedTag;
            topicCounts.set(keyToUse, (topicCounts.get(keyToUse) || 0) + 1);
          }
        });
      }
    });

    return Array.from(topicCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [uniqueProblems]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let result = [...uniqueProblems];

    // Filter by Topic
    if (selectedTopic && selectedTopic !== "all") {
      const targetTopic = selectedTopic.toLowerCase();
      result = result.filter(
        (p) =>
          Array.isArray(p.tags) &&
          p.tags.some((t) => t.toLowerCase() === targetTopic)
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.problem.toLowerCase().includes(q) ||
          (p.platform && p.platform.toLowerCase().includes(q)) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort problems
    const diffRank = { easy: 1, medium: 2, hard: 3 };

    result.sort((a, b) => {
      switch (sortBy) {
        case "added-asc": {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateA - dateB;
        }
        case "added-desc": {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        }
        case "difficulty-asc": {
          const rankA = diffRank[a.difficulty?.toLowerCase()] || 99;
          const rankB = diffRank[b.difficulty?.toLowerCase()] || 99;
          return rankA - rankB;
        }
        case "difficulty-desc": {
          const rankA = diffRank[a.difficulty?.toLowerCase()] || 99;
          const rankB = diffRank[b.difficulty?.toLowerCase()] || 99;
          return rankB - rankA;
        }
        case "name-asc":
          return a.problem.localeCompare(b.problem);
        case "solves-desc":
          return (b.solveCount || 0) - (a.solveCount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [uniqueProblems, selectedTopic, searchQuery, sortBy]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const handleInteraction = (index, type) => {
    if (isTouchDevice && (type === "enter" || type === "leave")) {
      return;
    }

    if (type === "enter") setActiveTooltip(index);
    else if (type === "leave") setActiveTooltip(null);
    else if (type === "click") {
      setActiveTooltip((prev) => (prev === index ? null : index));
    }
  };

  const handleResetFilters = () => {
    setSelectedTopic("all");
    setSearchQuery("");
    setSortBy("added-asc");
  };

  if (uniqueProblems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-10 text-center shadow-xl relative overflow-hidden"
      >
        <div className="w-14 h-14 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-3xl mb-4 shadow-inner text-slate-300">
          🗂️
        </div>

        <h3 className="text-base font-bold text-slate-100 tracking-tight">
          No History Yet
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed font-medium">
          Your problem history will appear here once you add some coding problems.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 overflow-visible"
      >
        {/* --- Premium Filter & Sorting Toolbar --- */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-4.5 shadow-xl backdrop-blur-xl space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input Field with Glow effect */}
            <div className="relative flex-1 min-w-[220px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search problem or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 border border-slate-800/90 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400/60 transition-all font-medium shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Filter & Sort Controls Group */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              
              {/* Topic Select Dropdown */}
              <div className="relative flex items-center gap-2 bg-slate-950/80 border border-slate-800/90 rounded-xl px-3 py-2 text-xs text-slate-200 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-400/60 transition-all">
                <span className="text-cyan-400 flex items-center">
                  <FiFilter />
                </span>
                <span className="font-bold text-slate-400 hidden xs:inline uppercase tracking-wider text-[10px]">
                  Topic:
                </span>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-100 outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-slate-900 text-slate-100">
                    All Topics ({uniqueProblems.length})
                  </option>
                  {allTopics.map((topic) => (
                    <option
                      key={topic.name}
                      value={topic.name}
                      className="bg-slate-900 text-slate-100"
                    >
                      {topic.name} ({topic.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Selector */}
              <div className="relative flex items-center gap-2 bg-slate-950/80 border border-slate-800/90 rounded-xl px-3 py-2 text-xs text-slate-200 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-400/60 transition-all">
                <span className="text-cyan-400 flex items-center">
                  <FiSort />
                </span>
                <span className="font-bold text-slate-400 hidden xs:inline uppercase tracking-wider text-[10px]">
                  Order:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-100 outline-none cursor-pointer pr-1"
                >
                  <option value="added-asc" className="bg-slate-900 text-slate-100">
                    Order Added (Oldest First)
                  </option>
                  <option value="added-desc" className="bg-slate-900 text-slate-100">
                    Order Added (Newest First)
                  </option>
                  <option value="difficulty-asc" className="bg-slate-900 text-slate-100">
                    Difficulty (Easy → Hard)
                  </option>
                  <option value="difficulty-desc" className="bg-slate-900 text-slate-100">
                    Difficulty (Hard → Easy)
                  </option>
                  <option value="name-asc" className="bg-slate-900 text-slate-100">
                    Problem Name (A → Z)
                  </option>
                  <option value="solves-desc" className="bg-slate-900 text-slate-100">
                    Most Solved
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Topic Filter Pills (Styled matching user screenshot with glowing effects) */}
          {allTopics.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 custom-scrollbar text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap mr-1 flex items-center gap-1">
                TOPICS:
              </span>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedTopic("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedTopic === "all"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                    : "bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-900"
                }`}
              >
                All ({uniqueProblems.length})
              </motion.button>
              {allTopics.map((topic) => {
                const isSelected = selectedTopic.toLowerCase() === topic.name.toLowerCase();
                return (
                  <motion.button
                    key={topic.name}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                        : "bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    {topic.name} ({topic.count})
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Filter Summary Banner */}
        {(selectedTopic !== "all" || searchQuery.trim()) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs backdrop-blur-md"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Active Filters:</span>
              {selectedTopic !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] shadow-sm">
                  <FiTag /> {selectedTopic}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
                  🔍 "{searchQuery}"
                </span>
              )}
              <span className="text-slate-400 font-medium text-[11px]">
                ({filteredProblems.length} {filteredProblems.length === 1 ? "question" : "questions"} in sequence)
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FiX /> Reset
            </button>
          </motion.div>
        )}

        {/* --- Problems Table or Empty Search Result --- */}
        {filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 text-center backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/60 flex items-center justify-center text-2xl mb-3 text-slate-400 shadow-inner">
              🔍
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              No matching questions found
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              No questions match topic "{selectedTopic}" {searchQuery ? `or query "${searchQuery}"` : ""}.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border border-slate-700/50"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="overflow-x-auto min-h-[400px] custom-scrollbar">
              <table className="min-w-full divide-y divide-slate-800/90">
                <thead className="bg-slate-900/90 backdrop-blur-md">
                  <tr>
                    <th
                      scope="col"
                      className="py-4 pl-4 pr-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider sm:pl-6"
                    >
                      S.No.
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider"
                    >
                      Problem
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider"
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider"
                    >
                      Solved on
                    </th>
                    {intervals.map((interval) => (
                      <th
                        key={interval.label}
                        scope="col"
                        className="px-3 py-4 text-center text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        {interval.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                  {filteredProblems.map((problem, index) => (
                    <tr
                      key={problem.id || index}
                      className="hover:bg-gradient-to-r hover:from-cyan-950/20 hover:to-slate-800/40 group/row transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedProblem(problem)}
                    >
                      {/* Monospace S.No. Badge */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                          #{index + 1}
                        </span>
                      </td>

                      {/* Problem Name Cell with Interactive Tooltip */}
                      <td className="px-3 py-4 text-sm text-slate-200 relative">
                        <div
                          className="relative inline-block"
                          onMouseEnter={() => handleInteraction(index, "enter")}
                          onMouseLeave={() => handleInteraction(index, "leave")}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInteraction(index, "click");
                          }}
                        >
                          <span className="hover:text-cyan-400 group-hover/row:text-cyan-300 transition-colors cursor-pointer select-none font-semibold text-sm">
                            {problem.problem}
                          </span>

                          {/* Tooltip Content via Framer Motion */}
                          <AnimatePresence>
                            {activeTooltip === index && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 top-full mt-2 z-50 w-64 p-4 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-xl"
                                style={{ pointerEvents: "auto" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-900 border-t border-l border-slate-700/80 rotate-45"></div>

                                <div className="relative z-10 space-y-3">
                                  {/* Platform Info */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                      Platform
                                    </span>
                                    <span className="ml-auto text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30 shadow-sm">
                                      {problem.platform || "Custom"}
                                    </span>
                                  </div>

                                  <div className="h-px bg-slate-800 my-2"></div>

                                  {/* Topics/Tags Info */}
                                  <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                      Topics
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {problem.tags && problem.tags.length > 0 ? (
                                        problem.tags.map((tag, i) => (
                                          <span
                                            key={i}
                                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                                              selectedTopic.toLowerCase() === tag.toLowerCase()
                                                ? "bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-sm"
                                                : "bg-slate-800 text-slate-300 border-slate-700"
                                            }`}
                                          >
                                            {tag}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-xs text-slate-500 italic">
                                          No tags added
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {problem.difficulty ? (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}
                          >
                            {problem.difficulty}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </td>

                      {/* Solved On Date */}
                      <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-slate-400">
                        {formatDate(problem.createdAt)}
                      </td>

                      {/* Interval Completion Icons */}
                      {intervals.map((interval, i) => {
                        const solveCount = problem.solveCount || 0;
                        const isCompleted = solveCount > i;

                        return (
                          <td
                            key={i}
                            className="whitespace-nowrap px-3 py-4 text-sm text-center"
                          >
                            {isCompleted ? (
                              <div className="flex flex-col items-center justify-center">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                                  <FiCheck />
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-600 text-sm">•</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Problem Details Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <ProblemDetailsModal
            problem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
            onMarkAsSolved={onMarkAsSolved}
            onUpdateNotes={onUpdateNotes}
            intervals={intervals}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AllProblemsTable;
