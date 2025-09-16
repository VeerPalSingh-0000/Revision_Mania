import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logOut } from '../components/Auth.jsx';
import ProblemForm from './ProblemForm.jsx';
import RevisionList from './RevisionList.jsx';
import AllProblemsList from './AllProblemsList.jsx';
import { useProblems } from '../hooks/useProblems.js';

// --- Header Component ---
const Header = ({ user }) => (
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
        Welcome, <span className="font-semibold text-cyan-400">{user.displayName || user.email}</span>
      </motion.p>
    </div>
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
  </header>
);

// --- View Toggle Component ---
const ViewToggleButton = ({ view, setView }) => (
  <div className="flex justify-center mb-6">
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center rounded-full bg-slate-800/80 p-1 border border-slate-700/50"
    >
      <button
        onClick={() => setView('revision')}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === 'revision' 
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
        }`}
      >
        {view === 'revision' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        Schedule
      </button>
      <button
        onClick={() => setView('all')}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === 'all' 
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
        }`}
      >
        {view === 'all' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        All Problems
      </button>
    </motion.div>
  </div>
);

// --- Loading Component ---
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

// --- Error Component ---
const ErrorMessage = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">Something went wrong</h3>
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

// --- Main App Component ---
export default function RevisionApp({ user }) {
  const { 
    problems, 
    isLoading, 
    error,
    addProblem, 
    deleteProblem, 
    markAsSolved, 
    undoRevision,
    refetch
  } = useProblems(user);
  
  const [view, setView] = useState('revision');

  // Statistics
  const totalProblems = problems.length;
  const totalRevisions = problems.filter(p => p.isRevision || p.originalProblemId).length;
  const totalSolves = problems.reduce((sum, p) => sum + (p.solveCount || 0), 0);

  return (
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
        <Header user={user} />

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
                <div className="text-lg font-bold text-slate-200">{totalProblems}</div>
                <div className="text-xs text-slate-400">Problems</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="text-lg font-bold text-emerald-400">{totalSolves}</div>
                <div className="text-xs text-slate-400">Total Solves</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="text-lg font-bold text-purple-400">{totalRevisions}</div>
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
            {error && (
              <ErrorMessage error={error} onRetry={refetch} />
            )}

            {/* Loading State */}
            {isLoading && !error && (
              <LoadingSpinner />
            )}

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
                  {view === 'revision' ? (
                    <RevisionList 
                      problems={problems} 
                      onMarkAsSolved={markAsSolved}
                      onUndoRevision={undoRevision}
                    />
                  ) : (
                    <AllProblemsList
                      problems={problems}
                      onBack={() => setView('revision')}
                      onDeleteProblem={deleteProblem}
                      onMarkAsSolved={markAsSolved}
                      onUndoRevision={undoRevision}
                    />
                  )}
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
            &copy; {new Date().getFullYear()} Revision Mania. Built with ❤️ by Veer Pal Singh.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
