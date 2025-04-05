import React, { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaClock, FaUtensils, FaSearch, FaSpinner, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
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

const AVAILABLE_CUISINES = ['Japanese', 'Italian', 'Mexican', 'Indian', 'Chinese', 'American', 'Mediterranean'];
const AVAILABLE_TASTES = ['savory', 'sweet', 'spicy', 'umami', 'sour', 'bitter'];
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

const RecipeGenerator = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCuisinesExpanded, setIsCuisinesExpanded] = useState(false);
  const [isTastesExpanded, setIsTastesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  
  // Move useSelector hooks to component level
  const foodPreferences = useSelector(state => state.foodPreferences);
  const kitchenAppliances = useSelector(state => state.kitchenAppliances.selectedAppliances);
 // const surveyData = useSelector(state => state.foodPreferences);
  // Get real inventory state from Redux
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];

  // Filter dummy ingredients based on search query
  const filteredIngredients = DUMMY_INGREDIENTS.filter(item =>
    item.food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const generateRecipes = () => {
    setIsLoading(true);
    
    console.log('Recipe Filters Responses and Ingredients:', {
      recipeFilters: {
        prepTime: { min: 15, max: filters.cookingTime === 'any' ? 90 : parseInt(filters.cookingTime) },
        cookTime: { min: 20, max: filters.cookingTime === 'any' ? 90 : parseInt(filters.cookingTime) },
        difficulty: [filters.skillLevel],
        mealTypes: [filters.mealType],
        tags: [...filters.cuisines, ...filters.tastes]
      },
      ingredients: selectedIngredients.map(item => ({
        name: item.food.name,
        amount: item.amount || 1,
        unit: item.food.unit || 'unit'
      })),
      foodPreferences,
      kitchenAppliances
    });
    
    // Simulate API call
    setTimeout(() => {
      const mockRecipes = [
        {
          recipe_id: '1',
          name: 'Japanese-Style Pork Belly Donburi',
          description: 'A delicious rice bowl topped with tender pork belly, soft-boiled egg, and green onions.',
          stats: {
            calories: 650,
            totalTime: 45,
            servings: 4
          },
          tags: ['Japanese', 'Pork', 'Rice', 'Dinner'],
          link: '/recipe-builder?recipe=1'
        },
        {
          recipe_id: '2',
          name: 'Garlic Soy Pork Stir-Fry',
          description: 'Quick and flavorful stir-fry with pork, garlic, and soy sauce.',
          stats: {
            calories: 580,
            totalTime: 25,
            servings: 4
          },
          tags: ['Asian', 'Pork', 'Quick', 'Dinner'],
          link: '/recipe-builder?recipe=2'
        },
        {
          recipe_id: '3',
          name: 'Pasta alla Carbonara',
          description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
          stats: {
            calories: 680,
            totalTime: 30,
            servings: 4
          },
          tags: ['Italian', 'Pasta', 'Dinner'],
          link: '/recipe-builder?recipe=3'
        },
        {
          recipe_id: '4',
          name: 'Japanese-Style Pork and Egg Rice Bowl',
          description: 'Simple and satisfying rice bowl with pork and soft-boiled egg.',
          stats: {
            calories: 620,
            totalTime: 35,
            servings: 4
          },
          tags: ['Japanese', 'Pork', 'Rice', 'Dinner'],
          link: '/recipe-builder?recipe=4'
        },
        {
          recipe_id: '5',
          name: 'Garlic Ginger Pork Noodles',
          description: 'Stir-fried noodles with pork, garlic, and ginger in a savory sauce.',
          stats: {
            calories: 590,
            totalTime: 40,
            servings: 4
          },
          tags: ['Asian', 'Pork', 'Noodles', 'Dinner'],
          link: '/recipe-builder?recipe=5'
        }
      ];
      
      setRecipes(mockRecipes);
      setIsLoading(false);
    }, 1000);
  };

  const renderIngredientsList = () => (
    <div className="ingredients-list">
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
          {showDropdown && searchQuery && (
            <div className="search-dropdown">
              {filteredIngredients.map(item => (
                <div
                  key={item.foodId}
                  className="dropdown-item"
                  onClick={() => handleIngredientSelect(item)}
                >
                  <span className="ingredient-icon">{item.food.icon}</span>
                  <span className="ingredient-name">{item.food.name}</span>
                </div>
              ))}
              {filteredIngredients.length === 0 && (
                <div className="dropdown-item empty">No ingredients found</div>
              )}
            </div>
          )}
        </div>
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
  );

  return (
    <div className="recipe-generator">
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
      </div>

      <div className="recipes-section">
        {isLoading ? (
          <div className="loading">
            <FaSpinner className="spinner" />
            <p>Generating recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            {renderIngredientsList()}
            <div className="recipe-grid">
              {recipes.map(recipe => (
                <div key={recipe.recipe_id} className="recipe-preview">
                  <h3>{recipe.name}</h3>
                  <p className="description">{recipe.description}</p>
                  <div className="stats">
                    <span>
                      <FaUtensils /> {recipe.stats.calories} cal
                    </span>
                    <span>
                      <FaClock /> {recipe.stats.totalTime} min
                    </span>
                    <span>
                      <FaUsers /> {recipe.stats.servings} servings
                    </span>
                  </div>
                  <div className="tags">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <a href={recipe.link} className="view-recipe">
                    View Recipe
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {renderIngredientsList()}
            <div className="empty-state">
              <FaUtensils />
              <p>Set your filters and click "Generate Recipes" to get started!</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator; 