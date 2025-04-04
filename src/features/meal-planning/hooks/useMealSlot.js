import { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addFoodToMeal, updateMealTime } from '../../../store/mealPlanSlice';

/**
 * Custom hook for managing meal slot functionality
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snacks)
 * @param {string} [day] - Day of the week (for weekly view)
 * @returns {Object} Hook methods and state
 */
export const useMealSlot = (mealType, day = null) => {
  const dispatch = useDispatch();
  const mealTimes = useSelector(state => state.mealPlan.mealTimes);
  
  // Time editing state
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeValue, setTimeValue] = useState(mealTimes[mealType]);

  // Drag and drop configuration
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {
      dispatch(addFoodToMeal({ 
        mealType, 
        food: item.food,
        day
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [mealType, day]);

  // Time editing handlers
  const handleTimeClick = useCallback(() => {
    setIsEditingTime(true);
  }, []);

  const handleTimeChange = useCallback((e) => {
    setTimeValue(e.target.value);
  }, []);

  const handleTimeBlur = useCallback(() => {
    dispatch(updateMealTime({ meal: mealType, time: timeValue }));
    setIsEditingTime(false);
  }, [dispatch, mealType, timeValue]);

  return {
    // Drag and drop
    isOver,
    drop,
    
    // Time editing
    isEditingTime,
    timeValue,
    handleTimeClick,
    handleTimeChange,
    handleTimeBlur
  };
}; 