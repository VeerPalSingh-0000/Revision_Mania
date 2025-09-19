import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { INTERVALS } from './constants';

// --- SVG Icons ---
const FiX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FiCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiCheckSquare = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;
const FiTrendingUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const FiTag = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const FiExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;
const FiClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

// --- Helper Components ---
const SolveTracker = ({ count }) => ( <div className="flex items-center gap-2">{[...Array(4)].map((_, i) => ( <div key={i} className={`h-3 w-3 rounded-full transition-all duration-300 ${ i < (count || 0) ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/25' : 'bg-slate-600' }`} /> ))}<span className="ml-2 text-sm font-medium text-slate-300">{count || 0}/4</span></div>);
const DifficultyBadge = ({ difficulty }) => { const getDifficultyColor = (d) => { switch(d?.toLowerCase()) { case 'easy': return 'text-green-400 bg-green-400/20 border-green-400/30'; case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'; case 'hard': return 'text-red-400 bg-red-400/20 border-red-400/30'; default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30'; } }; if (!difficulty) return null; return (<span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(difficulty)}`}>{difficulty}</span>);};
function getNextDueDate(lastSolvedDate, solveCount) { const nextInterval = INTERVALS[solveCount - 1] || INTERVALS[INTERVALS.length - 1]; const nextDate = new Date(lastSolvedDate.getTime()); nextDate.setDate(nextDate.getDate() + nextInterval.days); return nextDate; }

// --- Main Modal Component ---
export default function ProblemDetailsModal({ problem, onClose, onMarkAsSolved, onUndoRevision }) {
  if (!problem) return null;

  const containerRef = useRef(null);
  const isLink = problem.problem.startsWith('http');
  const isRevision = problem.isRevision || problem.originalProblemId;
  const lastSolved = problem.date.toDate();
  const nextDueDate = !isRevision ? getNextDueDate(lastSolved, problem.solveCount) : null;
  const canUndo = isRevision && problem.createdAt && ((new Date() - problem.createdAt.toDate()) / 1000 / 60) <= 5;

  useEffect(() => {
    containerRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);
  
  const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'short' });
  const formatTime = (date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const getDaysUntilDue = () => { if (!nextDueDate) return null; const today = new Date(); today.setHours(0,0,0,0); const dueDate = new Date(nextDueDate); dueDate.setHours(0,0,0,0); const diffTime = dueDate - today; const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`; if (diffDays === 0) return 'Due today'; if (diffDays === 1) return 'Due tomorrow'; return `Due in ${diffDays} days`; };
  const handleSolveAgain = () => { if (typeof onMarkAsSolved === 'function') { onMarkAsSolved(problem.id, problem.solveCount, true); onClose(); } };
  const handleUndo = () => { if (typeof onUndoRevision === 'function') { onUndoRevision(problem.id); onClose(); } };

  const daysDiff = nextDueDate ? Math.ceil((nextDueDate - new Date()) / (1000 * 60 * 60 * 24)) : 99;
  const dueVariant = (() => { if (daysDiff < 0) return 'bg-red-600/20 text-red-300 border-red-600/30'; if (daysDiff <= 1) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'; return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'; })();

  return (
    // THE FIX #1: The overlay is a flex container that centers its child.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        ref={containerRef}
        tabIndex={-1}
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        // THE FIX #2: The card has its own scrolling and max-height.
        // On mobile it's full-width, on desktop (sm:) it shrinks.
        className="relative w-full overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/60 shadow-2xl max-w-2xl h-auto max-h-[95vh] p-6 pb-24 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-700/40 hover:text-slate-100">
          <FiX />
        </button>

        <div className="pr-10 mb-6">
          {isRevision && (<div className="mb-3 flex items-center gap-3"><span className="px-3 py-1 rounded-full text-xs font-semibold text-purple-300 bg-purple-400/10 border border-purple-400/20 inline-flex items-center gap-2"><FiRepeat /> Revision</span>{canUndo && (<span className="text-xs text-orange-300">Can be undone</span>)}</div>)}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-tight mb-3 break-words">{isLink ? (<a href={problem.problem} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-cyan-400 transition-colors break-words"><span className="truncate">{problem.problem}</span><FiExternalLink /></a>) : (problem.problem)}</h2>
          <div className="flex flex-wrap items-center gap-2"><DifficultyBadge difficulty={problem.difficulty} />{problem.platform && (<span className="px-3 py-1 rounded-full text-sm font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/20">{problem.platform}</span>)}<span className="ml-auto text-sm text-slate-400">Solved {problem.solveCount || 0} time{(problem.solveCount || 0) !== 1 ? 's' : ''}</span></div>
        </div>
        
        {!isRevision && (<div className="mb-4 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><FiTrendingUp /></div><div className="flex-1 min-w-0"><p className="text-sm text-slate-400">Solve Progress</p><div className="mt-2"><SolveTracker count={problem.solveCount} /></div></div></div>)}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/40"><div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><FiCheckSquare /></div><div><p className="text-sm text-slate-400">{isRevision ? 'Solved On' : 'Last Solved'}</p><p className="font-medium text-slate-200">{formatDate(lastSolved)}<span className="text-sm text-slate-400 ml-2">at {formatTime(lastSolved)}</span></p></div></div>
          {!isRevision && nextDueDate && (<div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/40"><div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300"><FiCalendar /></div><div><p className="text-sm text-slate-400">Next Revision Due</p><p className="font-medium text-slate-200">{formatDate(nextDueDate)}</p><p className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-md font-medium ${dueVariant} border`}>{getDaysUntilDue()}</p></div></div>)}
        </div>

        {problem.tags && problem.tags.length > 0 && (<div className="mb-6"><div className="flex items-center gap-2 mb-3"><FiTag className="text-slate-400" /><h3 className="text-sm font-medium text-slate-400">Tags</h3></div><div className="flex flex-wrap gap-2">{problem.tags.map((tag, index) => (<span key={index} className="px-3 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50">#{tag}</span>))}</div></div>)}

        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          {canUndo && (<button onClick={handleUndo} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-orange-500/10 text-orange-300 font-medium transition-colors hover:bg-orange-500/20 border border-orange-500/30 min-h-[48px]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>Undo</button>)}
          {!isRevision && (<button onClick={handleSolveAgain} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-300 font-medium transition-colors hover:bg-emerald-500/20 border border-emerald-500/30 min-h-[48px]"><FiRepeat />Solve Again</button>)}
        </div>

      </motion.div>
    </motion.div>
  );
}