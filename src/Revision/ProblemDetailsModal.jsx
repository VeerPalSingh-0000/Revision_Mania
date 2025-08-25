import React from 'react';
import { motion } from 'framer-motion';
import { INTERVALS } from './constants';

// --- SVG Icons ---
const FiX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FiCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiCheckSquare = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;

// --- Helper to calculate the next due date ---
function getNextDueDate(lastSolvedDate, solveCount) {
  const nextInterval = INTERVALS[solveCount] || INTERVALS[INTERVALS.length - 1];
  const nextDate = new Date(lastSolvedDate.getTime());
  nextDate.setDate(nextDate.getDate() + nextInterval.days);
  return nextDate;
}

// --- Main Modal Component ---
export default function ProblemDetailsModal({ problem, onClose }) {
  if (!problem) return null;

  const lastSolved = problem.date.toDate();
  const nextDueDate = getNextDueDate(lastSolved, problem.solveCount);
  
  const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="absolute top-3 right-3">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-200">
                <FiX />
            </button>
        </div>

        <h2 className="pr-8 text-lg font-semibold text-slate-100">{problem.problem}</h2>
        
        <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FiCheckSquare />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Last Solved</p>
                    <p className="font-medium text-slate-200">{formatDate(lastSolved)}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <FiCalendar />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Next Revision Due</p>
                    <p className="font-medium text-slate-200">{formatDate(nextDueDate)}</p>
                </div>
            </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
