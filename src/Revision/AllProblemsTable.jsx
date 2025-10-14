import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { INTERVALS } from './constants';

const AllProblemsTable = ({ problems }) => {
  const uniqueProblems = useMemo(() => {
    if (!problems) return [];
    
    // Use a map to consolidate duplicates
    const problemMap = new Map();

    problems.forEach(problem => {
      const canonical = problem.problem.toLowerCase();
      
      if (problemMap.has(canonical)) {
        // If we've seen this problem, add its solve count to the existing entry
        const existing = problemMap.get(canonical);
        existing.solveCount += problem.solveCount || 0;
      } else {
        // If it's a new problem, add it to the map
        // Create a copy to avoid mutating the original problems array
        problemMap.set(canonical, { ...problem });
      }
    });

    // The map now holds unique problems with consolidated solve counts.
    // The default order from the database (createdAt ascending) is already correct.
    return Array.from(problemMap.values());
  }, [problems]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-GB');
  };

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
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Date Logged</th>
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
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{formatDate(problem.createdAt)}</td>
              {INTERVALS.map((_, i) => (
                <td key={i} className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  {problem.solveCount > i ? (
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