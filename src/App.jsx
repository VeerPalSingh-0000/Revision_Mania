import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeAuth } from "./components/Auth.jsx";
import { ToastProvider, useToast } from "./components/Toast.jsx";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

import SignIn from "./components/Signin.jsx";
import SignUp from "./components/Signup.jsx";
import RevisionApp from "./Revision/Revision.jsx";
import Loader from "./components/Loader.jsx";
import Onboarding from "./components/Onboarding.jsx";

function AppContent() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeAuth(async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      
      if (currentUser) {
        // Check if it's a new user for onboarding
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // This is a new user
          await setDoc(userDocRef, { onboarded: false, createdAt: new Date() });
          setShowOnboarding(true);
        } else if (userDoc.data().onboarded === false) {
          setShowOnboarding(true);
        }
        addToast(`Welcome back, ${currentUser.displayName || currentUser.email || 'User'}!`, 'success');
      }
    });
    return () => unsubscribe();
  }, [addToast]);

  const handleOnboardingComplete = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { onboarded: true }, { merge: true });
    }
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    if (showOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    return <RevisionApp user={user} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={authMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0 }}
      >
        {authMode === "signin" ? (
          <SignIn onSwitchToSignUp={() => setAuthMode("signup")} />
        ) : (
          <SignUp onSwitchToSignIn={() => setAuthMode("signin")} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}


export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
