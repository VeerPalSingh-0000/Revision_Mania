import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logOut, updateDisplayName } from "../components/Auth.jsx";
import ProblemForm from "./ProblemForm.jsx";
import RevisionList from "./RevisionList.jsx";
import AllProblemsTable from "./AllProblemsTable.jsx";
import { useProblems } from "../hooks/useProblems.js";
import { useSettings } from "../hooks/useSettings.js";
import SettingsModal from "./SettingsModal.jsx";

// --- SVG Icons for Header & Drawer ---
const FiSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const FiTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const FiLogOut = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// --- Spaced Repetition Section inside Drawer ---
const SpacedRepetitionSection = ({ intervals, onSave, onReset }) => {
  const [localIntervals, setLocalIntervals] = useState([...intervals]);

  useEffect(() => {
    setLocalIntervals([...intervals]);
  }, [intervals]);

  const handleChangeDays = (index, value) => {
    const next = [...localIntervals];
    next[index] = {
      ...next[index],
      days: Math.max(1, parseInt(value) || 1)
    };
    setLocalIntervals(next);
  };

  const handleRemove = (index) => {
    setLocalIntervals(localIntervals.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setLocalIntervals([...localIntervals, { label: `Step ${localIntervals.length + 1}`, days: 1 }]);
  };

  const handleSave = () => {
    const updated = localIntervals.map((interval, index) => ({
      label: `Step ${index + 1}`,
      days: interval.days
    }));
    onSave(updated);
  };

  return (
    <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Revision Intervals
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {localIntervals.map((interval, index) => (
          <div key={index} className="flex items-center justify-between py-1 px-3 bg-slate-900/40 border border-slate-800/60 rounded-lg">
            <span className="text-xs font-bold text-slate-300">
              Step {index + 1}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={interval.days}
                  onChange={(e) => handleChangeDays(index, e.target.value)}
                  className="w-14 bg-slate-950 border border-slate-850 rounded px-1.5 py-1 text-xs text-center text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                  min="1"
                />
                <span className="text-[10px] text-slate-500 font-bold uppercase">days</span>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                title="Remove Step"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleAdd}
          className="flex-grow py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-850 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Step
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-xs font-semibold text-white transition-colors cursor-pointer shadow-md shadow-cyan-500/10"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// --- Help Modal Component ---
const HelpModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl relative flex flex-col z-10"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span>Quick Guide</span>
              </h3>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-medium">
              <p className="text-[11px] text-slate-400">
                Revision Mania uses spaced repetition to help you retain solution approaches for coding problems over a long time.
              </p>

              <div className="space-y-2 border-t border-b border-slate-800/60 py-2.5 my-2">
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">01.</span>
                  <p><strong className="text-slate-200">Catalog:</strong> Add coding problems using the <strong className="text-cyan-400 font-semibold">+ Add Problem</strong> button.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">02.</span>
                  <p><strong className="text-slate-200">Review:</strong> Solve due problems when they appear on your schedule queue.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">03.</span>
                  <p><strong className="text-slate-200">Compound:</strong> Each resolve pushes out the next revision date (3d → 7d → 30d → 90d).</p>
                </div>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/80 text-[11px] text-slate-400">
                💡 Change revision step days or add new review levels under <strong>Revision Intervals</strong> inside your Profile Settings.
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all outline-none cursor-pointer"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Profile Drawer Component ---
const ProfileDrawer = ({
  isOpen,
  onClose,
  user,
  problems,
  totalProblems,
  totalSolves,
  intervals,
  onSaveIntervals,
  onResetIntervals,
  onClearAll,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName || user.email.split("@")[0]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const [confirmWipe, setConfirmWipe] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeError, setWipeError] = useState(null);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  useEffect(() => {
    if (user.displayName) {
      setDisplayName(user.displayName);
      setTempName(user.displayName);
    }
  }, [user.displayName]);

  const userInitial = displayName.trim()[0].toUpperCase();

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    try {
      const result = await updateDisplayName(tempName.trim());
      if (result.success) {
        setDisplayName(tempName.trim());
        setIsEditingName(false);
        alert("Display name updated successfully!");
      } else {
        alert("Failed to update name: " + result.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleWipe = async () => {
    setIsWiping(true);
    setWipeError(null);
    try {
      const result = await onClearAll();
      if (result.success) {
        setConfirmWipe(false);
        alert("Account reset successfully!");
      } else {
        setWipeError(result.error);
      }
    } catch (err) {
      setWipeError(err.message || "Failed to reset");
    } finally {
      setIsWiping(false);
    }
  };

  const easyCount = problems.filter((p) => p.difficulty?.toLowerCase() === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty?.toLowerCase() === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty?.toLowerCase() === "hard").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-slate-950/80 backdrop-blur-2xl border-l border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-[60] flex flex-col overflow-y-auto custom-scrollbar"
          >
            {/* Drawer Header */}
            <div className="relative p-8 pb-6 border-b border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">Your Profile</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-slate-100 font-bold text-xl uppercase tracking-wider">
                      {userInitial}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="flex-1 bg-slate-900/50 border border-cyan-500/50 rounded-lg px-2 py-1 text-sm font-semibold text-slate-100 outline-none shadow-[0_0_10px_rgba(6,182,212,0.15)] focus:ring-2 focus:ring-cyan-500/30"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateName}
                          className="p-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button
                          onClick={() => {
                            setTempName(displayName);
                            setIsEditingName(false);
                          }}
                          className="p-1.5 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {displayName}
                        </h3>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit display name"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="p-6 space-y-8 flex-grow">
              
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-500/20 rounded-2xl text-center relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="text-2xl font-black text-emerald-400 tracking-tight group-hover:scale-110 transition-transform">{totalSolves}</div>
                  <div className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mt-1">Solves</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-900/20 border border-blue-500/20 rounded-2xl text-center relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="text-2xl font-black text-blue-400 tracking-tight group-hover:scale-110 transition-transform">{totalProblems}</div>
                  <div className="text-[10px] font-bold text-blue-500/70 uppercase tracking-widest mt-1">Problems</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-900/20 border border-purple-500/20 rounded-2xl text-center relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="text-2xl font-black text-purple-400 tracking-tight group-hover:scale-110 transition-transform">
                    {problems.filter((p) => p.isRevision || p.originalProblemId).length}
                  </div>
                  <div className="text-[10px] font-bold text-purple-500/70 uppercase tracking-widest mt-1">Revisions</div>
                </div>
              </div>

              {/* Difficulty breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty Split</h4>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                  {totalProblems > 0 ? (
                    <>
                      <div style={{ width: `${(easyCount / totalProblems) * 100}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${(mediumCount / totalProblems) * 100}%` }} className="h-full bg-amber-500" />
                      <div style={{ width: `${(hardCount / totalProblems) * 100}%` }} className="h-full bg-red-500" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-800" />
                  )}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                    {easyCount} Easy
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span>
                    {mediumCount} Medium
                  </div>
                  <div className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                    {hardCount} Hard
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                {/* Settings Accordion */}
                <div className="bg-slate-900/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors overflow-hidden">
                  <div
                    onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                    className="w-full py-3.5 px-4 text-slate-300 hover:text-white text-sm font-bold transition-all flex items-center justify-between cursor-pointer outline-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                      </div>
                      <span>Revision Step Settings</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isSettingsExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isSettingsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-white/5 bg-slate-950/40">
                          <SpacedRepetitionSection
                            intervals={intervals}
                            onSave={onSaveIntervals}
                            onReset={onResetIntervals}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Help & Guide Button */}
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="w-full py-3.5 px-4 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 hover:border-slate-700 rounded-xl text-sm font-bold transition-all flex items-center gap-3 outline-none group"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <span>Documentation & Guide</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-900/10 border border-red-500/20 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-black text-red-500 uppercase tracking-widest">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-200/50 mt-1 font-medium leading-relaxed">
                    Wipe your dashboard clean. This permanently removes all problem history and resets intervals.
                  </p>
                </div>

                {wipeError && (
                  <p className="text-xs text-red-200 font-bold bg-red-950 p-2.5 rounded-lg border border-red-500/30">
                    {wipeError}
                  </p>
                )}

                {!confirmWipe ? (
                  <button
                    onClick={() => setConfirmWipe(true)}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-red-500/50 shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                  >
                    Reset Account Data
                  </button>
                ) : (
                  <div className="space-y-3 bg-red-950/50 p-3 rounded-xl border border-red-500/20">
                    <p className="text-xs text-red-300 font-bold text-center">
                      Are you absolutely sure?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmWipe(false)}
                        disabled={isWiping}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleWipe}
                        disabled={isWiping}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:shadow-none"
                      >
                        {isWiping ? "Resetting..." : "Yes, wipe it"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    onClose();
                    await logOut();
                  }}
                  className="w-full py-3 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-white transition-colors"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Help Overlay Modal */}
            <HelpModal
              isOpen={isHelpOpen}
              onClose={() => setIsHelpOpen(false)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Header Component ---
const Header = ({ user, onOpenProfile }) => {
  const userName = user.displayName || user.email.split("@")[0];
  const userInitial = userName.trim()[0].toUpperCase();

  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tighter text-slate-100"
        >
          Revision Planner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-sm text-slate-400"
        >
          Welcome,{" "}
          <span className="font-semibold text-cyan-400">
            {userName}
          </span>
        </motion.p>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-all duration-200 shadow-lg outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-inner uppercase">
            {userInitial}
          </div>
          <span className="text-sm font-semibold max-w-[120px] truncate hidden sm:inline">
            {userName}
          </span>
        </motion.button>
      </div>
    </header>
  );
};

// --- View Toggle Component (Updated: Removed 'All Problems') ---
const ViewToggleButton = ({ view, setView }) => (
  <div className="flex justify-center">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center rounded-full bg-slate-800/90 backdrop-blur-md p-1 border border-slate-700/50 shadow-lg shadow-slate-950/50"
    >
      <button
        onClick={() => setView("revision")}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === "revision"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        {view === "revision" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        Schedule
      </button>

      {/* Removed 'All Problems' button here */}

      <button
        onClick={() => setView("table")}
        className={`relative w-32 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          view === "table"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        {view === "table" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-cyan-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
        History
      </button>
    </motion.div>
  </div>
);

// --- Loading Component & Error Component (no changes) ---
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-slate-400 font-medium"
    >
      Loading your problems...
    </motion.p>
  </motion.div>
);
const ErrorMessage = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">
      Something went wrong
    </h3>
    <p className="text-slate-500 mb-4 text-center max-w-md">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

// --- Main App Component (Updated) ---
export default function RevisionApp({ user }) {
  const {
    problems,
    isLoading,
    error,
    addProblem,
    deleteProblem,
    markAsSolved,
    updateNotes,
    clearAllProblems,
    refetch,
  } = useProblems(user);

  const {
    intervals,
    updateIntervals,
    resetToDefaults,
    isLoading: isSettingsLoading,
  } = useSettings(user);

  const [view, setView] = useState("revision");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleClearAll = async () => {
    try {
      const result = await clearAllProblems();
      if (result.success) {
        await resetToDefaults();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message || err.toString() };
    }
  };

  // Statistics
  const totalProblems = problems.length;
  const totalRevisions = problems.filter(
    (p) => p.isRevision || p.originalProblemId,
  ).length;
  const totalSolves = problems.reduce((sum, p) => sum + (p.solveCount || 0), 0);

  const renderContent = () => {
    switch (view) {
      case "revision":
        return (
          <RevisionList
            problems={problems}
            onMarkAsSolved={markAsSolved}
            onUpdateNotes={updateNotes}
            intervals={intervals}
          />
        );
      // Case 'all' removed
      case "table":
        return (
          <AllProblemsTable
            problems={problems}
            onMarkAsSolved={markAsSolved}
            onUpdateNotes={updateNotes}
            intervals={intervals}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-start justify-start overflow-clip bg-slate-950 p-4 font-sans text-slate-200 sm:p-6 md:p-8">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl xl:max-w-[1400px] mx-auto transition-all duration-300"
        >
          <Header
            user={user}
            onOpenProfile={() => setIsProfileOpen(true)}
          />

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-lg"
          >
            {/* Dashboard Subheader Control Row */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 flex-wrap gap-3">
              <ViewToggleButton view={view} setView={setView} />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-bold text-xs text-white shadow-lg shadow-cyan-500/15 transition-all outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span>Add Problem</span>
              </motion.button>
            </div>

            {/* Statistics Bar */}
            {!isLoading && !error && totalProblems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 grid grid-cols-3 gap-4"
              >
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-slate-200">
                    {totalProblems}
                  </div>
                  <div className="text-xs text-slate-400">Problems</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-emerald-400">
                    {totalSolves}
                  </div>
                  <div className="text-xs text-slate-400">Total Solves</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-lg font-bold text-purple-400">
                    {totalRevisions}
                  </div>
                  <div className="text-xs text-slate-400">Revisions</div>
                </div>
              </motion.div>
            )}

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="min-h-[400px]"
            >
              {/* Error State */}
              {error && <ErrorMessage error={error} onRetry={refetch} />}

              {/* Loading State */}
              {isLoading && !error && <LoadingSpinner />}

              {/* Content Views */}
              {!isLoading && !error && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </motion.main>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-xs text-slate-500"
          >
            <p>
              &copy; {new Date().getFullYear()} Revision Mania. Built with ❤️ by
              Veer Pal Singh.
            </p>
          </motion.footer>
        </motion.div>
      </div>

      {/* Profile & Settings Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        problems={problems}
        totalProblems={totalProblems}
        totalSolves={totalSolves}
        intervals={intervals}
        onSaveIntervals={updateIntervals}
        onResetIntervals={resetToDefaults}
        onClearAll={handleClearAll}
      />

      {/* Add Problem Modal */}
      <ProblemForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAddProblem={addProblem}
      />
    </>
  );
}
