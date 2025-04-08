import React, { useState } from 'react';
import StateSelector from '../StateSelector';
import CookingGroceryScheduler from '../CookingGroceryScheduler';
import { CURRENT_STATES, DESIRED_STATES } from '../../utils/constants';
import './styles.css';

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState('states');

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'states' ? 'active' : ''}`}
          onClick={() => setActiveTab('states')}
        >
          States & Preferences
        </button>
        <button
          className={`tab-button ${activeTab === 'cooking' ? 'active' : ''}`}
          onClick={() => setActiveTab('cooking')}
        >
          Cooking & Groceries
        </button>
      </div>
      <div className="tabs-content">
        {activeTab === 'states' ? (
          <div className="states-section">
            <StateSelector 
              title="How are you feeling?" 
              type="current"
              options={CURRENT_STATES}
              question="How are you feeling?"
            />
            <StateSelector 
              title="How do you want to feel?" 
              type="desired"
              options={DESIRED_STATES}
              question="How do you want to feel?"
            />
          </div>
        ) : (
          <CookingGroceryScheduler />
        )}
      </div>
    </div>
  );
};

export default TabsContainer; 