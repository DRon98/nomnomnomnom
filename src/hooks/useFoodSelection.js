import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing food selection state and logic
 * @param {Object[]} initialFoods - Initial array of selected foods
 * @param {Function} [onChange] - Optional callback when selection changes
 * @returns {Object} Food selection state and handlers
 */
const useFoodSelection = (initialFoods = [], onChange) => {
  const [selectedFoods, setSelectedFoods] = useState(initialFoods);

  /**
   * Toggle selection of a food item
   * @param {Object} food - Food item to toggle
   */
  const toggleFood = useCallback((food) => {
    setSelectedFoods(prev => {
      const exists = prev.some(f => f.id === food.id);
      const newFoods = exists
        ? prev.filter(f => f.id !== food.id)
        : [...prev, food];
      
      if (onChange) {
        onChange(newFoods);
      }
      
      return newFoods;
    });
  }, [onChange]);

  /**
   * Check if a food item is selected
   * @param {Object} food - Food item to check
   * @returns {boolean} Whether the food is selected
   */
  const isSelected = useCallback((food) => {
    return selectedFoods.some(f => f.id === food.id);
  }, [selectedFoods]);

  /**
   * Clear all selected foods
   */
  const clearSelection = useCallback(() => {
    setSelectedFoods([]);
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);

  /**
   * Set multiple foods as selected
   * @param {Object[]} foods - Array of foods to select
   */
  const selectMultiple = useCallback((foods) => {
    setSelectedFoods(foods);
    if (onChange) {
      onChange(foods);
    }
  }, [onChange]);

  const selectionCount = useMemo(() => selectedFoods.length, [selectedFoods]);

  return {
    selectedFoods,
    toggleFood,
    isSelected,
    clearSelection,
    selectMultiple,
    selectionCount
  };
};

export default useFoodSelection; 