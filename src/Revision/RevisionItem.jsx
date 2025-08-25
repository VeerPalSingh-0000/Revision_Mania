import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- SVG Icons for UI Actions ---
const FiTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;

const SolveTracker = ({ count }) => (
  <div className="flex items-center gap-1.5" title={`${count || 0} solves`}>
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full transition-colors ${i < (count || 0) ? 'bg-emerald-500' : 'bg-slate-700'}`}
      />
    ))}
  </div>
);

/**
 * A reusable component to display a single revision problem.
 * It can be in a simple display mode or an interactive mode with action buttons.
 */
export default function RevisionItem({
  problem,
  onDelete,
  onSolve,
  interactive = false, // Controls whether the action buttons are shown
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLink = problem.problem.startsWith('http');

  const handleDeleteClick = () => {
    if (isDeleting) {
      if (typeof onDelete === 'function') onDelete(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };

  const handleSolveClick = () => {
    if (typeof onSolve === 'function') onSolve(problem.id, problem.solveCount);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-slate-300">
          {isLink ? (
            <a href={problem.problem} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 hover:underline">{problem.problem}</a>
          ) : (
            problem.problem
          )}
        </span>
        {interactive && <SolveTracker count={problem.solveCount} />}
      </div>
      {interactive && (
        <div className="flex items-center gap-2">
          <button onClick={handleSolveClick} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-700 hover:text-cyan-400" title="Mark as solved again">
            <FiRepeat />
          </button>
          <button onClick={handleDeleteClick} className={`flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-all duration-200 hover:bg-slate-700 ${isDeleting ? 'w-24 bg-red-900/50 text-red-400 hover:bg-red-900' : 'hover:text-red-400'}`} title="Delete problem">
            {isDeleting ? 'Confirm?' : <FiTrash />}
          </button>
        </div>
      )}
    </motion.li>
  );
}
