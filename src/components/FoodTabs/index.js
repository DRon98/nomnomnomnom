import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedFoods, setFoodsToAvoid, setLoading } from '../../store/foodsSlice';
import { generateRecommendations } from '../../utils/foodGenerator';
import FoodCard from '../FoodCard';
import './styles.css';

const FoodTabs = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const dispatch = useDispatch();
  const currentState = useSelector(state => state.user.currentState);
  const desiredState = useSelector(state => state.user.desiredState);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const foodsToAvoid = useSelector(state => state.foods.foodsToAvoid);
  const loading = useSelector(state => state.foods.loading);

  const handleGenerateRecommendations = () => {
    if (!currentState || !desiredState) return;

    dispatch(setLoading(true));
    const { recommended, avoid } = generateRecommendations(currentState, desiredState);
    dispatch(setRecommendedFoods(recommended));
    dispatch(setFoodsToAvoid(avoid));
    dispatch(setLoading(false));
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

      {currentState && desiredState ? (
        <>
          <button
            className="generate-button primary-button"
            onClick={handleGenerateRecommendations}
          >
            Generate Recommendations
          </button>

          <div className="tab-content">
            {loading ? (
              <div className="loading">Generating recommendations...</div>
            ) : (
              <div className="food-grid">
                {activeTab === 'recommended'
                  ? recommendedFoods.map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))
                  : foodsToAvoid.map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))
                }
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