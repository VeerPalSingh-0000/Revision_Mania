import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, Timestamp, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * A professional, robust hook to manage revision problems with optimistic UI updates.
 * @param {object} user - The authenticated user object.
 * @returns {object} - { problems, isLoading, error, addProblem, deleteProblem, markAsSolved, undoRevision }
 */
export function useProblems(user) {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to remove undefined values from objects
  const removeUndefinedFields = (obj) => {
    return Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  };

  // Generate unique ID helper function
  const generateUniqueId = () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const fetchProblems = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "problems"), 
        where("uid", "==", user.uid),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);
      const fetchedProblems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProblems(fetchedProblems);
    } catch (err) {
      console.error("Error fetching problems: ", err);
      setError("Failed to fetch revision problems.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const addProblem = async (problemData) => {
    if (!problemData || !user) return { success: false, error: "Invalid input." };
    
    const tempId = generateUniqueId();
    const newProblem = {
      id: tempId,
      uid: user.uid,
      problem: typeof problemData === 'string' ? problemData.trim() : problemData.problem,
      difficulty: problemData.difficulty || null,
      platform: problemData.platform || null,
      tags: problemData.tags || [],
      date: Timestamp.fromDate(new Date()),
      solveCount: 1,
      createdAt: Timestamp.fromDate(new Date()),
    };
    
    // Optimistic update
    setProblems(prev => [newProblem, ...prev]);

    try {
      // Clean the object before sending to Firestore
      const cleanProblemData = removeUndefinedFields({
        uid: user.uid,
        problem: newProblem.problem,
        difficulty: newProblem.difficulty,
        platform: newProblem.platform,
        tags: newProblem.tags,
        date: newProblem.date,
        solveCount: newProblem.solveCount,
        createdAt: newProblem.createdAt,
      });

      const docRef = await addDoc(collection(db, "problems"), cleanProblemData);
      
      // Update with real ID
      setProblems(prev => prev.map(p => p.id === tempId ? { ...p, id: docRef.id } : p));
      return { success: true, error: null };
    } catch (err) {
      console.error("Error adding problem:", err);
      setProblems(prev => prev.filter(p => p.id !== tempId));
      return { success: false, error: "Failed to add the problem." };
    }
  };

  const deleteProblem = async (problemId) => {
    const originalProblems = [...problems];
    
    // Optimistic update
    setProblems(prev => prev.filter(p => p.id !== problemId));
    
    try {
      const problemRef = doc(db, "problems", problemId);
      await deleteDoc(problemRef);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error deleting problem:", err);
      setProblems(originalProblems);
      return { success: false, error: "Failed to delete the problem." };
    }
  };

  const markAsSolved = async (problemId, currentSolveCount, createRevision = false) => {
    if (createRevision) {
      // Create a new revision entry for today while keeping the original unchanged
      const originalProblem = problems.find(p => p.id === problemId);
      
      if (!originalProblem) {
        return { success: false, error: "Original problem not found." };
      }

      const tempId = generateUniqueId();
      const revisionProblem = {
        id: tempId,
        uid: user.uid,
        problem: originalProblem.problem,
        difficulty: originalProblem.difficulty,
        platform: originalProblem.platform,
        tags: originalProblem.tags || [],
        date: Timestamp.fromDate(new Date()), // Today's date
        solveCount: 1, // Start fresh with 1 solve
        isRevision: true, // Mark as revision
        originalProblemId: originalProblem.id, // Track the original
        createdAt: Timestamp.fromDate(new Date()), // New creation timestamp
      };

      // Optimistic update - add the new revision without touching the original
      setProblems(prev => [revisionProblem, ...prev]);

      try {
        // Clean the object before sending to Firestore - this fixes the undefined error
        const cleanRevisionData = removeUndefinedFields({
          uid: user.uid,
          problem: revisionProblem.problem,
          difficulty: revisionProblem.difficulty,
          platform: revisionProblem.platform,
          tags: revisionProblem.tags,
          date: revisionProblem.date,
          solveCount: revisionProblem.solveCount,
          isRevision: revisionProblem.isRevision,
          originalProblemId: revisionProblem.originalProblemId,
          createdAt: revisionProblem.createdAt,
        });

        const docRef = await addDoc(collection(db, "problems"), cleanRevisionData);

        // Update with real ID
        setProblems(prev => prev.map(p => p.id === tempId ? { ...p, id: docRef.id } : p));
        return { success: true, error: null };
      } catch (err) {
        console.error("Error creating revision:", err);
        // Remove the optimistic update on error
        setProblems(prev => prev.filter(p => p.id !== tempId));
        return { success: false, error: "Failed to create revision." };
      }
    } else {
      // Original logic for incrementing solve count (if you still need it)
      const originalProblems = [...problems];
      
      // Optimistic Update: Just increment solve count, don't change date
      setProblems(prev => 
        prev.map(p => 
          p.id === problemId 
            ? { ...p, solveCount: (p.solveCount || 0) + 1 } 
            : p
        )
      );

      try {
        const problemRef = doc(db, "problems", problemId);
        await updateDoc(problemRef, {
          solveCount: (currentSolveCount || 0) + 1
        });
        return { success: true, error: null };
      } catch (err) {
        console.error("Error updating problem:", err);
        setProblems(originalProblems);
        return { success: false, error: "Failed to update the problem." };
      }
    }
  };

  // Undo revision function - properly placed inside the useProblems function
  const undoRevision = async (revisionProblemId) => {
    const originalProblems = [...problems];
    
    // Find the revision problem to undo
    const revisionProblem = problems.find(p => p.id === revisionProblemId && (p.isRevision || p.originalProblemId));
    
    if (!revisionProblem) {
      return { success: false, error: "Revision not found or not a revision." };
    }

    // Check if it's a recent revision (optional - within last 5 minutes)
    const revisionTime = revisionProblem.createdAt?.toDate?.() || new Date();
    const timeDiff = (new Date() - revisionTime) / 1000 / 60; // minutes
    
    if (timeDiff > 5) {
      return { success: false, error: "Can only undo revisions within 5 minutes." };
    }

    // Optimistic update - remove the revision
    setProblems(prev => prev.filter(p => p.id !== revisionProblemId));

    try {
      const problemRef = doc(db, "problems", revisionProblemId);
      await deleteDoc(problemRef);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error undoing revision:", err);
      setProblems(originalProblems);
      return { success: false, error: "Failed to undo revision." };
    }
  };

  // Refetch function for error recovery
  const refetch = useCallback(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Single return statement with all functions
  return { 
    problems, 
    isLoading, 
    error, 
    addProblem, 
    deleteProblem, 
    markAsSolved, 
    undoRevision,
    refetch
  };
}
