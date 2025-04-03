import { useState } from 'react';
import { useDrop } from 'react-dnd/dist/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addFoodToMeal, updateMealTime } from '../store/mealPlanSlice';

export const useMealSlot = (meal, day = null) => {
  const dispatch = useDispatch();
  const mealTimes = useSelector(state => state.mealPlan.mealTimes);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeValue, setTimeValue] = useState(mealTimes[meal]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {console.log(item);
      dispatch(addFoodToMeal({ 
        mealType: meal, 
        food: item.food,
        day
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const handleTimeClick = () => {
    setIsEditingTime(true);
  };

  const handleTimeChange = (e) => {
    setTimeValue(e.target.value);
  };

  const handleTimeBlur = () => {
    dispatch(updateMealTime({ meal, time: timeValue }));
    setIsEditingTime(false);
  };

  return {
    isOver,
    drop,
    isEditingTime,
    timeValue,
    handleTimeClick,
    handleTimeChange,
    handleTimeBlur
  };
}; 