// src/hooks/useProblems.js

import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
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
  writeBatch, // Import writeBatch for atomic operations
  onSnapshot  // Import onSnapshot for real-time updates
} from 'firebase/firestore';

/**
 * A professional, robust hook to manage revision problems with real-time updates.
 * @param {object} user - The authenticated user object.
 * @returns {object} - { problems, isLoading, error, ... }
 */
export function useProblems(user) {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // REAL-TIME DATA FETCHING with onSnapshot
  useEffect(() => {
    if (!user) {
      setProblems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(
      collection(db, "problems"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );

    // onSnapshot creates a real-time listener.
    // The UI will update automatically whenever the data changes in Firestore.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProblems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProblems(fetchedProblems);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching problems in real-time: ", err);
      setError("Failed to load revision problems.");
      setIsLoading(false);
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  // addProblem remains largely the same, but no need to manually update state
  // as onSnapshot will handle it.
  const addProblem = useCallback(async (problemData) => {
    if (!problemData || !user) return { success: false, error: "Invalid input." };
    
    try {
      const newProblem = {
        uid: user.uid,
        problem: typeof problemData === 'string' ? problemData.trim() : problemData.problem,
        difficulty: problemData.difficulty || null,
        platform: problemData.platform || null,
        tags: problemData.tags || [],
        date: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.fromDate(new Date()),
        solveCount: 1, // Start with 1 solve
        isRevision: false,
        originalProblemId: null,
      };
      await addDoc(collection(db, "problems"), newProblem);
      return { success: true };
    } catch (err) {
      console.error("Error adding problem:", err);
      return { success: false, error: "Failed to add the problem." };
    }
  }, [user]);

  // deleteProblem is also simplified by onSnapshot
  const deleteProblem = useCallback(async (problemId) => {
    try {
      await deleteDoc(doc(db, "problems", problemId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting problem:", err);
      return { success: false, error: "Failed to delete the problem." };
    }
  }, []);

  // --- UPDATED LOGIC for markAsSolved ---
  const markAsSolved = useCallback(async (problemId, currentSolveCount, createRevision = false) => {
    // This is the main action from the RevisionList and Modal "Solve Again" button
    if (createRevision) {
      const originalProblem = problems.find(p => p.id === problemId);
      if (!originalProblem) {
        console.error("Original problem not found for revision.");
        return { success: false, error: "Original problem not found." };
      }

      try {
        // Use a batch write to perform multiple operations atomically
        const batch = writeBatch(db);

        // 1. Create the new revision document
        const newRevisionRef = doc(collection(db, "problems")); // Create ref for new doc
        const revisionData = {
          uid: user.uid,
          problem: originalProblem.problem,
          difficulty: originalProblem.difficulty,
          platform: originalProblem.platform,
          tags: originalProblem.tags,
          date: Timestamp.fromDate(new Date()), // Today's date
          solveCount: 1, // A revision starts with 1 solve
          isRevision: true,
          originalProblemId: originalProblem.id, // Link to the original
          createdAt: Timestamp.fromDate(new Date()),
        };
        batch.set(newRevisionRef, revisionData);

        // 2. Update the original problem's solve count AND date
        const originalProblemRef = doc(db, "problems", originalProblem.id);
        batch.update(originalProblemRef, {
            solveCount: increment(1),
            date: Timestamp.fromDate(new Date()) // <-- THE FIX!
        });

        // 3. Commit the batch
        await batch.commit();
        
        return { success: true };
      } catch (err) {
        console.error("Error creating revision and updating count:", err);
        return { success: false, error: "Operation failed." };
      }
    } else {
      // This case is for simply incrementing a count without creating a revision.
      // We keep it for potential future use, but the current UI doesn't call it.
      try {
        const problemRef = doc(db, "problems", problemId);
        await updateDoc(problemRef, { solveCount: increment(1) });
        return { success: true };
      } catch (err) {
        console.error("Error updating solve count:", err);
        return { success: false, error: "Failed to update solve count." };
      }
    }
  }, [user, problems]);

  // --- UPDATED LOGIC for undoRevision ---
  const undoRevision = useCallback(async (revisionProblemId) => {
    const revisionProblem = problems.find(p => p.id === revisionProblemId && p.originalProblemId);
    if (!revisionProblem) {
      return { success: false, error: "Revision to undo not found." };
    }
    
    // Optional: Time check
    const timeDiff = (new Date() - revisionProblem.createdAt.toDate()) / 1000 / 60;
    if (timeDiff > 5) {
      return { success: false, error: "Can only undo revisions within 5 minutes." };
    }

    try {
        const batch = writeBatch(db);

        // 1. Delete the revision document
        const revisionRef = doc(db, "problems", revisionProblemId);
        batch.delete(revisionRef);

        // 2. Decrement the original problem's solve count
        const originalProblemRef = doc(db, "problems", revisionProblem.originalProblemId);
        batch.update(originalProblemRef, { solveCount: increment(-1) });

        // 3. Commit the batch
        await batch.commit();

        return { success: true };
    } catch (err) {
      console.error("Error undoing revision:", err);
      return { success: false, error: "Failed to undo revision." };
    }
  }, [problems]);

  return { 
    problems, 
    isLoading, 
    error, 
    addProblem, 
    deleteProblem, 
    markAsSolved, 
    undoRevision,
    refetch: null // Refetch is no longer needed with real-time listener
  };
}