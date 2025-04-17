import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RecipeGenerator from '../../pages/RecipeGenerator';
import { FaCheck } from 'react-icons/fa';
import './styles.css';

const TabbedRecipeGenerator = () => {
  const selectedFoods = useSelector(state => state.foods.selectedFoods) || [];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [recipesPerTab, setRecipesPerTab] = useState({});
  const [chosenRecipes, setChosenRecipes] = useState({});

  if (!selectedFoods.length) {
    return (
      <div className="no-foods-message">
        No foods selected. Please go back and select foods to generate recipes.
      </div>
    );
  }

  const handleRecipesUpdate = (recipes) => {
    setRecipesPerTab(prev => ({
      ...prev,
      [activeTabIndex]: recipes
    }));
  };

  const handleRecipeChosen = (recipe) => {
    console.log('Recipe chosen:', recipe.name);
    setChosenRecipes(prev => ({
      ...prev,
      [activeTabIndex]: recipe
    }));
  };

  return (
    <div className="tabbed-recipe-generator">
      <div className="placeholder-container">
        <span><strong>Breakfast:</strong>  servings, avg calories</span>
        <span><strong>Main (Lunch/Dinner):</strong>  servings, avg calories</span>
        <span><strong>Snacks:</strong>  servings, avg calories</span>
        <span><strong>Desserts:</strong>  servings, avg calories</span>
        <span><strong>Eating Out:</strong>  times/week</span>
        <span><strong>Avg Daily Calories:</strong> calories</span>
      </div> {/* Added text content */}
      <div className="recipe-tabs">
        {selectedFoods.map((food, index) => (
          <button
            key={food.id}
            className={`recipe-tab ${index === activeTabIndex ? 'active' : ''} ${chosenRecipes[index] ? 'has-chosen-recipe' : ''}`}
            onClick={() => setActiveTabIndex(index)}
          >
            {`Recipe ${index + 1}`}
            <span className="tab-food-name">{food.name}</span>
            {chosenRecipes[index] && (
              <span className="recipe-chosen-check">
                <FaCheck />
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="recipe-tab-content">
        <RecipeGenerator 
          key={`generator-${activeTabIndex}`} 
          baseIngredients={selectedFoods[activeTabIndex]?.base_ingredients_for_grocery_list || []}
          recipes={recipesPerTab[activeTabIndex] || []}
          onRecipesUpdate={handleRecipesUpdate}
          onRecipeChosen={handleRecipeChosen}
          chosenRecipe={chosenRecipes[activeTabIndex]}
        />
      </div>
    </div>
  );
};

export default TabbedRecipeGenerator;