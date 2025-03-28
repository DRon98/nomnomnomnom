import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addFoodConsumption,
  updateFoodServings,
  removeFoodConsumption,
  clearFoodJournal
} from '../../store/foodJournalSlice';
import './styles.css';

const JournalItem = ({ item, onUpdateServings, onRemove }) => {
  return (
    <div className="journal-item">
      <div className="journal-item-info">
        <span className="journal-item-icon">{item.food.icon}</span>
        <span className="journal-item-name">
          {item.food.name}
        </span>
      </div>
      <div className="journal-item-actions">
        <input
          type="number"
          min="1"
          value={item.servings}
          onChange={(e) => onUpdateServings(item.foodId, parseInt(e.target.value, 10), item.date)}
          className="servings-input"
        />
        <button
          onClick={() => onRemove(item.foodId, item.date)}
          className="remove-item-button"
          aria-label={`Remove ${item.food.name}`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const FoodJournal = () => {
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const dispatch = useDispatch();
  const consumedFoods = useSelector(state => state.foodJournal.consumedFoods);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  
  // Get foods consumed on the selected date
  const foodsForSelectedDate = consumedFoods.filter(item => item.date === selectedDate);
  
  // Get recommended foods that haven't been consumed on the selected date
  const unconsumedRecommendedFoods = recommendedFoods.filter(food => 
    !foodsForSelectedDate.some(item => item.foodId === food.id)
  );

  const handleUpdateServings = (foodId, servings, date) => {
    if (servings > 0) {
      dispatch(updateFoodServings({ foodId, servings, date }));
    }
  };

  const handleAddFood = (food) => {
    dispatch(addFoodConsumption({ food, servings: 1, date: selectedDate }));
  };

  // Generate dates for the past week
  const getPastWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      dates.push(formattedDate);
    }
    
    return dates;
  };

  const pastWeekDates = getPastWeekDates();

  // Format date for display (e.g., "Mon, Jan 1")
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="food-journal">
      <div className="journal-dropdown">
        <button
          className={`journal-button ${isJournalOpen ? 'active' : ''}`}
          onClick={() => setIsJournalOpen(!isJournalOpen)}
        >
          📝
        </button>
        {isJournalOpen && (
          <div className="dropdown-content">
            <div className="dropdown-header">
              <h3>Food Journal</h3>
              <button
                onClick={() => dispatch(clearFoodJournal())}
                className="clear-button"
              >
                Clear All
              </button>
            </div>
            
            <div className="date-selector">
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-select"
              >
                {pastWeekDates.map(date => (
                  <option key={date} value={date}>
                    {formatDateForDisplay(date)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="items-list">
              <h4>Consumed Foods</h4>
              {foodsForSelectedDate.length > 0 ? (
                foodsForSelectedDate.map(item => (
                  <JournalItem
                    key={`${item.foodId}-${item.date}`}
                    item={item}
                    onUpdateServings={handleUpdateServings}
                    onRemove={(foodId, date) => dispatch(removeFoodConsumption({ foodId, date }))}
                  />
                ))
              ) : (
                <div className="empty-message">No foods recorded for this day</div>
              )}
              
              <h4 className="add-foods-header">Add Recommended Foods</h4>
              {unconsumedRecommendedFoods.length > 0 ? (
                <div className="recommended-foods-list">
                  {unconsumedRecommendedFoods.map(food => (
                    <div key={food.id} className="recommended-food-item" onClick={() => handleAddFood(food)}>
                      <span className="food-icon">{food.icon}</span>
                      <span className="food-name">{food.name}</span>
                      <span className="add-icon">+</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">All recommended foods added</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodJournal;