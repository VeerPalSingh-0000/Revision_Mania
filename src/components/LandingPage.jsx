import React from "react";
import { motion } from "framer-motion";

// --- SVG Icons ---
const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-cyan-400"
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v12" />
    <path d="M8 10c0-2.2 1.8-4 4-4" />
    <path d="M12 18c2.2 0 4-1.8 4-4" />
    <path d="M16 10c0-2.2-1.8-4-4-4" />
    <path d="M12 18c-2.2 0-4-1.8-4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const GearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export default function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrainIcon />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Revision Mania
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onSignIn}
            className="text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors px-4 py-2"
          >
            Log In
          </button>
          <button
            onClick={onSignUp}
            className="relative group rounded-full px-5 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03] active:scale-[0.97]"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-xs font-semibold text-cyan-400 tracking-wide mb-8 shadow-inner"
        >
          <span>🚀</span> Spaced Repetition for Competitive Programmers
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.1] mb-6"
        >
          Master Coding Interviews.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            Systematically.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 font-medium"
        >
          Beat the forgetting curve. We automatically structure, queue, and optimize your coding revisions so you never struggle with a pattern twice.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button
            onClick={onSignUp}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 font-bold text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get Started for Free
          </button>
          <button
            onClick={onSignIn}
            className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-slate-100 hover:bg-slate-800/80 font-bold transition-all"
          >
            Explore Dashboard
          </button>
        </motion.div>

        {/* Interactive Dashboard Mock Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6 shadow-2xl backdrop-blur-md relative"
        >
          {/* Glass mock header controls */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Revision Queue Preview
            </div>
            <div className="w-12"></div>
          </div>

          {/* Visual list of items mock */}
          <div className="space-y-3 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200">
                    3Sum
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Medium
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-semibold">
                  <span>LeetCode</span>
                  <span>•</span>
                  <span>Two Pointers, Array</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/10 font-bold uppercase tracking-wider">
                  Due Today
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all">
                  Solve & Complete Step
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/20 border border-slate-800/40 gap-3 opacity-85">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-300">
                    LRU Cache
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    Hard
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-semibold">
                  <span>InterviewBit</span>
                  <span>•</span>
                  <span>Linked List, Design</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/10 font-bold uppercase tracking-wider">
                  Step 2 (In 4 Days)
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  2 Solves
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-200">
            Engineered for Effective Retention
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto font-medium">
            Stop doing random problems. Use a structured, pattern-based approach to get the maximum value out of every solve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center mb-4">
              <CalendarIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
              Spaced Repetition
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              We queue your solved tasks automatically after 3 days, 1 week, 1 month, and 3 months, keeping algorithms fresh in memory.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/40 flex items-center justify-center mb-4">
              <ChartIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
              Analytics & Insights
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Observe total solves, active revision step counts, and complete tracking histories to stay consistent and accountable.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-pink-950/80 border border-pink-800/40 flex items-center justify-center mb-4">
              <GearIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
              Custom Steps
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Want longer or shorter breaks? Fully customize your intervals and steps directly inside the settings to match your study schedule.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center mb-4">
              <TagIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
              Seamless Filters
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Quickly browse and query problems by topic tags (Array, Graph, DP) and platform tags (LeetCode, Codeforces, HackerRank).
            </p>
          </div>
        </div>
      </section>

      {/* "How It Works" Stepper Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-200">
            Four Steps to Mastery
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            Revision Mania integrates seamlessly into your standard practice workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
              1
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">
              Solve & Log
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              After coding a solution, add it to your log in seconds with custom details.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
              2
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">
              Auto-Scheduling
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              The algorithm schedules the optimal date for your next review round.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
              3
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">
              Revise Queue
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Log in daily to see a clean list of problems that are due for revision.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
              4
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">
              Compound Skills
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Observe your overall problem retention rates skyrocket over time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 pt-8 text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 max-w-xl leading-tight mb-4">
            Are you ready to beat the forgetting curve?
          </h2>
          <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed mb-8 font-medium">
            Join developers using Revision Mania to stay consistent, save time, and pass their software engineering interviews.
          </p>
          <button
            onClick={onSignUp}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 font-bold text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} Revision Mania. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
