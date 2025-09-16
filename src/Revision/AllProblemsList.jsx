import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemDetailsModal from './ProblemDetailsModal.jsx';

// --- SVG Icons for UI Actions ---
const FiTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;
const FiCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiUndo = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;

// --- Sub-components ---
const SolveTracker = ({ count }) => (
  <div className="flex items-center gap-1.5">
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

const RevisionItem = ({
  problem,
  onDeleteProblem,
  onMarkAsSolved,
  onUndoRevision,
  onClick,
  displayOrder,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!problem || !problem.problem) { return null; }

  const isLink = problem.problem.startsWith('http');
  const isRevision = problem.isRevision || problem.originalProblemId;

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
      if (typeof onDeleteProblem === 'function') onDeleteProblem(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };

  const handleSolveAgainClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onMarkAsSolved === 'function') {
      // Calling with 'true' triggers the combined action in useProblems hook
      onMarkAsSolved(problem.id, (problem.solveCount || 0), true);
    }
  };

  const handleUndoClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onUndoRevision === 'function') {
      onUndoRevision(problem.id);
    }
  };

  const handleProblemClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onClick === 'function') {
      onClick(problem);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <li
      onClick={handleProblemClick}
      className="group relative cursor-pointer rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-800/20 p-4 transition-colors duration-200 hover:from-slate-700/50 hover:to-slate-700/30 border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-cyan-500/5"
      style={{ order: displayOrder }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isRevision && (
                <span className="px-2 py-1 rounded-md text-xs font-medium text-purple-400 bg-purple-400/10 flex items-center gap-1 whitespace-nowrap">
                  <FiRepeat /> Revision
                  {canUndo && <span className="text-xs text-orange-300 ml-1">(Undoable)</span>}
                </span>
              )}
              {problem.difficulty && <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>}
              {problem.platform && <span className="px-2 py-1 rounded-md text-xs font-medium text-cyan-400 bg-cyan-400/10 whitespace-nowrap">{problem.platform}</span>}
            </div>
            <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed break-words">
              {isLink ? (
                <a href={problem.problem} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-cyan-400 hover:underline inline-flex items-center gap-1 break-all">
                  {problem.problem}
                  <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ) : (
                problem.problem
              )}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-100 flex-shrink-0 ml-2">
            {canUndo && 
              <button onClick={handleUndoClick} className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-400 bg-orange-500/20 transition-colors duration-200 hover:bg-orange-500/30" title="Undo this revision" type="button"><FiUndo /></button>
            }
            
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

            <button onClick={handleDeleteClick} className={`flex items-center justify-center rounded-lg text-red-400 transition-all duration-200 ${isDeleting ? 'h-8 w-20 bg-red-500/30' : 'h-8 w-8 bg-red-500/20'}`} title="Delete problem" type="button">
              {isDeleting ? (<span className="text-xs font-medium whitespace-nowrap">Confirm?</span>) : (<FiTrash />)}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 gap-4">
          <div className="flex-shrink-0">
            {!isRevision && <SolveTracker count={problem.solveCount || 0} />}
          </div>
          {problem.tags && (
            <div className="flex gap-1 flex-wrap justify-end">
              {problem.tags.slice(0, 2).map((tag, index) => <span key={index} className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 whitespace-nowrap">{tag}</span>)}
              {problem.tags.length > 2 && <span className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-400 whitespace-nowrap">+{problem.tags.length - 2}</span>}
            </div>
          )}
        </div>
      </div>
    </li>
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

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const problemDate = date?.toDate ? date.toDate() : date;
    if (!problemDate || isNaN(new Date(problemDate))) return "Invalid Date";
    if (new Date(problemDate).toDateString() === today.toDateString()) return 'Today';
    if (new Date(problemDate).toDateString() === yesterday.toDateString()) return 'Yesterday';
    return new Date(problemDate).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getSolvedCount = () => problems.reduce((total, p) => total + (p?.solveCount || 0), 0);
  const getRevisionCount = () => problems.filter((p) => p && (p.isRevision || p.originalProblemId)).length;
  const getUndoableCount = () =>
    problems.filter((problem) => {
      if (!problem) return false;
      const isRevision = problem.isRevision || problem.originalProblemId;
      const createdAt = problem.createdAt?.toDate ? problem.createdAt.toDate() : new Date(problem.createdAt);
      return isRevision && createdAt && !isNaN(createdAt) && ((new Date() - createdAt) / 1000 / 60) <= 5;
    }).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/30">
        <button
          onClick={() => setIsExpanded((e) => !e)}
          className="flex items-center gap-3 flex-1 text-left transition-colors hover:text-white"
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-slate-200">{formatDate(date)}</h3>
          </div>
          <motion.svg
            className="w-4 h-4 text-slate-400"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </button>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-cyan-400"></div>{problems.length} problem{problems.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>{getSolvedCount()} solve{getSolvedCount() !== 1 ? 's' : ''}</span>
          {getRevisionCount() > 0 && <span className="flex items-center gap-1 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-purple-400"></div>{getRevisionCount()} revision{getRevisionCount() !== 1 ? 's' : ''}</span>}
          {getUndoableCount() > 0 && <span className="flex items-center gap-1 whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-orange-400"></div>{getUndoableCount()} undoable</span>}
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
           <motion.ul 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pl-2 overflow-hidden"
          >
            {problems.map((problem, index) => (
              <RevisionItem
                key={problem?.id || `problem-${index}`}
                problem={problem}
                onDeleteProblem={onDeleteProblem}
                onMarkAsSolved={onMarkAsSolved}
                onUndoRevision={onUndoRevision}
                onClick={onProblemClick}
                displayOrder={index}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
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

  const groupedProblems = useMemo(() => {
    const groups = {};
    if (!problems) return [];
    
    problems.forEach((problem) => {
      if (!problem || !problem.date) return;
      const dateKey = problem.date.toDate ? problem.date.toDate().toDateString() : new Date(problem.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: problem.date,
          problems: [],
        };
      }
      groups[dateKey].problems.push(problem);
    });
    return Object.values(groups).sort((a, b) => (b.date.toDate ? b.date.toDate() - a.date.toDate() : new Date(b.date) - new Date(a.date)));
  }, [problems]);

  const totalSolves = problems?.reduce((total, problem) => total + (problem?.solveCount || 0), 0) || 0;
  const totalRevisions = (problems?.filter((p) => p && (p.isRevision || p.originalProblemId)) || []).length;
  const totalUndoable = (problems?.filter((problem) => {
    if (!problem) return false;
    const isRevision = problem.isRevision || problem.originalProblemId;
    const createdAtDate = problem.createdAt?.toDate ? problem.createdAt.toDate() : new Date(problem.createdAt);
    return isRevision && createdAtDate && !isNaN(createdAtDate) && (new Date() - createdAtDate) / 1000 / 60 <= 5;
  }) || []).length;

  const handleProblemClick = (problem) => {
    setSelectedProblem(problem);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 p-2 rounded-lg bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-700/60 border border-slate-600/20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-sm font-bold text-slate-100 mb-0.5">Problem Archive</h1>
              <p className="text-slate-400 text-[11px]">Track your coding journey and revision progress</p>
            </div>
            <button
              onClick={onBack}
              className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 border border-cyan-500/20"
              aria-label="Back to Schedule"
            >
              ← Back
            </button>
          </div>

          <div className="mt-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50 border border-slate-600/20">
                <div className="text-lg font-bold text-slate-100">{problems?.length || 0}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-emerald-900/30 border border-emerald-500/20">
                <div className="text-lg font-bold text-emerald-400">{totalSolves}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Solves</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-purple-900/30 border border-purple-500/20">
                <div className="text-lg font-bold text-purple-400">{totalRevisions}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Revs</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-orange-900/30 border border-orange-500/20">
                <div className="text-lg font-bold text-orange-400">{totalUndoable}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Undo</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-cyan-900/30 border border-cyan-500/20 col-span-2">
                <div className="text-lg font-bold text-cyan-400">{groupedProblems.length}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Days</div>
              </div>
            </div>
          </div>
        </div>

        {(!problems || problems.length === 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-700/30 p-6 text-center bg-slate-800/10"
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-sm font-semibold text-slate-300 mb-1">No Problems Yet</h3>
            <p className="text-slate-500 text-[12px] max-w-xs">Start adding problems you've solved to track progress and revisions.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {groupedProblems.map(({ date, problems: dayProblems }) => (
              <DateSection
                key={date.toDate ? date.toDate().toDateString() : new Date(date).toDateString()}
                date={date}
                problems={dayProblems}
                onDeleteProblem={onDeleteProblem}
                onMarkAsSolved={onMarkAsSolved}
                onUndoRevision={onUndoRevision}
                onProblemClick={handleProblemClick}
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
          />
        )}
      </AnimatePresence>
    </>
  );
}