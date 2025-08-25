import { Timestamp } from "firebase/firestore";

/**
 * Checks if a problem is due for revision based on a given interval.
 * @param {object} problem - The problem object with a 'date' property.
 * @param {object} interval - The interval object with a 'days' property.
 * @returns {boolean} - True if the problem is due, false otherwise.
 */
export function isDue(problem, interval) {
  if (!problem.date) return false;
  const solved = problem.date.toDate();
  const now = new Date();
  const daysAgo = (now - solved) / (1000 * 60 * 60 * 24);
  // Check if the problem was solved approximately 'interval.days' ago.
  return Math.floor(daysAgo) === interval.days;
}
