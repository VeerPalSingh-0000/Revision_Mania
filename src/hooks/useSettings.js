// src/hooks/useSettings.js
import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { INTERVALS } from "../Revision/constants";

/**
 * A hook to manage user-specific settings (like custom revision intervals) in Firestore.
 */
export function useSettings(user) {
  const [settings, setSettings] = useState({ intervals: INTERVALS });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings({ intervals: INTERVALS });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const settingsRef = doc(db, "userSettings", user.uid);

    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          setSettings({ intervals: INTERVALS });
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching settings:", err);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const updateIntervals = useCallback(
    async (newIntervals) => {
      if (!user) return { success: false, error: "Not authenticated" };
      try {
        const settingsRef = doc(db, "userSettings", user.uid);
        await setDoc(settingsRef, { intervals: newIntervals }, { merge: true });
        return { success: true };
      } catch (err) {
        console.error("Error updating intervals:", err);
        return { success: false, error: "Failed to save settings." };
      }
    },
    [user],
  );

  const resetToDefaults = useCallback(async () => {
    return await updateIntervals(INTERVALS);
  }, [updateIntervals]);

  const updateToSequentialLabels = useCallback(async () => {
    if (!user) return { success: false, error: "Not authenticated" };
    try {
      // Get current intervals and update their labels to sequential format
      const currentIntervals = settings.intervals || INTERVALS;
      const updatedIntervals = currentIntervals.map((interval, index) => {
        let timeLabel = '';
        if (interval.days === 3) timeLabel = '3 Days';
        else if (interval.days === 7) timeLabel = '1 Week';
        else if (interval.days === 30) timeLabel = '1 Month';
        else if (interval.days === 90) timeLabel = '3 Months';
        else timeLabel = `${interval.days} Days`;
        
        return {
          ...interval,
          label: `Rev ${index + 1} (${timeLabel})`
        };
      });
      
      const settingsRef = doc(db, "userSettings", user.uid);
      await setDoc(settingsRef, { intervals: updatedIntervals }, { merge: true });
      return { success: true };
    } catch (err) {
      console.error("Error updating to sequential labels:", err);
      return { success: false, error: "Failed to update labels." };
    }
  }, [user, settings.intervals]);

  return {
    intervals: settings.intervals || INTERVALS,
    isLoading,
    updateIntervals,
    resetToDefaults,
    updateToSequentialLabels,
  };
}
