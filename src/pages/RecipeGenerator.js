import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { FaClock, FaUtensils, FaSearch, FaSpinner, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaPlus, FaShoppingBasket, FaTimes, FaUsers } from 'react-icons/fa';
import { generateRecipePreviewsFromAPI } from '../utils/api';
import RecipeBuilder from '../pages/RecipeBuilder';
import './RecipeGenerator.css';

const DEFAULT_FILTERS = {
  servings: 4,
  maxCalories: 700,
  pantryOnly: false,
  cuisines: [],
  tastes: [],
  cookingTime: 'any',
  mealType: 'dinner',
  skillLevel: 'intermediate'
};

const AVAILABLE_CUISINES = ["Italian", "Chinese", "Mexican", "Indian", "Japanese", "Thai", "French", "Greek", "Spanish", "Korean", "Vietnamese", "Brazilian", "Ethiopian", "Moroccan", "Turkish", "Lebanese", "German", "Russian", "Caribbean", "Peruvian", "Argentinian", "Malaysian", "Indonesian", "Filipino", "Egyptian", "Pakistani", "Bangladeshi", "Nigerian", "South African", "Polish"];
const AVAILABLE_TASTES = ["savory", "sweet", "spicy", "umami", "sour", "bitter", "crunchy", "creamy", "chewy", "crispy", "smooth", "grainy", "aromatic", "earthy", "fragrant", "pungent", "floral", "smoky"]
const COOKING_TIMES = ['any', '15', '30', '45', '60'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];

const DUMMY_INGREDIENTS = [
  { foodId: 'ice-cream', food: { name: 'Ice Cream', icon: '🍨' } },
  { foodId: 'chocolate', food: { name: 'Chocolate', icon: '🍫' } },
  { foodId: 'banana', food: { name: 'Banana', icon: '🍌' } },
  { foodId: 'pizza', food: { name: 'Pizza', icon: '🍕' } },
  { foodId: 'sushi', food: { name: 'Sushi', icon: '🍱' } },
];

const ScrollableIngredientList = ({ items, onSelect, selectedIds, emptyMessage, showRemoveButton }) => {
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const checkOverflow = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const contentWidth = container.scrollWidth;
      
      setContainerWidth(containerWidth);
      setContentWidth(contentWidth);
      setShowLeftArrow(translateX < 0);
      setShowRightArrow(contentWidth > containerWidth + Math.abs(translateX));
    }
  }, [translateX]);

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? 200 : -200;
    const newTranslateX = Math.min(0, Math.max(translateX + scrollAmount, -(contentWidth - containerWidth)));
    setTranslateX(newTranslateX);
  };

  React.useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [items, checkOverflow]);

  React.useEffect(() => {
    checkOverflow();
  }, [translateX, checkOverflow]);

  return (
    <div className="ingredients-scroll">
      {showLeftArrow && (
        <button className="scroll-button left" onClick={() => scroll('left')}>
          <FaChevronLeft />
        </button>
      )}
      <div 
        className="ingredients-scroll-container" 
        ref={containerRef}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {items.map(item => (
          <div 
            key={item.foodId} 
            className={`ingredient-pill ${!showRemoveButton ? 'clickable' : ''} ${selectedIds.includes(item.foodId) ? 'selected' : ''}`}
            onClick={() => !showRemoveButton && onSelect(item)}
          >
            <span className="ingredient-icon">{item.food.icon}</span>
            <span className="ingredient-name">{item.food.name}</span>
            {showRemoveButton && (
              <button
                className="remove-ingredient"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item.foodId);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="empty-message">{emptyMessage}</div>
        )}
      </div>
      {showRightArrow && (
        <button className="scroll-button right" onClick={() => scroll('right')}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

const RecipeGenerator = ({ 
  baseIngredients = [], 
  recipes: passedRecipes = [], 
  onRecipesUpdate,
  onRecipeChosen,
  chosenRecipe
}) => {
  const location = useLocation();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isCuisinesExpanded, setIsCuisinesExpanded] = useState(false);
  const [isTastesExpanded, setIsTastesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [error, setError] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeBuilderData, setRecipeBuilderData] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [activeIngredientsTab, setActiveIngredientsTab] = useState('ingredients');
  
  // Move useSelector hooks to component level
  const foodPreferences = useSelector(state => state.foodPreferences);
  const kitchenAppliances = useSelector(state => state.kitchenAppliances.selectedAppliances);
  const pantryItems = useSelector(state => state.inventory.pantry || []);
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];

  // Handle ingredients from URL query parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const ingredientsParam = params.get('ingredients');
      if (ingredientsParam) {
        const ingredients = decodeURIComponent(ingredientsParam).split(',').filter(Boolean);
        if (ingredients.length > 0) {
          const ingredientObjects = ingredients.map(name => ({
            foodId: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            food: {
              name: name.trim(),
              icon: '🍳',  // Default icon for now
              unit: 'unit'
            }
          }));
          setSelectedIngredients(prevIngredients => {
            // Merge with existing ingredients, avoiding duplicates
            const existingIds = new Set(prevIngredients.map(i => i.foodId));
            const newIngredients = ingredientObjects.filter(i => !existingIds.has(i.foodId));
            return [...prevIngredients, ...newIngredients];
          });
        }
      }
    } catch (err) {
      console.error('Error parsing URL parameters:', err);
      setError('Failed to load ingredients from URL. Please try adding them manually.');
    }
  }, [location.search]);

  // Clear error when ingredients change
  useEffect(() => {
    if (error && selectedIngredients.length > 0) {
      setError(null);
    }
  }, [selectedIngredients, error]);

  // Filter dummy ingredients based on search query
  const filteredIngredients = DUMMY_INGREDIENTS.filter(item =>
    item.food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add effect to populate ingredients when baseIngredients changes
  useEffect(() => {
    if (baseIngredients.length > 0) {
      const ingredientObjects = baseIngredients.map(name => ({
        foodId: name.toLowerCase().replace(/\s+/g, '-'),
        food: {
          name: name,
          unit: 'unit',
          icon: '🥘' // Default icon for all base ingredients
        }
      }));
      setSelectedIngredients(ingredientObjects);
    }
  }, [baseIngredients]);

  const handleIngredientSelect = (ingredient) => {
    // Toggle selection: if already selected, remove it
    if (selectedIngredients.find(item => item.foodId === ingredient.foodId)) {
      handleIngredientRemove(ingredient.foodId);
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleIngredientRemove = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(item => item.foodId !== ingredientId));
  };

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const handleBubbleSelect = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(v => v !== value)
        : [...prev[filterName], value]
    }));
  }, []);

  const generateRecipes = async () => {
    setIsLoading(true);
    
    const recipeData = {
      recipeFilters: {
        prepTime: { min: 15, max: filters.cookingTime === 'any' ? 90 : parseInt(filters.cookingTime) },
        cookTime: { min: 20, max: filters.cookingTime === 'any' ? 90 : parseInt(filters.cookingTime) },
        difficulty: [filters.skillLevel],
        servings: filters.servings,
        maxCalories: filters.maxCalories,
        pantryOnly: filters.pantryOnly,
        mealTypes: [filters.mealType],
        tags: [...filters.cuisines, ...filters.tastes]
      },
      ingredients: selectedIngredients.map(item => ({
        name: item.food.name,
        amount: item.amount || 1,
        unit: item.food.unit || 'unit'
      })),
      foodPreferences,
      kitchenAppliances,
      inventory: {
        pantry: pantryItems.map(item => ({
          foodId: item.foodId,
          name: item.food.name,
          amount: item.amount,
          unit: item.food.unit || 'unit',
          category: item.food.category
        })),
        shoppingList: shoppingListItems.map(item => ({
          foodId: item.foodId,
          name: item.food.name,
          amount: item.amount,
          unit: item.food.unit || 'unit',
          category: item.food.category
        }))
      }
    };

    try {
      const response = await generateRecipePreviewsFromAPI(recipeData);
      console.log('Recipe Previews Response:', response.recommended);
      onRecipesUpdate(response.recommended);
    } catch (error) {
      console.error('Error generating recipes:', error);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getIngredientsInPantryCount = (ingredients) => {
    const inPantryCount = ingredients.reduce((count, ingredient) => {
      const isInPantry = pantryItems.some(item => 
        item.food.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      return isInPantry ? count + 1 : count;
    }, 0);
    return inPantryCount;
  };

  const renderRecipeCard = (recipe) => {
    // Format the recipe data for the API call
    const formattedRecipe = {
      title: recipe.name,
      description: recipe.description,
      stats: {
        totalTime: recipe.stats.totalTime
      },
      difficulty: recipe.difficulty || 'medium',
      tags: recipe.tags || [],
      ingredients: recipe.ingredients || [],
      seasonings: recipe.seasonings || []
    };

    const inPantryCount = getIngredientsInPantryCount(recipe.ingredients);
    const totalIngredients = recipe.ingredients.length;
    const isChosen = chosenRecipe?.recipe_id === recipe.recipe_id;
    const isSelected = selectedPreview?.recipe_id === recipe.recipe_id;

    return (
      <div 
        key={recipe.recipe_id} 
        className={`recipe-card ${isChosen ? 'chosen' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={(e) => {
          // Only set preview if not clicking the View Recipe button
          if (!e.target.closest('.view-recipe-button')) {
            setSelectedPreview(recipe);
            setActiveIngredientsTab('preview');
          }
        }}
      >
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>
        <div className="recipe-stats">
          <div>
            <FaClock /> {recipe.stats.totalTime} min
          </div>
          <div>
            <FaUsers /> {recipe.stats.servings} servings
          </div>
          <div>
            <FaUtensils /> {recipe.stats.calories} cal
          </div>
          <div className="pantry-stat">
            <FaShoppingBasket /> {inPantryCount}/{totalIngredients} ingredients in pantry
          </div>
        </div>
        <div className="recipe-tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <button 
          className="view-recipe-button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecipe(recipe);
            setRecipeBuilderData(formattedRecipe);
            setShowRecipeModal(true);
          }}
        >
          View Recipe
        </button>
      </div>
    );
  };

  const renderRecipePreview = () => {
    if (!selectedPreview) {
      return (
        <div className="empty-preview">
          <FaUtensils />
          <p>Click on a recipe card to view its details</p>
        </div>
      );
    }

    return (
      <div className="recipe-preview-content">
        <div className="preview-header">
          <h2>{selectedPreview.name}</h2>
          <button 
            className={`use-recipe-button ${chosenRecipe?.recipe_id === selectedPreview.recipe_id ? 'chosen' : ''}`}
            onClick={() => onRecipeChosen(selectedPreview)}
          >
            {chosenRecipe?.recipe_id === selectedPreview.recipe_id ? 'Recipe Selected' : 'Use Recipe'}
          </button>
        </div>

        <div className="preview-stats">
          <div><FaClock /> {selectedPreview.stats.totalTime} min</div>
          <div><FaUsers /> {selectedPreview.stats.servings} servings</div>
          <div><FaUtensils /> {selectedPreview.stats.calories} cal</div>
        </div>

        {/* <div className="preview-tags">
          {selectedPreview.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div> */}

        <div className="preview-tables">
          <div className="ingredients-table">
            <h3>Ingredients</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedPreview.ingredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.quantity}</td>
                    <td>{ingredient.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="seasonings-table">
            <h3>Seasonings</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedPreview.seasonings.map((seasoning, index) => (
                  <tr key={index}>
                    <td>{seasoning.name}</td>
                    <td>{seasoning.quantity}</td>
                    <td>{seasoning.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderIngredientsList = () => {
    return (
      <div className="ingredients-list">
        <div className="ingredients-tabs">
          <button
            className={`tab-button ${activeIngredientsTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveIngredientsTab('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`tab-button ${activeIngredientsTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveIngredientsTab('preview')}
          >
            Recipe Preview
          </button>
        </div>

        <div className="ingredients-tab-content">
          {activeIngredientsTab === 'ingredients' ? (
            <>
              <div className="ingredients-section">
                <h3>Pantry Items</h3>
                <ScrollableIngredientList
                  items={pantryItems}
                  onSelect={handleIngredientSelect}
                  selectedIds={selectedIngredients.map(item => item.foodId)}
                  emptyMessage="No items in pantry"
                  showRemoveButton={false}
                />
              </div>
              <div className="ingredients-section">
                <h3>Shopping List</h3>
                <ScrollableIngredientList
                  items={shoppingListItems}
                  onSelect={handleIngredientSelect}
                  selectedIds={selectedIngredients.map(item => item.foodId)}
                  emptyMessage="No items in shopping list"
                  showRemoveButton={false}
                />
              </div>
              <div className="ingredients-section">
                <h3>Add More Ingredients</h3>
                <div className="search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for ingredients..."
                    className="ingredient-search"
                  />
                </div>
                <div className="ingredients-section">
            <h3>Ingredients to Use</h3>
            <ScrollableIngredientList
              items={selectedIngredients}
              onSelect={handleIngredientRemove}
              selectedIds={[]}
              emptyMessage="No ingredients selected"
              showRemoveButton={true}
            />
          </div>
              </div>
            </>
          ) : (
            renderRecipePreview()
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="recipe-generator">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div className="filters-section">
        <h2>
          <FaUtensils /> Recipe Filters
        </h2>

        <button
          className="generate-button"
          onClick={generateRecipes}
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
          Generate Recipes
        </button>
        
        <div className="filter-group">
          <label>Servings</label>
          <input
            type="number"
            min="1"
            max="10"
            value={filters.servings}
            onChange={(e) => handleFilterChange('servings', parseInt(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>Max Calories per Serving</label>
          <input
            type="number"
            min="200"
            max="1500"
            value={filters.maxCalories}
            onChange={(e) => handleFilterChange('maxCalories', parseInt(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={filters.pantryOnly}
              onChange={(e) => handleFilterChange('pantryOnly', e.target.checked)}
            />
            Use Only Pantry Ingredients
          </label>
        </div>

        <div className="filter-group">
          <label>Cooking Time (minutes)</label>
          <select
            value={filters.cookingTime}
            onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
          >
            {COOKING_TIMES.map(time => (
              <option key={time} value={time}>
                {time === 'any' ? 'Any' : `Under ${time} minutes`}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Meal Type</label>
          <select
            value={filters.mealType}
            onChange={(e) => handleFilterChange('mealType', e.target.value)}
          >
            {MEAL_TYPES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Skill Level</label>
          <select
            value={filters.skillLevel}
            onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
          >
            {SKILL_LEVELS.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group collapsible">
          <div 
            className="collapsible-header"
            onClick={() => setIsCuisinesExpanded(!isCuisinesExpanded)}
          >
            <label>Cuisines</label>
            {isCuisinesExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isCuisinesExpanded && (
            <div className="bubble-select">
              {AVAILABLE_CUISINES.map(cuisine => (
                <button
                  key={cuisine}
                  className={`bubble ${filters.cuisines.includes(cuisine) ? 'active' : ''}`}
                  onClick={() => handleBubbleSelect('cuisines', cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="filter-group collapsible">
          <div 
            className="collapsible-header"
            onClick={() => setIsTastesExpanded(!isTastesExpanded)}
          >
            <label>Taste Preferences</label>
            {isTastesExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isTastesExpanded && (
            <div className="bubble-select">
              {AVAILABLE_TASTES.map(taste => (
                <button
                  key={taste}
                  className={`bubble ${filters.tastes.includes(taste) ? 'active' : ''}`}
                  onClick={() => handleBubbleSelect('tastes', taste)}
                >
                  {taste}
                </button>
              ))}
            </div>
          )}
        </div>


      </div>

      <div className="recipes-section">
        {renderIngredientsList()}
        {isLoading ? (
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <p>Generating recipes...</p>
          </div>
        ) : passedRecipes.length > 0 ? (
          <div className="recipe-grid">
            {passedRecipes.map(recipe => renderRecipeCard(recipe))}
          </div>
        ) : (
          <div className="empty-state">
            <FaUtensils />
            <p>Set your filters and click "Generate Recipes" to get started!</p>
          </div>
        )}
      </div>

      {showRecipeModal && (
        <div className="modal-overlay" onClick={() => setShowRecipeModal(false)}>
          <div className="modal-content recipe-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="close-modal"
                onClick={() => setShowRecipeModal(false)}
              >
                <FaTimes />
              </button>
              <div className="modal-actions">
                <button 
                  className={`use-recipe-button ${chosenRecipe?.recipe_id === selectedRecipe?.recipe_id ? 'chosen' : ''}`}
                  onClick={() => onRecipeChosen(selectedRecipe)}
                >
                  {chosenRecipe?.recipe_id === selectedRecipe?.recipe_id ? 'Recipe Selected' : 'Use Recipe'}
                </button>
              </div>
            </div>
            <RecipeBuilder recipeData={recipeBuilderData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;