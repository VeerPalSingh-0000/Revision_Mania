// src/Revision/AIImport/AIImportModal.jsx

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "./ImageUploader";
import ReviewScreen from "./ReviewScreen";
import {
  extractProblemsFromImage,
  autoDetectProblemDetails,
} from "../../ai/extractProblems";

// SVG Icons
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

const FiSparkles = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path>
  </svg>
);

const FiCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
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

export default function AIImportModal({
  isOpen,
  onClose,
  onBulkAdd,
  existingProblems = [],
  addToast,
}) {
  const [step, setStep] = useState("upload"); // "upload" | "review" | "success"
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [problemsList, setProblemsList] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [saveSummary, setSaveSummary] = useState(null);

  // Set of canonical names for duplicate detection
  const existingCanonicalSet = useMemo(() => {
    const set = new Set();
    existingProblems.forEach((p) => {
      const canon = (p.problemCanonical || p.problem || "").toLowerCase().trim();
      if (canon) set.add(canon);
    });
    return set;
  }, [existingProblems]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep("upload");
      setIsExtracting(false);
      setIsSaving(false);
      setError(null);
      setProblemsList([]);
      setSelectedIndices(new Set());
      setSaveSummary(null);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen && !isExtracting && !isSaving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isExtracting, isSaving, onClose]);

  if (!isOpen) return null;

  // Extract from uploaded image
  const handleExtractImage = async (imageFile, platformHint, apiKey) => {
    setIsExtracting(true);
    setError(null);
    try {
      const extracted = await extractProblemsFromImage(imageFile, platformHint, apiKey);
      if (!extracted || extracted.length === 0) {
        throw new Error(
          "No coding problems could be detected in this image. Please check image clarity and try again."
        );
      }
      setProblemsList(extracted);
      setSelectedIndices(new Set(extracted.map((_, i) => i)));
      setStep("review");
      if (addToast) {
        addToast(`AI extracted ${extracted.length} problem(s)! Review them below.`, "success");
      }
    } catch (err) {
      console.error("AI Extraction error:", err);
      setError(err.message || "Failed to extract problems from image.");
      if (addToast) {
        addToast(err.message || "Extraction failed", "error");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Auto-detect from problem names
  const handleExtractByNames = async (namesList, platformHint, apiKey) => {
    setIsExtracting(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        namesList.map((name) => autoDetectProblemDetails(name, platformHint, apiKey))
      );

      const successfulItems = [];
      results.forEach((res, index) => {
        if (res.status === "fulfilled" && res.value) {
          successfulItems.push(res.value);
        } else {
          // Fallback to basic item if one failed
          successfulItems.push({
            problem: namesList[index],
            platform: platformHint || "LeetCode",
            difficulty: "medium",
            tags: [],
            notes: "",
            confidence: "low",
          });
        }
      });

      if (successfulItems.length === 0) {
        throw new Error("Could not process any problem names.");
      }

      setProblemsList(successfulItems);
      setSelectedIndices(new Set(successfulItems.map((_, i) => i)));
      setStep("review");
      if (addToast) {
        addToast(`Generated details for ${successfulItems.length} problem(s)!`, "success");
      }
    } catch (err) {
      console.error("AI Names Detection error:", err);
      setError(err.message || "Failed to auto-detect problem details.");
      if (addToast) {
        addToast(err.message || "Detection failed", "error");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Save selected problems to Firestore
  const handleSave = async () => {
    const itemsToSave = problemsList.filter((_, i) => selectedIndices.has(i));
    if (itemsToSave.length === 0) return;

    setIsSaving(true);
    setError(null);
    try {
      const result = await onBulkAdd(itemsToSave);
      if (result.success) {
        setSaveSummary({
          added: result.added || 0,
          updated: result.updated || 0,
        });
        setStep("success");
        if (addToast) {
          addToast(
            `Imported ${result.added} new problem(s), updated ${result.updated} existing!`,
            "success"
          );
        }
      } else {
        throw new Error(result.error || "Failed to save problems.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save problems.");
      if (addToast) {
        addToast(err.message || "Failed to save problems", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5"
      onClick={() => {
        if (!isExtracting && !isSaving) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background accents */}
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/50">
              <FiSparkles />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>AI Problem Importer</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Gemini Vision
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {step === "upload" && "Paste a screenshot or type problem names for instant extraction."}
                {step === "review" && "Review, customize, and edit before adding to your revision schedule."}
                {step === "success" && "All problems imported successfully into your Revision Mania schedule!"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isExtracting || isSaving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
          >
            <FiX />
          </button>
        </div>

        {/* Step Progress Pill Indicator */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-slate-800/40 text-xs font-semibold">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              step === "upload"
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            ① Upload / Input
          </span>

          <span className="text-slate-600">→</span>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              step === "review"
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                step === "review" ? "bg-cyan-400" : "bg-slate-600"
              }`}
            />
            ② Review & Edit
          </span>

          <span className="text-slate-600">→</span>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              step === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                step === "success" ? "bg-emerald-400" : "bg-slate-600"
              }`}
            />
            ③ Saved ✨
          </span>
        </div>

        {/* Error Notification Banner if any */}
        {error && (
          <div className="mt-3 p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-300 flex items-start justify-between gap-2">
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Main Body per Step */}
        <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          {step === "upload" && (
            <ImageUploader
              onExtractImage={handleExtractImage}
              onExtractByNames={handleExtractByNames}
              isExtracting={isExtracting}
            />
          )}

          {step === "review" && (
            <ReviewScreen
              problemsList={problemsList}
              setProblemsList={setProblemsList}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              existingCanonicalSet={existingCanonicalSet}
              onSave={handleSave}
              onBack={() => setStep("upload")}
              isSaving={isSaving}
            />
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-500/20">
                <FiCheckCircle />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-100">
                  Successfully Imported!
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {saveSummary?.added || 0} new problem(s) added and{" "}
                  {saveSummary?.updated || 0} existing problem(s) updated with a new revision solve.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("upload");
                    setProblemsList([]);
                    setSelectedIndices(new Set());
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Import More
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 transition-all cursor-pointer"
                >
                  View Revision Schedule
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

