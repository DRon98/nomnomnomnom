import React from 'react';
import { useSelector } from 'react-redux';
import StateSelector from '../components/StateSelector';
import FoodTabs from '../components/FoodTabs';
import MealPlanner from '../components/MealPlanner';
import TabsContainer from '../components/TabsContainer';
import './Home.css';
import { CURRENT_STATES, DESIRED_STATES } from '../utils/constants';

function Home() {
  const dietaryRestrictions = useSelector(state => state.user.dietaryRestrictions);
  
  return (
    <div className="app-content">
      <div className="day-view">
        <div className="left-section">
          <TabsContainer>
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
          </TabsContainer>
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
    </div>
  );
}

export default Home;