import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd/dist/hooks';
import { 
  addFoodToMeal, 
  removeFoodFromMeal, 
  updateMealTime 
} from '../../store/mealPlanSlice';
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
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    drop: (item) => {
      dispatch(addFoodToMeal({ 
        meal, 
        food: item.food,
        day
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const handleRemoveFood = (foodId) => {
    dispatch(removeFoodFromMeal({ meal, foodId, day }));
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

  const [showCopyOptions, setShowCopyOptions] = useState(false);

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
        {foods.length > 0 && (
          <button 
            className="copy-meal-button"
            onClick={() => setShowCopyOptions(!showCopyOptions)}
          >
            Copy to Another Day
          </button>
        )}
      </div>
      
      {showCopyOptions && (
        <div className="copy-options">
          {DAYS_OF_WEEK.filter(d => d !== day).map(targetDay => (
            <button 
              key={targetDay}
              className="copy-day-button"
              onClick={() => {
                onCopyToDay(day, targetDay, meal);
                setShowCopyOptions(false);
              }}
            >
              {targetDay}
            </button>
          ))}
        </div>
      )}
      
      <div
        ref={drop}
        className={`meal-content droppable ${isOver ? 'active' : ''}`}
      >
        {foods.length > 0 ? (
          <div className="meal-foods">
            {foods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onRemove={handleRemoveFood}
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
  
  // Find feelings assigned to this day
  const dayFeelings = weekFeelings
    .filter(({ days }) => days.includes(day.substring(0, 3)))
    .map(({ feeling }, index) => ({
      feeling,
      color: EMOTION_COLORS[index % EMOTION_COLORS.length]
    }));

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
        meal,
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