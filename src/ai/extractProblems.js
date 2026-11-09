// src/ai/extractProblems.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { COMMON_TAGS, PLATFORM_OPTIONS } from "../Revision/constants.js";

/**
 * Get the current Gemini API key either from environment or localStorage
 */
export function getGeminiApiKey() {
  const envKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env["VITE_GEMINI_API_KEY "] ||
    "";
  if (envKey && envKey.trim() && envKey !== "YOUR_GEMINI_API_KEY") {
    return envKey.trim();
  }
  const localKey = localStorage.getItem("gemini_api_key");
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return "";
}

/**
 * Save user-entered Gemini API key to localStorage
 */
export function saveGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem("gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("gemini_api_key");
  }
}

/**
 * Helper to convert a File or Blob object to a base64 inlineData object for Gemini
 */
export function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type || "image/png",
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Clean JSON output from LLM in case it wraps in markdown code fences
 */
function cleanJsonText(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Extract coding problems from an image using Gemini Vision API
 * @param {File|Blob} imageFile 
 * @param {string} [platformHint] - Optional platform hint ("LeetCode", "GeeksforGeeks", etc.)
 * @param {string} [customApiKey]
 * @returns {Promise<Array<{problem: string, platform: string, difficulty: string, tags: string[], notes: string, confidence: 'high'|'medium'|'low'}>>}
 */
export async function extractProblemsFromImage(imageFile, platformHint = "", customApiKey = "") {
  const apiKey = customApiKey || getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please provide a key in settings or .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Supported active models
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let imagePart;
  try {
    imagePart = await fileToGenerativePart(imageFile);
  } catch (err) {
    throw new Error("Failed to process image file: " + err.message);
  }

  const allowedPlatforms = PLATFORM_OPTIONS.join(", ");
  const tagListSample = COMMON_TAGS.slice(0, 35).join(", ");

  const prompt = `
You are an expert assistant for a competitive programming and DSA revision tracker.
Analyze this screenshot from a coding platform (such as LeetCode, GeeksforGeeks, CodeForces, HackerRank, CodeChef, etc.).

Task:
Extract EVERY coding problem or question visible in this image.

Rules:
1. Detect each problem title / name cleanly (strip number prefix if desired, or keep standard format like "Two Sum" or "1. Two Sum").
2. Detect the platform. Preferred platforms: [${allowedPlatforms}].
   ${platformHint ? `User has hinted the platform is likely "${platformHint}". If it matches or is ambiguous, use "${platformHint}".` : "Look for platform logos, URLs, UI styling (e.g. LeetCode orange/dark UI, GeeksforGeeks green UI, CodeForces, etc.)."}
3. Detect or infer difficulty: strictly one of "easy", "medium", or "hard".
   (e.g., LeetCode green=easy, yellow/orange=medium, red=hard. GeeksforGeeks school/basic/easy -> easy, medium -> medium, hard -> hard).
4. Assign 1-4 relevant DSA topic tags from common topics like: ${tagListSample}.
5. Write a brief 1-line note/insight if visible or inferred (or leave empty string "").
6. Assign a "confidence": "high" (clearly identified problem with known platform & difficulty), "medium" (inferred fields), or "low" (partially cut off or uncertain).

CRITICAL: Return ONLY a raw JSON array matching this exact schema, with NO markdown backticks or explanation:
[
  {
    "problem": "Two Sum",
    "platform": "LeetCode",
    "difficulty": "easy",
    "tags": ["Array", "Hash Table"],
    "notes": "Classic two-pass or one-pass hash map approach",
    "confidence": "high"
  }
]
`;

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      const cleanedJson = cleanJsonText(text);
      const parsed = JSON.parse(cleanedJson);

      if (!Array.isArray(parsed)) {
        throw new Error("AI returned data, but it wasn't a list of problems.");
      }

      // Sanitize fields
      return parsed.map((item) => ({
        problem: String(item.problem || item.problemName || "Untitled Problem").trim(),
        platform: item.platform || platformHint || "LeetCode",
        difficulty: ["easy", "medium", "hard"].includes(String(item.difficulty).toLowerCase())
          ? String(item.difficulty).toLowerCase()
          : "medium",
        tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
        notes: item.notes || "",
        confidence: ["high", "medium", "low"].includes(item.confidence) ? item.confidence : "medium",
      }));
    } catch (err) {
      console.warn(`Model ${modelName} attempt failed:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to extract problems from image.");
}

/**
 * Auto-detect details for a single problem name using Gemini
 * When a user just types a problem name (e.g. "Trapping Rain Water" or "Egg Dropping Puzzle"),
 * AI detects its platform, difficulty, topic tags, and a quick summary note.
 * @param {string} problemName 
 * @param {string} [platformHint]
 * @param {string} [customApiKey]
 */
export async function autoDetectProblemDetails(problemName, platformHint = "", customApiKey = "") {
  const apiKey = customApiKey || getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please provide a key in settings or .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

  const prompt = `
You are an expert DSA assistant. The user wants to catalog this coding problem: "${problemName}".

Tasks:
1. Identify the canonical problem title.
2. Identify the most common platform it is associated with (e.g. ${PLATFORM_OPTIONS.join(", ")}). ${platformHint ? `User prefers platform: "${platformHint}".` : "Usually LeetCode or GeeksforGeeks."}
3. Identify its standard difficulty: strictly "easy", "medium", or "hard".
4. Identify 1 to 4 most accurate DSA topic tags from: ${COMMON_TAGS.slice(0, 40).join(", ")}.
5. Provide a 1-sentence key takeaway or algorithm approach for the notes.

Return ONLY a raw JSON object with NO markdown backticks:
{
  "problem": "exact canonical problem title",
  "platform": "LeetCode",
  "difficulty": "medium",
  "tags": ["Two Pointers", "Stack"],
  "notes": "Optimal solution uses two pointers or monotonic stack in O(n) time.",
  "confidence": "high"
}
`;

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleaned = cleanJsonText(text);
      const parsed = JSON.parse(cleaned);

      return {
        problem: String(parsed.problem || problemName).trim(),
        platform: parsed.platform || platformHint || "LeetCode",
        difficulty: ["easy", "medium", "hard"].includes(String(parsed.difficulty).toLowerCase())
          ? String(parsed.difficulty).toLowerCase()
          : "medium",
        tags: Array.isArray(parsed.tags) ? parsed.tags.filter(Boolean) : [],
        notes: parsed.notes || "",
        confidence: "high",
      };
    } catch (err) {
      console.warn(`Model ${modelName} auto-detect attempt failed:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to auto-detect problem details.");
}

