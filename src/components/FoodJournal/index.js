import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  addFoodConsumption,
  updateFoodServings,
  removeFoodConsumption,
  clearFoodJournal,
  addQuickJournalEntry
} from '../../store/foodJournalSlice';
import './styles.css';

// Mock food data for search/select
const MOCK_FOODS = [
  { id: 1, name: 'Chicken Breast', icon: '🍗', type: 'protein' },
  { id: 2, name: 'Salmon', icon: '🐟', type: 'protein' },
  { id: 3, name: 'Quinoa', icon: '🌾', type: 'grain' },
  { id: 4, name: 'Brown Rice', icon: '🍚', type: 'grain' },
  { id: 5, name: 'Broccoli', icon: '🥦', type: 'vegetable' },
  { id: 6, name: 'Spinach', icon: '🥬', type: 'vegetable' },
  { id: 7, name: 'Apple', icon: '🍎', type: 'fruit' },
  { id: 8, name: 'Banana', icon: '🍌', type: 'fruit' },
  { id: 9, name: 'Yogurt', icon: '🥛', type: 'dairy' },
  { id: 10, name: 'Eggs', icon: '🥚', type: 'protein' },
];

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
  const [quickJournalStep, setQuickJournalStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [quickJournalData, setQuickJournalData] = useState({
    recommendedFoodConsumption: '',
    foodsEaten: [],
    foodsNotEaten: [],
    otherFoods: [],
    followedMealTimes: '',
    followedTip: ''
  });
  
  const dispatch = useDispatch();
  const consumedFoods = useSelector(state => state.foodJournal.consumedFoods);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const mealTimes = useSelector(state => state.mealPlan.mealTimes);
  const personalizedTip = useSelector(state => state.survey.data?.personalizedTips?.[0] || 'Include protein in every meal');

  // Get foods consumed on the selected date
  const foodsForSelectedDate = consumedFoods.filter(item => item.date === selectedDate);
  
  // Get recommended foods that haven't been consumed on the selected date
  const unconsumedRecommendedFoods = recommendedFoods.filter(food => 
    !foodsForSelectedDate.some(item => item.foodId === food.id)
  );

  // Filter foods based on search term
  const filteredFoods = useMemo(() => {
    if (!searchTerm) return MOCK_FOODS;
    const lowerSearch = searchTerm.toLowerCase();
    return MOCK_FOODS.filter(food => 
      food.name.toLowerCase().includes(lowerSearch) ||
      food.type.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

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

  const handleFoodSelection = (food, type) => {
    setQuickJournalData(prev => {
      const list = prev[type];
      const index = list.findIndex(f => f.id === food.id);
      
      if (index === -1) {
        return { ...prev, [type]: [...list, food] };
      } else {
        return { ...prev, [type]: list.filter(f => f.id !== food.id) };
      }
    });
  };

  const handleQuickAddFood = (food) => {
    setSelectedFoods(prev => {
      const exists = prev.some(f => f.id === food.id);
      if (exists) {
        return prev.filter(f => f.id !== food.id);
      }
      return [...prev, food];
    });
  };

  const handleOtherFoodsResponse = (response) => {
    if (response === 'no') {
      const messages = {
        all: 'Great job! Add details',
        most: 'Nice work! Log more',
        some: 'Good start! Complete journal',
        none: 'No worries! Log details'
      };
      setQuickJournalStep(3);
      setQuickJournalData(prev => ({ 
        ...prev, 
        message: messages[prev.recommendedFoodConsumption],
        otherFoods: selectedFoods
      }));
    } else {
      setQuickJournalStep(2.5); // Show Quick Add
    }
  };

  const handleQuickJournalSubmit = () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    dispatch(addQuickJournalEntry({
      date: yesterday,
      ...quickJournalData,
      otherFoods: selectedFoods,
      entryType: 'quick'
    }));
    setIsJournalOpen(false);
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
              {/* <h4>Consumed Foods</h4>
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
              ) : ( */}
                

            </div>
            
            <div className="quick-journal">
              {quickJournalStep === 0 && (
                <>
                  <h4>How much of the recommended foods did you eat yesterday?</h4>
                  <div className="response-buttons">
                    <button 
                      className="response-button all"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, recommendedFoodConsumption: 'all'});
                        setQuickJournalStep(0.5);
                      }}
                    >
                      All
                    </button>
                    <button 
                      className="response-button most"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, recommendedFoodConsumption: 'most'});
                        setQuickJournalStep(0.5);
                      }}
                    >
                      Most
                    </button>
                    <button 
                      className="response-button some"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, recommendedFoodConsumption: 'some'});
                        setQuickJournalStep(0.5);
                      }}
                    >
                      Some
                    </button>
                    <button 
                      className="response-button none"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, recommendedFoodConsumption: 'none'});
                        setQuickJournalStep(0.5);
                      }}
                    >
                      None
                    </button>
                  </div>
                </>
              )}

              {quickJournalStep === 0.5 && (
                <>
                  {quickJournalData.recommendedFoodConsumption === 'most' && (
                    <>
                      <h4>Which foods did you skip?</h4>
                      <div className="multi-select">
                        {recommendedFoods.map(food => (
                          <div 
                            key={food.id} 
                            className="multi-select-item"
                            onClick={() => handleFoodSelection(food, 'foodsNotEaten')}
                          >
                            <input 
                              type="checkbox"
                              checked={quickJournalData.foodsNotEaten.some(f => f.id === food.id)}
                              readOnly
                            />
                            <span className="food-icon">{food.icon}</span>
                            <span>{food.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {quickJournalData.recommendedFoodConsumption === 'some' && (
                    <>
                      <h4>Which foods did you eat?</h4>
                      <div className="multi-select">
                        {recommendedFoods.map(food => (
                          <div 
                            key={food.id} 
                            className="multi-select-item"
                            onClick={() => handleFoodSelection(food, 'foodsEaten')}
                          >
                            <input 
                              type="checkbox"
                              checked={quickJournalData.foodsEaten.some(f => f.id === food.id)}
                              readOnly
                            />
                            <span className="food-icon">{food.icon}</span>
                            <span>{food.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {quickJournalData.recommendedFoodConsumption === 'none' && (
                    <>
                      <h4>What did you eat?</h4>
                      <div className="quick-add">
                        <input
                          type="text"
                          className="quick-add-search"
                          placeholder="Search foods..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="quick-add-results">
                          {filteredFoods.map(food => (
                            <div 
                              key={food.id}
                              className={`quick-add-item ${selectedFoods.some(f => f.id === food.id) ? 'selected' : ''}`}
                              onClick={() => handleQuickAddFood(food)}
                            >
                              <span className="food-icon">{food.icon}</span>
                              <span className="food-name">{food.name}</span>
                              <span className="food-type">{food.type}</span>
                              {selectedFoods.some(f => f.id === food.id) && (
                                <span className="check-icon">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="response-buttons">
                    <h4>Did you eat other foods?</h4>
                    <button 
                      className="response-button"
                      onClick={() => handleOtherFoodsResponse('yes')}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => handleOtherFoodsResponse('no')}
                    >
                      No
                    </button>
                  </div>
                </>
              )}

              {quickJournalStep === 2.5 && (
                <>
                  <h4>Quick Add Foods</h4>
                  <div className="quick-add">
                    <input
                      type="text"
                      className="quick-add-search"
                      placeholder="Search foods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="quick-add-results">
                      {filteredFoods.map(food => (
                        <div 
                          key={food.id}
                          className={`quick-add-item ${selectedFoods.some(f => f.id === food.id) ? 'selected' : ''}`}
                          onClick={() => handleQuickAddFood(food)}
                        >
                          <span className="food-icon">{food.icon}</span>
                          <span className="food-name">{food.name}</span>
                          <span className="food-type">{food.type}</span>
                          {selectedFoods.some(f => f.id === food.id) && (
                            <span className="check-icon">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      className="quick-journal-submit"
                      onClick={() => setQuickJournalStep(1)}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
              
              {quickJournalStep === 1 && (
                <>
                  <h4>Did you eat recommended foods at suggested times?</h4>
                  <div className="response-buttons">
                    <button 
                      className="response-button"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, followedMealTimes: 'yes'});
                        setQuickJournalStep(2);
                      }}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, followedMealTimes: 'no'});
                        setQuickJournalStep(2);
                      }}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
              
              {quickJournalStep === 2 && (
                <>
                  <h4>Did you follow your eating tip?</h4>
                  <p className="quick-journal-tip">Tip: {personalizedTip}</p>
                  <div className="response-buttons">
                    <button 
                      className="response-button"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, followedTip: 'yes'});
                        setQuickJournalStep(3);
                      }}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => {
                        setQuickJournalData({...quickJournalData, followedTip: 'no'});
                        setQuickJournalStep(3);
                      }}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
              
              {quickJournalStep === 3 && (
                <div className="quick-journal-complete">
                  <h4>Thanks for logging!</h4>
                  {quickJournalData.message && (
                    <p className="quick-journal-tip">{quickJournalData.message}</p>
                  )}
                  <Link 
                    to="/food-journal?date=yesterday" 
                    className="journal-cta"
                  >
                    View Full Journal
                  </Link>
                  <button 
                    className="quick-journal-submit"
                    onClick={handleQuickJournalSubmit}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodJournal;