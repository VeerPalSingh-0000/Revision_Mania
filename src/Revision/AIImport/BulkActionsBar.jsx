// src/Revision/AIImport/BulkActionsBar.jsx

import React from "react";
import { DIFFICULTY_OPTIONS, PLATFORM_OPTIONS } from "../constants";

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
    width="14"
    height="14"
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

export default function BulkActionsBar({
  totalCount,
  selectedCount,
  onToggleSelectAll,
  onBulkSetPlatform,
  onBulkSetDifficulty,
  onAddNewManualCard,
}) {
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs backdrop-blur-md">
      {/* Left: Select All Checkbox + Count */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSelectAll}
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all cursor-pointer ${
            isAllSelected
              ? "border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              : isIndeterminate
              ? "border-cyan-500 bg-cyan-950/80 text-cyan-300"
              : "border-slate-700 bg-slate-900 text-transparent hover:border-slate-500"
          }`}
          title={isAllSelected ? "Deselect All" : "Select All"}
        >
          {isAllSelected && <FiCheck />}
          {isIndeterminate && <span className="h-1.5 w-2 bg-cyan-400 rounded-sm" />}
        </button>

        <span className="font-semibold text-slate-200">
          Selected <span className="text-cyan-400 font-bold">{selectedCount}</span> of{" "}
          <span className="text-slate-100">{totalCount}</span> problems
        </span>
      </div>

      {/* Right: Bulk change dropdowns + Add card */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Bulk Platform Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Set Platform:</span>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkSetPlatform(e.target.value);
                e.target.value = "";
              }
            }}
            disabled={selectedCount === 0}
            className="bg-transparent text-xs font-semibold text-cyan-300 outline-none cursor-pointer disabled:opacity-40"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Apply to selected...
            </option>
            {PLATFORM_OPTIONS.map((plat) => (
              <option key={plat} value={plat} className="bg-slate-900 text-slate-200">
                {plat}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Difficulty Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Set Diff:</span>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkSetDifficulty(e.target.value);
                e.target.value = "";
              }
            }}
            disabled={selectedCount === 0}
            className="bg-transparent text-xs font-semibold text-amber-300 outline-none cursor-pointer disabled:opacity-40"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Apply to selected...
            </option>
            {DIFFICULTY_OPTIONS.map((diff) => (
              <option key={diff.key} value={diff.value} className="bg-slate-900 text-slate-200">
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add manual item */}
        <button
          type="button"
          onClick={onAddNewManualCard}
          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <FiPlus /> Add Problem
        </button>
      </div>
    </div>
  );
}

