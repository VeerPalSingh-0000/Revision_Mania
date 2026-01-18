// src/Revision/AllProblemsTable.jsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { INTERVALS } from './constants';

const AllProblemsTable = ({ problems }) => {
  const uniqueProblems = useMemo(() => {
    if (!problems) return [];
    
    const problemMap = new Map();

    problems.forEach(problem => {
      const canonical = problem.problem.toLowerCase();
      
      if (problemMap.has(canonical)) {
        const existing = problemMap.get(canonical);
        // We accumulate solveCounts, but we might want to keep the latest difficulty/tags
        // if they changed. For now, we keep the first one encountered or the latest if we swap.
        existing.solveCount += problem.solveCount || 0;
      } else {
        problemMap.set(canonical, { ...problem });
      }
    });

    return Array.from(problemMap.values());
  }, [problems]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-GB');
  };
  
  // Helper to get color classes based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };
  
  if (uniqueProblems.length === 0) {
      return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/50 p-16 text-center bg-slate-800/20"
          >
            <div className="text-6xl mb-4">🗂️</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No History Yet</h3>
            <p className="text-slate-500 max-w-md">
              Your revision history will appear here once you start solving problems.
            </p>
          </motion.div>
      )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto"
    >
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">S.No.</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Problem</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Difficulty</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Solved on</th>
            {INTERVALS.map((interval) => (
              <th key={interval.label} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-slate-200">{interval.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
          {uniqueProblems.map((problem, index) => (
            <tr key={problem.id} className="hover:bg-slate-800/50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300 sm:pl-6">{index + 1}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300 max-w-xs truncate">{problem.problem}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                {problem.difficulty ? (
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs">-</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{formatDate(problem.createdAt)}</td>
              {INTERVALS.map((_, i) => (
                <td key={i} className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  {(problem.solveCount || 0) > i ? (
                    <span className="text-green-400">✔️</span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AllProblemsTable;