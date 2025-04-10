import React from 'react';
import { useSelector } from 'react-redux';
import StateSelector from '../components/StateSelector';
import FoodTabs from '../components/FoodTabs';
import MealPlanner from '../components/MealPlanner';
import WeekPlanner from '../components/WeekPlanner';
import WeekMealPlanner from '../components/WeekMealPlanner';
import ViewToggle from '../components/ViewToggle';
import { CURRENT_STATES, DESIRED_STATES } from '../utils/constants';
import './Home.css';

function Home() {
  const dietaryRestrictions = useSelector(state => state.user.dietaryRestrictions);
  const activeView = useSelector(state => state.user.activeView);
  
  return (
    <div className="app-content">
      <ViewToggle />
      
      {activeView === 'day' ? (
        // Day View
        <div className="day-view">
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
            <FoodTabs view="day" />
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
          </div>
          <div className="right-section">
            <MealPlanner />
          </div>
        </div>
      ) : (
        // Week View
        <div className="week-view">
          <div className="left-section">
            <WeekPlanner />
            <FoodTabs view="week" />
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
          </div>
          <div className="right-section">
            <WeekMealPlanner />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;