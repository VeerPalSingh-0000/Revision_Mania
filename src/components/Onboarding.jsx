import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    emoji: '👋',
    title: 'Welcome to Revision Mania!',
    description: "Let's quickly walk through the main features to get you started.",
  },
  {
    emoji: '✍️',
    title: 'Add a Problem',
    description: 'Start by adding a problem you just solved. You can add a simple name or use the "Advanced Mode" for more details like difficulty, platform, and tags.',
  },
  {
    emoji: '🗓️',
    title: 'Revision Schedule',
    description: 'The app automatically schedules your problems for revision based on spaced repetition. Check the "Schedule" tab to see what\'s due today.',
  },
  {
    emoji: '📚',
    title: 'Track Your History',
    description: 'Visit the "All Problems" and "History" tabs to see your entire coding journey, filter your solves, and track your progress over time.',
  },
  {
    emoji: '🎉',
    title: "You're all set!",
    description: 'You are ready to start your revision journey. Happy coding!',
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };
  
  const isLastStep = step === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <motion.div
        key={step}
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-8 text-center"
      >
        <div className="text-6xl mb-4">{steps[step].emoji}</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{steps[step].title}</h2>
        <p className="text-slate-400 mb-8 min-h-[40px]">{steps[step].description}</p>
        
        <div className="flex items-center justify-center gap-4">
          {step > 0 && !isLastStep && (
             <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-sm font-semibold text-slate-400 rounded-lg hover:bg-slate-800 transition-colors">
                Back
             </button>
          )}
          <button 
            onClick={nextStep} 
            className="px-6 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all"
          >
            {isLastStep ? "Get Started" : "Next"}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-all ${i === step ? 'bg-cyan-500 scale-125' : 'bg-slate-600'}`} />
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
