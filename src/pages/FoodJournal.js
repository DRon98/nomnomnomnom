import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, subDays } from 'date-fns';
import { FaChevronDown, FaChevronUp, FaUtensils, FaSearch, FaPlus } from 'react-icons/fa';
import { addConsumedFood, removeConsumedFood } from '../store/foodLogSlice';
import './FoodJournal.css';

const MEAL_QUESTIONS = {
  breakfast: {
    main: "How was your breakfast?",
    subQuestions: [
      "Did you eat within 30 minutes of waking up?",
      "Was it a balanced meal?",
      "Did you eat mindfully (without distractions)?",
    ]
  },
  lunch: {
    main: "How was your lunch?",
    subQuestions: [
      "Did you take a proper lunch break?",
      "Was it a balanced meal?",
      "Did you eat mindfully?",
    ]
  },
  dinner: {
    main: "How was your dinner?",
    subQuestions: [
      "Did you eat at least 2 hours before bed?",
      "Was it a balanced meal?",
      "Did you eat mindfully?",
    ]
  },
  snacks: {
    main: "How were your snacks today?",
    subQuestions: [
      "Were they planned or unplanned?",
      "Were they healthy choices?",
      "Did you snack due to hunger or other reasons?",
    ]
  }
};

const RESPONSE_OPTIONS = {
  satisfaction: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
  yesNo: ['Yes', 'No'],
  snackTiming: ['Planned', 'Unplanned', 'Mixed'],
  snackChoice: ['Healthy', 'Unhealthy', 'Mixed'],
  snackReason: ['Hunger', 'Stress', 'Boredom', 'Social', 'Other']
};

const MealSection = ({ 
  meal, 
  responses, 
  onResponseChange, 
  consumedFoods,
  onAddFood,
  onRemoveFood 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const getResponseOptions = (questionIndex) => {
    if (questionIndex === 0) return RESPONSE_OPTIONS.satisfaction;
    if (meal === 'snacks') {
      if (questionIndex === 1) return RESPONSE_OPTIONS.snackTiming;
      if (questionIndex === 2) return RESPONSE_OPTIONS.snackChoice;
      if (questionIndex === 3) return RESPONSE_OPTIONS.snackReason;
    }
    return RESPONSE_OPTIONS.yesNo;
  };

  return (
    <div className="meal-section">
      <div 
        className="meal-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{MEAL_QUESTIONS[meal].main}</h3>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      
      {isExpanded && (
        <div className="meal-content">
          <div className="consumed-foods">
            <h4>Foods Consumed</h4>
            <div className="food-list">
              {consumedFoods.map(food => (
                <div key={food.id} className="food-item">
                  <span className="food-icon">{food.icon}</span>
                  <span className="food-name">{food.name}</span>
                  <button 
                    className="remove-food"
                    onClick={() => onRemoveFood(food.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                className="add-food-button"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaPlus /> Add Food
              </button>
            </div>
            
            {showSearch && (
              <div className="food-search">
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for food..."
                  />
                </div>
                {/* Food search results would go here */}
              </div>
            )}
          </div>

          <div className="questions">
            <div className="question">
              <label>How satisfied were you with this meal?</label>
              <select
                value={responses[0] || ''}
                onChange={(e) => onResponseChange(0, e.target.value)}
              >
                <option value="">Select...</option>
                {RESPONSE_OPTIONS.satisfaction.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {MEAL_QUESTIONS[meal].subQuestions.map((question, index) => (
              <div key={index} className="question">
                <label>{question}</label>
                <select
                  value={responses[index + 1] || ''}
                  onChange={(e) => onResponseChange(index + 1, e.target.value)}
                >
                  <option value="">Select...</option>
                  {getResponseOptions(index + 1).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="additional-questions">
            <div className="question">
              <label>Did you eat out?</label>
              <select
                value={responses.ateOut || ''}
                onChange={(e) => onResponseChange('ateOut', e.target.value)}
              >
                <option value="">Select...</option>
                {RESPONSE_OPTIONS.yesNo.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {responses.ateOut === 'Yes' && (
              <div className="restaurant-search">
                <input
                  type="text"
                  placeholder="Where did you eat?"
                  value={responses.restaurant || ''}
                  onChange={(e) => onResponseChange('restaurant', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FoodJournal = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealResponses, setMealResponses] = useState({
    breakfast: {},
    lunch: {},
    dinner: {},
    snacks: {}
  });

  const dispatch = useDispatch();
  const consumedFoods = useSelector(state => state.foodLog.consumed[selectedDate] || {});

  const handleResponseChange = (meal, questionIndex, value) => {
    setMealResponses(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [questionIndex]: value
      }
    }));
  };

  const handleAddFood = (meal, food) => {
    dispatch(addConsumedFood({ date: selectedDate, meal, food }));
  };

  const handleRemoveFood = (meal, foodId) => {
    dispatch(removeConsumedFood({ date: selectedDate, meal, foodId }));
  };

  const generatePastWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="food-journal">
      <div className="date-selector">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {generatePastWeekDates().map(date => (
            <option key={date} value={date}>
              {format(new Date(date), 'EEEE, MMMM d')}
            </option>
          ))}
        </select>
      </div>

      <div className="meals-container">
        {Object.keys(MEAL_QUESTIONS).map(meal => (
          <MealSection
            key={meal}
            meal={meal}
            responses={mealResponses[meal]}
            onResponseChange={(questionIndex, value) => 
              handleResponseChange(meal, questionIndex, value)
            }
            consumedFoods={consumedFoods[meal] || []}
            onAddFood={(food) => handleAddFood(meal, food)}
            onRemoveFood={(foodId) => handleRemoveFood(meal, foodId)}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodJournal; 