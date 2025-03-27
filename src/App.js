import React from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import StateSelector from './components/StateSelector';
import FoodTabs from './components/FoodTabs';
import MealPlanner from './components/MealPlanner';
import { CURRENT_STATES, DESIRED_STATES } from './utils/constants';
import './App.css';

function App() {
  const currentState = useSelector(state => state.user.currentState);
  const desiredState = useSelector(state => state.user.desiredState);
  const dietaryRestrictions = useSelector(state => state.user.dietaryRestrictions);

  return (
    <div className="container">
      <Header />
      <div className="app-content">
        <div className="left-section">
          <StateSelector
            type="current"
            options={CURRENT_STATES}
            question="How do you feel today?"
          />
          <StateSelector
            type="desired"
            options={DESIRED_STATES}
            question="How do you want to feel today?"
          />
          <div className="dietary-restrictions">
            Dietary restrictions applied: {
              Object.entries(dietaryRestrictions)
                .filter(([_, value]) => value)
                .map(([key]) => key)
                .join(', ')
            }
            {' '}
            (Edit in Profile)
          </div>
          <FoodTabs />
        </div>
        <div className="right-section">
          <MealPlanner />
        </div>
      </div>
    </div>
  );
}

export default App; 