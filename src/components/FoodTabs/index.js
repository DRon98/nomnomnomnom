import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedFoods, setFoodsToAvoid, setLoading } from '../../store/foodsSlice';
import { addToGroceries } from '../../store/inventorySlice';
import { generateRecommendations } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';

const FoodTabs = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState(new Set());
  const [statusFilters, setStatusFilters] = useState(new Set(['all']));
  const dispatch = useDispatch();
  const currentStates = useSelector(state => state.user.currentStates);
  const desiredStates = useSelector(state => state.user.desiredStates);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods) || [];
  const foodsToAvoid = useSelector(state => state.foods.foodsToAvoid) || [];
  const loading = useSelector(state => state.foods.loading);
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const groceryItems = useSelector(state => state.inventory.groceries) || [];

  const toggleStatusFilter = (filter) => {
    setStatusFilters(prev => {
      const newSet = new Set(prev);
      if (filter === 'all') {
        return new Set(['all']);
      }
      if (newSet.has(filter)) {
        newSet.delete(filter);
        if (newSet.size === 0) {
          newSet.add('all');
        }
      } else {
        newSet.delete('all');
        newSet.add(filter);
      }
      return newSet;
    });
  };

  const getFoodStatus = (food) => {
    const inPantry = pantryItems.some(item => item.foodId === food.id);
    const inGrocery = groceryItems.some(item => item.foodId === food.id);
    
    if (inPantry) return 'pantry';
    if (inGrocery) return 'shopping';
    return 'need';
  };

  const filteredFoods = (activeTab === 'recommended' ? recommendedFoods : foodsToAvoid).filter(food => {
    if (statusFilters.has('all')) return true;
    const status = getFoodStatus(food);
    return statusFilters.has(status);
  });

  const handleGenerateRecommendations = async () => {
    if (currentStates.length === 0 || desiredStates.length === 0) return;

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
          <div className="action-buttons">
            <button
              className="generate-button primary-button"
              onClick={handleGenerateRecommendations}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Recommendations'}
            </button>
            
            <div className="filter-batch-container">
              <div className="status-filters">
                <button
                  className={`filter-button ${statusFilters.has('all') ? 'active' : ''}`}
                  onClick={() => toggleStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-button ${statusFilters.has('pantry') ? 'active' : ''}`}
                  onClick={() => toggleStatusFilter('pantry')}
                >
                  In Pantry
                </button>
                <button
                  className={`filter-button ${statusFilters.has('shopping') ? 'active' : ''}`}
                  onClick={() => toggleStatusFilter('shopping')}
                >
                  In Shopping List
                </button>
                <button
                  className={`filter-button ${statusFilters.has('need') ? 'active' : ''}`}
                  onClick={() => toggleStatusFilter('need')}
                >
                  Need to Purchase
                </button>
              </div>

              {filteredFoods.length > 0 && (
                <button
                  className={`batch-select-button ${isBatchMode ? 'active' : ''}`}
                  onClick={() => {
                    if (isBatchMode) {
                      setSelectedFoods(new Set());
                    } else {
                      setSelectedFoods(new Set(filteredFoods.map(food => food.id)));
                    }
                    setIsBatchMode(!isBatchMode);
                  }}
                >
                  <span className="icon">📋</span>
                  {isBatchMode ? 'Cancel' : 'Batch Add'}
                </button>
              )}
            </div>

            {isBatchMode && selectedFoods.size > 0 && (
              <button
                className="confirm-batch-button"
                onClick={handleBatchAdd}
              >
                Add {selectedFoods.size} items to Shopping List
              </button>
            )}
          </div>

          <div className="tab-content">
            {loading ? (
              <div className="loading">Generating recommendations...</div>
            ) : (
              <div className="food-grid">
                {activeTab === 'recommended' ? (
                  filteredFoods.length > 0 ? (
                    filteredFoods.map(food => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        isBatchMode={isBatchMode}
                        isSelected={selectedFoods.has(food.id)}
                        onSelect={() => toggleFoodSelection(food.id)}
                        status={getFoodStatus(food)}
                      />
                    ))
                  ) : (
                    <div className="no-foods-message">
                      Click "Generate Recommendations" to get food suggestions
                    </div>
                  )
                ) : filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isBatchMode={isBatchMode}
                      isSelected={selectedFoods.has(food.id)}
                      onSelect={() => toggleFoodSelection(food.id)}
                      status={getFoodStatus(food)}
                    />
                  ))
                ) : (
                  <div className="no-foods-message">
                    Click "Generate Recommendations" to get foods to avoid
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