// src/Revision/AllProblemsTable.jsx

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemDetailsModal from "./ProblemDetailsModal";

const AllProblemsTable = ({
  problems,
  onMarkAsSolved,
  onUpdateNotes,
  intervals,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Detect if the device is a touch device (mobile/tablet)
  useEffect(() => {
    const checkDevice = () => {
      // (hover: none) typically indicates a primary input mechanism that cannot hover (like a touchscreen)
      const isTouch = window.matchMedia("(hover: none)").matches;
      setIsTouchDevice(isTouch);
    };

    checkDevice();

    // Listen for changes (e.g., if user attaches a mouse to a tablet)
    const mediaQuery = window.matchMedia("(hover: none)");
    const handler = (e) => setIsTouchDevice(e.matches);

    // Safety check for older browsers
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const handleInteraction = (index, type) => {
    // If it's a touch device, we ignore 'enter' and 'leave' events
    // to prevent the "double fire" bug where hover opens it and click immediately closes it.
    if (isTouchDevice && (type === "enter" || type === "leave")) {
      return;
    }

    if (type === "enter") setActiveTooltip(index);
    else if (type === "leave") setActiveTooltip(null);
    else if (type === "click") {
      setActiveTooltip((prev) => (prev === index ? null : index));
    }
  };

  if (uniqueProblems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/50 p-16 text-center bg-slate-800/20"
      >
        <div className="text-6xl mb-4">🗂️</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">
          No History Yet
        </h3>
        <p className="text-slate-500 max-w-md">
          Your revision history will appear here once you start solving
          problems.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="overflow-visible"
      >
        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6"
                >
                  S.No.
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200"
                >
                  Problem
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200"
                >
                  Difficulty
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200"
                >
                  Solved on
                </th>
                {intervals.map((interval) => (
                  <th
                    key={interval.label}
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-slate-200 whitespace-nowrap"
                  >
                    {interval.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {uniqueProblems.map((problem, index) => (
                <tr
                  key={problem.id || index}
                  className="hover:bg-slate-800/50 group/row transition-colors cursor-pointer"
                  onClick={() => setSelectedProblem(problem)}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-500 sm:pl-6">
                    {index + 1}
                  </td>

                  {/* Problem Name Cell with Interactive Tooltip */}
                  <td className="px-3 py-4 text-sm text-slate-300 relative">
                    <div
                      className="relative inline-block"
                      onMouseEnter={() => handleInteraction(index, "enter")}
                      onMouseLeave={() => handleInteraction(index, "leave")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(index, "click");
                      }}
                    >
                      <span className="hover:text-cyan-400 transition-colors cursor-pointer select-none">
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
                            className="absolute left-0 top-full mt-2 z-50 w-64 p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl"
                            style={{ pointerEvents: "auto" }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside tooltip
                          >
                            {/* Triangle Pointer */}
                            <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-800 border-t border-l border-slate-700 rotate-45"></div>

                            <div className="relative z-10 space-y-3">
                              {/* Platform Info */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                  Platform
                                </span>
                                <span className="ml-auto text-xs font-medium text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                                  {problem.platform || "Custom"}
                                </span>
                              </div>

                              <div className="h-px bg-slate-700/50 my-2"></div>

                              {/* Topics/Tags Info */}
                              <div>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                                  Topics
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {problem.tags && problem.tags.length > 0 ? (
                                    problem.tags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] px-2 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600"
                                      >
                                        {tag}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-slate-600 italic">
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

                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {problem.difficulty ? (
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                    {formatDate(problem.createdAt)}
                  </td>
                  {intervals.map((interval, i) => {
                    const solveCount = problem.solveCount || 0;
                    const isCompleted = solveCount > i;

                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap px-3 py-4 text-sm text-center"
                      >
                        {isCompleted ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-green-400 font-bold">✔️</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">•</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
