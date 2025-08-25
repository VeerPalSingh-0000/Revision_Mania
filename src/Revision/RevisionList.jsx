import React, { useState, useEffect } from 'react';
import { INTERVALS } from './constants';
import { isDue } from './utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icon Components ---
const FiCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const RevisionItem = ({ problem, onSolve, onLocalRemove }) => {
  const [isSolving, setIsSolving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isLink = problem.problem.startsWith('http');

  const handleSolve = async () => {
    setIsSolving(true);
    
    // Show success animation
    setShowSuccess(true);
    
    // Small delay for visual feedback
    setTimeout(async () => {
      await onSolve(problem.id, problem.solveCount);
      // Remove from local revision view
      onLocalRemove(problem.id);
      setIsSolving(false);
    }, 600);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: showSuccess ? 0.7 : 1, 
        y: 0,
        scale: showSuccess ? 0.95 : 1
      }}
      exit={{ 
        opacity: 0, 
        x: 100, 
        scale: 0.8,
        transition: { duration: 0.3, ease: "easeInOut" } 
      }}
      className={`flex items-center justify-between rounded-lg p-3 text-sm transition-all duration-300 relative ${
        showSuccess 
          ? 'bg-emerald-500/20 border border-emerald-400/30' 
          : 'bg-slate-800/50'
      }`}
    >
      <span className="text-slate-300 flex-1 pr-4">
        {isLink ? (
          <a 
            href={problem.problem} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 hover:underline break-all"
          >
            {problem.problem}
          </a>
        ) : (
          <span className="break-words">{problem.problem}</span>
        )}
      </span>
      
      <motion.button
        onClick={handleSolve}
        disabled={isSolving}
        className={`flex flex-shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          showSuccess
            ? 'bg-emerald-500/30 text-emerald-300'
            : isSolving
            ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
        }`}
        whileTap={{ scale: 0.95 }}
        animate={showSuccess ? { rotate: [0, 5, -5, 0] } : {}}
      >
        <motion.div
          animate={showSuccess ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {showSuccess ? <CheckCircle /> : <FiCheck />}
        </motion.div>
        <span>{showSuccess ? 'Completed!' : isSolving ? 'Solving...' : 'Solved'}</span>
      </motion.button>
      
      {/* Success particle effect */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute right-4 text-emerald-400 pointer-events-none"
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default function RevisionList({ problems, onMarkAsSolved }) {
  // Initialize with items from sessionStorage
  const [locallyRemovedIds, setLocallyRemovedIds] = useState(() => {
    const stored = sessionStorage.getItem('revision-removed-today');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const handleLocalRemove = (problemId) => {
    const newSet = new Set([...locallyRemovedIds, problemId]);
    setLocallyRemovedIds(newSet);
    // Save to sessionStorage
    sessionStorage.setItem('revision-removed-today', JSON.stringify([...newSet]));
  };

  // Clear removed items at midnight
  useEffect(() => {
    const checkNewDay = () => {
      const stored = sessionStorage.getItem('revision-removed-date');
      const today = new Date().toDateString();
      
      if (stored !== today) {
        sessionStorage.removeItem('revision-removed-today');
        sessionStorage.setItem('revision-removed-date', today);
        setLocallyRemovedIds(new Set());
      }
    };
    
    checkNewDay();
    const interval = setInterval(checkNewDay, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced filtering: remove locally removed + problems solved today
  const visibleProblems = problems.filter(p => {
    // Don't show if locally removed
    if (locallyRemovedIds.has(p.id)) return false;
    
    // Don't show if solved today (extra safety)
    if (p.date) {
      const lastSolved = p.date.toDate();
      const today = new Date();
      const isToday = lastSolved.toDateString() === today.toDateString();
      if (isToday && p.solveCount > 0) return false;
    }
    
    return true;
  });

  const dueProblems = INTERVALS.map(interval => ({
    ...interval,
    problems: visibleProblems.filter(p => isDue(p, interval)),
  }));

  const totalDue = dueProblems.reduce((sum, group) => sum + group.problems.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Today's Revision Schedule</h2>
        {totalDue > 0 && (
          <motion.span 
            key={totalDue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded-full"
          >
            {totalDue} due
          </motion.span>
        )}
      </div>
      
      {totalDue === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 p-12 text-center"
        >
          <motion.span 
            className="text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🎉
          </motion.span>
          <p className="mt-4 font-semibold text-slate-300">All caught up!</p>
          <p className="mt-1 text-sm text-slate-500">No problems are due for revision today.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {dueProblems.map(({ label, problems: dueItems }) => (
              dueItems.length > 0 && (
                <motion.div 
                  key={label}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-cyan-400">{label}</h3>
                    <motion.span 
                      key={`${label}-${dueItems.length}`}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-700/50 rounded-full"
                    >
                      {dueItems.length} problem{dueItems.length > 1 ? 's' : ''}
                    </motion.span>
                  </div>
                  <motion.ul layout className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {dueItems.map(problem => (
                        <RevisionItem 
                          key={problem.id} 
                          problem={problem} 
                          onSolve={onMarkAsSolved}
                          onLocalRemove={handleLocalRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
