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
  writeBatch,
  onSnapshot 
} from 'firebase/firestore';

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
    const q = query(collection(db, "problems"), where("uid", "==", user.uid), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProblems(problemsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching problems:", err);
      setError("Could not load your problems.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addProblem = useCallback(async (problemData) => {
    if (!user || !problemData) return { success: false, error: "Invalid data." };
    try {
      const newProblem = {
        uid: user.uid,
        problem: typeof problemData === 'string' ? problemData.trim() : problemData.problem,
        difficulty: problemData.difficulty || null,
        platform: problemData.platform || null,
        tags: problemData.tags || [],
        date: Timestamp.fromDate(new Date()),
        solveCount: 1,
        createdAt: Timestamp.fromDate(new Date()),
      };
      await addDoc(collection(db, "problems"), newProblem);
      return { success: true };
    } catch (err) {
      console.error("Error adding problem:", err);
      return { success: false, error: "Failed to add problem." };
    }
  }, [user]);

  const deleteProblem = useCallback(async (problemId) => {
    try {
      await deleteDoc(doc(db, "problems", problemId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting problem:", err);
      return { success: false, error: "Failed to delete problem." };
    }
  }, []);

  const markAsSolved = useCallback(async (problemId, _, createRevision = false) => {
    if (createRevision) {
      const originalProblem = problems.find(p => p.id === problemId);
      if (!originalProblem) {
        return { success: false, error: "Original problem not found." };
      }
      try {
        const batch = writeBatch(db);
        const newRevisionRef = doc(collection(db, "problems"));
        const revisionData = {
            uid: user.uid,
            problem: originalProblem.problem,
            difficulty: originalProblem.difficulty,
            platform: originalProblem.platform,
            tags: originalProblem.tags,
            date: Timestamp.fromDate(new Date()),
            solveCount: 1,
            isRevision: true,
            originalProblemId: originalProblem.id,
            createdAt: Timestamp.fromDate(new Date()),
        };
        batch.set(newRevisionRef, revisionData);
        const originalProblemRef = doc(db, "problems", originalProblem.id);
        batch.update(originalProblemRef, { solveCount: increment(1) });
        await batch.commit();
        return { success: true };
      } catch (err) {
        console.error("Error creating revision:", err);
        return { success: false, error: "Operation failed." };
      }
    }
  }, [user, problems]);

  const undoRevision = useCallback(async (revisionProblemId) => {
    const revisionProblem = problems.find(p => p.id === revisionProblemId && p.originalProblemId);
    if (!revisionProblem) {
        return { success: false, error: "Revision to undo not found." };
    }
    const timeDiff = (new Date() - revisionProblem.createdAt.toDate()) / 1000 / 60;
    if (timeDiff > 5) {
        return { success: false, error: "Can only undo revisions within 5 minutes." };
    }
    try {
        const batch = writeBatch(db);
        const revisionRef = doc(db, "problems", revisionProblemId);
        batch.delete(revisionRef);
        const originalProblemRef = doc(db, "problems", revisionProblem.originalProblemId);
        batch.update(originalProblemRef, { solveCount: increment(-1) });
        await batch.commit();
        return { success: true };
    } catch (err) {
        console.error("Error undoing revision:", err);
        return { success: false, error: "Failed to undo revision." };
    }
  }, [problems]);
  
  // --- THIS IS THE FIX ---
  // Ensure all the functions your app needs are included in this return object.
  return { 
    problems, 
    isLoading, 
    error, 
    addProblem,
    deleteProblem,
    markAsSolved, 
    undoRevision 
  };
}