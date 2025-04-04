import React, { useState, useRef, useEffect } from 'react';
import './RecipeBuilder.css';
import { FaFire, FaClock, FaUtensils, FaListUl, FaChartBar, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const HEAT_STATES = {
  OFF: 'off',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const INITIAL_RECIPE = {
  title: 'Homemade Ramen with Chashu Pork',
  maxTime: 180,
  difficulty: 'medium',
  tags: ['Japanese', 'Soup', 'Comfort Food'],
  steps: [
    {
      id: 1,
      name: 'Prepare Chashu Pork',
      description: 'Season and roll pork belly, tie with kitchen twine',
      duration: 20,
      startTime: 0,
      intensity: 'medium',
      parallel: false,
      ingredients: ['2 lbs pork belly', 'salt', 'pepper', 'kitchen twine'],
      prepSteps: [
        'Pat dry pork belly with paper towels',
        'Season generously with salt and pepper',
        'Roll the pork belly tightly',
        'Tie with kitchen twine at 1-inch intervals'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    },
    {
      id: 2,
      name: 'Braise Chashu',
      description: 'Slow cook pork in soy sauce, sake, and mirin mixture',
      duration: 120,
      startTime: 20,
      intensity: 'low',
      parallel: true,
      ingredients: ['1 cup soy sauce', '1 cup sake', '1 cup mirin', '2 cups water', '2 green onions', '6 garlic cloves', '2-inch ginger'],
      prepSteps: [
        'Combine liquids in a pot',
        'Add aromatics (green onions, garlic, ginger)',
        'Bring to a boil, then reduce to simmer',
        'Add pork and cook for 2 hours, turning occasionally'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    },
    {
      id: 3,
      name: 'Prepare Ramen Eggs',
      description: 'Soft boil eggs and marinate in chashu liquid',
      duration: 20,
      startTime: 30,
      intensity: 'medium',
      parallel: true,
      ingredients: ['6 eggs', '1 cup chashu liquid'],
      prepSteps: [
        'Bring water to a boil',
        'Carefully add eggs and cook for 6.5 minutes',
        'Ice bath immediately',
        'Peel and marinate in strained chashu liquid'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    },
    {
      id: 4,
      name: 'Prepare Toppings',
      description: 'Slice green onions, corn, and prepare bamboo shoots',
      duration: 15,
      startTime: 100,
      intensity: 'low',
      parallel: true,
      ingredients: ['4 green onions', '1 cup corn', '1 cup bamboo shoots', 'nori sheets'],
      prepSteps: [
        'Finely slice green onions',
        'Drain and season corn',
        'Drain and rinse bamboo shoots',
        'Cut nori sheets into strips'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    },
    {
      id: 5,
      name: 'Make Ramen Broth',
      description: 'Prepare rich and flavorful ramen broth',
      duration: 40,
      startTime: 140,
      intensity: 'high',
      parallel: false,
      ingredients: ['pork bones', 'chicken wings', 'onion', 'garlic', 'ginger', 'kombu', 'dried shiitake'],
      prepSteps: [
        'Blanch bones for 5 minutes',
        'Add all ingredients to pot',
        'Bring to boil, then simmer',
        'Strain and season broth'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    },
    {
      id: 6,
      name: 'Cook Noodles & Assemble',
      description: 'Cook fresh ramen noodles and assemble bowls',
      duration: 10,
      startTime: 170,
      intensity: 'high',
      parallel: false,
      ingredients: ['fresh ramen noodles', 'prepared toppings', 'sesame oil', 'chili oil'],
      prepSteps: [
        'Cook noodles according to package',
        'Warm serving bowls',
        'Layer: noodles, broth, sliced chashu',
        'Add toppings and oils'
      ],
      heatProfile: [{time: 0, level: HEAT_STATES.HIGH}, {time: 0.2, level: HEAT_STATES.MEDIUM}, {time: 0.8, level: HEAT_STATES.LOW}]
    }
  ]
};

const RecipeBuilder = () => {
  const [recipeTitle, setRecipeTitle] = useState(INITIAL_RECIPE.title);
  const [selectedStep, setSelectedStep] = useState(null);
  const [activeTab, setActiveTab] = useState('full');
  const [steps, setSteps] = useState(INITIAL_RECIPE.steps);
  const [maxTime, setMaxTime] = useState(INITIAL_RECIPE.maxTime);
  const [difficulty, setDifficulty] = useState(INITIAL_RECIPE.difficulty);
  const [tags, setTags] = useState(INITIAL_RECIPE.tags);
  const [newIngredient, setNewIngredient] = useState('');
  const [pantryItems, setPantryItems] = useState([
    'soy sauce', 'mirin', 'sake', 'eggs', 'green onions', 'garlic', 'ginger'
  ]);

  const timelineRef = useRef(null);

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setActiveTab('prep');
  };

  const getStepStyle = (step) => {
    const totalMinutes = Math.max(...steps.map(s => s.startTime + s.duration));
    const heightPercent = (step.duration / totalMinutes) * 100;
    const topPercent = (step.startTime / totalMinutes) * 100;
    
    let left = '20px';
    let width = 'calc(100% - 40px)';
    
    if (step.parallel) {
      width = 'calc(33% - 20px)';
      const parallelSteps = steps.filter(s => 
        s.startTime <= step.startTime + step.duration && 
        s.startTime + s.duration >= step.startTime && 
        s.parallel
      );
      const index = parallelSteps.indexOf(step);
      if (index === 1) {
        left = 'calc(33% + 10px)';
      } else if (index === 2) {
        left = 'calc(66% + 10px)';
      }
    }
    
    return {
      height: `${Math.max(heightPercent, 10)}%`,
      top: `${topPercent}%`,
      left,
      width
    };
  };

  const getHeatLevel = (step, progress) => {
    if (!step.heatProfile) return null;
    
    const profile = step.heatProfile;
    for (let i = profile.length - 1; i >= 0; i--) {
      if (progress >= profile[i].time) {
        return profile[i].level;
      }
    }
    return profile[0].level;
  };

  const renderGridLines = () => {
    const totalMinutes = Math.max(...steps.map(step => step.startTime + step.duration));
    const numLines = Math.ceil(totalMinutes / 30) + 1;
    
    return Array.from({ length: numLines }, (_, i) => (
      <div
        key={`grid-${i}`}
        className="timeline-grid-line"
        style={{ top: `${(i / (numLines - 1)) * 100}%` }}
      />
    ));
  };

  const renderTimeMarkers = () => {
    const totalMinutes = Math.max(...steps.map(step => step.startTime + step.duration));
    const numMarkers = Math.ceil(totalMinutes / 30) + 1;
    
    return Array.from({ length: numMarkers }, (_, i) => (
      <div 
        key={`marker-${i}`}
        className="time-marker"
        style={{ 
          position: 'absolute',
          top: `${(i / (numMarkers - 1)) * 100}%`,
          transform: 'translateY(-50%)'
        }}
      >
        {i * 30}min
      </div>
    ));
  };

  const addToPantry = (ingredient) => {
    if (!pantryItems.includes(ingredient)) {
      setPantryItems([...pantryItems, ingredient]);
    }
  };

  const removeFromPantry = (ingredient) => {
    setPantryItems(pantryItems.filter(item => item !== ingredient));
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      addToPantry(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const renderTimeline = () => {
    return (
      <div className="timeline-container">
        <div className="timeline-header">
          {renderTimeMarkers()}
        </div>
        <div className="timeline-grid" ref={timelineRef}>
          {renderGridLines()}
          {steps.map(step => {
            const progress = step.startTime / (step.startTime + step.duration);
            const heatLevel = getHeatLevel(step, progress);
            
            return (
              <div
                key={step.id}
                className={`timeline-step intensity-${step.intensity} ${step.parallel ? 'parallel' : ''} ${selectedStep?.id === step.id ? 'selected' : ''}`}
                style={getStepStyle(step)}
                onClick={() => handleStepClick(step)}
              >
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-name">{step.name}</span>
                    <span className="step-duration">
                      <FaClock /> {step.duration}min
                    </span>
                  </div>
                  <p className="step-description">{step.description}</p>
                </div>
                {step.intensity === 'high' && (
                  <div className="intensity-indicator">
                    <FaFire />
                  </div>
                )}
                {heatLevel && (
                  <div className={`heat-indicator heat-${heatLevel}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFullRecipe = () => {
    return (
      <div className="full-recipe">
        <div className="ingredients-section">
          <h4>
            <FaUtensils /> Ingredients
          </h4>
          <ul className="ingredients-list">
            {Array.from(new Set(steps.flatMap(step => step.ingredients))).map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <span>{ingredient}</span>
                <button
                  onClick={() => pantryItems.includes(ingredient) ? removeFromPantry(ingredient) : addToPantry(ingredient)}
                  title={pantryItems.includes(ingredient) ? "Remove from pantry" : "Add to pantry"}
                >
                  {pantryItems.includes(ingredient) ? <FaMinus /> : <FaPlus />}
                </button>
              </li>
            ))}
          </ul>
          <form className="add-ingredient" onSubmit={handleAddIngredient}>
            <input
              type="text"
              placeholder="Add ingredient to pantry"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
            />
            <button type="submit">
              <FaPlus /> Add
            </button>
          </form>
        </div>
        <div className="instructions-section">
          <h4>Instructions</h4>
          <ol>
            {steps.map(step => (
              <li key={step.id}>
                <strong>{step.name}</strong> ({step.duration} minutes)
                <p>{step.description}</p>
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
                <li key={index}>
                  {ingredient}
                  {pantryItems.includes(ingredient) && " (in pantry)"}
                </li>
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
    const nutritionData = {
      servingSize: '1 bowl (500g)',
      servingsPerContainer: 1,
      calories: 450,
      totalFat: {value: 15, unit: 'g', dv: 19},
      saturatedFat: {value: 4.5, unit: 'g', dv: 23},
      transFat: {value: 0, unit: 'g'},
      cholesterol: {value: 65, unit: 'mg', dv: 22},
      sodium: {value: 1200, unit: 'mg', dv: 52},
      totalCarbs: {value: 65, unit: 'g', dv: 24},
      dietaryFiber: {value: 8, unit: 'g', dv: 29},
      totalSugars: {value: 6, unit: 'g'},
      addedSugars: {value: 0, unit: 'g', dv: 0},
      protein: {value: 12, unit: 'g'},
      vitaminD: {value: 2, unit: 'mcg', dv: 10},
      calcium: {value: 260, unit: 'mg', dv: 20},
      iron: {value: 4.5, unit: 'mg', dv: 25},
      potassium: {value: 450, unit: 'mg', dv: 10}
    };

    return (
      <div className="nutrition-info">
        <h4>Nutrition Facts</h4>
        <table className="nutrition-table">
          <tbody>
            <tr>
              <td colSpan="2">Serving Size {nutritionData.servingSize}</td>
            </tr>
            <tr className="thick-line">
              <td colSpan="2">Servings Per Container {nutritionData.servingsPerContainer}</td>
            </tr>
            <tr className="thick-line">
              <td colSpan="2">
                <strong>Calories</strong> {nutritionData.calories}
              </td>
            </tr>
            <tr className="thin-line">
              <td colSpan="2" align="right"><strong>% Daily Value*</strong></td>
            </tr>
            {Object.entries(nutritionData).map(([key, value]) => {
              if (typeof value === 'object' && value.dv !== undefined) {
                return (
                  <tr key={key} className="thin-line">
                    <td>
                      <strong>{key.replace(/([A-Z])/g, ' $1').trim()}</strong>
                      {' '}{value.value}{value.unit}
                    </td>
                    <td><strong>{value.dv}%</strong></td>
                  </tr>
                );
              }
              return null;
            })}
            <tr className="medium-line">
              <td colSpan="2" style={{fontSize: '0.9em', paddingTop: '10px'}}>
                * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </td>
            </tr>
          </tbody>
        </table>
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
          <div className="filter-section">
            <h4>Time & Difficulty</h4>
            <div className="time-filter">
              <label>Max Time:</label>
              <input
                type="number"
                value={maxTime}
                onChange={(e) => setMaxTime(parseInt(e.target.value))}
                min="0"
              />
              <span>min</span>
            </div>
            <div className="filter-tags">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  className={`filter-tag ${difficulty === diff ? 'active' : ''}`}
                  onClick={() => setDifficulty(diff)}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>Recipe Tags</h4>
            <div className="filter-tags">
              {tags.map(tag => (
                <button
                  key={tag}
                  className="filter-tag remove"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                >
                  {tag} <FaTrash />
                </button>
              ))}
              <button className="filter-tag">+ Add Tag</button>
            </div>
          </div>
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
        <button className="action-button print">
          Print Recipe
        </button>
        <button className="action-button share">
          Share Recipe
        </button>
        <button className="action-button save">
          Save Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeBuilder; 