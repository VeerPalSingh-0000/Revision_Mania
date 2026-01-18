import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    emoji: "👋",
    title: "Welcome to Revision Mania",
    description: "Let's quickly walk through the main features to get you started.",
  },
  {
    emoji: "✍️",
    title: "Add a Problem",
    description: "Log problems you've solved. Add details like difficulty, platform, and tags to keep your database organized.",
  },
  {
    emoji: "🗓️",
    title: "Smart Scheduling",
    description: "We automatically schedule reviews using spaced repetition. Check the 'Schedule' tab to see what's due today.",
  },
  {
    emoji: "📈",
    title: "Track Progress",
    description: "Visit the 'History' tab to visualize your coding journey and monitor your consistency over time.",
  },
  {
    emoji: "🎉",
    title: "You're All Set!",
    description: "You are ready to begin your mastery journey. Happy coding!",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const isLastStep = step === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
    >
      <div className="relative w-full max-w-lg">
        {/* Background decorative glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20" />
        
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          {/* Header Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8 md:p-10 min-h-[420px] flex flex-col items-center text-center">
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 flex flex-col items-center justify-center w-full"
              >
                {/* Icon Container */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                  <div className="relative w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
                    <span className="text-5xl drop-shadow-lg filter">{steps[step].emoji}</span>
                  </div>
                </div>

                {/* Typography */}
                <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  {steps[step].title}
                </h2>
                
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm mx-auto">
                  {steps[step].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="w-full mt-8 pt-6 border-t border-slate-800/50">
              <div className="flex items-center justify-between">
                
                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step 
                          ? "w-6 bg-cyan-500" 
                          : i < step 
                            ? "w-1.5 bg-cyan-900" 
                            : "w-1.5 bg-slate-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className={`px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors ${
                      step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={nextStep}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isLastStep ? "Get Started" : "Next"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}