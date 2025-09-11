import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemDetailsModal from './ProblemDetailsModal.jsx';

// --- SVG Icons for UI Actions ---
const FiTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FiRepeat = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>;
const FiCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiUndo = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;

// --- Sub-components for a Cleaner Structure ---

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

const RevisionItem = ({ problem, onDeleteProblem, onMarkAsSolved, onUndoRevision, onClick, displayOrder }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLink = problem.problem.startsWith('http');
  const isRevision = problem.isRevision || problem.originalProblemId;
  
  // Check if this revision can be undone (within 5 minutes)
  const canUndo = isRevision && problem.createdAt && 
    ((new Date() - problem.createdAt.toDate()) / 1000 / 60) <= 5;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      if (typeof onDeleteProblem === 'function') onDeleteProblem(problem.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 2500);
    }
  };

  const handleSolveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onMarkAsSolved === 'function') {
      onMarkAsSolved(problem.id, problem.solveCount, true);
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
    switch(difficulty?.toLowerCase()) {
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
      style={{ 
        position: 'relative',
        zIndex: 1,
        order: displayOrder // Use fixed display order
      }}
    >
      {/* Problem Content */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {isRevision && (
                <span className="px-2 py-1 rounded-md text-xs font-medium text-purple-400 bg-purple-400/10 flex items-center gap-1 whitespace-nowrap">
                  <FiRepeat className="w-3 h-3" />
                  Revision
                  {canUndo && (
                    <span className="text-xs text-purple-300 ml-1">(Can undo)</span>
                  )}
                </span>
              )}
              {problem.difficulty && (
                <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              )}
              {problem.platform && (
                <span className="px-2 py-1 rounded-md text-xs font-medium text-cyan-400 bg-cyan-400/10 whitespace-nowrap">
                  {problem.platform}
                </span>
              )}
            </div>
            
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
                  <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                problem.problem
              )}
            </h3>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
            {canUndo && (
              <button 
                onClick={handleUndoClick} 
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-orange-500/20 hover:text-orange-400" 
                title="Undo this revision"
                type="button"
              >
                <FiUndo />
              </button>
            )}
            
            <button 
              onClick={handleSolveClick} 
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-emerald-500/20 hover:text-emerald-400" 
              title="Solve again (creates new entry for today)"
              type="button"
            >
              <FiRepeat />
            </button>
            
            <button 
              onClick={handleDeleteClick} 
              className={`flex items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                isDeleting 
                  ? 'h-8 w-20 bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'h-8 w-8 hover:bg-red-500/20 hover:text-red-400'
              }`} 
              title="Delete problem"
              type="button"
            >
              {isDeleting ? (
                <span className="text-xs font-medium whitespace-nowrap">Confirm?</span>
              ) : (
                <FiTrash />
              )}
            </button>
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 gap-4">
          <div className="flex-shrink-0">
            <SolveTracker count={problem.solveCount} />
          </div>
          {problem.tags && (
            <div className="flex gap-1 flex-wrap justify-end">
              {problem.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 whitespace-nowrap">
                  {tag}
                </span>
              ))}
              {problem.tags.length > 2 && (
                <span className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-400 whitespace-nowrap">
                  +{problem.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const DateSection = ({ date, problems, onDeleteProblem, onMarkAsSolved, onUndoRevision, onProblemClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const problemDate = date.toDate();
    
    if (problemDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (problemDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return problemDate.toLocaleDateString('en-GB', { 
        weekday: 'long',
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  const getSolvedCount = () => {
    return problems.reduce((total, problem) => total + (problem.solveCount || 0), 0);
  };

  const getRevisionCount = () => {
    return problems.filter(problem => problem.isRevision || problem.originalProblemId).length;
  };

  const getUndoableCount = () => {
    return problems.filter(problem => {
      const isRevision = problem.isRevision || problem.originalProblemId;
      const canUndo = isRevision && problem.createdAt && 
        ((new Date() - problem.createdAt.toDate()) / 1000 / 60) <= 5;
      return canUndo;
    }).length;
  };

  // Create stable ordering that preserves original positions
  const stableOrderedProblems = useMemo(() => {
    // Create a map to store the original position of each problem
    const positionMap = new Map();
    
    // First, assign positions to original problems (non-revisions)
    const originalProblems = problems.filter(p => !(p.isRevision || p.originalProblemId));
    originalProblems.forEach((problem, index) => {
      // Use the problem ID or a combination that uniquely identifies its original position
      const positionKey = problem.originalId || problem.id;
      if (!positionMap.has(positionKey)) {
        positionMap.set(positionKey, index);
      }
    });

    // Then assign positions to revisions, placing them after original problems
    const revisions = problems.filter(p => p.isRevision || p.originalProblemId);
    let revisionIndex = originalProblems.length;
    
    return problems.map(problem => {
      let displayOrder;
      
      if (problem.isRevision || problem.originalProblemId) {
        // Revisions get new positions at the end, in chronological order
        displayOrder = revisionIndex++;
      } else {
        // Original problems keep their fixed positions
        const positionKey = problem.originalId || problem.id;
        displayOrder = positionMap.get(positionKey) ?? 0;
      }
      
      return {
        ...problem,
        displayOrder,
        stableKey: `${problem.id}-${displayOrder}-fixed`
      };
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [problems]);

  return (
    <div className="mb-8">
      {/* Date Header */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
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
        
        <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            {problems.length} problem{problems.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            {getSolvedCount()} solve{getSolvedCount() !== 1 ? 's' : ''}
          </span>
          {getRevisionCount() > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              {getRevisionCount()} revision{getRevisionCount() !== 1 ? 's' : ''}
            </span>
          )}
          {getUndoableCount() > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              {getUndoableCount()} undoable
            </span>
          )}
        </div>
      </div>

      {/* Problems List */}
      {isExpanded && (
        <ul className="space-y-3 pl-2">
          {stableOrderedProblems.map((problem) => (
            <RevisionItem
              key={problem.stableKey}
              problem={problem}
              onDeleteProblem={onDeleteProblem}
              onMarkAsSolved={onMarkAsSolved}
              onUndoRevision={onUndoRevision}
              onClick={onProblemClick}
              displayOrder={problem.displayOrder}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

// --- Main Component ---
export default function AllProblemsList({ problems, onBack, onDeleteProblem, onMarkAsSolved, onUndoRevision }) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Group problems by date with absolutely stable positioning
  const groupedProblems = useMemo(() => {
    const groups = {};
    
    // Add a creation timestamp to maintain absolute order
    problems.forEach((problem) => {
      const dateKey = problem.date.toDate().toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: problem.date,
          problems: []
        };
      }
      
      // Ensure each problem has a stable identifier for its original position
      const enhancedProblem = {
        ...problem,
        // Use existing originalId or create one based on the problem's original creation
        originalId: problem.originalId || (problem.isRevision ? problem.originalProblemId : problem.id),
        // Add creation timestamp if not present
        createdAt: problem.createdAt || problem.date.toMillis()
      };
      
      groups[dateKey].problems.push(enhancedProblem);
    });

    return Object.values(groups)
      .sort((a, b) => b.date.toDate() - a.date.toDate());
  }, [problems]);

  const totalSolves = problems.reduce((total, problem) => total + (problem.solveCount || 0), 0);
  const totalRevisions = problems.filter(problem => problem.isRevision || problem.originalProblemId).length;
  const totalUndoable = problems.filter(problem => {
    const isRevision = problem.isRevision || problem.originalProblemId;
    const canUndo = isRevision && problem.createdAt && 
      ((new Date() - problem.createdAt.toDate()) / 1000 / 60) <= 5;
    return canUndo;
  }).length;

  const handleProblemClick = (problem) => {
    setSelectedProblem(problem);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-700/60 border border-slate-600/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Problem Archive</h1>
              <p className="text-slate-400">Track your coding journey and revision progress</p>
            </div>
            <button 
              onClick={onBack} 
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-500/30 hover:text-cyan-300 border border-cyan-500/30"
            >
              ← Back to Schedule
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-slate-700/40">
              <div className="text-2xl font-bold text-slate-200">{problems.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Problems</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-700/40">
              <div className="text-2xl font-bold text-emerald-400">{totalSolves}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Solves</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-700/40">
              <div className="text-2xl font-bold text-purple-400">{totalRevisions}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Revisions</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-700/40">
              <div className="text-2xl font-bold text-orange-400">{totalUndoable}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Undoable</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-700/40">
              <div className="text-2xl font-bold text-cyan-400">{groupedProblems.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Active Days</div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {problems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/50 p-16 text-center bg-slate-800/20"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Problems Yet</h3>
            <p className="text-slate-500 max-w-md">Start your coding journey by adding problems you've solved. Track your progress and never forget what you've learned!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groupedProblems.map(({ date, problems: dayProblems }) => (
              <DateSection
                key={date.toDate().toDateString()}
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

      {/* Problem Details Modal */}
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
