import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- SVG Icons (no changes) ---
const FiTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;
const FiUndo = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;

const SolveTracker = ({ count }) => (
  <div className="flex items-center gap-1.5" title={`${count || 0} solves`}>
    <span className="text-xs text-slate-400 mr-1">Progress:</span>
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
          i < (count || 0) 
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/25' 
            : 'bg-slate-600 hover:bg-slate-500'
        }`}
      />
    ))}
    <span className="text-xs text-slate-400 ml-2">{count || 0}/4</span>
  </div>
);

export default function RevisionItem({
  problem,
  onDelete,
  onSolve,
  onUndo,
  onClick,
  interactive = false,
}) {
  // DEFENSIVE CHECK: If problem is null or undefined, render nothing.
  if (!problem) {
    return null;
  }

  const [isDeleting, setIsDeleting] = useState(false);

  // Use default values to prevent crashes if fields are missing.
  const problemText = problem.problem ?? 'No description';
  const isLink = problemText.startsWith('http');
  const isRevision = problem.isRevision || problem.originalProblemId;
  const solveCount = problem.solveCount ?? 0;
  const tags = problem.tags ?? [];

  const getCreatedAtAsDate = () => {
    const createdAt = problem.createdAt;
    if (!createdAt) return null;
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    return isNaN(date.getTime()) ? null : date;
  };
  const createdAtDate = getCreatedAtAsDate();
  const canUndo = isRevision && createdAtDate && ((new Date() - createdAtDate) / 1000 / 60) <= 5;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      if (typeof onDelete === 'function') onDelete(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };

  const handleSolveClick = (e) => {
    e.stopPropagation();
    if (typeof onSolve === 'function') onSolve(problem.id, solveCount, true);
  };

  const handleUndoClick = (e) => {
    e.stopPropagation();
    if (typeof onUndo === 'function') onUndo(problem.id);
  };

  const handleItemClick = (e) => {
    e.preventDefault();
    if (typeof onClick === 'function') onClick(problem);
  };
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClick ? handleItemClick : undefined}
      className={`group relative rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-800/20 p-4 transition-colors duration-200 hover:from-slate-700/50 hover:to-slate-700/30 border border-slate-700/50 hover:border-slate-600/50 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-cyan-500/5' : ''
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {isRevision && <span className="px-2 py-1 rounded-md text-xs font-medium text-purple-400 bg-purple-400/10 flex items-center gap-1 whitespace-nowrap"><FiRepeat className="w-3 h-3" /> Revision</span>}
              {problem.difficulty && <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>}
              {problem.platform && <span className="px-2 py-1 rounded-md text-xs font-medium text-cyan-400 bg-cyan-400/10 whitespace-nowrap">{problem.platform}</span>}
            </div>
            <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed break-words">
              {isLink ? (
                <a href={problemText} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-cyan-400 hover:underline inline-flex items-center gap-1 break-all">
                  {problemText}
                  <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ) : (
                problemText
              )}
            </h3>
          </div>
          {interactive && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
              {isRevision && <button onClick={canUndo ? handleUndoClick : undefined} disabled={!canUndo} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${canUndo ? 'text-orange-400 bg-orange-500/20 hover:bg-orange-500/30 cursor-pointer' : 'text-slate-500 bg-slate-700/20 cursor-not-allowed'}`} title={canUndo ? "Undo this revision" : "Undo time limit has passed"} type="button"><FiUndo /></button>}
              <button onClick={handleSolveClick} className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-400 bg-emerald-500/20 transition-colors duration-200 hover:bg-emerald-500/30" title="Solve again (creates new entry for today)" type="button"><FiRepeat /></button>
              <button onClick={handleDeleteClick} className={`flex items-center justify-center rounded-lg transition-all duration-200 ${isDeleting ? 'h-8 w-20 bg-red-500/30 text-red-400' : 'h-8 w-8 text-red-400 bg-red-500/20 hover:bg-red-500/30'}`} title="Delete problem" type="button">
                {isDeleting ? <span className="text-xs font-medium whitespace-nowrap">Confirm?</span> : <FiTrash />}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 gap-4">
          <div className="flex-shrink-0"><SolveTracker count={solveCount} /></div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {tags.slice(0, 2).map((tag, index) => <span key={index} className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 whitespace-nowrap">{tag}</span>)}
              {tags.length > 2 && <span className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-400 whitespace-nowrap">+{tags.length - 2}</span>}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}