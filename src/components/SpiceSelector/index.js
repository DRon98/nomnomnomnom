import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import './styles.css';

const SpiceSelector = ({ 
  categories,
  onComplete,
  onBack,
  title = "Select Items",
  completeButtonText = "Complete Selection"
}) => {
  const [activeTab, setActiveTab] = useState(Object.keys(categories)[0]);
  const [selections, setSelections] = useState(
    Object.keys(categories).reduce((acc, category) => {
      acc[category] = new Set();
      return acc;
    }, {})
  );

  const handleSelect = (item) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const categorySet = new Set(prev[activeTab]);
      
      if (categorySet.has(item)) {
        categorySet.delete(item);
      } else {
        categorySet.add(item);
      }
      
      newSelections[activeTab] = categorySet;
      return newSelections;
    });
  };

  const handleSelectAll = () => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const currentItems = categories[activeTab].items;
      
      if (prev[activeTab].size === currentItems.length) {
        newSelections[activeTab] = new Set();
      } else {
        newSelections[activeTab] = new Set(currentItems);
      }
      
      return newSelections;
    });
  };

  const getTotalSelectedCount = () => {
    return Object.values(selections).reduce((total, set) => total + set.size, 0);
  };

  return (
    <div className="spice-selector">
      <div className="header-section">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <FaCheck /> Back
          </button>
        )}
        <h1>{title}</h1>
        <div className="selected-count">
          {getTotalSelectedCount()} items selected
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {Object.keys(categories).map(category => (
            <button
              key={category}
              className={`tab-button ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {categories[category].title}
              {selections[category].size > 0 && (
                <span className="selection-badge">
                  {selections[category].size}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <div className="tab-header">
            <h2>{categories[activeTab].title}</h2>
            <button className="select-all-btn" onClick={handleSelectAll}>
              {selections[activeTab].size === categories[activeTab].items.length 
                ? 'Deselect All' 
                : 'Select All'}
            </button>
          </div>

          <div className="options-grid">
            {categories[activeTab].items.map(item => (
              <button
                key={item}
                className={`option-bubble ${selections[activeTab].has(item) ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
              >vvvdf
                {item}
                {selections[activeTab].has(item) && <FaCheck className="check-icon" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-actions">
        <button 
          className="complete-button"
          onClick={() => onComplete(selections)}
          disabled={getTotalSelectedCount() === 0}
        >
          {completeButtonText} ({getTotalSelectedCount()})
        </button>
      </div>
    </div>
  );
};

export default SpiceSelector; 