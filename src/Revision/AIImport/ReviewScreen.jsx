// src/Revision/AIImport/ReviewScreen.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemCard from "./ProblemCard";
import BulkActionsBar from "./BulkActionsBar";

const FiArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const FiCheckCircle = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const FiSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function ReviewScreen({
  problemsList,
  setProblemsList,
  selectedIndices,
  setSelectedIndices,
  existingCanonicalSet,
  onSave,
  onBack,
  isSaving,
}) {
  const [filterSearch, setFilterSearch] = useState("");

  const totalCount = problemsList.length;
  const selectedCount = selectedIndices.size;

  const handleToggleSelect = (index) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const handleToggleSelectAll = () => {
    if (selectedIndices.size === totalCount) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(problemsList.map((_, i) => i)));
    }
  };

  const handleProblemChange = (index, updatedItem) => {
    const updated = [...problemsList];
    updated[index] = updatedItem;
    setProblemsList(updated);
  };

  const handleDeleteProblem = (index) => {
    const updated = problemsList.filter((_, i) => i !== index);
    setProblemsList(updated);

    // Recompute selected indices
    const nextSelected = new Set();
    selectedIndices.forEach((i) => {
      if (i < index) nextSelected.add(i);
      else if (i > index) nextSelected.add(i - 1);
    });
    setSelectedIndices(nextSelected);
  };

  const handleBulkSetPlatform = (platform) => {
    const updated = problemsList.map((item, i) => {
      if (selectedIndices.has(i)) {
        return { ...item, platform };
      }
      return item;
    });
    setProblemsList(updated);
  };

  const handleBulkSetDifficulty = (difficulty) => {
    const updated = problemsList.map((item, i) => {
      if (selectedIndices.has(i)) {
        return { ...item, difficulty };
      }
      return item;
    });
    setProblemsList(updated);
  };

  const handleAddNewManualCard = () => {
    const newCard = {
      problem: "",
      platform: "LeetCode",
      difficulty: "medium",
      tags: [],
      notes: "",
      confidence: "high",
    };
    const updated = [...problemsList, newCard];
    setProblemsList(updated);
    const nextSelected = new Set(selectedIndices);
    nextSelected.add(updated.length - 1);
    setSelectedIndices(nextSelected);
  };

  // Count how many selected problems already exist
  const existingSelectedCount = Array.from(selectedIndices).filter((i) => {
    const item = problemsList[i];
    if (!item) return false;
    const canon = (item.problem || "").toLowerCase().trim();
    return existingCanonicalSet?.has(canon);
  }).length;

  return (
    <div className="space-y-4">
      {/* Search & Bulk Toolbar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <FiArrowLeft /> Back to upload
          </button>

          {/* Quick Filter Search */}
          <div className="relative w-48 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Filter extracted..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        <BulkActionsBar
          totalCount={totalCount}
          selectedCount={selectedCount}
          onToggleSelectAll={handleToggleSelectAll}
          onBulkSetPlatform={handleBulkSetPlatform}
          onBulkSetDifficulty={handleBulkSetDifficulty}
          onAddNewManualCard={handleAddNewManualCard}
        />
      </div>

      {/* Cards List */}
      <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <AnimatePresence>
          {problemsList.map((item, index) => {
            if (
              filterSearch.trim() &&
              !item.problem.toLowerCase().includes(filterSearch.toLowerCase().trim()) &&
              !(item.platform || "").toLowerCase().includes(filterSearch.toLowerCase().trim())
            ) {
              return null;
            }

            const isCanon = (item.problem || "").toLowerCase().trim();
            const isExisting = Boolean(existingCanonicalSet?.has(isCanon));

            return (
              <ProblemCard
                key={index}
                item={item}
                index={index}
                isSelected={selectedIndices.has(index)}
                onToggleSelect={() => handleToggleSelect(index)}
                onChange={(updatedItem) => handleProblemChange(index, updatedItem)}
                onDelete={() => handleDeleteProblem(index)}
                isExisting={isExisting}
              />
            );
          })}
        </AnimatePresence>

        {problemsList.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No problems in this list. Click "Back to upload" or add one manually.
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          {existingSelectedCount > 0 ? (
            <span className="text-amber-400 font-medium">
              ℹ️ {existingSelectedCount} of {selectedCount} already exist & will be updated
            </span>
          ) : (
            <span>Ready to add {selectedCount} new problem(s)</span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            disabled={isSaving}
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={selectedCount === 0 || isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving to Firestore...</span>
              </>
            ) : (
              <>
                <FiCheckCircle />
                <span>Save {selectedCount} Problem{selectedCount !== 1 ? "s" : ""} ✨</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

