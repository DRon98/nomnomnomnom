import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd/dist/hooks';
import { 
  addFoodToMeal, 
  removeFoodFromMeal, 
  updateMealTime,
  generateRandomPlan,
  clearMealPlan
} from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];
const MEAL_ICONS = {
  breakfast: '☀️',
  lunch: '🍽️',
  dinner: '🌙',
  snacks: '🍎'
};
const MEAL_TITLES = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks'
};

// Color palette for emotions (copied from WeekPlanner)
const EMOTION_COLORS = [
  '#3498db', // Blue
  '#27ae60', // Dark Green
  '#8e44ad', // Purple
  '#e67e22', // Orange
  '#c0392b', // Red
  '#16a085', // Teal
];

const WeekMealSlot = ({ day, title, icon, meal, foods, onCopyToDay }) => {
  const dispatch = useDispatch();
  const mealTimes = useSelector(state => state.mealPlan.mealTimes);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeValue, setTimeValue] = useState(mealTimes[meal]);
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {
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

  const handleRemoveFood = (foodId) => {
    dispatch(removeFoodFromMeal({ mealType: meal, mealId: foodId, day }));
  };

  const handleTimeClick = () => {
    setIsEditingTime(true);
  };

  const handleTimeChange = (e) => {
    setTimeValue(e.target.value);
  };

  const handleTimeBlur = () => {
    dispatch(updateMealTime({ meal, time: timeValue, day }));
    setIsEditingTime(false);
  };

  const handleDayToggle = (targetDay) => {
    setSelectedDays(prev => 
      prev.includes(targetDay) 
        ? prev.filter(d => d !== targetDay)
        : [...prev, targetDay]
    );
  };

  const handleCopy = () => {
    selectedDays.forEach(targetDay => {
      onCopyToDay(day, targetDay, meal);
    });
    setShowCopyOptions(false);
    setSelectedDays([]);
  };

  return (
    <div className="week-meal-slot">
      <div className="meal-header">
        <span className="meal-icon">{icon}</span>
        <h4 className="meal-title">{title}</h4>
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
        {foods && foods.length > 0 && (
          <button 
            className="copy-meal-button"
            onClick={() => {
              setShowCopyOptions(!showCopyOptions);
              if (!showCopyOptions) {
                setSelectedDays([]);
              }
            }}
          >
            Copy to Other Days
          </button>
        )}
      </div>
      
      {showCopyOptions && (
        <div className="copy-options-container">
          <div className="copy-options">
            {DAYS_OF_WEEK.filter(d => d !== day).map(targetDay => (
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

const DaySection = ({ day, mealPlan, weekFeelings, onCopyToDay }) => {
  const [isExpanded, setIsExpanded] = useState(day === 'Monday');
  const dispatch = useDispatch();
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  // Find feelings assigned to this day and maintain their original colors
  const dayFeelings = weekFeelings
    .filter(({ days }) => days.includes(day.substring(0, 3)))
    .map(feeling => {
      // Find the original index of this feeling in the weekFeelings array
      const originalIndex = weekFeelings.findIndex(f => f.feeling === feeling.feeling);
      return {
        feeling: feeling.feeling,
        color: EMOTION_COLORS[originalIndex % EMOTION_COLORS.length]
      };
    });

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
          
          {MEAL_TYPES.map(mealType => (
            <WeekMealSlot
              key={`${day}-${mealType}`}
              day={day}
              title={MEAL_TITLES[mealType]}
              icon={MEAL_ICONS[mealType]}
              meal={mealType}
              foods={mealPlan[day]?.[mealType] || []}
              onCopyToDay={onCopyToDay}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WeekMealPlanner = () => {
  const dispatch = useDispatch();
  const weekMealPlan = useSelector(state => state.mealPlan.weekPlan || {});
  const weekFeelings = useSelector(state => state.user.weekFeelings);

  const handleCopyToDay = (sourceDay, targetDay, meal) => {
    const foodsToCopy = weekMealPlan[sourceDay]?.[meal] || [];
    
    foodsToCopy.forEach(food => {
      dispatch(addFoodToMeal({
        mealType: meal,
        food,
        day: targetDay
      }));
    });
  };

  return (
    <div className="week-meal-planner">
      <h2 className="planner-title">Plan Your Week</h2>
      
      <div className="week-days">
        {DAYS_OF_WEEK.map(day => (
          <DaySection 
            key={day}
            day={day}
            mealPlan={weekMealPlan}
            weekFeelings={weekFeelings}
            onCopyToDay={handleCopyToDay}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekMealPlanner;