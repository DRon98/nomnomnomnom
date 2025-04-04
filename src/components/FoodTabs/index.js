import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedFoods, setFoodsToAvoid, setLoading } from '../../store/foodsSlice';
import { addToGroceries } from '../../store/inventorySlice';
import { generateRecommendations } from '../../utils/foodGenerator';
import { FILTER_OPTIONS, FOOD_CATEGORIES } from '../../constants';
import FoodCard from '../FoodCard';
import './styles.css';

const FoodTabs = ({ view = 'day' }) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState(new Set());
  const [activeFilters, setActiveFilters] = useState(new Set([FILTER_OPTIONS.ALL]));
  const dispatch = useDispatch();
  
  // Get states from Redux
  const currentStates = useSelector(state => state.user.currentStates);
  const desiredStates = useSelector(state => state.user.desiredStates);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods) || [];
  const foodsToAvoid = useSelector(state => state.foods.foodsToAvoid) || [];
  const loading = useSelector(state => state.foods.loading);
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];
  const foodPreferences = useSelector(state => state.survey.data);
  const weekFeelings = useSelector(state => state.user.weekFeelings) || [];

  // Select all items when entering batch mode
  useEffect(() => {
    if (isBatchMode) {
      const currentFoods = activeTab === 'recommended' ? recommendedFoods : foodsToAvoid;
      setSelectedFoods(new Set(currentFoods.map(food => food.id)));
    } else {
      setSelectedFoods(new Set());
    }
  }, [isBatchMode, activeTab, recommendedFoods, foodsToAvoid]);

  const handleGenerateRecommendations = async () => {
    if (currentStates.length === 0 || desiredStates.length === 0) return;

    // Get current date and day
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (view === 'day') {
      // Log day view data
      console.log('Day View Data:', {
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
        foodPreferences: foodPreferences,
        currentFeelings: currentStates,
        desiredFeelings: desiredStates
      });
    } else {
      // Log week view data with prioritized feelings per day
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

      console.log('Week View Data:', {
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
        foodPreferences: foodPreferences,
        feelings: {
          [currentDay]: {
            currentFeelings: currentStates,
            desiredFeelings: desiredStates
          },
          prioritizedFeelingsPerDay: feelingsByDay
        }
      });
    }

    try {
      dispatch(setLoading(true));
      const { recommended, avoid } = await generateRecommendations(currentStates, desiredStates);
      dispatch(setRecommendedFoods(recommended));
      dispatch(setFoodsToAvoid(avoid));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const toggleFoodSelection = (foodId) => {
    setSelectedFoods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(foodId)) {
        newSet.delete(foodId);
      } else {
        newSet.add(foodId);
      }
      return newSet;
    });
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (filter === FILTER_OPTIONS.ALL) {
        newSet.clear();
        newSet.add(FILTER_OPTIONS.ALL);
      } else {
        newSet.delete(FILTER_OPTIONS.ALL);
        if (newSet.has(filter)) {
          newSet.delete(filter);
          if (newSet.size === 0) {
            newSet.add(FILTER_OPTIONS.ALL);
          }
        } else {
          newSet.add(filter);
        }
      }
      return newSet;
    });
  };

  const handleBatchAdd = () => {
    const foodsToAdd = (activeTab === 'recommended' ? recommendedFoods : foodsToAvoid)
      .filter(food => selectedFoods.has(food.id));
    
    foodsToAdd.forEach(food => {
      dispatch(addToGroceries({ food }));
    });

    // Reset selection mode
    setIsBatchMode(false);
    setSelectedFoods(new Set());
  };

  const getFilteredFoods = (foods) => {
    if (activeFilters.has(FILTER_OPTIONS.ALL)) {
      return foods;
    }

    // Separate status and category filters
    const statusFilters = new Set(
      Array.from(activeFilters).filter(filter => 
        [FILTER_OPTIONS.PANTRY, FILTER_OPTIONS.SHOPPING_LIST, FILTER_OPTIONS.NEED_TO_PURCHASE].includes(filter)
      )
    );
    
    const categoryFilters = new Set(
      Array.from(activeFilters).filter(filter => 
        Object.values(FOOD_CATEGORIES).includes(filter)
      )
    );

    return foods.filter(food => {
      const inPantry = pantryItems.some(item => item.food?.name?.toLowerCase() === food.name?.toLowerCase());
      const inShoppingList = shoppingListItems.some(item => item.food?.name?.toLowerCase() === food.name?.toLowerCase());
      
      // If no status filters are selected, don't filter by status
      const matchesStatusFilter = statusFilters.size === 0 ? true : (
        (statusFilters.has(FILTER_OPTIONS.PANTRY) && inPantry) ||
        (statusFilters.has(FILTER_OPTIONS.SHOPPING_LIST) && inShoppingList) ||
        (statusFilters.has(FILTER_OPTIONS.NEED_TO_PURCHASE) && !inPantry && !inShoppingList)
      );

      // If no category filters are selected, don't filter by category
      const matchesCategoryFilter = categoryFilters.size === 0 ? true :
        categoryFilters.has(food.category);

      // Item must match both status AND category filters if they are active
      return matchesStatusFilter && matchesCategoryFilter;
    });
  };

  const filteredRecommendedFoods = getFilteredFoods(recommendedFoods);
  const filteredFoodsToAvoid = getFilteredFoods(foodsToAvoid);

  return (
    <div className="food-tabs">
      <div className="tabs-header">
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
          Foods to Avoid
        </button>
      </div>

      {currentStates.length > 0 && desiredStates.length > 0 ? (
        <>
          <div className="action-bar">
            <div className="action-buttons">
              <button
                className="generate-button"
                onClick={handleGenerateRecommendations}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Recommendations'}
              </button>
              <div className="batch-buttons">
                <button
                  className={`batch-select-button ${isBatchMode ? 'active' : ''}`}
                  onClick={() => {
                    if (isBatchMode) {
                      setSelectedFoods(new Set());
                    }
                    setIsBatchMode(!isBatchMode);
                  }}
                >
                  <span className="icon">📋</span>
                  {isBatchMode ? 'Cancel' : 'Batch Add'}
                </button>

                {isBatchMode && selectedFoods.size > 0 && (
                  <button
                    className="confirm-batch-button"
                    onClick={handleBatchAdd}
                  >
                    Add {selectedFoods.size} items
                  </button>
                )}
              </div>
            </div>
            
            {(activeTab === 'recommended' ? recommendedFoods : foodsToAvoid).length > 0 && (
              <div className="filters-container">
                  
                  <div className="filter-options">
                  <h4>Status:</h4>
                    <button
                      className={`filter-button ${activeFilters.has(FILTER_OPTIONS.ALL) ? 'active' : ''}`}
                      onClick={() => toggleFilter(FILTER_OPTIONS.ALL)}
                      data-status="all"
                    >
                      All
                    </button>
                    <button
                      className={`filter-button ${activeFilters.has(FILTER_OPTIONS.PANTRY) ? 'active' : ''}`}
                      onClick={() => toggleFilter(FILTER_OPTIONS.PANTRY)}
                      data-status="pantry"
                    >
                      In Pantry
                    </button>
                    <button
                      className={`filter-button ${activeFilters.has(FILTER_OPTIONS.SHOPPING_LIST) ? 'active' : ''}`}
                      onClick={() => toggleFilter(FILTER_OPTIONS.SHOPPING_LIST)}
                      data-status="shopping_list"
                    >
                      In Shopping List
                    </button>
                    <button
                      className={`filter-button ${activeFilters.has(FILTER_OPTIONS.NEED_TO_PURCHASE) ? 'active' : ''}`}
                      onClick={() => toggleFilter(FILTER_OPTIONS.NEED_TO_PURCHASE)}
                      data-status="need_to_purchase"
                    >
                      Need to Purchase
                    </button>
                  </div>
                  
                  <div className="filter-options">
                  <h4>Type:</h4>
                    {Object.values(FOOD_CATEGORIES).map(category => (
                      <button
                        key={category}
                        className={`filter-button ${activeFilters.has(category) ? 'active' : ''}`}
                        onClick={() => toggleFilter(category)}
                        data-category={category}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
           
            )}
          </div>

          <div className="tab-content">
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
                        isBatchMode={isBatchMode}
                        isSelected={selectedFoods.has(food.id)}
                        onSelect={() => toggleFoodSelection(food.id)}
                      />
                    ))
                  ) : (
                    <div className="no-foods-message">
                      {recommendedFoods.length > 0 ? 'No foods match the selected filters' : 'Click "Generate Recommendations" to get food suggestions'}
                    </div>
                  )
                ) : filteredFoodsToAvoid.length > 0 ? (
                  filteredFoodsToAvoid.map(food => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isBatchMode={isBatchMode}
                      isSelected={selectedFoods.has(food.id)}
                      onSelect={() => toggleFoodSelection(food.id)}
                    />
                  ))
                ) : (
                  <div className="no-foods-message">
                    {foodsToAvoid.length > 0 ? 'No foods match the selected filters' : 'Click "Generate Recommendations" to get foods to avoid'}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="select-states-message">
          Please select your current and desired states to get recommendations
        </div>
      )}
    </div>
  );
};

export default FoodTabs; 