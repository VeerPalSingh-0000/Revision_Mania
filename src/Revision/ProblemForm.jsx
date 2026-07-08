import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG Icons ---
const FiPlus = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const FiLoader = () => (
  <svg
    className="animate-spin"
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
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
const FiX = () => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const FiChevronDown = () => (
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
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// --- Constants ---
const DIFFICULTY_OPTIONS = [
  { key: "easy", value: "easy", label: "Easy" },
  { key: "medium", value: "medium", label: "Medium" },
  { key: "hard", value: "hard", label: "Hard" },
];

const PLATFORM_OPTIONS = [
  "LeetCode",
  "HackerRank",
  "CodeForces",
  "AtCoder",
  "CodeChef",
  "GeeksforGeeks",
  "InterviewBit",
  "Pramp",
  "Other",
];

const COMMON_TAGS = [
  "Array",
  "Backtracking",
  "Biconnected Component",
  "Binary Indexed Tree",
  "Binary Search",
  "Binary Search Tree",
  "Binary Tree",
  "Bit Manipulation",
  "Bitmask",
  "Brainteaser",
  "Breadth-First Search",
  "Bucket Sort",
  "Combinatorics",
  "Concurrency",
  "Counting",
  "Counting Sort",
  "Data Stream",
  "Database",
  "Depth-First Search",
  "Design",
  "Divide and Conquer",
  "Doubly-Linked List",
  "Dynamic Programming",
  "Eulerian Circuit",
  "Game Theory",
  "Geometry",
  "Graph",
  "Greedy",
  "Hash Function",
  "Hash Table",
  "Heap",
  "Heap (Priority Queue)",
  "Interactive",
  "Iterator",
  "Line Sweep",
  "Linked List",
  "Math",
  "Matrix",
  "Memoization",
  "Merge Sort",
  "Minimum Spanning Tree",
  "Monotonic Queue",
  "Monotonic Stack",
  "Number Theory",
  "Ordered Set",
  "Prefix Sum",
  "Probability and Statistics",
  "Queue",
  "Quickselect",
  "Radix Sort",
  "Randomized",
  "Recursion",
  "Rejection Sampling",
  "Rolling Hash",
  "Segment Tree",
  "Shell",
  "Shortest Path",
  "Sliding Window",
  "Sorting",
  "Stack",
  "String",
  "String Matching",
  "Strongly Connected Component",
  "Suffix Array",
  "Topological Sort",
  "Tree",
  "Trie",
  "Two Pointers",
  "Union Find"
];

// --- Sub Components ---
const CustomSelect = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-left text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${className}`}
      >
        <span className={value ? "text-slate-200" : "text-slate-500"}>
          {value
            ? options.find((o) => o.value === value)?.label || value
            : placeholder}
        </span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.key || option}
                type="button"
                onClick={() => {
                  onChange(option.value || option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label || option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TagInput = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      const filtered = COMMON_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(tag),
      );
      setSuggestions(filtered.slice(0, 5));
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue("");
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        addTag(suggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
            >
              {tag}{" "}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-400 transition-colors"
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter)..."
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                  className={`w-full px-3 py-2 text-left transition-colors text-slate-200 ${
                    activeSuggestionIndex === index
                      ? "bg-slate-700 text-cyan-400 font-semibold"
                      : "hover:bg-slate-700/50"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ProblemForm({ isOpen, onClose, onAddProblem }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    problem: "",
    difficulty: "",
    platform: "",
    tags: [],
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem.trim()) {
      setError("Problem description is required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const problemData = {
        problem: formData.problem.trim(),
        difficulty: formData.difficulty || null,
        platform: formData.platform || null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        notes: formData.notes.trim(),
      };

      const result = await onAddProblem(problemData);

      if (result?.success) {
        setFormData({
          problem: "",
          difficulty: "",
          platform: "",
          tags: [],
          notes: "",
        });
        onClose();
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to add problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Modal Overlay backdrop click */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200">
                Add Problem
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                >
                  <span>⚠️</span> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Problem Input */}
              <div>
                <label
                  htmlFor="problem"
                  className="block text-xs font-semibold text-slate-400 mb-1.5"
                >
                  Problem Description / URL
                </label>
                <input
                  id="problem"
                  type="text"
                  value={formData.problem}
                  onChange={(e) => updateFormData("problem", e.target.value)}
                  placeholder="e.g. Reverse Linked List or https://leetcode.com/..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {/* Advanced Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Difficulty
                  </label>
                  <CustomSelect
                    options={DIFFICULTY_OPTIONS}
                    value={formData.difficulty}
                    onChange={(value) => updateFormData("difficulty", value)}
                    placeholder="Select difficulty..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Platform
                  </label>
                  <CustomSelect
                    options={PLATFORM_OPTIONS}
                    value={formData.platform}
                    onChange={(value) => updateFormData("platform", value)}
                    placeholder="Select platform..."
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Tags{" "}
                  <span className="text-[10px] text-slate-500">
                    ({formData.tags.length})
                  </span>
                </label>
                <TagInput
                  tags={formData.tags}
                  onChange={(tags) => updateFormData("tags", tags)}
                />
              </div>

              {/* Notes / Approach */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold text-slate-400 mb-1.5"
                >
                  Notes / Approach <span className="text-[10px] text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  placeholder="Key insight, approach used, or things to remember..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-md bg-cyan-500 font-semibold text-xs text-white shadow shadow-cyan-500/20 transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-700/60 cursor-pointer"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <FiLoader /> : "Add Problem"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
