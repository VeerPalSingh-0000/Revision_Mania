import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FiPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const FiLoader = () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;

export default function ProblemForm({ onAddProblem }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const { success } = await onAddProblem(input);
    if (success) {
      setInput('');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        className="flex-grow rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new solved problem..."
        required
        disabled={isLoading}
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-700/60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <FiLoader /> : <FiPlus />}
      </motion.button>
    </form>
  );
}
