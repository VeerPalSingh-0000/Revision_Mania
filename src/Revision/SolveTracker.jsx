import React from "react";
import { INTERVALS } from "./constants";

const getShortLabel = (label) => {
  if (label === "3 Days") return "3D";
  if (label === "1 Week") return "1W";
  if (label === "1 Month") return "1M";
  if (label === "3 Months") return "3M";
  return label;
};

export default function SolveTracker({
  count,
  solveDates = [],
  intervals = INTERVALS,
  size = "md",
  showFullLabel = false,
  createdAt = null, // ✨ NEW: Now it accepts the creation date!
}) {
  const totalSteps = intervals.length;

  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  return (
    <div className="flex items-center gap-3">
      {[...Array(totalSteps)].map((_, i) => {
        const isCompleted = i < (count || 0);

        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <div
                className={`${dotSizes[size]} rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/25"
                    : "bg-slate-600"
                }`}
              />
              <span className="text-[9px] text-slate-500 leading-tight">
                {showFullLabel
                  ? intervals[i].label
                  : getShortLabel(intervals[i].label)}
              </span>
            </div>
          </div>
        );
      })}
      <span className="text-xs text-slate-400 ml-1">
        {count || 0}/{totalSteps}
      </span>
    </div>
  );
}
