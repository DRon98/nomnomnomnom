import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './BaseSurvey.css';

const BaseSurvey = ({ title, categories, responses, onToggle, onSubmit }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const categoryKeys = Object.keys(categories);
  const currentCategoryKey = categoryKeys[currentCategoryIndex];
  const currentCategory = categories[currentCategoryKey];

  const handleNext = () => {
    if (currentCategoryIndex < categoryKeys.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  // Render progress bubbles
  const renderProgressBubbles = () => {
    return (
      <div className="progress-bubbles">
        {categoryKeys.map((_, index) => (
          <div 
            key={index} 
            className={`progress-bubble ${index === currentCategoryIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="survey-container">
      <h2 className="survey-title">{title}</h2>
      
      {renderProgressBubbles()}
      
      <div className="survey-content">
        <h3 className="category-title">{currentCategory.title}</h3>
        <div className="subcategory-bubbles">
          {Object.entries(currentCategory.subcategories).map(([subKey, description]) => (
            <button
              key={subKey}
              className={`subcategory-bubble ${responses[currentCategoryKey].includes(subKey) ? 'selected' : ''}`}
              onClick={() => onToggle(currentCategoryKey, subKey)}
              title={description}
            >
              {subKey.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
        
        <div className="navigation-container">
          <button 
            className="next-button" 
            onClick={currentCategoryIndex < categoryKeys.length - 1 ? handleNext : onSubmit}
          >
            {currentCategoryIndex < categoryKeys.length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

BaseSurvey.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default BaseSurvey; 