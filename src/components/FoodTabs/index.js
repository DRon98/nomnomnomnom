import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedFoods, setFoodsToAvoid, setLoading } from '../../store/foodsSlice';
import { generateRecommendations } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';

const FoodTabs = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const dispatch = useDispatch();
  const currentStates = useSelector(state => state.user.currentStates);
  const desiredStates = useSelector(state => state.user.desiredStates);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods) || [];
  const foodsToAvoid = useSelector(state => state.foods.foodsToAvoid) || [];
  const loading = useSelector(state => state.foods.loading);

  const handleGenerateRecommendations = async () => {
    if (currentStates.length === 0 || desiredStates.length === 0) return;

    try {
      dispatch(setLoading(true));
      const { recommended, avoid } = await generateRecommendations(currentStates, desiredStates);
      dispatch(setRecommendedFoods(recommended));
      dispatch(setFoodsToAvoid(avoid));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      // You might want to dispatch an error action here
    } finally {
      dispatch(setLoading(false));
    }
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
          <button
            className="generate-button primary-button"
            onClick={handleGenerateRecommendations}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Recommendations'}
          </button>

          <div className="tab-content">
            {loading ? (
              <div className="loading">Generating recommendations...</div>
            ) : (
              <div className="food-grid">
                {activeTab === 'recommended' ? (
                  recommendedFoods.length > 0 ? (
                    recommendedFoods.map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))
                  ) : (
                    <div className="no-foods-message">
                      Click "Generate Recommendations" to get food suggestions
                    </div>
                  )
                ) : foodsToAvoid.length > 0 ? (
                  foodsToAvoid.map(food => (
                    <FoodCard key={food.id} food={food} />
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
          Please select your current and desired states to get food recommendations
        </div>
      )}
    </div>
  );
};

export default FoodTabs; 