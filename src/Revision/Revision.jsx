import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logOut } from "../components/Auth.jsx";
import ProblemForm from "./ProblemForm.jsx";
import RevisionList from "./RevisionList.jsx";
import AllProblemsTable from "./AllProblemsTable.jsx";
import { useProblems } from "../hooks/useProblems.js";
import { useSettings } from "../hooks/useSettings.js";
import SettingsModal from "./SettingsModal.jsx";

// --- Header Component ---
const Header = ({ user, onOpenSettings, updateToSequentialLabels }) => (
  <header className="mb-8 flex items-center justify-between">
    <div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold tracking-tighter text-slate-100"
      >
        Revision Planner
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-1 text-sm text-slate-400"
      >
        Welcome,{" "}
        <span className="font-semibold text-cyan-400">
          {user.displayName || user.email}
        </span>
      </motion.p>
    </div>
    <div className="flex items-center gap-2">
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={async () => {
          const result = await updateToSequentialLabels();
          if (result.success) {
            alert('Interval labels updated successfully!');
          } else {
            alert('Failed to update labels: ' + result.error);
          }
        }}
        className="p-2 rounded-lg bg-emerald-800 text-emerald-400 hover:text-emerald-300 border border-emerald-700 hover:border-emerald-600 transition-all duration-200"
        title="Update to Sequential Labels"
      >
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
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      </motion.button>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenSettings}
        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 transition-all duration-200"
        title="Custom Intervals"
      >
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
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </motion.button>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={logOut}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-slate-100 border border-slate-700 hover:border-slate-600"
      >
        Logout
      </motion.button>
    </div>
  </header>
);

// --- View Toggle Component (Updated: Removed 'All Problems') ---
const ViewToggleButton = ({ view, setView }) => (
  <div className="flex justify-center mb-6 mt-10">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center rounded-full bg-slate-800/80 p-1 border border-slate-700/50"
    >
      <button
        onClick={() => setView("revision")}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === "revision"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        {view === "revision" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        Schedule
      </button>

      {/* Removed 'All Problems' button here */}

      <button
        onClick={() => setView("table")}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === "table"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        {view === "table" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        History
      </button>
    </motion.div>
  </div>
);

// --- Loading Component & Error Component (no changes) ---
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-slate-400 font-medium"
    >
      Loading your problems...
    </motion.p>
  </motion.div>
);
const ErrorMessage = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">
      Something went wrong
    </h3>
    <p className="text-slate-500 mb-4 text-center max-w-md">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

// --- Main App Component (Updated) ---
export default function RevisionApp({ user }) {
  const {
    problems,
    isLoading,
    error,
    addProblem,
    deleteProblem,
    markAsSolved,
    updateNotes,
    refetch,
  } = useProblems(user);

  const {
    intervals,
    updateIntervals,
    resetToDefaults,
    updateToSequentialLabels,
    isLoading: isSettingsLoading,
  } = useSettings(user);

  const [view, setView] = useState("revision");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Statistics
  const totalProblems = problems.length;
  const totalRevisions = problems.filter(
    (p) => p.isRevision || p.originalProblemId,
  ).length;
  const totalSolves = problems.reduce((sum, p) => sum + (p.solveCount || 0), 0);

  const renderContent = () => {
    switch (view) {
      case "revision":
        return (
          <RevisionList
            problems={problems}
            onMarkAsSolved={markAsSolved}
            onUpdateNotes={updateNotes}
            intervals={intervals}
          />
        );
      // Case 'all' removed
      case "table":
        return (
          <AllProblemsTable
            problems={problems}
            onMarkAsSolved={markAsSolved}
            onUpdateNotes={updateNotes}
            intervals={intervals}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-start justify-start overflow-hidden bg-slate-950 p-4 font-sans text-slate-200 sm:p-6 md:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900/50 via-slate-950 to-slate-900/50"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <Header user={user} onOpenSettings={() => setIsSettingsOpen(true)} updateToSequentialLabels={updateToSequentialLabels} />

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-slate-800/50 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-lg"
          >
            {/* Problem Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProblemForm onAddProblem={addProblem} />
            </motion.div>

            {/* Statistics Bar */}
            {!isLoading && !error && totalProblems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="my-6 grid grid-cols-3 gap-4"
              >
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-slate-200">
                    {totalProblems}
                  </div>
                  <div className="text-xs text-slate-400">Problems</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-emerald-400">
                    {totalSolves}
                  </div>
                  <div className="text-xs text-slate-400">Total Solves</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-purple-400">
                    {totalRevisions}
                  </div>
                  <div className="text-xs text-slate-400">Revisions</div>
                </div>
              </motion.div>
            )}

            {/* View Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ViewToggleButton view={view} setView={setView} />
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="min-h-[400px]"
            >
              {/* Error State */}
              {error && <ErrorMessage error={error} onRetry={refetch} />}

              {/* Loading State */}
              {isLoading && !error && <LoadingSpinner />}

              {/* Content Views */}
              {!isLoading && !error && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </motion.main>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-xs text-slate-500"
          >
            <p>
              &copy; {new Date().getFullYear()} Revision Mania. Built with ❤️ by
              Veer Pal Singh.
            </p>
          </motion.footer>
        </motion.div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            intervals={intervals}
            onSave={updateIntervals}
            onReset={resetToDefaults}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
