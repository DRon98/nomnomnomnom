import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd/dist/hooks';
import { addFoodToMeal, clearMealPlan, generateRandomPlan, removeFoodFromMeal, updateMealTime } from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';
import { selectDayPlanMeals } from '../../store/mealPlanSlice';

const MealSlot = ({ title, icon, meal, foods }) => {
  const dispatch = useDispatch();
  const mealTimes = useSelector(state => state.mealPlan.mealTimes);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeValue, setTimeValue] = useState(mealTimes[meal]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {
      dispatch(addFoodToMeal({ 
        mealType: meal, 
        food: item.food
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const handleRemoveFood = (foodId) => {
    dispatch(removeFoodFromMeal({ mealType: meal, mealId: foodId }));
  };

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

  return (
    <div className="meal-slot">
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
            {mealTimes[meal]}
          </span>
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
                onRemove={() => handleRemoveFood(food.id)}
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

const MealPlanner = () => {
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const breakfast = useSelector(state => selectDayPlanMeals(state, 'breakfast'));
  const lunch = useSelector(state => selectDayPlanMeals(state, 'lunch'));
  const dinner = useSelector(state => selectDayPlanMeals(state, 'dinner'));
  const snacks = useSelector(state => selectDayPlanMeals(state, 'snacks'));
  
  const handleGeneratePlan = () => {
    if (recommendedFoods.length === 0) return;
    
    const plan = generateMealPlan(recommendedFoods);
    dispatch(generateRandomPlan(plan));
  };

  const handleClearPlan = () => {
    dispatch(clearMealPlan());
  };

  return (
    <div className="meal-planner">
      <h2 className="planner-title">Plan Your Day</h2>
      
      <div className="planner-actions">
        <button
          className="primary-button"
          onClick={handleGeneratePlan}
          disabled={recommendedFoods.length === 0}
        >
          Generate Plan
        </button>
        <button
          className="secondary-button"
          onClick={handleClearPlan}
        >
          Clear Plan
        </button>
      </div>
      
      <div className="meal-slots">
        <MealSlot
          title="Breakfast"
          icon="☀️"
          meal="breakfast"
          foods={breakfast}
        />
        <MealSlot
          title="Lunch"
          icon="🍽️"
          meal="lunch"
          foods={lunch}
        />
        <MealSlot
          title="Dinner"
          icon="🌙"
          meal="dinner"
          foods={dinner}
        />
        <MealSlot
          title="Snacks"
          icon="🍎"
          meal="snacks"
          foods={snacks}
        />
      </div>
    </div>
  );
};

export default MealPlanner;