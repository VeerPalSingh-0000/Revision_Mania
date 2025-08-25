import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemDetailsModal from './ProblemDetailsModal.jsx'; // Import the new modal

// --- SVG Icons for UI Actions ---
const FiTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;

// --- Sub-components for a Cleaner Structure ---

const SolveTracker = ({ count }) => (
  <div className="flex items-center gap-1.5">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full transition-colors ${
          i < (count || 0) ? 'bg-emerald-500' : 'bg-slate-700'
        }`}
      />
    ))}
  </div>
);

const RevisionItem = ({ problem, onDeleteProblem, onMarkAsSolved, onClick }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLink = problem.problem.startsWith('http');

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the modal from opening on delete click
    if (isDeleting) {
      if (typeof onDeleteProblem === 'function') onDeleteProblem(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };

  const handleSolveClick = (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    if (typeof onMarkAsSolved === 'function') onMarkAsSolved(problem.id, problem.solveCount);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-800/50 p-3 transition-colors hover:bg-slate-800"
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm text-slate-300">
          {isLink ? (
            <a href={problem.problem} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-cyan-400 hover:underline">{problem.problem}</a>
          ) : (
            problem.problem
          )}
        </span>
        <div className="flex items-center gap-3">
            <SolveTracker count={problem.solveCount} />
            <span className="text-xs text-slate-500">
                Last Solved: {problem.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button onClick={handleSolveClick} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-700 hover:text-cyan-400" title="Mark as solved again">
            <FiRepeat />
        </button>
        <button onClick={handleDeleteClick} className={`flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-all duration-200 hover:bg-slate-700 ${isDeleting ? 'w-24 bg-red-900/50 text-red-400 hover:bg-red-900' : 'hover:text-red-400'}`} title="Delete problem">
          {isDeleting ? 'Confirm?' : <FiTrash />}
        </button>
      </div>
    </motion.li>
  );
};

// --- Main Component ---

export default function AllProblemsList({ problems, onBack, onDeleteProblem, onMarkAsSolved }) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200">All Problems ({problems.length})</h2>
          <button onClick={onBack} className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline">
            &larr; Back to Schedule
          </button>
        </div>
        {problems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 p-12 text-center">
              <span className="text-4xl">🗂️</span>
              <p className="mt-4 font-semibold text-slate-300">No Problems Yet</p>
              <p className="mt-1 text-sm text-slate-500">Add a problem you've solved to start tracking it.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {problems.map(problem => (
                <RevisionItem
                  key={problem.id}
                  problem={problem}
                  onDeleteProblem={onDeleteProblem}
                  onMarkAsSolved={onMarkAsSolved}
                  onClick={() => setSelectedProblem(problem)}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <AnimatePresence>
        {selectedProblem && (
          <ProblemDetailsModal 
            problem={selectedProblem} 
            onClose={() => setSelectedProblem(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
