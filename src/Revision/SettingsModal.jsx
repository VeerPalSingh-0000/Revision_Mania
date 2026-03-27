// src/Revision/SettingsModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const FiX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FiPlus = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FiTrash2 = () => (
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

export default function SettingsModal({ intervals, onSave, onReset, onClose }) {
  const [localIntervals, setLocalIntervals] = useState([...intervals]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setLocalIntervals([...localIntervals, { label: "New Step", days: 1 }]);
  };

  const handleRemove = (index) => {
    setLocalIntervals(localIntervals.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const next = [...localIntervals];
    next[index] = {
      ...next[index],
      [field]: field === "days" ? parseInt(value) || 0 : value,
    };
    setLocalIntervals(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(localIntervals);
    setIsSaving(false);
    onClose();
  };

  const handleReset = async () => {
    if (confirm("Reset intervals to default values?")) {
      await onReset();
      onClose();
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 text-primary">
            Revision Step Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FiX />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-6 font-medium">
          Customize the spaced-repetition intervals. These steps define when a
          problem will reappear in your revision schedule.
        </p>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {localIntervals.map((interval, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 group"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={interval.label}
                  onChange={(e) => handleChange(index, "label", e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-cyan-500/50 transition-colors"
                  placeholder="Label (e.g. 3 Days)"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={interval.days}
                  onChange={(e) => handleChange(index, "days", e.target.value)}
                  className="w-16 bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-center text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none transition-shadow"
                  min="1"
                />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  days
                </span>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove step"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-sm font-semibold mb-6 group hover:bg-cyan-500/5"
        >
          <FiPlus className="group-hover:scale-110 transition-transform" /> Add
          Revision Step
        </button>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors px-2"
          >
            Reset to Defaults
          </button>
          <div className="flex-1"></div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
