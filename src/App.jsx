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
import LandingPage from "./components/LandingPage.jsx";

function AppContent() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("landing");
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeAuth(async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      
      if (currentUser) {
        // Create user document in Firestore if it doesn't exist
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, { createdAt: new Date() });
        }
        addToast(`Welcome back, ${currentUser.displayName || currentUser.email || 'User'}!`, 'success');
      }
    });
    return () => unsubscribe();
  }, [addToast]);

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return <RevisionApp user={user} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={authMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {authMode === "landing" && (
          <LandingPage 
            onSignIn={() => setAuthMode("signin")} 
            onSignUp={() => setAuthMode("signup")} 
          />
        )}
        {authMode === "signin" && (
          <SignIn 
            onSwitchToSignUp={() => setAuthMode("signup")} 
            onBackToLanding={() => setAuthMode("landing")}
          />
        )}
        {authMode === "signup" && (
          <SignUp 
            onSwitchToSignIn={() => setAuthMode("signin")} 
            onBackToLanding={() => setAuthMode("landing")}
          />
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
