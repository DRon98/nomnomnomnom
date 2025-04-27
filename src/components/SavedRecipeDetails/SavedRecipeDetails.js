import React from 'react';
import { FaClock, FaUsers, FaUtensils } from 'react-icons/fa';
import RecipeModal from '../RecipeModal/RecipeModal';
import './SavedRecipeDetails.css';

const SavedRecipeDetails = ({
  activeRecipe,
  servingsCount,
  setServingsCount,
  selectedMealType,
  setSelectedMealType,
  isModalOpen,
  setIsModalOpen,
  handleUseRecipe,
  handleRecipeChosen,
  chosenRecipes,
  activeTabIndex
}) => {
  if (!activeRecipe) return null;

  return (
    <div className="saved-recipe-details">
      <div className="saved-recipe-header">
        <h2>{activeRecipe.name}</h2>
        <p className="description">{activeRecipe.description}</p>
      </div>

      <div className="saved-recipe-stats">
        <div className="stat-item">
          <FaClock /> {activeRecipe.stats.totalTime} min
        </div>
        <div className="stat-item">
          <FaUsers /> {servingsCount} servings
        </div>
        <div className="stat-item">
          <FaUtensils /> {Math.round(activeRecipe.stats.calories)} cal/serving
        </div>
      </div>

      <div className="saved-recipe-controls">
        <div className="control-group">
          <label>Servings:</label>
          <input
            type="number"
            min="1"
            value={servingsCount}
            onChange={(e) => setServingsCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="control-group">
          <label>Meal Type:</label>
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Main(Lunch/Dinner)">Main (Lunch/Dinner)</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>
      </div>

      <div className="saved-recipe-ingredients">
        <h3>Ingredients</h3>
        <ul>
          {activeRecipe.recipeBuilderData.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="saved-recipe-actions">
        <button 
          className="view-recipe-button"
          onClick={() => setIsModalOpen(true)}
        >
          View Recipe
        </button>
        <button 
          className="use-recipe-button"
          onClick={handleUseRecipe}
        >
          Use Recipe
        </button>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRecipe={activeRecipe}
        chosenRecipe={chosenRecipes[activeTabIndex]}
        onRecipeChosen={handleRecipeChosen}
        recipeBuilderData={{
          title: activeRecipe.name,
          description: activeRecipe.description,
          stats: activeRecipe.stats,
          difficulty: activeRecipe.difficulty || 'medium',
          tags: activeRecipe.tags || [],
          ingredients: activeRecipe.ingredients || [],
          seasonings: activeRecipe.seasonings || []
        }}
        mealType={selectedMealType}
      />
    </div>
  );
};

export default SavedRecipeDetails; 