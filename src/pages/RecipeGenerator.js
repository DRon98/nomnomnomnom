import React, { useState } from 'react';
import { FaClock, FaUtensils, FaSearch, FaSpinner } from 'react-icons/fa';
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

const RecipeGenerator = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleBubbleSelect = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(v => v !== value)
        : [...prev[filterName], value]
    }));
  };

  const generateRecipes = () => {
    setIsLoading(true);
    
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

  return (
    <div className="recipe-generator">
      <div className="filters-section">
        <h2>
          <FaUtensils /> Recipe Filters
        </h2>
        
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
          <label>Cuisines</label>
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
        </div>

        <div className="filter-group">
          <label>Taste Preferences</label>
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

        <button
          className="generate-button"
          onClick={generateRecipes}
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
          Generate Recipes
        </button>
      </div>

      <div className="recipes-section">
        {isLoading ? (
          <div className="loading">
            <FaSpinner className="spinner" />
            <p>Generating recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
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
        ) : (
          <div className="empty-state">
            <FaUtensils />
            <p>Set your filters and click "Generate Recipes" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator; 