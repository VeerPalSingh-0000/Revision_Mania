import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, Timestamp, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * A professional, robust hook to manage revision problems with optimistic UI updates.
 * @param {object} user - The authenticated user object.
 * @returns {object} - { problems, isLoading, error, addProblem, deleteProblem, markAsSolved }
 */
export function useProblems(user) {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblems = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    };
    
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

  const addProblem = async (problemText) => {
    if (!problemText.trim() || !user) return { success: false, error: "Input is empty." };
    
    const tempId = `temp_${Date.now()}`;
    const newProblem = {
        id: tempId,
        uid: user.uid,
        problem: problemText.trim(),
        date: Timestamp.fromDate(new Date()),
        solveCount: 0,
    };
    setProblems(prev => [newProblem, ...prev]);

    try {
      const docRef = await addDoc(collection(db, "problems"), {
        uid: user.uid,
        problem: problemText.trim(),
        date: newProblem.date,
        solveCount: 0,
      });
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

const markAsSolved = async (problemId, currentSolveCount) => {
  const originalProblems = [...problems];
  
  // Optimistic Update: Update the date and solve count (keep in problems list)
  const newDate = new Date();
  setProblems(prev => 
      prev.map(p => 
          p.id === problemId 
          ? { ...p, date: Timestamp.fromDate(newDate), solveCount: (p.solveCount || 0) + 1 } 
          : p
      )
  );

  try {
      const problemRef = doc(db, "problems", problemId);
      await updateDoc(problemRef, {
          date: Timestamp.fromDate(newDate),
          solveCount: (currentSolveCount || 0) + 1
      });
      return { success: true, error: null };
  } catch (err) {
      console.error("Error updating problem:", err);
      setProblems(originalProblems);
      return { success: false, error: "Failed to update the problem." };
  }
};



  return { problems, isLoading, error, addProblem, deleteProblem, markAsSolved };
}
