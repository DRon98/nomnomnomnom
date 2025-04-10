import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addFoodToMeal, 
  generateRandomPlan,
  clearMealPlan,
  selectWeekPlanMeals
} from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import MealSlot from '../MealSlot';
import './styles.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_CONFIG = [
  { type: 'breakfast', title: 'Breakfast', icon: '☀️' },
  { type: 'lunch', title: 'Lunch', icon: '🍽️' },
  { type: 'dinner', title: 'Dinner', icon: '🌙' },
  { type: 'snacks', title: 'Snacks', icon: '🍎' }
];

// Color palette for emotions
const EMOTION_COLORS = [
  '#3498db', // Blue
  '#27ae60', // Dark Green
  '#8e44ad', // Purple
  '#e67e22', // Orange
  '#c0392b', // Red
  '#16a085', // Teal
];

const DaySection = ({ day, weekFeelings, onCopyToDay }) => {
  const [isExpanded, setIsExpanded] = useState(day === 'Monday');
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  // Move selectors to the top level
  const breakfastMeals = useSelector(state => selectWeekPlanMeals(state, day, 'breakfast'));
  const lunchMeals = useSelector(state => selectWeekPlanMeals(state, day, 'lunch'));
  const dinnerMeals = useSelector(state => selectWeekPlanMeals(state, day, 'dinner'));
  const snacksMeals = useSelector(state => selectWeekPlanMeals(state, day, 'snacks'));
  
  // Create meals map after the selectors
  const mealsByType = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snacks: snacksMeals
  };
  
  // Find feelings assigned to this day and maintain their original colors
  const dayFeelings = weekFeelings
    .filter(({ days }) => days.includes(day.substring(0, 3)))
    .map(feeling => {
      const originalIndex = weekFeelings.findIndex(f => f.feeling === feeling.feeling);
      return {
        feeling: feeling.feeling,
        color: EMOTION_COLORS[originalIndex % EMOTION_COLORS.length]
      };
    });

  const handleGeneratePlan = () => {
    if (recommendedFoods.length === 0) return;
    
    const plan = generateMealPlan(recommendedFoods);
    console.log(plan);
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
          {dayFeelings.length > 0 && (
            <div className="day-feelings">
              {dayFeelings.map(({ feeling, color }) => (
                <span 
                  key={feeling} 
                  className="day-feeling-bubble"
                  style={{ backgroundColor: color }}
                >
                  {feeling}
                </span>
              ))}
            </div>
          )}
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

const WeekMealPlanner = () => {
  const dispatch = useDispatch();
  const weekFeelings = useSelector(state => state.user.weekFeelings);
  const [selectedDays, setSelectedDays] = useState([]);
  const [copyingMeal, setCopyingMeal] = useState(null);

  // Get foods for copying at the top level
  const foodsToCopy = useSelector(state => 
    copyingMeal 
      ? selectWeekPlanMeals(state, copyingMeal.sourceDay, copyingMeal.meal)
      : []
  );

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
    <div className="week-meal-planner">
      <h2 className="planner-title">Plan Your Week</h2>
    
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
    </div>
  );
};

export default WeekMealPlanner;