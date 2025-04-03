import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMealPlan, generateRandomPlan } from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import MealSlot from '../MealSlot';
import { selectDayPlanMeals } from '../../store/mealPlanSlice';
import './styles.css';

const MEAL_CONFIG = [
  { type: 'breakfast', title: 'Breakfast', icon: '☀️' },
  { type: 'lunch', title: 'Lunch', icon: '🍽️' },
  { type: 'dinner', title: 'Dinner', icon: '🌙' },
  { type: 'snacks', title: 'Snacks', icon: '🍎' }
];

const MealPlanner = () => {
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  // Move selectors to the top level
  const breakfastMeals = useSelector(state => selectDayPlanMeals(state, 'breakfast'));
  const lunchMeals = useSelector(state => selectDayPlanMeals(state, 'lunch'));
  const dinnerMeals = useSelector(state => selectDayPlanMeals(state, 'dinner'));
  const snacksMeals = useSelector(state => selectDayPlanMeals(state, 'snacks'));
  
  // Create meals map after the selectors
  const mealsByType = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snacks: snacksMeals
  };
  
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
        {MEAL_CONFIG.map(({ type, title, icon }) => (
          <MealSlot
            key={type}
            title={title}
            icon={icon}
            meal={type}
            foods={mealsByType[type]}
          />
         
        ))
        
        }
      </div>
    </div>
  );
};

export default MealPlanner;