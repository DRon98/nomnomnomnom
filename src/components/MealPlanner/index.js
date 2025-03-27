import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { addFoodToMeal, clearMealPlan, generateRandomPlan } from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';

const MealSlot = ({ title, icon, meal, foods }) => {
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {
      dispatch(addFoodToMeal({ meal, food: item.food }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div className="meal-slot">
      <div className="meal-header">
        <span className="meal-icon">{icon}</span>
        <h3 className="meal-title">{title}</h3>
      </div>
      <div
        ref={drop}
        className={`meal-content droppable ${isOver ? 'active' : ''}`}
      >
        {foods.length > 0 ? (
          foods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))
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
  const mealPlan = useSelector(state => state.mealPlan);

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
      
      <div className="meal-slots">
        <MealSlot
          title="Breakfast"
          icon="☀️"
          meal="breakfast"
          foods={mealPlan.breakfast}
        />
        <MealSlot
          title="Lunch"
          icon="🍽️"
          meal="lunch"
          foods={mealPlan.lunch}
        />
        <MealSlot
          title="Dinner"
          icon="🌙"
          meal="dinner"
          foods={mealPlan.dinner}
        />
        <MealSlot
          title="Snacks"
          icon="🍎"
          meal="snacks"
          foods={mealPlan.snacks}
        />
      </div>

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
    </div>
  );
};

export default MealPlanner; 