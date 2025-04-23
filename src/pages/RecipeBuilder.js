import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './RecipeBuilder.css';
import { FaFire, FaClock, FaUtensils, FaListUl, FaChartBar, FaPlus, FaMinus, FaTrash, FaInfoCircle, FaSpinner, FaStar, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { generateRecipeBuilderFromAPI } from '../utils/api';
import { addToGroceries } from '../store/inventorySlice';

const RecipeBuilder = ({ recipeData }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [activeTab, setActiveTab] = useState('full');
  const [steps, setSteps] = useState([]);
  const [maxTime, setMaxTime] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState([]);
  const [highlightedIngredients, setHighlightedIngredients] = useState([]);
  const [activeTasteAdjustment, setActiveTasteAdjustment] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const location = useLocation();

  const timelineRef = useRef(null);
  const dispatch = useDispatch();
  const pantryItems = useSelector(state => state.inventory.pantry || []);
  const groceryItems = useSelector(state => state.inventory.groceries || []);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!recipeData) {
          throw new Error('No recipe data provided');
        }

        // If we already have the API response for this recipe, use it
        if (apiResponse) {
          updateRecipeState(apiResponse);
          setLoading(false);
          return;
        }

        // Otherwise, make the API call
        const response = await generateRecipeBuilderFromAPI(recipeData);
        setApiResponse(response); // Cache the response
        updateRecipeState(response);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [recipeData]);

  const updateRecipeState = (recipeData) => {
    setRecipe(recipeData);
    setSteps(recipeData.steps);
    setMaxTime(recipeData.maxTime);
    setDifficulty(recipeData.difficulty);
    setTags(recipeData.tags);
    setIngredients(recipeData.fullIngredients);
  };

  if (loading) {
    return (
      <div className="recipe-builder-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-builder-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setActiveTab('prep');
  };

  const getStepStyle = (step) => {
    // For parallel steps, we don't need to calculate anything - CSS grid will handle it
    // We only need to ensure non-parallel steps span all columns, which is handled by CSS
    return {};
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

  const handleTasteClick = (tasteAdjustment) => {
    setActiveTasteAdjustment(activeTasteAdjustment?.type === tasteAdjustment.type ? null : tasteAdjustment);
  };

  const renderTimeline = () => {
    // Group steps by their start time to maintain order
    const stepGroups = steps.reduce((groups, step) => {
      const startTime = step.startTime;
      if (!groups[startTime]) {
        groups[startTime] = [];
      }
      groups[startTime].push(step);
      return groups;
    }, {});

    // Sort by start time and flatten
    const sortedSteps = Object.entries(stepGroups)
      .sort(([timeA], [timeB]) => Number(timeA) - Number(timeB))
      .flatMap(([_, stepsAtTime]) => stepsAtTime);

    return (
      <div className="timeline-container">
        <div className="timeline-header">
          <div>Prep Steps</div>
          <div>Cook Steps</div>
          <div>Finish Steps</div>
        </div>
        <div className="timeline-grid" ref={timelineRef}>
          {sortedSteps.map(step => (
            <div
              key={step.id}
              className={`timeline-step ${step.parallel ? 'parallel' : ''} intensity-${step.intensity} ${selectedStep?.id === step.id ? 'selected' : ''}`}
              onClick={() => handleStepClick(step)}
            >
              <div className="step-content">
                <div className="step-header">
                  <span className="step-name">{step.name}</span>
                  <div className="step-meta">
                    <div className="info-tooltip">
                      <FaInfoCircle className="info-icon" />
                      <span className="tooltip-text">{step.description}</span>
                    </div>
                    <span className="step-duration">
                      <FaClock /> {step.duration}min
                    </span>
                  </div>
                </div>
                <div className="step-description">{step.description}</div>
              </div>
              {step.intensity === 'high' && (
                <div className="intensity-indicator">
                  <FaFire />
                </div>
              )}
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
          <div className="ingredients-header">
            <h4>
              <FaUtensils /> Ingredients
            </h4>
          </div>
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <div className="ingredient-info">
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-amount">{ingredient.quantity} {ingredient.unit}</span>
                  {isIngredientInPantry(ingredient) && (
                    <div className="pantry-indicator" title="In Pantry">
                      <FaCheck className="pantry-check" />
                    </div>
                  )}
                  {!isIngredientInPantry(ingredient) && isIngredientInGroceries(ingredient) && (
                    <div className="shopping-list-indicator" title="In Shopping List">
                      <FaShoppingCart className="shopping-cart-icon" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        
        </div>
        <div className="instructions-section">
          <h4>Instructions</h4>
          <ol>
            {steps.map(step => (
              <li key={step.id}>
                <strong>{step.name}</strong> ({step.duration} minutes)
  
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
        <div className="prep-header">
          <h4>{selectedStep.name}</h4>
          <div className="info-tooltip">
            <FaInfoCircle className="info-icon" />
            <span className="tooltip-text">{selectedStep.description}</span>
          </div>
        </div>
        <div className="prep-details">
          <div className="prep-section">
            <h5>Ingredients Needed</h5>
            <ul>
              {selectedStep.ingredients.map((ingredient, index) => (
                <li key={index} className={`${highlightedIngredients.includes(ingredient.ingredientname) ? 'highlighted' : ''}`}>
                  <div className="ingredient-info">
                
                    <span className="ingredient-name">{ingredient.ingredientname}</span>
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
          
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
      calories: { value: 450, unit: "kcal" },
      macronutrients: [
        { name: "totalFat", value: 15, unit: "g", dailyValue: 19 },
        { name: "saturatedFat", value: 4.5, unit: "g", dailyValue: 23 },
        { name: "transFat", value: 0, unit: "g" },
        { name: "cholesterol", value: 65, unit: "mg", dailyValue: 22 },
        { name: "sodium", value: 1200, unit: "mg", dailyValue: 52 },
        { name: "totalCarbs", value: 65, unit: "g", dailyValue: 24 },
        { name: "dietaryFiber", value: 8, unit: "g", dailyValue: 29 },
        { name: "totalSugars", value: 6, unit: "g" },
        { name: "addedSugars", value: 0, unit: "g", dailyValue: 0 },
        { name: "protein", value: 12, unit: "g" }
      ],
      micronutrients: [
        { name: "vitaminD", value: 2, unit: "mcg", dailyValue: 10 },
        { name: "calcium", value: 260, unit: "mg", dailyValue: 20 },
        { name: "iron", value: 4.5, unit: "mg", dailyValue: 25 },
        { name: "potassium", value: 450, unit: "mg", dailyValue: 10 }
      ]
    };

    const formatNutrientName = (name) => {
      return name.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
      <div className="nutrition-info">
        <h4>Nutrition Facts</h4>
        <table className="nutrition-table">
          <tbody>
            <tr>
              <td colSpan="2">Serving Size 1 bowl (500g)</td>
            </tr>
            <tr className="thick-line">
              <td colSpan="2">Servings Per Container 1</td>
            </tr>
            <tr className="thick-line">
              <td colSpan="2">
                <strong>Calories</strong> {nutritionData.calories.value}{nutritionData.calories.unit}
              </td>
            </tr>
            <tr className="thin-line">
              <td colSpan="2" align="right"><strong>% Daily Value*</strong></td>
            </tr>
            
            {/* Macronutrients */}
            {nutritionData.macronutrients.map((nutrient, index) => (
              <tr key={index} className="thin-line">
                <td>
                  <strong>{formatNutrientName(nutrient.name)}</strong>
                  {' '}{nutrient.value}{nutrient.unit}
                </td>
                <td>
                  {nutrient.dailyValue !== undefined && <strong>{nutrient.dailyValue}%</strong>}
                </td>
              </tr>
            ))}
            
            {/* Micronutrients */}
            {nutritionData.micronutrients.map((nutrient, index) => (
              <tr key={`micro-${index}`} className="thin-line">
                <td>
                  <strong>{formatNutrientName(nutrient.name)}</strong>
                  {' '}{nutrient.value}{nutrient.unit}
                </td>
                <td>
                  {nutrient.dailyValue !== undefined && <strong>{nutrient.dailyValue}%</strong>}
                </td>
              </tr>
            ))}
            
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

  const renderRecipeStats = () => (
    <div className="recipe-stats">
      <div className="recipe-stats-content">
        <div className="recipe-stats-row">
          <div>
            <FaClock />
            <span>{recipe.maxTime} min</span>
          </div>
          <div>
            <FaUtensils />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
        <div className="recipe-tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

    </div>
  );

  const renderTasteAdjustments = () => {
    if (!recipe?.tasteAdjustments?.length) return null;

    return (
      <div className="taste-adjustments">
        <h4>Taste Adjustments</h4>
        <div className="taste-tags">
          {recipe.tasteAdjustments.map(adjustment => (
            <span
              
              key={adjustment.type}
              className={`taste-tag ${activeTasteAdjustment?.type === adjustment.type ? 'active' : ''}`}
              onClick={() => handleTasteClick(adjustment)}
            >
              {adjustment.type}
            </span>
          ))}
        </div>
        {activeTasteAdjustment && (
          <div className="taste-adjustment-details">
            <h5>Adjustment Method</h5>
            <p className="adjustment-method">{activeTasteAdjustment.method}</p>
            <h5>Ingredients to Adjust</h5>
            <div className="highlighted-ingredients">
              {activeTasteAdjustment.ingredients.map((ingredient, index) => (
                <span key={index} className="highlighted-ingredient">
                  <span className="ingredient-name">{ingredient}</span>
                  <span className="ingredient-amount">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isIngredientInPantry = (ingredient) => {
    return pantryItems.some(item => 
      item.food.name.toLowerCase() === ingredient.name.toLowerCase()
    );
  };

  const isIngredientInGroceries = (ingredient) => {
    return groceryItems.some(item => 
      item.food.name.toLowerCase() === ingredient.name.toLowerCase()
    );
  };

  const handleAddToShoppingList = () => {
    const missingIngredients = ingredients.filter(ingredient => !isIngredientInPantry(ingredient));
    
    missingIngredients.forEach(ingredient => {
      if (!isIngredientInGroceries(ingredient)) {
        dispatch(addToGroceries({
          food: {
            id: `${ingredient.name.toLowerCase().replace(/\s+/g, '_')}`,
            name: ingredient.name,
            category: ingredient.category || 'other',
            unit: ingredient.unit
          },
          amount: ingredient.quantity
        }));
      }
    });
  };

  return (
    <div className="recipe-builder-container">
      <div className="recipe-header">
        <input
          type="text"
          className="recipe-title-input"
          placeholder="Enter Recipe Title"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
        {renderRecipeStats()}
        {renderTasteAdjustments()}
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


    </div>
  );
};

export default RecipeBuilder; 