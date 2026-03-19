// src/hooks/useProblems.js

import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  Timestamp,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  arrayUnion,
  onSnapshot,
  getDocs,
  getDoc,
  limit,
} from "firebase/firestore";

/**
 * A professional, robust hook to manage revision problems with real-time updates.
 * @param {object} user - The authenticated user object.
 * @returns {object} - { problems, isLoading, error, ... }
 */
export function useProblems(user) {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setProblems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Fetch problems ordered by when they were created
    const q = query(
      collection(db, "problems"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedProblems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProblems(fetchedProblems);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching problems in real-time: ", err);
        setError("Failed to load revision problems.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const markAsSolved = useCallback(async (problemId, currentSolveCount = 0) => {
    try {
      const problemRef = doc(db, "problems", problemId);
      const now = Timestamp.fromDate(new Date());
      
      // Get current problem data to access existing solveDates
      const problemDoc = await getDoc(problemRef);
      const currentData = problemDoc.data();
      const solveDates = currentData.solveDates || [];
      
      // Ensure the array has enough elements
      while (solveDates.length <= currentSolveCount) {
        solveDates.push(null);
      }
      
      // Store the date at the correct index corresponding to the solve count
      solveDates[currentSolveCount] = now;
      
      await updateDoc(problemRef, {
        solveCount: increment(1),
        date: now, // Reset the revision date
        solveDates: solveDates,
      });
      return { success: true };
    } catch (err) {
      console.error("Error marking problem as solved:", err);
      return { success: false, error: "Failed to update the problem." };
    }
  }, []);

  const addProblem = useCallback(
    async (problemData) => {
      if (!problemData || !user)
        return { success: false, error: "Invalid input." };

      const problemText =
        typeof problemData === "string"
          ? problemData.trim()
          : problemData.problem.trim();
      const problemCanonical = problemText.toLowerCase();

      try {
        // Check if a problem with the same case-insensitive name already exists
        const q = query(
          collection(db, "problems"),
          where("uid", "==", user.uid),
          where("problemCanonical", "==", problemCanonical),
          limit(1),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If it exists, just mark it as solved (which increments the count)
          const existingProblemDoc = querySnapshot.docs[0];
          const existingData = existingProblemDoc.data();
          await markAsSolved(existingProblemDoc.id, existingData.solveCount || 0);
          return { success: true, updated: true };
        } else {
          // If it's a completely new problem, add it with a solveCount of 0
          const newProblem = {
            uid: user.uid,
            problem: problemText,
            problemCanonical: problemCanonical,
            difficulty: problemData.difficulty || null,
            platform: problemData.platform || null,
            tags: problemData.tags || [],
            notes: problemData.notes || "",
            date: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.fromDate(new Date()),
            solveCount: 0,
            isRevision: false,
            originalProblemId: null,
          };
          await addDoc(collection(db, "problems"), newProblem);
          return { success: true, updated: false };
        }
      } catch (err) {
        console.error("Error adding or updating problem:", err);
        return { success: false, error: "Failed to process the problem." };
      }
    },
    [user, markAsSolved],
  );

  const deleteProblem = useCallback(async (problemId) => {
    try {
      await deleteDoc(doc(db, "problems", problemId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting problem:", err);
      return { success: false, error: "Failed to delete the problem." };
    }
  }, []);

  const updateNotes = useCallback(async (problemId, notes) => {
    try {
      const problemRef = doc(db, "problems", problemId);
      await updateDoc(problemRef, { notes });
      return { success: true };
    } catch (err) {
      console.error("Error updating notes:", err);
      return { success: false, error: "Failed to update notes." };
    }
  }, []);

  return {
    problems,
    isLoading,
    error,
    addProblem,
    deleteProblem,
    markAsSolved,
    updateNotes,
    refetch: null,
  };
}
