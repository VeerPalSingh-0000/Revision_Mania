import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logOut } from '../components/Auth.jsx';
import ProblemForm from './ProblemForm.jsx';
import RevisionList from './RevisionList.jsx';
import AllProblemsList from './AllProblemsList.jsx';
import { useProblems } from '../hooks/useProblems.js';

const Header = ({ user }) => (
  <header className="mb-8 flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tighter text-slate-100">Revision Planner</h1>
      <p className="mt-1 text-sm text-slate-400">
        Welcome, <span className="font-semibold text-cyan-400">{user.displayName || user.email}</span>
      </p>
    </div>
    <button
      onClick={logOut}
      className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
    >
      Logout
    </button>
  </header>
);

const ViewToggleButton = ({ view, setView }) => (
    <div className="flex justify-center">
        <div className="flex items-center rounded-full bg-slate-800/80 p-1">
             <button
                onClick={() => setView('revision')}
                className={`w-32 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'revision' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            >
                Schedule
            </button>
            <button
                onClick={() => setView('all')}
                className={`w-32 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            >
                All Problems
            </button>
        </div>
    </div>
);


export default function RevisionApp({ user }) {
  const { problems, isLoading, addProblem, deleteProblem, markAsSolved } = useProblems(user);
  const [view, setView] = useState('revision');

  return (
    <div className="relative flex min-h-screen flex-col items-start justify-start overflow-hidden bg-slate-950 p-4 font-sans text-slate-200 sm:p-6 md:p-8">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        <Header user={user} />

        <main className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-lg">
          <ProblemForm onAddProblem={addProblem} />

          <div className="my-6">
            <ViewToggleButton view={view} setView={setView} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                 <p className="text-center text-slate-400">Loading...</p>
              ) : view === 'revision' ? (
                <RevisionList 
                  problems={problems} 
                  onMarkAsSolved={markAsSolved} // Pass the function here
                />
              ) : (
                <AllProblemsList
                    problems={problems}
                    onBack={() => setView('revision')}
                    onDeleteProblem={deleteProblem}
                    onMarkAsSolved={markAsSolved}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}
