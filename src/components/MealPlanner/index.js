import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMealPlan, generateRandomPlan, addFoodToMeal } from '../../store/mealPlanSlice';
import { generateMealPlan } from '../../utils/foodGenerator';
import MealSlot from '../MealSlot';
import { selectDayPlanMeals, selectWeekPlanMeals } from '../../store/mealPlanSlice';
import { selectScheduleData } from '../../store/scheduleDataSlice';
import { generateMealPlanFromAPI } from '../../utils/api';
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

const FoodSelectionModal = ({ recommendedFoods, selectedFoods, onSelect, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Foods for Your Meal Plan</h3>
        <div className="food-selection-grid">
          {recommendedFoods.map(food => (
            <div 
              key={food.id}
              className={`food-item ${selectedFoods.includes(food) ? 'selected' : ''}`}
              onClick={() => onSelect(food)}
            >
              <span className="food-icon">{food.icon || '🍽️'}</span>
              <span className="food-name">{food.name}</span>
              <span className="selection-indicator">
                {selectedFoods.includes(food) ? '✓' : '+'}
              </span>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="primary-button" 
            onClick={onConfirm}
            disabled={selectedFoods.length === 0}
          >
            Confirm ({selectedFoods.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
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
  const [view, setView] = useState('week');
  const [selectedDays, setSelectedDays] = useState([]);
  const [copyingMeal, setCopyingMeal] = useState(null);
  const [isSelectingFoods, setIsSelectingFoods] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const weekFeelings = useSelector(state => state.user.weekFeelings);
  const scheduleData = useSelector(selectScheduleData);
  
  const foodsToCopy = useSelector(state => 
    copyingMeal 
      ? selectWeekPlanMeals(state, copyingMeal.sourceDay, copyingMeal.meal)
      : []
  );
  
  const nextSevenDays = useMemo(() => getNextSevenDays(), []);

  const handleFoodSelect = (food) => {
    setSelectedFoods(prev => 
      prev.includes(food)
        ? prev.filter(f => f.id !== food.id)
        : [...prev, food]
    );
  };

  const handleGenerateWeeklyPlan = () => {
    if (!isSelectingFoods) {
      setIsSelectingFoods(true);
      return;
    }
  };

  const handleConfirmGenerate = async () => {
    if (selectedFoods.length === 0) return;
    
    // Combine schedule data and selected foods into one JSON
    const combinedData = {
      ...scheduleData,
      selected_foods: selectedFoods.map(food => ({
        base_ingredients_for_grocery_list: food.base_ingredients_for_grocery_list,
        id: food.id,
        name: food.name,
        category: food.category || 'uncategorized'
      }))
    };

    try {
      // Call the API and wait for the response
      const generatedPlan = await generateMealPlanFromAPI(combinedData);
      console.log('API Generated Meal Plan:', generatedPlan);
      
      // Generate and dispatch plans for each day using only selected foods
      nextSevenDays.forEach(dayInfo => {
        const plan = generateMealPlan(selectedFoods);
        dispatch(generateRandomPlan({ ...plan, day: dayInfo.key }));
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
    }

    setIsSelectingFoods(false);
    setSelectedFoods([]);
  };

  const handleCancelGenerate = () => {
    setIsSelectingFoods(false);
    setSelectedFoods([]);
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
        <h2 className="planner-title">Plan Your Week</h2>
        <div className="planner-actions">
          <button
            className="primary-button"
            onClick={handleGenerateWeeklyPlan}
            disabled={recommendedFoods.length === 0}
          >
            {isSelectingFoods ? 'Confirm Selection' : 'Generate Plan'}
          </button>
          <button
            className="secondary-button"
            onClick={handleClearPlan}
          >
            Clear All
          </button>
        </div>
      </div>

      {isSelectingFoods && (
        <FoodSelectionModal
          recommendedFoods={recommendedFoods}
          selectedFoods={selectedFoods}
          onSelect={handleFoodSelect}
          onConfirm={handleConfirmGenerate}
          onCancel={handleCancelGenerate}
        />
      )}

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
    </div>
  );
};

export default MealPlanner;