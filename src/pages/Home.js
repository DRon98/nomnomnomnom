import React from 'react';
import { useSelector } from 'react-redux';
import StateSelector from '../components/StateSelector';
import FoodTabs from '../components/FoodTabs';
import RecommendationPriorities from '../components/RecommendationPriorities';
import { CURRENT_STATES, DESIRED_STATES } from '../utils/constants';
import './Home.css';

function Home() {
  const dietaryRestrictions = useSelector(state => state.user.dietaryRestrictions);

  return (
    <div className="app-content">
      <div className="day-view">
        <div className="states-container">
          <StateSelector
            type="current"
            options={CURRENT_STATES}
            question="How do you feel?"
          />
          <StateSelector
            type="desired"
            options={DESIRED_STATES}
            question="How do you want to feel?"
          />
        </div>
        <div className="dietary-restrictions">
          <RecommendationPriorities />
        </div>
        <div className="tabs-container">
          <FoodTabs view="day" />
        </div>
      </div>
    </div>
  );
}

export default Home;