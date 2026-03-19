import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SolveTracker from "./SolveTracker";
import ProblemDetailsModal from "./ProblemDetailsModal";

// --- SVG Icon Components ---
const FiCheck = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const CheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const RevisionItem = ({ problem, onSolve, onClickProblem, intervals }) => {
  const [isSolving, setIsSolving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isLink = problem.problem.startsWith("http");

  const handleSolve = async () => {
    setIsSolving(true);
    setShowSuccess(true);
    // Short delay to show feedback before the item disappears
    setTimeout(async () => {
      try {
        await onSolve(problem.id, problem.solveCount || 0);
      } catch (error) {
        console.error("Error solving problem:", error);
        setShowSuccess(false); // Reset on error
      }
    }, 600);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/30";
    }
  };

  return (
    <motion.li
      layout
      layoutId={problem.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: showSuccess ? 0.8 : 1,
        y: 0,
        scale: showSuccess ? 0.98 : 1,
      }}
      exit={{
        opacity: 0,
        x: 100,
        scale: 0.9,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      className={`group relative rounded-xl p-4 transition-all duration-300 cursor-pointer ${
        showSuccess
          ? "bg-emerald-500/20 border border-emerald-400/40 shadow-lg shadow-emerald-500/10"
          : "bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/50"
      }`}
      onClick={() => onClickProblem?.(problem)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {problem.difficulty && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </span>
              )}
              {problem.platform && (
                <span className="px-2 py-1 rounded-md text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/30">
                  {problem.platform}
                </span>
              )}
            </div>

            <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed mb-2">
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
            </h3>

            <SolveTracker
              count={problem.solveCount}
              solveDates={problem.solveDates}
              intervals={intervals}
              createdAt={problem.createdAt}
            />
          </div>

          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 ml-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSolve}
              disabled={isSolving || showSuccess}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                showSuccess
                  ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40"
                  : isSolving
                    ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed border border-emerald-400/20"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-400/30 hover:border-emerald-400/50"
              }`}
            >
              <motion.div
                animate={showSuccess ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.5 }}
              >
                {showSuccess ? <CheckCircle /> : <FiCheck />}
              </motion.div>
              <span>
                {showSuccess ? "Solved!" : isSolving ? "Solving..." : "Solve"}
              </span>
            </motion.button>
          </div>
        </div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/30"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-400 border border-slate-600/30">
                +{problem.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 right-4 text-emerald-400 pointer-events-none text-lg"
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

// --- Main Component ---
export default function RevisionList({
  problems,
  onMarkAsSolved,
  onUpdateNotes,
  intervals,
}) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const dueProblemsByCategory = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categories = {
      ...Object.fromEntries(intervals.map((i) => [i.label, []])),
    };

    for (const problem of problems) {
      // Determine the correct interval for the *next* revision based on solveCount
      const intervalIndex = problem.solveCount;

      if (intervalIndex < intervals.length) {
        const interval = intervals[intervalIndex];

        // For the very first solve (count is 0), the due date is based on when it was CREATED.
        // For all subsequent solves, it's based on the last SOLVED date.
        const baseDate =
          problem.solveCount === 0
            ? problem.createdAt.toDate()
            : problem.date.toDate();

        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + interval.days);
        dueDate.setHours(0, 0, 0, 0);

        // If today is on or after the calculated due date, the problem is due for this interval.
        if (today >= dueDate) {
          categories[interval.label].push(problem);
        }
      }
    }

    // Filter out empty groups and sort them by the interval days
    return Object.entries(categories)
      .map(([label, problems]) => ({ label, problems }))
      .filter((group) => group.problems.length > 0)
      .sort((a, b) => {
        const daysA = intervals.find((i) => i.label === a.label).days;
        const daysB = intervals.find((i) => i.label === b.label).days;
        return daysA - daysB;
      });
  }, [problems, intervals]);

  const totalDue = dueProblemsByCategory.reduce(
    (sum, group) => sum + group.problems.length,
    0,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">
            Today's Revision Schedule
          </h2>
          {totalDue > 0 && (
            <motion.div
              key={totalDue}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <span className="px-3 py-1 text-sm font-bold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                {totalDue} due
              </span>
            </motion.div>
          )}
        </div>
        {totalDue === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/50 p-16 text-center bg-slate-800/20"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">
              All caught up!
            </h3>
            <p className="text-slate-500 max-w-md">
              No problems are due for revision today. Great job staying on top
              of your practice!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {dueProblemsByCategory.map(({ label, problems: dueItems }) => (
                <motion.div
                  key={label}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <motion.h3
                      className={`text-lg font-bold text-cyan-400`}
                      layoutId={`header-${label}`}
                    >
                      {label}
                    </motion.h3>
                    <motion.span
                      key={`${label}-${dueItems.length}`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-1 text-xs font-bold text-slate-400 bg-slate-700/50 rounded-full border border-slate-600/50"
                    >
                      {dueItems.length} problem{dueItems.length > 1 ? "s" : ""}
                    </motion.span>
                  </div>

                  <motion.ul layout className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {dueItems.map((problem) => (
                        <RevisionItem
                          key={problem.id}
                          problem={problem}
                          onSolve={onMarkAsSolved}
                          onClickProblem={setSelectedProblem}
                          intervals={intervals}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

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
}
