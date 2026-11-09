// src/Revision/AIImport/ImageUploader.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLATFORM_OPTIONS } from "../constants";
import { getGeminiApiKey, saveGeminiApiKey } from "../../ai/extractProblems";

// SVG Icons
const FiUploadCloud = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
    <polyline points="16 16 12 12 8 16"></polyline>
  </svg>
);

const FiImage = () => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const FiZap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const FiKey = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2l-2 2m-1.5 1.5L16 7l-1.5-1.5M19 5l-2.5 2.5m-5.5 3.5a5 5 0 1 0-7 7 5 5 0 0 0 7-7l8-8h3v3l-2.5 2.5"></path>
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
    strokeWidth="2.5"
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
    width="16"
    height="16"
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

export default function ImageUploader({
  onExtractImage,
  onExtractByNames,
  isExtracting,
}) {
  const [activeTab, setActiveTab] = useState("screenshot"); // "screenshot" | "quick-name"
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [platformHint, setPlatformHint] = useState("LeetCode");
  const [isDragging, setIsDragging] = useState(false);
  
  // Quick name text area (supports one or multiple problem names)
  const [quickNamesText, setQuickNamesText] = useState("");

  // API Key management
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [showKeyConfig, setShowKeyConfig] = useState(!getGeminiApiKey());
  const [tempKeyInput, setTempKeyInput] = useState(getGeminiApiKey());

  const fileInputRef = useRef(null);

  // Global paste handler to capture screenshot when modal is in focus
  useEffect(() => {
    const handlePaste = (e) => {
      // If user is currently typing in the quick names textarea or API key input, don't intercept text
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) {
        // If it's an image being pasted into an input, handle it
        if (!e.clipboardData?.files?.[0]?.type?.startsWith("image/")) {
          return;
        }
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleImageSelected(blob);
            setActiveTab("screenshot");
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleImageSelected = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      handleImageSelected(files[0]);
    }
  };

  const handleSaveApiKey = () => {
    saveGeminiApiKey(tempKeyInput);
    setApiKey(tempKeyInput.trim());
    if (tempKeyInput.trim()) {
      setShowKeyConfig(false);
    }
  };

  const handleStartExtraction = () => {
    if (!apiKey) {
      setShowKeyConfig(true);
      return;
    }

    if (activeTab === "screenshot") {
      if (!selectedImage) return;
      onExtractImage(selectedImage, platformHint, apiKey);
    } else {
      if (!quickNamesText.trim()) return;
      // Split by newlines or commas
      const names = quickNamesText
        .split(/[\n,]+/)
        .map((n) => n.trim())
        .filter(Boolean);
      onExtractByNames(names, platformHint, apiKey);
    }
  };

  return (
    <div className="space-y-5">
      {/* API Key Banner / Config */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <FiKey />
            </span>
            <div>
              <span className="font-semibold text-slate-200">Gemini Vision AI: </span>
              {apiKey ? (
                <span className="text-emerald-400 font-medium">Ready (Key configured)</span>
              ) : (
                <span className="text-amber-400 font-medium">API Key required for extraction</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline cursor-pointer"
          >
            {showKeyConfig ? "Hide" : apiKey ? "Change Key" : "Set API Key"}
          </button>
        </div>

        {/* Expandable Key Input */}
        <AnimatePresence>
          {showKeyConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-slate-800 space-y-2"
            >
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Enter your Google Gemini API key. It's stored securely in your browser's local storage.
                Don't have one? Get a free key in 30 seconds at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Google AI Studio ↗
                </a>
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Paste AIzaSy... key here"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-bold text-white text-xs transition-colors cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab("screenshot")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "screenshot"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiImage /> Screenshot OCR (Paste / Drop)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("quick-name")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "quick-name"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiZap /> Quick Problem Name (AI Auto-Fill)
        </button>
      </div>

      {/* Tab 1: Screenshot Upload Area */}
      {activeTab === "screenshot" ? (
        <div className="space-y-4">
          {!selectedImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-cyan-400 bg-cyan-950/20 scale-[1.01]"
                  : "border-slate-700/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageSelected(e.target.files[0]);
                  }
                }}
              />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 mb-3 shadow-lg shadow-cyan-950/50">
                <FiUploadCloud />
              </div>

              <h4 className="text-sm font-bold text-slate-100">
                Paste screenshot (Ctrl + V) or drop image here
              </h4>
              <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
                Take a snippet of LeetCode, GFG, or any contest page and paste it directly. We'll extract every problem.
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300">
                <span>📁 Click to browse files</span>
              </div>
            </div>
          ) : (
            /* Image Preview Area */
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-4 overflow-hidden backdrop-blur-md">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                    <FiImage />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 truncate max-w-xs">
                      {selectedImage.name || "Pasted Screenshot"}
                    </h5>
                    <span className="text-[10px] text-slate-500">
                      {(selectedImage.size / 1024).toFixed(1)} KB • Ready for AI extraction
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <FiX />
                </button>
              </div>

              {/* Thumbnail with optional scanning animation overlay */}
              <div className="relative max-h-64 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
                <img
                  src={previewUrl}
                  alt="Screenshot Preview"
                  className="w-full object-contain max-h-64 mx-auto"
                />

                {/* Animated Scanner Laser Bar when extracting */}
                {isExtracting && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Quick Name Magic Textarea */
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FiSparkles className="text-cyan-400" /> Enter Problem Name(s) or URLs:
            </label>
            <p className="text-[11px] text-slate-400">
              Type or paste problem names (one per line). AI will automatically determine difficulty, platform, tags, and approach notes!
            </p>
            <textarea
              rows={4}
              value={quickNamesText}
              onChange={(e) => setQuickNamesText(e.target.value)}
              placeholder="e.g.&#10;Trapping Rain Water&#10;Longest Substring Without Repeating Characters&#10;Subarray Sum Equals K"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 resize-none font-mono"
            />
          </div>
        </div>
      )}

      {/* Platform Hint Quick Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span className="uppercase tracking-wider">Platform Hint:</span>
          <span className="text-slate-500 text-[10px]">
            {activeTab === "screenshot" ? "Helps AI identify specific UI layout" : "Preferred platform context"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PLATFORM_OPTIONS.slice(0, 6).map((plat) => {
            const isSelected = platformHint.toLowerCase() === plat.toLowerCase();
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setPlatformHint(plat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-500/20"
                    : "bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {plat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button: Extract Problems ✨ */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={
          isExtracting ||
          (activeTab === "screenshot" && !selectedImage) ||
          (activeTab === "quick-name" && !quickNamesText.trim())
        }
        onClick={handleStartExtraction}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isExtracting ? (
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
            <span>Analyzing & Extracting with Gemini AI...</span>
          </>
        ) : (
          <>
            <FiSparkles />
            <span>
              {activeTab === "screenshot"
                ? "Extract Problems from Screenshot ✨"
                : "Auto-Fill Details with AI ✨"}
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}

