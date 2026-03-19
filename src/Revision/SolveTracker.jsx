import React from "react";
import { INTERVALS } from "./constants";

const formatDate = (timestamp) => {
  if (!timestamp) return null;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

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
        const actualDates = solveDates || [];
        
        const offset = (count || 0) - actualDates.length;
        const dateIndex = i - offset;
        
        let actualDate = dateIndex >= 0 ? actualDates[dateIndex] : null;

        // ✨ THE MAGIC: Calculate missing dates just like the table
        if (isCompleted && !actualDate && createdAt) {
           const createdDate = createdAt.toDate 
              ? createdAt.toDate() 
              : new Date(createdAt);
           
           const estimatedDate = new Date(createdDate);
           estimatedDate.setDate(estimatedDate.getDate() + intervals[i].days);
           actualDate = estimatedDate;
        }

        const solveDate = actualDate ? formatDate(actualDate) : null;

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
            {isCompleted && solveDate && (
              <span className="text-[8px] text-emerald-400/70 leading-tight">
                {solveDate}
              </span>
            )}
          </div>
        );
      })}
      <span className="text-xs text-slate-400 ml-1">
        {count || 0}/{totalSteps}
      </span>
    </div>
  );
}
