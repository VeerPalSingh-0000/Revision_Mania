import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeAuth } from "./components/Auth.jsx";

// Import your components from their respective files
import SignIn from "./components/Signin.jsx";
import SignUp from "./components/Signup.jsx";
import RevisionApp from "./Revision/Revision.jsx";
import Loader from "./components/Loader.jsx"; // Import the new Loader component

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signin"); // 'signin' or 'signup'
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial auth check

  useEffect(() => {
    const unsubscribe = subscribeAuth((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show the dedicated Loader component while checking auth state
  if (isLoading) {
    return <Loader />;
  }

  // If a user is logged in, show the main application
  if (user) {
    return <RevisionApp user={user} />;
  }

  // If no user, show either the SignIn or SignUp component
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
