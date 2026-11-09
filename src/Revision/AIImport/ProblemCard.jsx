// src/Revision/AIImport/ProblemCard.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIFFICULTY_OPTIONS, PLATFORM_OPTIONS, COMMON_TAGS } from "../constants";

// SVG Icons
const FiTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const FiCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FiPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FiX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FiTag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const FiRepeat = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);

export default function ProblemCard({
  item,
  index,
  isSelected,
  onToggleSelect,
  onChange,
  onDelete,
  isExisting,
}) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [showNotes, setShowNotes] = useState(Boolean(item.notes));

  const filteredTags = COMMON_TAGS.filter(
    (t) =>
      t.toLowerCase().includes(tagSearch.toLowerCase().trim()) &&
      !item.tags?.includes(t)
  ).slice(0, 8);

  const handleAddTag = (tagToAdd) => {
    const currentTags = item.tags || [];
    if (!currentTags.includes(tagToAdd)) {
      onChange({ ...item, tags: [...currentTags, tagToAdd] });
    }
    setTagSearch("");
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange({
      ...item,
      tags: (item.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "medium":
      default:
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`relative rounded-xl border p-4 transition-all duration-200 ${
        isSelected
          ? "border-cyan-500/50 bg-slate-900/90 shadow-lg shadow-cyan-950/20"
          : "border-slate-800/80 bg-slate-900/40 opacity-70"
      }`}
    >
      {/* Top Header: Checkbox + Number + Title Input + Delete Button */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggleSelect}
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${
            isSelected
              ? "border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/30"
              : "border-slate-700 bg-slate-950/60 text-transparent hover:border-slate-500"
          }`}
          title={isSelected ? "Deselect" : "Select for import"}
        >
          <FiCheck />
        </button>

        {/* Index Badge */}
        <span className="mt-1 font-mono text-[11px] font-bold text-slate-500">
          #{index + 1}
        </span>

        {/* Editable Problem Title */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={item.problem}
            onChange={(e) => onChange({ ...item, problem: e.target.value })}
            placeholder="Problem name or URL..."
            className="w-full rounded-lg border border-transparent bg-slate-950/40 px-2.5 py-1 text-sm font-semibold text-slate-100 placeholder-slate-600 outline-none hover:border-slate-800 focus:border-cyan-500/60 focus:bg-slate-950 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />

          {/* Duplicate / Existing Warning Badge */}
          {isExisting && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                <FiRepeat /> Already in tracker (will increment solve count & update)
              </span>
            </div>
          )}
        </div>

        {/* Confidence dot */}
        {item.confidence && (
          <span
            className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
              item.confidence === "high"
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                : item.confidence === "low"
                ? "bg-rose-950/60 text-rose-400 border-rose-500/30"
                : "bg-amber-950/60 text-amber-400 border-amber-500/30"
            }`}
            title={`AI Confidence: ${item.confidence}`}
          >
            {item.confidence} confidence
          </span>
        )}

        {/* Delete Card */}
        <button
          type="button"
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer"
          title="Remove problem"
        >
          <FiTrash />
        </button>
      </div>

      {/* Middle Row: Platform & Difficulty Selectors */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
        {/* Platform Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-16">
            Platform:
          </label>
          <select
            value={item.platform || "LeetCode"}
            onChange={(e) => onChange({ ...item, platform: e.target.value })}
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-cyan-300 outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            {PLATFORM_OPTIONS.map((plat) => (
              <option key={plat} value={plat} className="bg-slate-900 text-slate-200">
                {plat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-16">
            Difficulty:
          </label>
          <select
            value={item.difficulty || "medium"}
            onChange={(e) => onChange({ ...item, difficulty: e.target.value })}
            className={`flex-1 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${getDifficultyBadge(
              item.difficulty
            )}`}
          >
            {DIFFICULTY_OPTIONS.map((diff) => (
              <option key={diff.key} value={diff.value} className="bg-slate-900 text-slate-200">
                {diff.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mt-3 pl-8 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <FiTag /> Tags:
        </span>

        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <FiX />
            </button>
          </span>
        ))}

        {/* Add Tag Popover Button */}
        {isAddingTag ? (
          <div className="relative inline-flex items-center">
            <input
              type="text"
              autoFocus
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagSearch.trim()) {
                  e.preventDefault();
                  handleAddTag(tagSearch.trim());
                } else if (e.key === "Escape") {
                  setIsAddingTag(false);
                }
              }}
              placeholder="Type tag name..."
              className="w-28 rounded-md border border-cyan-500/50 bg-slate-950 px-2 py-0.5 text-[11px] text-slate-200 outline-none"
            />
            <button
              type="button"
              onClick={() => setIsAddingTag(false)}
              className="ml-1 text-slate-400 hover:text-slate-200"
            >
              <FiX />
            </button>

            {/* Quick dropdown suggestions */}
            {tagSearch.trim() && filteredTags.length > 0 && (
              <div className="absolute left-0 top-full mt-1 z-30 w-44 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl">
                {filteredTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="w-full text-left px-2 py-1 text-[11px] text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 rounded cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingTag(true)}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-700 hover:border-cyan-500/60 hover:text-cyan-400 px-2 py-0.5 text-[11px] text-slate-400 transition-colors cursor-pointer"
          >
            <FiPlus /> Add Tag
          </button>
        )}
      </div>

      {/* Notes / Approach Section */}
      <div className="mt-3 pl-8">
        {showNotes ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Notes / Approach Insight:
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowNotes(false);
                  onChange({ ...item, notes: "" });
                }}
                className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={2}
              value={item.notes || ""}
              onChange={(e) => onChange({ ...item, notes: e.target.value })}
              placeholder="e.g. Key trick, edge cases, time/space complexity..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FiPlus /> Add quick notes or approach
          </button>
        )}
      </div>
    </motion.div>
  );
}

