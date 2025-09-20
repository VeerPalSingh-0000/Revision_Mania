// src/components/AllProblemsList.jsx

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemDetailsModal from "./ProblemDetailsModal.jsx";

// --- SVG Icons ---
const FiTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const FiRepeat = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);
const FiCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const FiUndo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

// --- Sub-components ---
const SolveTracker = ({ count }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-xs text-slate-400 mr-1">Progress:</span>
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
          i < (count || 0)
            ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/25"
            : "bg-slate-600 hover:bg-slate-500"
        }`}
      />
    ))}
    <span className="text-xs text-slate-400 ml-2">{count || 0}/4</span>
  </div>
);
const RevisionItem = ({
  problem,
  onDeleteProblem,
  onMarkAsSolved,
  onUndoRevision,
  onClick,
  displayOrder,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!problem || !problem.problem) {
    return null;
  }
  const isLink = problem.problem.startsWith("http");
  const isRevision = problem.isRevision || problem.originalProblemId;
  const getCreatedAtAsDate = () => {
    const createdAt = problem.createdAt;
    if (!createdAt) return null;
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    return isNaN(date.getTime()) ? null : date;
  };
  const createdAtDate = getCreatedAtAsDate();
  const canUndo =
    isRevision &&
    createdAtDate &&
    (new Date() - createdAtDate) / 1000 / 60 <= 5;
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      if (typeof onDeleteProblem === "function") onDeleteProblem(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };
  const handleSolveAgainClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onMarkAsSolved === "function") {
      onMarkAsSolved(problem.id, problem.solveCount || 0, true);
    }
  };
  const handleUndoClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onUndoRevision === "function") {
      onUndoRevision(problem.id);
    }
  };
  const handleProblemClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onClick === "function") {
      onClick(problem);
    }
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleProblemClick}
      className="group relative cursor-pointer rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-800/20 p-4 transition-colors duration-200 hover:from-slate-700/50 hover:to-slate-700/30 border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-cyan-500/5"
      style={{ order: displayOrder }}
    >
      {" "}
      <div className="flex flex-col gap-3">
        {" "}
        <div className="flex items-start justify-between">
          {" "}
          <div className="flex-1 min-w-0">
            {" "}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isRevision && (
                <span className="px-2 py-1 rounded-md text-xs font-medium text-purple-400 bg-purple-400/10 flex items-center gap-1 whitespace-nowrap">
                  <FiRepeat className="w-3 h-3" /> Revision
                  {canUndo && (
                    <span className="text-xs text-orange-300 ml-1">
                      (Undoable)
                    </span>
                  )}
                </span>
              )}
              {problem.difficulty && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>
              )}
              {problem.platform && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium text-cyan-400 bg-cyan-400/10 whitespace-nowrap`}
                >
                  {problem.platform}
                </span>
              )}
            </div>{" "}
            <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed break-words">
              {isLink ? (
                <a
                  href={problem.problem}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-cyan-400 hover:underline inline-flex items-center gap-1 break-all"
                >
                  {problem.problem}
                  <svg
                    className="w-3 h-3 opacity-60 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ) : (
                problem.problem
              )}
            </h3>{" "}
          </div>{" "}
          <div className="flex items-center gap-1 opacity-100 flex-shrink-0 ml-2">
            {canUndo && (
              <button
                onClick={handleUndoClick}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-400 bg-orange-500/20 transition-colors duration-200 hover:bg-orange-500/30"
                title="Undo this revision"
                type="button"
              >
                <FiUndo />
              </button>
            )}
            {!isRevision && (
              <button
                onClick={handleSolveAgainClick}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-cyan-400 bg-cyan-500/20 transition-colors duration-200 hover:bg-cyan-500/30"
                title="Solve Again (creates new revision)"
                type="button"
              >
                <FiRepeat />
              </button>
            )}
            <button
              onClick={handleDeleteClick}
              className={`flex items-center justify-center rounded-lg text-red-400 transition-all duration-200 ${
                isDeleting ? "h-8 w-20 bg-red-500/30" : "h-8 w-8 bg-red-500/20"
              }`}
              title="Delete problem"
              type="button"
            >
              {isDeleting ? (
                <span className="text-xs font-medium whitespace-nowrap">
                  Confirm?
                </span>
              ) : (
                <FiTrash />
              )}
            </button>
          </div>{" "}
        </div>{" "}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 gap-4">
          {" "}
          <div className="flex-shrink-0 h-5">
            {!isRevision && <SolveTracker count={problem.solveCount || 0} />}
          </div>{" "}
          {problem.tags && (
            <div className="flex gap-1 flex-wrap justify-end">
              {problem.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {problem.tags.length > 2 && (
                <span className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-400 whitespace-nowrap">
                  +{problem.tags.length - 2}
                </span>
              )}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </motion.li>
  );
};
const DateSection = ({
  date,
  problems,
  onDeleteProblem,
  onMarkAsSolved,
  onUndoRevision,
  onProblemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatDate = (dateObj) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const problemDate = dateObj?.toDate ? dateObj.toDate() : new Date(dateObj);
    if (isNaN(problemDate.getTime())) return "Invalid Date";
    if (problemDate.toDateString() === today.toDateString()) return "Today";
    if (problemDate.toDateString() === yesterday.toDateString())
      return "Yesterday";
    return problemDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  };
  const getRevisionCount = () =>
    problems.filter((p) => p && (p.isRevision || p.originalProblemId)).length;
  const getUndoableCount = () =>
    problems.filter((p) => {
      const isRevision = p && (p.isRevision || p.originalProblemId);
      const createdAt =
        p && p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
      return (
        isRevision &&
        createdAt &&
        !isNaN(createdAt) &&
        (new Date() - createdAt) / 1000 / 60 <= 5
      );
    }).length;
  return (
    <div className="mb-6">
      {" "}
      <div className="flex items-center justify-between mb-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/30">
        {" "}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <FiCalendar className="text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-200">
            {formatDate(date)}
          </h3>
          <motion.div
            className="w-4 h-4 text-slate-400 flex-shrink-0"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </button>{" "}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            {problems.length}
          </span>
          {getRevisionCount() > 0 && (
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              {getRevisionCount()}
            </span>
          )}
          {getUndoableCount() > 0 && (
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              {getUndoableCount()}
            </span>
          )}
        </div>{" "}
      </div>{" "}
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pl-2 overflow-hidden"
          >
            {problems.map((problem, index) => (
              <RevisionItem
                key={problem?.id || `problem-${index}`}
                problem={problem}
                {...{
                  onDeleteProblem,
                  onMarkAsSolved,
                  onUndoRevision,
                  onClick: onProblemClick,
                  displayOrder: index,
                }}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>{" "}
    </div>
  );
};

export default function AllProblemsList({
  problems,
  onBack,
  onDeleteProblem,
  onMarkAsSolved,
  onUndoRevision,
}) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  // **THE FIX**: This effect adds/removes a class to the <body> tag
  // to prevent the background from scrolling when the modal is open.
  useEffect(() => {
    if (selectedProblem) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup function to ensure the class is removed if the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedProblem]);

  const groupedProblems = useMemo(() => {
    const groups = {};
    if (!problems) return [];
    problems.forEach((problem) => {
      if (!problem || !problem.date) return;
      const dateKey = problem.date.toDate
        ? problem.date.toDate().toDateString()
        : new Date(problem.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = { date: problem.date, problems: [] };
      }
      groups[dateKey].problems.push(problem);
    });
    return Object.values(groups).sort((a, b) =>
      b.date.toDate
        ? b.date.toDate() - a.date.toDate()
        : new Date(b.date) - new Date(a.date)
    );
  }, [problems]);
  const stats = useMemo(() => {
    if (!problems)
      return { totalSolves: 0, totalRevisions: 0, totalUndoable: 0 };
    return {
      totalSolves: problems.reduce(
        (total, p) => total + (p?.solveCount || 0),
        0
      ),
      totalRevisions: problems.filter(
        (p) => p && (p.isRevision || p.originalProblemId)
      ).length,
      totalUndoable: problems.filter((p) => {
        const isRevision = p && (p.isRevision || p.originalProblemId);
        const createdAt = p?.createdAt?.toDate
          ? p.createdAt.toDate()
          : new Date(p.createdAt);
        return (
          isRevision &&
          createdAt &&
          !isNaN(createdAt) &&
          (new Date() - createdAt) / 1000 / 60 <= 5
        );
      }).length,
    };
  }, [problems]);
  const handleProblemClick = (problem) => {
    setSelectedProblem(problem);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-100">
                Problem Archive
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Your entire coding journey
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 border border-cyan-500/20"
            >
              ← Schedule
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              {
                label: "Total",
                value: problems?.length || 0,
                color: "text-slate-100",
              },
              {
                label: "Solves",
                value: stats.totalSolves,
                color: "text-emerald-400",
              },
              {
                label: "Revisions",
                value: stats.totalRevisions,
                color: "text-purple-400",
              },
              {
                label: "Undoable",
                value: stats.totalUndoable,
                color: "text-orange-400",
              },
              {
                label: "Active Days",
                value: groupedProblems.length,
                color: "text-cyan-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {!problems || problems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/50 p-10 text-center bg-slate-800/20"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">
              No Problems Yet
            </h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Add your first solved problem to begin tracking your progress!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groupedProblems.map(({ date, problems: dayProblems }) => (
              <DateSection
                key={
                  date.toDate ? date.toDate().toDateString() : date.toString()
                }
                {...{
                  date,
                  problems: dayProblems,
                  onDeleteProblem,
                  onMarkAsSolved,
                  onUndoRevision,
                  onProblemClick: handleProblemClick,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedProblem && (
          <ProblemDetailsModal
            problem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
            onMarkAsSolved={onMarkAsSolved}
            onUndoRevision={onUndoRevision}
          />
        )}
      </AnimatePresence>
    </>
  );
}
