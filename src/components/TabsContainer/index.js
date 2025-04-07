import React, { useState } from 'react';
import './styles.css';

const TabsContainer = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          State Selection
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Meal History
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 0 ? (
          <div className="state-selectors">
            {children}
          </div>
        ) : (
          <div className="meal-history">
            <p className="placeholder-text">Meal history coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsContainer; 