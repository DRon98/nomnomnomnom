import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMealPlan, generateRandomPlan, addFoodToMeal } from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import MealSlot from '../MealSlot';
import { selectDayPlanMeals, selectWeekPlanMeals } from '../../store/mealPlanSlice';
import './styles.css';

const MEAL_CONFIG = [
  { type: 'breakfast', title: 'Breakfast', icon: '☀️' },
  { type: 'lunch', title: 'Lunch', icon: '🍽️' },
  { type: 'dinner', title: 'Dinner', icon: '🌙' },
  { type: 'snacks', title: 'Snacks', icon: '🍎' }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DaySection = ({ day, weekFeelings, onCopyToDay }) => {
  const [isExpanded, setIsExpanded] = useState(day === 'Monday');
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  const breakfastMeals = useSelector(state => selectWeekPlanMeals(state, day, 'breakfast'));
  const lunchMeals = useSelector(state => selectWeekPlanMeals(state, day, 'lunch'));
  const dinnerMeals = useSelector(state => selectWeekPlanMeals(state, day, 'dinner'));
  const snacksMeals = useSelector(state => selectWeekPlanMeals(state, day, 'snacks'));
  
  const mealsByType = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snacks: snacksMeals
  };

  const handleGeneratePlan = () => {
    if (recommendedFoods.length === 0) return;
    const plan = generateMealPlan(recommendedFoods);
    dispatch(generateRandomPlan({ ...plan, day }));
  };

  const handleClearPlan = () => {
    dispatch(clearMealPlan({ day }));
  };

  return (
    <div className="day-section">
      <div 
        className="day-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="day-title-container">
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
          <h3 className="day-title">{day}</h3>
        </div>
      </div>
      
      {isExpanded && (
        <div className="day-meals">
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
          
          {MEAL_CONFIG.map(({ type, title, icon }) => (
            <MealSlot
              key={`${day}-${type}`}
              title={title}
              icon={icon}
              meal={type}
              foods={mealsByType[type]}
              day={day}
              onCopyToDay={() => onCopyToDay(day, type)}
              className="week-meal-slot"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MealPlanner = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState('day');
  const [selectedDays, setSelectedDays] = useState([]);
  const [copyingMeal, setCopyingMeal] = useState(null);
  
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const weekFeelings = useSelector(state => state.user.weekFeelings);
  
  // Day view selectors
  const breakfastMeals = useSelector(state => selectDayPlanMeals(state, 'breakfast'));
  const lunchMeals = useSelector(state => selectDayPlanMeals(state, 'lunch'));
  const dinnerMeals = useSelector(state => selectDayPlanMeals(state, 'dinner'));
  const snacksMeals = useSelector(state => selectDayPlanMeals(state, 'snacks'));
  
  const mealsByType = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snacks: snacksMeals
  };

  // Get foods for copying at the top level
  const foodsToCopy = useSelector(state => 
    copyingMeal 
      ? selectWeekPlanMeals(state, copyingMeal.sourceDay, copyingMeal.meal)
      : []
  );

  const handleGeneratePlan = () => {
    if (recommendedFoods.length === 0) return;
    const plan = generateMealPlan(recommendedFoods);
    dispatch(generateRandomPlan(plan));
  };

  const handleClearPlan = () => {
    dispatch(clearMealPlan());
  };

  const handleCopyToDay = (sourceDay, meal) => {
    setCopyingMeal({ sourceDay, meal });
  };

  const handleDayToggle = (targetDay) => {
    setSelectedDays(prev => 
      prev.includes(targetDay) 
        ? prev.filter(d => d !== targetDay)
        : [...prev, targetDay]
    );
  };

  const handleCopy = () => {
    if (!copyingMeal) return;
    
    selectedDays.forEach(targetDay => {
      foodsToCopy.forEach(food => {
        dispatch(addFoodToMeal({
          mealType: copyingMeal.meal,
          food,
          day: targetDay
        }));
      });
    });

    setCopyingMeal(null);
    setSelectedDays([]);
  };

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h2 className="planner-title">Plan Your {view === 'day' ? 'Day' : 'Week'}</h2>
        <div className="view-toggle">
          <button 
            className={`toggle-button ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            Today
          </button>
          <button 
            className={`toggle-button ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Next 7 Days
          </button>
        </div>
      </div>

      {view === 'day' ? (
        <>
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
            ))}
          </div>
        </>
      ) : (
        <>
          {copyingMeal && (
            <div className="copy-options-container">
              <div className="copy-options">
                {DAYS_OF_WEEK.filter(d => d !== copyingMeal.sourceDay).map(targetDay => (
                  <button 
                    key={targetDay}
                    className={`copy-day-button ${selectedDays.includes(targetDay) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(targetDay)}
                  >
                    {targetDay}
                  </button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <button 
                  className="copy-confirm-button"
                  onClick={handleCopy}
                >
                  Copy to {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
          
          <div className="week-days">
            {DAYS_OF_WEEK.map(day => (
              <DaySection 
                key={day}
                day={day}
                weekFeelings={weekFeelings}
                onCopyToDay={handleCopyToDay}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MealPlanner;