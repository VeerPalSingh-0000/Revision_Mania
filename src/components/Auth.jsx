import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase'; // Correct path to your firebase config

const googleProvider = new GoogleAuthProvider();

// Helper: translate Firebase errors to readable text
function translateAuthError(error) {
  if (!error.code) return error.message;
  switch (error.code) {
    case "auth/user-not-found":
      return "No user with this email found.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled.";
    case "auth/network-request-failed":
      return "Network error. Please try again.";
    default:
      return error.message;
  }
}

// Sign Up: email, password + extra fields (displayName)
export const signUp = async (email, password, extra = {}) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // Optionally set displayName
    if (extra.displayName) {
      await updateProfile(userCred.user, { displayName: extra.displayName });
    }
    // Optionally send verification email
    try {
      await sendEmailVerification(userCred.user);
    } catch {}
    return { user: userCred.user, error: null };
  } catch (error) {
    return { user: null, error: translateAuthError(error) };
  }
};

// Sign In: email & password
export const signIn = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user, error: null };
  } catch (error) {
    return { user: null, error: translateAuthError(error) };
  }
};

// Sign In with Google
export const signInWithGoogle = async () => {
  try {
    const userCred = await signInWithPopup(auth, googleProvider);
    return { user: userCred.user, error: null };
  } catch (error) {
    return { user: null, error: translateAuthError(error) };
  }
};

// Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: translateAuthError(error) };
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: translateAuthError(error) };
  }
};

// Subscribe to auth state
export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);
