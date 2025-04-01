import React, { useState, useRef, useEffect } from 'react';
import './RecipeBuilder.css';
import { FaFire, FaClock, FaUtensils, FaListUl, FaChartBar } from 'react-icons/fa';

const RecipeBuilder = () => {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);
  const [activeTab, setActiveTab] = useState('full');
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: 'Prep Vegetables',
      duration: 15,
      startTime: 0,
      intensity: 'low',
      parallel: false,
      ingredients: ['carrots', 'celery', 'onions'],
      prepSteps: [
        'Wash all vegetables thoroughly',
        'Dice onions into small cubes',
        'Cut carrots and celery into uniform pieces'
      ]
    },
    {
      id: 2,
      name: 'Sauté Vegetables',
      duration: 10,
      startTime: 15,
      intensity: 'medium',
      parallel: false,
      ingredients: ['olive oil'],
      prepSteps: [
        'Heat oil in pan over medium heat',
        'Add vegetables and stir occasionally',
        'Cook until onions are translucent'
      ]
    }
  ]);

  const timelineRef = useRef(null);

  useEffect(() => {
    if (timelineRef.current) {
      const gridLines = Array.from({ length: 12 }, (_, i) => {
        const line = document.createElement('div');
        line.className = 'timeline-grid-line';
        line.style.left = `${(i + 1) * (100 / 12)}%`;
        return line;
      });
      
      timelineRef.current.append(...gridLines);
    }
  }, []);

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setActiveTab('prep');
  };

  const getStepStyle = (step) => {
    const width = (step.duration / 60) * 100;
    const left = (step.startTime / 60) * 100;
    
    return {
      width: `${width}%`,
      left: `${left}%`,
      top: step.parallel ? '50%' : '20%'
    };
  };

  const renderTimeMarkers = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div key={i} className="time-marker">
        {i * 5}min
      </div>
    ));
  };

  const renderTimeline = () => {
    return (
      <div className="timeline-container">
        <div className="timeline-header">
          {renderTimeMarkers()}
        </div>
        <div className="timeline-grid" ref={timelineRef}>
          {steps.map(step => (
            <div
              key={step.id}
              className={`timeline-step intensity-${step.intensity} ${selectedStep?.id === step.id ? 'selected' : ''}`}
              style={getStepStyle(step)}
              onClick={() => handleStepClick(step)}
            >
              <div className="step-content">
                <span className="step-name">{step.name}</span>
                <span className="step-duration">
                  <FaClock /> {step.duration}min
                </span>
              </div>
              <div className="intensity-indicator">
                {step.intensity === 'high' && <FaFire />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFullRecipe = () => {
    return (
      <div className="full-recipe">
        <div className="ingredients-section">
          <h4>Ingredients</h4>
          <ul>
            {Array.from(new Set(steps.flatMap(step => step.ingredients))).map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="instructions-section">
          <h4>Instructions</h4>
          <ol>
            {steps.map(step => (
              <li key={step.id}>
                {step.name} ({step.duration} minutes)
                <ul>
                  {step.prepSteps.map((prepStep, index) => (
                    <li key={index}>{prepStep}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  };

  const renderPrepSteps = () => {
    if (!selectedStep) {
      return (
        <div className="prep-steps">
          <h4>Select a step to view preparation details</h4>
        </div>
      );
    }

    return (
      <div className="prep-steps">
        <h4>{selectedStep.name} Preparation</h4>
        <div className="prep-details">
          <div className="prep-section">
            <h5>Ingredients Needed</h5>
            <ul>
              {selectedStep.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="prep-section">
            <h5>Step-by-Step Instructions</h5>
            <ul>
              {selectedStep.prepSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderNutritionInfo = () => {
    // Placeholder nutrition data
    const nutritionData = {
      calories: 450,
      protein: 12,
      carbs: 65,
      fat: 15,
      fiber: 8,
      sugar: 6
    };

    return (
      <div className="nutrition-info">
        <h4>Nutritional Information</h4>
        <div className="nutrition-grid">
          {Object.entries(nutritionData).map(([key, value]) => (
            <div key={key} className="nutrition-item">
              <span className="nutrient-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="nutrient-value">{value}{key === 'calories' ? '' : 'g'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="recipe-builder-container">
      <div className="recipe-header">
        <input
          type="text"
          className="recipe-title-input"
          placeholder="Enter Recipe Title"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
        />
        <div className="recipe-filters">
          <button className="filter-tag">Vegetarian</button>
          <button className="filter-tag">Quick & Easy</button>
          <button className="filter-tag">+ Add Tag</button>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-timeline">
          <h3>Recipe Timeline</h3>
          {renderTimeline()}
        </div>

        <div className="recipe-details">
          <div className="recipe-tabs">
            <button
              className={`tab-button ${activeTab === 'full' ? 'active' : ''}`}
              onClick={() => setActiveTab('full')}
            >
              <FaUtensils /> Full Recipe
            </button>
            <button
              className={`tab-button ${activeTab === 'prep' ? 'active' : ''}`}
              onClick={() => setActiveTab('prep')}
            >
              <FaListUl /> Prep Steps
            </button>
            <button
              className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition')}
            >
              <FaChartBar /> Nutrition
            </button>
          </div>

          <div className="recipe-tab-content">
            {activeTab === 'full' && renderFullRecipe()}
            {activeTab === 'prep' && renderPrepSteps()}
            {activeTab === 'nutrition' && renderNutritionInfo()}
          </div>
        </div>
      </div>

      <div className="recipe-actions">
        <button className="action-button print">Print Recipe</button>
        <button className="action-button share">Share Recipe</button>
        <button className="action-button save">Save Recipe</button>
      </div>
    </div>
  );
};

export default RecipeBuilder; 