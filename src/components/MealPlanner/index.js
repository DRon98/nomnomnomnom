import React, { useState, useMemo } from 'react';
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

// Function to generate dates for the next 7 days
const getNextSevenDays = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    
    days.push({
      date,
      display: `${dayOfWeek} ${monthDay}`,
      key: date.toISOString().split('T')[0]
    });
  }
  
  return days;
};

const DaySection = ({ dayInfo, weekFeelings, onCopyToDay }) => {
  const [isExpanded, setIsExpanded] = useState(dayInfo.key === getNextSevenDays()[0].key);
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  const breakfastMeals = useSelector(state => selectWeekPlanMeals(state, dayInfo.key, 'breakfast'));
  const lunchMeals = useSelector(state => selectWeekPlanMeals(state, dayInfo.key, 'lunch'));
  const dinnerMeals = useSelector(state => selectWeekPlanMeals(state, dayInfo.key, 'dinner'));
  const snacksMeals = useSelector(state => selectWeekPlanMeals(state, dayInfo.key, 'snacks'));
  
  const mealsByType = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snacks: snacksMeals
  };

  const handleGeneratePlan = () => {
    if (recommendedFoods.length === 0) return;
    const plan = generateMealPlan(recommendedFoods);
    dispatch(generateRandomPlan({ ...plan, day: dayInfo.key }));
  };

  const handleClearPlan = () => {
    dispatch(clearMealPlan({ day: dayInfo.key }));
  };

  return (
    <div className="day-section">
      <div 
        className="day-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="day-title-container">
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
          <h3 className="day-title">{dayInfo.display}</h3>
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
              key={`${dayInfo.key}-${type}`}
              title={title}
              icon={icon}
              meal={type}
              foods={mealsByType[type]}
              day={dayInfo.key}
              onCopyToDay={() => onCopyToDay(dayInfo.key, type)}
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
  
  // Memoize the next seven days to prevent recalculation on every render
  const nextSevenDays = useMemo(() => getNextSevenDays(), []);
  
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
                {nextSevenDays
                  .filter(d => d.key !== copyingMeal.sourceDay)
                  .map(dayInfo => (
                    <button 
                      key={dayInfo.key}
                      className={`copy-day-button ${selectedDays.includes(dayInfo.key) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(dayInfo.key)}
                    >
                      {dayInfo.display}
                    </button>
                  ))
                }
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
            {nextSevenDays.map(dayInfo => (
              <DaySection 
                key={dayInfo.key}
                dayInfo={dayInfo}
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