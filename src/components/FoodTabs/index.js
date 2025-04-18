import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedFoods, setFoodsToAvoid, setLoading, setSelectedFoods } from '../../store/foodsSlice';
import { addToGroceries } from '../../store/inventorySlice';
import { generateRecommendationsFromAPI } from '../../utils/api';
import { FILTER_OPTIONS, FOOD_CATEGORIES } from '../../constants';
import FoodCard from '../FoodCard';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import WeeklyCalendar from '../../pages/WeeklyCalendar';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const FoodTabs = ({ view = 'day' }) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState(new Set());
  const [showTooltip, setShowTooltip] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get states from Redux
  const currentStates = useSelector(state => state.user.currentStates);
  const desiredStates = useSelector(state => state.user.desiredStates);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods) || [];
  const foodsToAvoid = useSelector(state => state.foods.foodsToAvoid) || [];
  const loading = useSelector(state => state.foods.loading);
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];
  const foodPreferences = useSelector(state => state.foodPreferences);
  const weekFeelings = useSelector(state => state.user.weekFeelings) || [];
  
  // Get food and lifestyle survey data
  const surveyData = useSelector(state => state.foodPreferences);
  console.log(surveyData);
  const lifestyleData = useSelector(state => state.lifestyle);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleFoodSelect = (food) => {
    const newSelectedCardIds = new Set(selectedCardIds);
    let newSelectedItems = [...selectedItems];

    if (newSelectedCardIds.has(food.id)) {
      newSelectedCardIds.delete(food.id);
      newSelectedItems = newSelectedItems.filter(item => item.id !== food.id);
    } else {
      newSelectedCardIds.add(food.id);
      // Avoid adding duplicates if somehow selected again
      if (!newSelectedItems.some(item => item.id === food.id)) {
         newSelectedItems.push(food);
      }
    }
    setSelectedCardIds(newSelectedCardIds);
    setSelectedItems(newSelectedItems);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setSelectedCardIds(new Set());
  };

  const handleRemoveFood = (foodId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== foodId));
    setSelectedCardIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(foodId);
      return newSet;
    });
  };

  const handleAddToRecipes = () => {
    // Store selected items in Redux
    dispatch(setSelectedFoods(selectedItems));
    // Navigate to the recipe generator
    navigate('/recipe-generator');
  };

  const handleGenerateRecommendations = async () => {
    if (currentStates.length === 0 || desiredStates.length === 0) return;

    // Get current date and day
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    let userData = null;
    
    if (view === 'day') {
      // Create survey data object with default values
      const foodSurveyData = {
        dietaryRestrictions: surveyData?.dietaryRestrictions ? 
          Object.keys(surveyData.dietaryRestrictions).filter(key => surveyData.dietaryRestrictions[key]) : [],
        otherRestriction: surveyData?.otherRestriction || '',
        spiceLevel: surveyData?.spiceLevel || 'medium',
        cuisinePreferences: surveyData?.cuisinePreferences || {},
        foodPreferences: surveyData?.foodPreferences || {},
        cookingMethodPreferences: surveyData?.cookingMethodPreferences || {},
        additionalPreferences: surveyData?.additionalPreferences || '',
        showingCookingMethods: surveyData?.showingCookingMethods || false
      };
      
      // Create user data for AI recommendations
      userData = {
        pantryManager: {
          items: pantryItems.map(item => ({
            foodId: item.foodId,
            name: item.food.name,
            amount: item.amount,
            unit: item.food.unit || 'unit',
            category: item.food.category,
            dateAdded: now.toISOString()
          }))
        },
        currentFeelings: currentStates,
        desiredFeelings: desiredStates,
        surveyData: foodSurveyData,
        lifestyleData: lifestyleData?.responses || {},
        foodPreferences: surveyData?.responses || {}
      };

      console.log('Day View Data:', userData);
    } else {
      // Week view data
      const feelingsByDay = weekFeelings.reduce((acc, { feeling, days }) => {
        days.forEach(day => {
          if (!acc[day]) {
            acc[day] = {
              prioritizedFeelings: []
            };
          }
          acc[day].prioritizedFeelings.push(feeling);
        });
        return acc;
      }, {});

      // Create survey data object for week view with null checks
      const foodSurveyData = {
        dietaryRestrictions: surveyData?.dietaryRestrictions ? 
          Object.keys(surveyData.dietaryRestrictions).filter(key => surveyData.dietaryRestrictions[key]) : [],
        otherRestriction: '',
        spiceLevel: surveyData?.spiceLevel === 'low' ? 1 : surveyData?.spiceLevel === 'medium' ? 3 : 5,
        cuisinePreferences: {},
        foodPreferences: surveyData?.foodPreferences || {},
        cookingMethodPreferences: surveyData?.cookingMethods || {},
        additionalPreferences: '',
        showingCookingMethods: false
      };

      userData = {
        pantryManager: {
          items: pantryItems.map(item => ({
            foodId: item.foodId,
            name: item.food.name,
            amount: item.amount,
            unit: item.food.unit || 'unit',
            category: item.food.category,
            dateAdded: now.toISOString()
          }))
        },
        foodPreferences: foodPreferences || {},
        feelings: {
          [currentDay]: {
            currentFeelings: currentStates,
            desiredFeelings: desiredStates
          },
          prioritizedFeelingsPerDay: feelingsByDay
        },
        surveyData: foodSurveyData,
        lifestyleData: lifestyleData?.responses || {}
      };

      console.log('Week View Data:', userData);
    }

    try {
      dispatch(setLoading(true));
      const { recommended, avoid } = await generateRecommendationsFromAPI(userData);
      dispatch(setRecommendedFoods(recommended));
      dispatch(setFoodsToAvoid(avoid));
      setSelectedCardIds(new Set());
      
      console.log('Generated Recommendations:', { recommended, avoid });
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getFilteredFoods = (foods) => {
    return foods; // Return all foods without filtering
  };

  const filteredRecommendedFoods = getFilteredFoods(recommendedFoods);
  const filteredFoodsToAvoid = getFilteredFoods(foodsToAvoid);

  return (
    <div className="tab-container">
      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended Foods
        </button>
        <button
          className={`tab-button ${activeTab === 'avoid' ? 'active' : ''}`}
          onClick={() => setActiveTab('avoid')}
        >
          Calendar
        </button>
      </div>

      <div className="tab-content">
        {currentStates.length > 0 && desiredStates.length > 0 ? (
          <>
            <div className="action-bar">
              <div className="button-group">
                <button
                  className="generate-button"
                  onClick={handleGenerateRecommendations}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Recommendations'}
                </button>
                <button
                  className={`add-recipes-button ${selectedItems.length > 0 ? 'active' : ''}`}
                  onClick={handleAddToRecipes}
                  disabled={selectedItems.length === 0}
                >
                  Add to Recipe Builder
                </button>
              </div>
            </div>

            {showTooltip && (
              <div className="selection-tooltip">
                Select food cards to add to recipes
                <button className="close-tooltip" onClick={() => setShowTooltip(false)}>×</button>
              </div>
            )}

            <div className="selected-foods-bar">
              <div className="selected-foods-header">
                <span>Selected Items ({selectedItems.length})</span>
                <button 
                  className="clear-all" 
                  onClick={handleClearSelection}
                  disabled={selectedItems.length === 0}
                >
                  Clear All
                </button>
              </div>
              <div className="selected-foods-chips">
                {selectedItems.length > 0 ? (
                  selectedItems.map(item => (
                    <div key={item.id} className="food-chip">
                      <span>{item.name}</span>
                      <button
                        className="remove-chip"
                        onClick={() => handleRemoveFood(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="no-items-message">No items selected</span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading">Generating recommendations...</div>
            ) : (
              <div className="food-grid">
                {activeTab === 'recommended' ? (
                  filteredRecommendedFoods.length > 0 ? (
                    filteredRecommendedFoods.map(food => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        isSelected={selectedCardIds.has(food.id)}
                        onSelect={handleFoodSelect}
                      />
                    ))
                  ) : (
                    <div className="no-foods-message">
                      Click "Generate Recommendations" to get food suggestions
                    </div>
                  )
                ) : (
                  <WeeklyCalendar />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="select-states-message">
            Please select your current and desired states to get recommendations
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodTabs; 