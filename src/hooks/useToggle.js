import { useState, useCallback } from 'react';

/**
 * Custom hook for handling toggle state
 * @param {boolean} initialState - Initial state of the toggle
 * @returns {[boolean, () => void]} - Current state and toggle function
 */
const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(prevState => !prevState);
  }, []);

  return [state, toggle];
};

export default useToggle; 