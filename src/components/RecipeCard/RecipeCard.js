import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FaClock, FaUsers, FaUtensils, FaShoppingBasket,FaBookmark, FaStar } from 'react-icons/fa';
import { toggleFavorite } from '../../store/favoritesSlice';
import RecipeModal from '../RecipeModal/RecipeModal';
import './RecipeCard.css';

const RecipeCard = ({
  recipe,
  isChosen,
  isSelected,
  isFavorite,
  onSelect,
  onViewRecipe,
  inPantryCount,
  totalIngredients,
  chosenRecipe,
  onRecipeChosen,
  mealType,
  renderRecipePreview,
  handleUseRecipe
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the recipe data for the API call – memoized to avoid recalculation on every render
  const formattedRecipe = useMemo(() => ({
    title: recipe.name,
    description: recipe.description,
    stats: {
      totalTime: recipe.stats.totalTime,
      calories: recipe.stats.calories,
      servings: recipe.stats.servings
    },
    difficulty: recipe.difficulty || 'medium',
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || [],
    seasonings: recipe.seasonings || []
  }), [recipe]);
  
  const handleViewRecipe = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`recipe-card ${isChosen ? 'chosen' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={(e) => {
          // Only set preview if not clicking the View Recipe button or favorite button
          if (!e.target.closest('.view-recipe-button') && !e.target.closest('.favorite-button')) {
            onSelect(recipe);
          }
        }}
      >
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleFavorite({
              recipe_id: recipe.recipe_id,
              name: recipe.name,
              description: recipe.description,
              stats: {
                calories: recipe.stats.calories,
                totalTime: recipe.stats.totalTime,
                servings: recipe.stats.servings
              },
              recipeBuilderData: formattedRecipe
            }));
          }}
        >
          <FaBookmark />
        </button>
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
          onClick={handleViewRecipe}
        >
          View Recipe
        </button>
        <button 
          className="view-recipe-button"
          onClick={handleUseRecipe}
        >
          Use Recipe
        </button>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRecipe={recipe}
        chosenRecipe={chosenRecipe}
        onRecipeChosen={onRecipeChosen}
        recipeBuilderData={formattedRecipe}
        mealType={mealType}
      />
    </>
  );
};

export default React.memo(RecipeCard, (prev, next) => {
  // Re‑render only if core props relevant to visual state change
  return (
    prev.recipe.recipe_id === next.recipe.recipe_id &&
    prev.isChosen === next.isChosen &&
    prev.isSelected === next.isSelected &&
    prev.isFavorite === next.isFavorite &&
    prev.inPantryCount === next.inPantryCount &&
    prev.totalIngredients === next.totalIngredients
  );
}); 