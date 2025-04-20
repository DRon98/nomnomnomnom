import React from 'react';
import StateSelector from '../StateSelector';
import { CURRENT_STATES, DESIRED_STATES } from '../../utils/constants';
import './styles.css';

const TabsContainer = () => {
  return (
    <div className="states-container">
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
    </div>
  );
};

export default TabsContainer; 