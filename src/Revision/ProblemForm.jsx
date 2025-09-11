import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icons ---
const FiPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const FiLoader = () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;
const FiSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const FiX = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FiChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

// --- Constants ---
const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  { value: 'hard', label: 'Hard', color: 'text-red-400 bg-red-400/10 border-red-400/30' }
];

const PLATFORM_OPTIONS = [
  'LeetCode',
  'HackerRank', 
  'CodeForces',
  'AtCoder',
  'CodeChef',
  'GeeksforGeeks',
  'InterviewBit',
  'Pramp',
  'Other'
];

const COMMON_TAGS = [
  'Array', 'String', 'Hash Table', 'Math', 'Dynamic Programming',
  'Sorting', 'Greedy', 'Database', 'Binary Search', 'Tree',
  'Depth-First Search', 'Breadth-First Search', 'Two Pointers',
  'Sliding Window', 'Stack', 'Queue', 'Heap', 'Graph',
  'Backtracking', 'Bit Manipulation'
];

// --- Sub Components ---
const CustomSelect = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-left text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${className}`}
      >
        <span className={value ? 'text-slate-200' : 'text-slate-500'}>
          {value || placeholder}
        </span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={typeof option === 'string' ? option : option.value}
                type="button"
                onClick={() => {
                  onChange(typeof option === 'string' ? option : option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg"
              >
                {typeof option === 'string' ? option : option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TagInput = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const filtered = COMMON_TAGS.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) && 
        !tags.includes(tag)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
            >
              {tag}
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
      
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter)..."
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        
        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg"
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
export default function ProblemForm({ onAddProblem }) {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    problem: '',
    difficulty: '',
    platform: '',
    tags: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem.trim()) {
      setError('Problem description is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const problemData = isAdvanced ? {
        problem: formData.problem.trim(),
        difficulty: formData.difficulty || null,
        platform: formData.platform || null,
        tags: formData.tags.length > 0 ? formData.tags : []
      } : formData.problem.trim();

      const result = await onAddProblem(problemData);
      
      if (result?.success) {
        // Reset form
        setFormData({
          problem: '',
          difficulty: '',
          platform: '',
          tags: []
        });
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to add problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const getDifficultyColor = (difficulty) => {
    const option = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);
    return option ? option.color : '';
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-200">Add New Problem</h3>
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <FiSettings />
          {isAdvanced ? 'Simple Mode' : 'Advanced Mode'}
        </button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Problem Input */}
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-slate-400 mb-2">
            Problem Description or URL
          </label>
          <input
            id="problem"
            type="text"
            value={formData.problem}
            onChange={(e) => updateFormData('problem', e.target.value)}
            placeholder="Enter problem name or URL..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            required
            disabled={isLoading}
          />
        </div>

        {/* Advanced Fields */}
        <AnimatePresence>
          {isAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Difficulty and Platform Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Difficulty
                  </label>
                  <CustomSelect
                    options={DIFFICULTY_OPTIONS}
                    value={formData.difficulty}
                    onChange={(value) => updateFormData('difficulty', value)}
                    placeholder="Select difficulty..."
                  />
                  {formData.difficulty && (
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(formData.difficulty)}`}>
                        {DIFFICULTY_OPTIONS.find(opt => opt.value === formData.difficulty)?.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Platform
                  </label>
                  <CustomSelect
                    options={PLATFORM_OPTIONS}
                    value={formData.platform}
                    onChange={(value) => updateFormData('platform', value)}
                    placeholder="Select platform..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Tags
                  <span className="text-xs text-slate-500 ml-2">
                    ({formData.tags.length} selected)
                  </span>
                </label>
                <TagInput
                  tags={formData.tags}
                  onChange={(tags) => updateFormData('tags', tags)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-700/60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiLoader />
                Adding...
              </>
            ) : (
              <>
                <FiPlus />
                Add Problem
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
