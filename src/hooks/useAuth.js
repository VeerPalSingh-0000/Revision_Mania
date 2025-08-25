import { useState, useEffect } from 'react';
import { subscribeAuth } from '../components/Auth.jsx';

/**
 * Custom hook to manage and provide authentication state.
 * @returns {{user: object | null, isLoading: boolean}}
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to the authentication state changes
    const unsubscribe = subscribeAuth(currentUser => {
      setUser(currentUser);
      setIsLoading(false);
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}
