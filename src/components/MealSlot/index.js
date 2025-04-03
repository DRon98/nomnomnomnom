import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFoodFromMeal } from '../../store/mealPlanSlice';
import { useMealSlot } from '../../hooks/useMealSlot';
import FoodCard from '../FoodCard';
import './styles.css';

const MealSlot = ({ 
  title, 
  icon, 
  meal, 
  foods, 
  day = null, 
  onCopyToDay = null,
  className = ''
}) => {
  const dispatch = useDispatch();
  const {
    isOver,
    drop,
    isEditingTime,
    timeValue,
    handleTimeClick,
    handleTimeChange,
    handleTimeBlur
  } = useMealSlot(meal, day);

  const handleRemoveFood = (mealId) => {
    dispatch(removeFoodFromMeal({ mealType: meal, mealId, day }));
  };

  return (
    <div className={`meal-slot ${className}`}>
      <div className="meal-header">
        <span className="meal-icon">{icon}</span>
        <h3 className="meal-title">{title}</h3>
        {isEditingTime ? (
          <input
            type="time"
            className="meal-time-input"
            value={timeValue}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            autoFocus
          />
        ) : (
          <span className="meal-time" onClick={handleTimeClick}>
            {timeValue}
          </span>
        )}
        {onCopyToDay && foods && foods.length > 0 && (
          <button 
            className="copy-meal-button"
            onClick={() => onCopyToDay()}
          >
            Copy to Other Days
          </button>
        )}
      </div>
      <div
        ref={drop}
        className={`meal-content droppable ${isOver ? 'active' : ''}`}
      >
        {foods && foods.length > 0 ? (
          <div className="meal-foods">
            {foods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onRemove={() => handleRemoveFood(food.mealId)}
                inMealPlan={true}
              />
            ))}
          </div>
        ) : (
          <div className="drag-placeholder">
            Drag a food here
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSlot; 